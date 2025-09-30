import { defineCommand } from "citty";
import { display, log } from "@/logger.js";
import { createVoicevoxClient } from "@/utils/client.js";
import { commonCommandOptions } from "@/utils/command-helpers.js";
import { handleError } from "@/utils/error-handler.js";

type ValidateKanaStructured = {
  valid?: boolean;
  errors?: string[];
  message?: string;
};
type ValidateKanaResponse = ValidateKanaStructured | string | null | undefined;

export const validateCommand = defineCommand({
  meta: {
    name: "validate",
    description: "Validate VOICEVOX kana format",
  },
  args: {
    text: {
      type: "positional",
      description: "Kana text to validate",
      required: true,
    },
    ...commonCommandOptions,
  },
  async run({ args }) {
    try {
      const client = createVoicevoxClient({ baseUrl: args.baseUrl });

      log.debug("Validating kana", { baseUrl: args.baseUrl, text: args.text });

      const res = await client.POST("/validate_kana", {
        // @ts-expect-error - API accepts JSON { text }
        body: { text: String(args.text) },
      });

      const status = res.response?.status;
      const data = res.data as ValidateKanaResponse;

      let valid = false;
      let errors: string[] | undefined;

      if (status === 204) {
        valid = true;
      } else if (typeof data === "object" && data) {
        const v = data.valid;
        const e = data.errors;
        if (typeof v === "boolean") {
          valid = v;
          errors = Array.isArray(e) ? e : undefined;
        } else {
          valid = false;
          errors = ["Invalid response schema from validate_kana"];
        }
      } else if (typeof data === "string") {
        const lower = data.toLowerCase();
        if (lower.includes("ok") || lower.includes("valid")) {
          valid = true;
        } else {
          valid = false;
          errors = [data];
        }
      } else {
        valid = false;
        errors = ["Empty response from validate_kana"];
      }

      if (args.json) {
        display.info(
          JSON.stringify(errors ? { valid, errors } : { valid }, null, 2),
        );
        return;
      }

      if (valid) {
        display.info("Kana is valid");
      } else {
        display.info("Kana is invalid");
        if (errors && errors.length > 0) {
          for (const e of errors) display.info(`- ${e}`);
        }
      }
    } catch (error) {
      handleError(error, "kana-validate", {
        text: args.text,
        baseUrl: args.baseUrl,
      });
    }
  },
});
