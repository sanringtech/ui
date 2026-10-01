// Lives in the docs app (not next to the block) because registry/ ships inside
// the CLI tarball. Uses elk's bundled build: same engine, no worker.
import ELK from 'elkjs/lib/elk.bundled.js';
import {
  layoutOrg,
  orgEdgePath,
  type OrgEdge,
  type OrgLayout,
  type OrgPoint,
  type PositionedOrgNode,
} from '../../../../../../registry/blocks/org-chart/layout';

const engine = new ELK();
const size = { nodeWidth: 180, nodeHeight: 64 };

const s = (source: string, target: string): OrgEdge => ({ source, target, kind: 'solid' });
const d = (source: string, target: string): OrgEdge => ({ source, target, kind: 'dotted' });

// mia reports to eng2 and sal1; ceo has a dotted line to a junior pm two levels down.
const people = [
  'ceo', 'cto', 'cfo', 'cso', 'eng1', 'eng2', 'fin1', 'sal1', 'sal2',
  'dev1', 'dev2', 'dev3', 'mia', 'acc1', 'rep1', 'rep2', 'pm',
].map((id) => ({ id }));
const links = [
  s('ceo', 'cto'), s('ceo', 'cfo'), s('ceo', 'cso'),
  s('cto', 'eng1'), s('cto', 'eng2'), s('cfo', 'fin1'), s('cso', 'sal1'), s('cso', 'sal2'),
  s('eng1', 'dev1'), s('eng1', 'dev2'), s('eng2', 'dev3'), s('eng2', 'mia'), s('sal1', 'mia'),
  s('fin1', 'acc1'), s('sal2', 'rep1'), s('sal2', 'rep2'), s('eng1', 'pm'),
  d('ceo', 'pm'), d('fin1', 'rep2'),
];

type Segment = [OrgPoint, OrgPoint];
const segments = (points: OrgPoint[]): Segment[] =>
  points.slice(1).map((p, i) => [points[i], p] as Segment);

function overlaps([a1, a2]: Segment, [b1, b2]: Segment): boolean {
  const span = (p: number, q: number, r: number, t: number) =>
    Math.min(Math.max(p, q), Math.max(r, t)) - Math.max(Math.min(p, q), Math.min(r, t));
  if (a1.x === a2.x && b1.x === b2.x && a1.x === b1.x) return span(a1.y, a2.y, b1.y, b2.y) > 0.5;
  if (a1.y === a2.y && b1.y === b2.y && a1.y === b1.y) return span(a1.x, a2.x, b1.x, b2.x) > 0.5;
  return false;
}

function crossesCard([a, b]: Segment, n: PositionedOrgNode): boolean {
  return (
    Math.max(a.x, b.x) > n.x + 1 &&
    Math.min(a.x, b.x) < n.x + n.width - 1 &&
    Math.max(a.y, b.y) > n.y + 1 &&
    Math.min(a.y, b.y) < n.y + n.height - 1
  );
}

describe('layoutOrg', () => {
  let layout: OrgLayout;
  const node = (id: string) => layout.nodes.find((n) => n.id === id)!;

  beforeAll(async () => {
    layout = await layoutOrg(engine, people, links, size);
  });

  it('places every person and routes every edge', () => {
    expect(layout.nodes).toHaveLength(people.length);
    expect(layout.edges).toHaveLength(links.length);
    expect(layout.dropped).toEqual([]);
    expect(layout.width).toBeGreaterThan(0);
  });

  it('puts managers above reports, including both managers of a dual report', () => {
    expect(node('cto').y).toBeGreaterThan(node('ceo').y);
    expect(node('mia').y).toBeGreaterThan(node('eng2').y);
    expect(node('mia').y).toBeGreaterThan(node('sal1').y);
  });

  it('keeps a dotted line from pulling its target out of its solid level', () => {
    expect(node('pm').y).toBe(node('dev1').y);
  });

  it('draws one shared bus per manager', () => {
    const starts = layout.edges
      .filter((e) => e.kind === 'solid' && e.source === 'ceo')
      .map((e) => `${e.points[0].x},${e.points[0].y}`);
    expect(new Set(starts).size).toBe(1);
  });

  it('never lays a dotted line on top of a solid one', () => {
    const solid = layout.edges.filter((e) => e.kind === 'solid').flatMap((e) => segments(e.points));
    const dotted = layout.edges.filter((e) => e.kind === 'dotted').flatMap((e) => segments(e.points));
    const hits = dotted.filter((a) => solid.some((b) => overlaps(a, b)));
    expect(hits).toEqual([]);
  });

  it('routes no edge through a card', () => {
    const hits = layout.edges.flatMap((e) =>
      segments(e.points)
        .filter((seg) => layout.nodes.some((n) => crossesCard(seg, n)))
        .map(() => `${e.source}->${e.target}`),
    );
    expect(hits).toEqual([]);
  });
});

describe('layoutOrg edge sanitising', () => {
  beforeEach(() => vi.spyOn(console, 'warn').mockImplementation(() => undefined));
  afterEach(() => vi.restoreAllMocks());

  it('drops the solid edge that closes a reporting cycle and warns', async () => {
    const result = await layoutOrg(
      engine,
      [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
      [s('a', 'b'), s('b', 'c'), s('c', 'a')],
      size,
    );
    expect(result.dropped).toEqual([s('c', 'a')]);
    expect(result.edges).toHaveLength(2);
    expect(console.warn).toHaveBeenCalledOnce();
  });

  it('allows a dotted line that points back up the hierarchy', async () => {
    const result = await layoutOrg(engine, [{ id: 'a' }, { id: 'b' }], [s('a', 'b'), d('b', 'a')], size);
    expect(result.dropped).toEqual([]);
    expect(result.edges).toHaveLength(2);
  });

  it('drops unknown endpoints and self-loops, and dedupes repeats', async () => {
    const result = await layoutOrg(
      engine,
      [{ id: 'a' }, { id: 'b' }],
      [{ source: 'a', target: 'b' }, s('a', 'b'), s('a', 'ghost'), s('b', 'b')],
      size,
    );
    expect(result.edges).toHaveLength(1);
    expect(result.edges[0].kind).toBe('solid');
    expect(result.dropped).toEqual([s('a', 'ghost'), s('b', 'b')]);
  });

  it('lays out an empty org', async () => {
    const result = await layoutOrg(engine, [], [], size);
    expect(result.nodes).toEqual([]);
    expect(result.edges).toEqual([]);
  });
});

describe('orgEdgePath', () => {
  it('builds an orthogonal SVG path', () => {
    expect(orgEdgePath([{ x: 0, y: 0 }, { x: 0, y: 10 }, { x: 20, y: 10 }])).toBe('M0 0 L0 10 L20 10');
  });
});
