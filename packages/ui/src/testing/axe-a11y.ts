import axe, { type RunOptions } from 'axe-core';

/**
 * Runs axe-core against `node` and throws if it finds a definite violation.
 *
 * `results.incomplete` (axe couldn't determine a verdict — in this jsdom-based
 * test runner that's almost always `color-contrast`, since jsdom has no real
 * layout/canvas engine to compute rendered colors) is intentionally NOT
 * treated as a failure. That's axe's own built-in distinction between
 * "broken" and "needs a human to look at it", not a workaround specific to
 * this environment — asserting on `violations` only is the standard way
 * axe-core is used in CI.
 *
 * Attaches `node` to `document.body` for the duration of the check if it
 * isn't already attached (axe needs a real, connected DOM to evaluate
 * visibility-dependent rules), then detaches it again — unless the caller
 * already attached it themselves (e.g. specs that need `document.body` for
 * CDK Overlay content), in which case we leave that alone.
 */
export async function expectNoA11yViolations(node: Element, options: RunOptions = {}): Promise<void> {
  const alreadyAttached = document.body.contains(node);
  if (!alreadyAttached) document.body.appendChild(node);

  try {
    const results = await axe.run(node, options);
    if (results.violations.length > 0) {
      const details = results.violations
        .map(
          (v) =>
            `- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))\n  ${v.helpUrl}`,
        )
        .join('\n');
      throw new Error(
        `axe-core found ${results.violations.length} accessibility violation(s):\n${details}`,
      );
    }
  } finally {
    if (!alreadyAttached) node.remove();
  }
}
