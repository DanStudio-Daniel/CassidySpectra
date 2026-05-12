import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";
import { UNIRedux } from "@cassidy/unispectra";

// Simple sleep helper to prevent rate-limiting
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const meta: CassidySpectra.CommandMeta = {
  name: "unfriend",
  description: "Remove users from bot's friend list with a limit",
  version: "1.1.0",
  usage: "{prefix}{name} [all <amount> | reply | mention | uid]",
  category: "Admin",
  permissions: [2], 
  icon: "🚮",
  cmdType: "cplx_g",
};

const configs: Config[] = [
  {
    key: "home",
    description: "Unfriend logic with rate-limiting.",
    async handler({ api, input, output, money }) {
      const adminRoles = [1, 2];
      let targets: string[] = [];
      const mode = input.args[0]?.toLowerCase();
      const amountLimit = parseInt(input.args[1]) || 0;

      if (mode === "all") {
        if (!amountLimit) return output.reply("⚠️ Please specify an amount! Example: unfriend all 10");
        
        const users = await money.getAllCache();
        const allIDs = Object.keys(users);
        
        for (const id of allIDs) {
          if (targets.length >= amountLimit) break;
          // Protect admins and the bot itself
          if (!adminRoles.includes(users[id].role)) {
            targets.push(id);
          }
        }
      } else if (input.replier) {
        targets.push(input.replier.senderID);
      } else if (input.hasMentions) {
        targets.push(...Object.keys(input.mentions));
      } else if (input.args[0]) {
        targets.push(input.args[0]);
      }

      if (targets.length === 0) return output.reply("❌ No valid targets found.");

      await output.reply(`⚙️ Starting to unfriend ${targets.length} users. This will take a moment to avoid errors...`);

      let successCount = 0;
      let failCount = 0;

      for (const uid of targets) {
        try {
          await new Promise((resolve, reject) => {
            api.unfriend(uid, (err) => {
              if (err) reject(err);
              else resolve(true);
            });
          });
          successCount++;
          // Wait 2 seconds between each unfriend to stay under the radar
          await sleep(2000); 
        } catch (e) {
          failCount++;
        }
      }

      return output.reply(`✅ Processed!\n• Success: ${successCount}\n• Failed: ${failCount}\n${UNIRedux.charm}`);
    },
  },
];

const home = new SpectralCMDHome({ defaultKey: "home", defaultCategory: "Admin" }, configs);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});
