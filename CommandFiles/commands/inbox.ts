import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";
import { UNIRedux } from "@cassidy/unispectra";

export const meta: CassidySpectra.CommandMeta = {
  name: "inbox",
  description: "Sends a private message to you",
  otherNames: ["pm", "dm"],
  version: "1.0.0",
  usage: "{prefix}{name}",
  category: "Utility",
  permissions: [0], // Everyone
  icon: "📩",
  cmdType: "cplx_g",
};

const configs: Config[] = [
  {
    key: "home",
    description: "Send a DM to the user.",
    async handler({ api, input, output }) {
      const msg = `Hello! You requested a message via the inbox command. ${UNIRedux.charm}`;
      
      return api.sendMessage(msg, input.senderID, (err) => {
        if (err) return output.reply("❌ I couldn't message you. Please make sure you've messaged me first or accepted my request!");
        return output.reply("📬 I've sent you a message in private!");
      });
    },
  },
];

const home = new SpectralCMDHome({ defaultKey: "home", defaultCategory: "Utility" }, configs);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});