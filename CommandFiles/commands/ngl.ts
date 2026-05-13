import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";
import axios from "axios";

export const meta: CassidySpectra.CommandMeta = {
  name: "ngl",
  description: "Send anonymous messages via NGL.link API",
  version: "1.1.0",
  author: "AzukiDan",
  category: "Fun",
  permissions: [0],
  icon: "📩",
  cmdType: "cplx_g", // Spectra Complex G type
};

const configs: Config[] = [
  {
    key: "home",
    description: "Submit an NGL message.",
    async handler({ output }, { spectralArgs }) {
      const username = spectralArgs[0];
      // Support for \n by replacing the string literal with actual newlines
      let message = spectralArgs.slice(1).join(" ").replace(/\\n/g, "\n");

      if (!username || !message) {
        return output.reply("❌ Usage: ngl <username> <message>\nUse \\n for new lines.");
      }

      const borderTop = "╔═════════════════╗";
      const borderMid = "╠═════════════════╣";
      const borderBot = "╚═════════════════╝";

      try {
        await axios.post("https://ngl.link/api/submit", 
          `username=${username}&question=${encodeURIComponent(message)}&deviceId=7c28c83a-4467-4d2a-8b83-8a356075c345`, 
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            }
          }
        );

        return output.reply(
          `${borderTop}\n` +
          `   📩  **NGL SENT**  📩\n` +
          `${borderMid}\n` +
          `👤 **To:** ${username}\n` +
          `💬 **Msg:** ${message}\n` +
          `${borderBot}`
        );
      } catch (e) {
        return output.reply(`❌ Error: Could not reach NGL for ${username}.`);
      }
    },
  },
];

const home = new SpectralCMDHome({ defaultKey: "home", defaultCategory: "Fun" }, configs);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});
