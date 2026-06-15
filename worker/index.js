const CANONICAL_HOST = "happycppd-github-io.ashtonang77.workers.dev";

const PASS_THROUGH = new Set([CANONICAL_HOST, "localhost", "127.0.0.1"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (!PASS_THROUGH.has(url.hostname)) {
      url.hostname = CANONICAL_HOST;
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
