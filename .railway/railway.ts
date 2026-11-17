import { defineRailway, github, postgres, preserve, project, service, volume } from "railway/iac";

export default defineRailway(() => {
  const Postgres = postgres("Postgres", { region: "sfo" });
  Postgres.networking = { privateNetworkEndpoint: "postgres" };
  const postgresVolume = volume("postgres-volume", { alerts: { usage: { "100": {}, "80": {}, "95": {} } }, allowOnlineResize: true, region: "sfo", sizeMB: 500 });
  const apap = service("apap", {
    source: github("accordproject/apap", { branch: "main", checkSuites: false }),
    build: { buildCommand: "cd server && npm ci && npm run build", buildEnvironment: "V3", builder: "RAILPACK", watchPatterns: ["/server/**"] },
    start: "cd server/dist && npm start",
    healthcheck: "/health",
    preDeploy: "sh -c 'cd server && npx drizzle-kit push'",
    replicas: { "sfo": 1 },
    // Carried over from railway.json, which stops applying at cutover.
    deploy: { restartPolicyType: "ON_FAILURE", restartPolicyMaxRetries: 10 },
    env: {
      A2A_JWT_AUDIENCE: preserve(),
      A2A_JWT_ISSUER: preserve(),
      A2A_JWT_SECRET: preserve(),
      APAP_PUBLIC_BASE_URL: preserve(),
      AUTH_ADAPTER: preserve(),
      HOST: preserve(),
      PORT: preserve(),
      POSTGRES_URL: preserve(),
      PUBLIC_BASE_URL: preserve(),
      TRUST_PROXY: preserve(),
    },
  });
  const nginxProxy = service("nginx-proxy", {
    source: github("accordproject/apap", { branch: "main", checkSuites: false, rootDirectory: "proxy" }),
    build: { buildEnvironment: "V3", builder: "DOCKERFILE", dockerfilePath: "Dockerfile" },
    replicas: { "europe-west4-drams3a": 1 },
    deploy: { sleepApplication: true },
    domains: [{ domain: "api.accordproject.org", port: 80 }],
    env: { NGINX_AUTH_PASSWORD: preserve(), NGINX_AUTH_USER: preserve() },
  });

  return project("reliable-fascination", {
    variables: { managed: true },
    resources: [apap, Postgres, nginxProxy, postgresVolume],
  });
});
