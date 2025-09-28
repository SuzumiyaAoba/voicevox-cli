declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly LANG?: string;
    readonly LOG_LEVEL?:
      | "trace"
      | "debug"
      | "info"
      | "warn"
      | "error"
      | "fatal";
  }
}
