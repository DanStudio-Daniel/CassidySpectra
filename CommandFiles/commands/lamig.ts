import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";

export const meta: CassidySpectra.CommandMeta = {
  name: "lamig",
  description: "Sends a cold hugot response",
  otherNames: ["ang lamig", "ang lamig no?", "bat ang lamig?"],
  version: "1.0.0",
  usage: "{name}",
  category: "Fun",
  permissions: [0], // Available to everyone
  icon: "❄️",
  cmdType: "cplx_g",
  noPrefix: "both" // Triggered by plain text messages
};

const configs: Config[] = [
  {
    key: "home",
    description: "The cold truth for everyone.",
    async handler({ output }) {
      return output.reply("ganyan talaga pag second option lang. ❄️💔");
    },
  }
];

const home = new SpectralCMDHome({ defaultKey: "home", defaultCategory: "Fun" }, configs);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});
