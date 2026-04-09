/// <reference types="@nuxtblog/plugin-sdk" />

module.exports = {
  activate() {
    const available = ctx.plugins.isAvailable("nuxtblog-plugin-hello-js");
    const version = ctx.plugins.getVersion("nuxtblog-plugin-hello-js");
    ctx.log.info(
      "dep-test activated — hello-js available=" + available + " version=" + version
    );
  },

  deactivate() {
    ctx.log.info("dep-test deactivated");
  },

  routes: [
    {
      method: "GET",
      path: "/api/plugin/nuxtblog-plugin-dep-test/info",
      auth: "admin",
      handler(req: RouteRequest) {
        const prefix = ctx.settings.get("prefix") || "[dep-test]";
        const helloAvailable = ctx.plugins.isAvailable("nuxtblog-plugin-hello-js");
        const helloVersion = ctx.plugins.getVersion("nuxtblog-plugin-hello-js");

        // Try fetching hello-js greeting via internal HTTP
        var helloGreeting = "";
        try {
          var resp = ctx.http.fetch(
            "http://127.0.0.1:8000/api/plugin/nuxtblog-plugin-hello-js/hello"
          );
          if (resp && resp.body) {
            var parsed = JSON.parse(resp.body);
            if (parsed.data && parsed.data.greeting) {
              helloGreeting = parsed.data.greeting;
            }
          }
        } catch (e) {
          helloGreeting = "(fetch failed)";
        }

        return {
          code: 0,
          message: "",
          data: {
            prefix: prefix,
            hello_js: {
              available: helloAvailable,
              version: helloVersion,
              greeting: helloGreeting,
            },
          },
        };
      },
    },
  ],

  onEvent(event: string, data: Record<string, unknown>) {
    ctx.log.debug("dep-test received event: " + event);
  },
} satisfies PluginExports;
