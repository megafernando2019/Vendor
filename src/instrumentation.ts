/**
 * Next.js instrumentation hook — makes newrelic.js reachable for static analysis
 * and loads agent config when the Node.js runtime starts.
 * Production also uses NODE_OPTIONS=--require=newrelic in package.json "start".
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../newrelic.js");
  }
}
