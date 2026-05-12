import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";
import { UNIRedux } from "@cassidy/unispectra";

export const meta: CassidySpectra.CommandMeta = {
  name: "out",
  description: "Make the bot leave groups",
  otherNames: ["leave", "goodbye"],
  version: "1.2.0",
  usage: "{name} [all]",
  category: "Admin",
  author: "AzukiDan",
  permissions: [1, 2],
  noPrefix: "both", // This allows 'out' or '/out' to work
  waitingTime: 0,
  icon: "🏃",
  cmdType: "cplx_g",
  noRibbonUI: true,
};

const configs: Config[] = [
  {
    key: "home",
    description: "Leave the current group or all groups.",
    async handler({ api, input, output }) {
      const mode = input.args[0]?.toLowerCase();
      const botID = api.getCurrentUserID();

      // Handle "out all" logic
      if (mode === "all") {
        // Double check for Role 2 for safety on 'all' command
        const userData = await ctx.money.getCache(input.senderID);
        if (userData.role !== 2) return output.reply("❌ Only the Owner (Role 2) can use 'out all'.");

        return api.getThreadList(100, null, ["INBOX"], async (err, list) => {
          if (err) return output.reply("❌ Failed to fetch thread list.");
          
          const groups = list.filter(t => t.isGroup);
          if (groups.length === 0) return output.reply("I am not in any group chats!");

          await output.reply(`🏃 Leaving ${groups.length} groups...`);

          for (const thread of groups) {
            api.removeUserFromGroup(botID, thread.threadID);
            // Small delay to prevent API spam blocks
            await new Promise(res => setTimeout(res, 1000));
          }
          return;
        });
      }

      // Default: Leave only current thread
      await output.reply(`lilipad na!${UNIRedux.charm}`);
      return api.removeUserFromGroup(botID, input.threadID);
    },
  }
];

const home = new SpectralCMDHome(
  {
    argIndex: 0,
    isHypen: false,
    defaultKey: "home",
    defaultCategory: "Admin",
  },
  configs
);

export const entry = defineEntry(async (ctx) => {
  // We pass ctx to the home.runInContext, ensuring all tools are available
  return home.runInContext(ctx);
});
