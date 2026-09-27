// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "to-be-wed",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: { region: "ap-southeast-2" },
      },
    };
  },
  async run() {
    const domain = "natandxander.wedding";
    const isProduction = $app.stage === "production";

    const secrets = [
      new sst.Secret("LinkSecret"),
      new sst.Secret("GoogleClientEmail"),
      new sst.Secret("GooglePrivateKey"),
      new sst.Secret("SheetId"),
      new sst.Secret("SiteUrl", isProduction ? `https://${domain}` : "http://localhost:3000"),
    ];

    new sst.aws.Nextjs("Site", {
      link: secrets,
      environment: {
        SHEET_TAB: process.env.SHEET_TAB ?? "",
      },
      domain: isProduction ? { name: domain, redirects: [`www.${domain}`] } : undefined,
    });
  },
});
