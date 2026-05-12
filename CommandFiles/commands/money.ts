import { SpectralCMDHome, Config, CassCheckly } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";
import { UNIRedux } from "@cassidy/unispectra";
import { formatCash } from "@cass-modules/ArielUtils";
import { FontSystem } from "cassidy-styler";

// Re-using your sort function for consistency
export function sortUsersByMoney(users: { [x: string]: any }, top?: number) {
  const entries = Object.entries(users).sort(([, a], [, b]) => b.money - a.money);
  const sliced = top && top > 0 ? entries.slice(0, top) : entries;
  return Object.fromEntries(sliced);
}

const configs: Config[] = [
  {
    key: "home",
    description: "Shows only your balance amount with charm.",
    aliases: ["amount"],
    async handler({ money, input, output }) {
      const userData = await money.getCache(input.senderID);
      const balance = formatCash(userData.money, "💵", true);
      
      // Output: 💵 1,000,000 ✧
      return output.reply(`${balance} ${UNIRedux.charm}`);
    },
  },
  {
    key: "top",
    description: "Show the top 15 richest users.",
    aliases: ["leaderboard", "lb"],
    cooldown: 10,
    async handler({ money, output, prefix }) {
      const allUsers = await money.getAllCache();
      const top15 = sortUsersByMoney(allUsers, 15);

      let result = [`🏆 ${FontSystem.applyFonts("TOP 15 RICH LIST", "bold")} 🏆`];
      let rank = 1;

      for (const id in top15) {
        const user = top15[id];
        const rankStr = rank < 10 ? `0${rank}` : `${rank}`;
        
        result.push(
          `${rank === 1 ? "👑" : "🔹"} ${rankStr}. **${user.name}**\n` +
          `   ╰─> ${formatCash(user.money, "💵")}`
        );
        rank++;
      }

      return output.reply(result.join("\n\n"));
    }
  }
];

const home = new SpectralCMDHome(
  {
    argIndex: 0,
    isHypen: false,
    globalCooldown: 5,
    defaultKey: "home",
    defaultCategory: "Finance",
  },
  configs
);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});
