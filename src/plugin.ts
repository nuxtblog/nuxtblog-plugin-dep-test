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

        // Read hello-js greeting via shared settings API
        var helloGreeting = ctx.plugins.getSetting("nuxtblog-plugin-hello-js", "greeting");
        if (!helloGreeting) helloGreeting = "Hello from Goja!";

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
