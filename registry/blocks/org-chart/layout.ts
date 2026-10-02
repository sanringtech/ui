// The only module (with org-chart.worker.ts) that knows about elkjs. Everything
// it returns is plain coordinates, so swapping the engine only touches this file.
import ELK, { type ElkExtendedEdge, type ElkNode, type ElkPort } from 'elkjs/lib/elk-api';

export type OrgEdgeKind = 'solid' | 'dotted';

export interface OrgNode {
  id: string;
}

/** `solid` = line manager; `dotted` = matrix / dotted-line reporting. */
export interface OrgEdge {
  source: string;
  target: string;
  kind?: OrgEdgeKind;
}

export interface OrgLayoutOptions {
  nodeWidth: number;
  nodeHeight: number;
  /** Horizontal gap between siblings. */
  nodeGap?: number;
  /** Vertical gap between levels. */
  levelGap?: number;
}

export interface OrgPoint {
  x: number;
  y: number;
}

export interface PositionedOrgNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RoutedOrgEdge {
  id: string;
  source: string;
  target: string;
  kind: OrgEdgeKind;
  points: OrgPoint[];
}

export interface OrgLayout {
  width: number;
  height: number;
  nodes: PositionedOrgNode[];
  edges: RoutedOrgEdge[];
  /** Edges left out of the layout: unknown endpoints, self-loops, or solid reporting cycles. */
  dropped: OrgEdge[];
}

/** Anything with elk's `layout()` — the worker-backed engine in the app, the bundled one in tests. */
export interface OrgLayoutEngine {
  layout(graph: ElkNode): Promise<ElkNode>;
}

/** Runs elk in a Web Worker so large charts never block change detection. */
export function createOrgLayoutEngine(): OrgLayoutEngine {
  return new ELK({
    workerFactory: () =>
      new Worker(new URL('./org-chart.worker', import.meta.url), { type: 'module' }),
  });
}

// Solid and dotted edges leave / enter through separate ports. With one shared
// port (or `mergeEdges`), elk routes dotted lines along the solid bus, so the
// first stretch of a dotted line is drawn on top of a solid one.
const DOTTED_PORT_OFFSET = 24;

const LAYOUT_OPTIONS: Record<string, string> = {
  'elk.algorithm': 'layered',
  'elk.direction': 'DOWN',
  'elk.edgeRouting': 'ORTHOGONAL',
  'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
  'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
  'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
};

export async function layoutOrg(
  engine: OrgLayoutEngine,
  nodes: readonly OrgNode[],
  edges: readonly OrgEdge[],
  options: OrgLayoutOptions,
): Promise<OrgLayout> {
  const { nodeWidth: w, nodeHeight: h, nodeGap = 24, levelGap = 48 } = options;
  const { kept, dropped } = sanitizeEdges(nodes, edges);
  if (dropped.length > 0) {
    console.warn('[org-chart] dropped edges (unknown node, self-loop, or reporting cycle):', dropped);
  }

  const port = (node: string, name: string, side: 'NORTH' | 'SOUTH', x: number): ElkPort => ({
    id: `${node}:${name}`,
    width: 1,
    height: 1,
    x,
    y: side === 'NORTH' ? -1 : h,
    layoutOptions: { 'elk.port.side': side },
  });

  const graph: ElkNode = {
    id: 'root',
    layoutOptions: {
      ...LAYOUT_OPTIONS,
      'elk.spacing.nodeNode': String(nodeGap),
      'elk.layered.spacing.nodeNodeBetweenLayers': String(levelGap),
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: w,
      height: h,
      layoutOptions: { 'elk.portConstraints': 'FIXED_POS' },
      ports: [
        port(node.id, 'in', 'NORTH', w / 2),
        port(node.id, 'out', 'SOUTH', w / 2),
        port(node.id, 'dotted-in', 'NORTH', w / 2 + DOTTED_PORT_OFFSET),
        port(node.id, 'dotted-out', 'SOUTH', w / 2 + DOTTED_PORT_OFFSET),
      ],
    })),
    edges: kept.map<ElkExtendedEdge>((edge) => {
      const dotted = edge.kind === 'dotted';
      return {
        id: edge.id,
        sources: [`${edge.source}:${dotted ? 'dotted-out' : 'out'}`],
        targets: [`${edge.target}:${dotted ? 'dotted-in' : 'in'}`],
      };
    }),
  };

  const result = await engine.layout(graph);
  const byId = new Map(kept.map((edge) => [edge.id, edge]));

  return {
    width: result.width ?? 0,
    height: result.height ?? 0,
    nodes: (result.children ?? []).map((child) => ({
      id: child.id,
      x: child.x ?? 0,
      y: child.y ?? 0,
      width: child.width ?? w,
      height: child.height ?? h,
    })),
    edges: (result.edges ?? []).flatMap((edge) => {
      const source = byId.get(edge.id);
      const section = edge.sections?.[0];
      if (!source || !section) return [];
      return [
        {
          id: edge.id,
          source: source.source,
          target: source.target,
          kind: source.kind,
          points: [section.startPoint, ...(section.bendPoints ?? []), section.endPoint],
        },
      ];
    }),
    dropped,
  };
}

/** SVG `d` for an orthogonal polyline. */
export function orgEdgePath(points: readonly OrgPoint[]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
}

type KeptEdge = Required<OrgEdge> & { id: string };

function sanitizeEdges(
  nodes: readonly OrgNode[],
  edges: readonly OrgEdge[],
): { kept: KeptEdge[]; dropped: OrgEdge[] } {
  const ids = new Set(nodes.map((node) => node.id));
  const dropped: OrgEdge[] = [];
  const seen = new Set<string>();
  const candidates: KeptEdge[] = [];

  for (const edge of edges) {
    const kind = edge.kind ?? 'solid';
    const id = `${kind}:${edge.source}->${edge.target}`;
    if (seen.has(id)) continue;
    if (!ids.has(edge.source) || !ids.has(edge.target) || edge.source === edge.target) {
      dropped.push(edge);
      continue;
    }
    seen.add(id);
    candidates.push({ ...edge, kind, id });
  }

  // A cycle in line management is bad data (A manages B manages A). Drop the
  // solid edge that closes each cycle; dotted lines may point anywhere.
  const children = new Map<string, KeptEdge[]>();
  for (const edge of candidates) {
    if (edge.kind !== 'solid') continue;
    children.set(edge.source, [...(children.get(edge.source) ?? []), edge]);
  }
  const state = new Map<string, 'visiting' | 'done'>();
  const backEdges = new Set<string>();
  const visit = (id: string) => {
    state.set(id, 'visiting');
    for (const edge of children.get(id) ?? []) {
      const next = state.get(edge.target);
      if (next === 'visiting') backEdges.add(edge.id);
      else if (next === undefined) visit(edge.target);
    }
    state.set(id, 'done');
  };
  for (const node of nodes) if (!state.has(node.id)) visit(node.id);

  const kept: KeptEdge[] = [];
  for (const edge of candidates) {
    if (backEdges.has(edge.id)) dropped.push({ source: edge.source, target: edge.target, kind: edge.kind });
    else kept.push(edge);
  }
  return { kept, dropped };
}
