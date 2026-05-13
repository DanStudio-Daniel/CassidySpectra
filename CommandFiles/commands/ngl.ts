import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";
import axios from "axios";

export const meta: CassidySpectra.CommandMeta = {
  name: "ngl",
  description: "Send anonymous messages via NGL.link API",
  version: "1.2.0",
  author: "AzukiDan",
  category: "Fun",
  permissions: [0],
  icon: "📩",
  cmdType: "cplx_g",
};

const configs: Config[] = [
  {
    key: "home",
    description: "Submit an NGL message.",
    async handler({ output }, { spectralArgs }) {
      const username = spectralArgs[0];
      // Support for \n space by replacing literal \n with real newlines
      let message = spectralArgs.slice(1).join(" ").replace(/\\n/g, "\n");

      if (!username || !message) {
        return output.reply("❌ Usage: ngl <username> <message>\nUse \\n for new lines.");
      }

      const borderTop = "╔═════════════════╗";
      const borderMid = "╠═════════════════╣";
      const borderBot = "╚═════════════════╝";

      try {
        await axios.post("https://ngl.link/api/submit", 
          `username=${username}&question=${encodeURIComponent(message)}&deviceId=bb2476e3-519d-4767-9c9e-2646f9038202`, 
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
              "Accept": "*/*",
              "X-Requested-With": "XMLHttpRequest",
              "Referer": `https://ngl.link/${username}`,
              "Origin": "https://ngl.link",
              "User-Agent": "Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36"
            }
          }
        );

        return output.reply(
          `${borderTop}\n` +
          `   📩  **NGL SENT**  📩\n` +
          `${borderMid}\n` +
          `👤 **To:** ${username}\n` +
          `💬 **Msg:**\n${message}\n` +
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
