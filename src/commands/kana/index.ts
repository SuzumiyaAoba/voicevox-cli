import { defineCommand } from "citty";
import { validateCommand } from "./validate.js";

export const kanaCommand = defineCommand({
  meta: {
    name: "kana",
    description: "Kana utilities",
  },
  subCommands: {
    validate: validateCommand,
  },
});
