import { SpectralCMDHome, CassCheckly, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";
import { UNIRedux } from "@cassidy/unispectra";

export const meta: CassidySpectra.CommandMeta = {
  name: "unfriend",
  description: "Remove users from bot's friend list",
  version: "1.0.0",
  usage: "{prefix}{name} [reply|mention|uid|all]",
  category: "Admin",
  permissions: [2], // Role 2 Only
  icon: "🚮",
  cmdType: "cplx_g",
};

const configs: Config[] = [
  {
    key: "home",
    description: "Unfriend logic.",
    async handler({ api, input, output, money }) {
      const adminRoles = [1, 2]; // Roles to protect
      let targets: string[] = [];

      if (input.args[0] === "all") {
        const users = await money.getAllCache();
        for (const id in users) {
          // Check role from UserData to protect admins
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

      let successCount = 0;
      for (const uid of targets) {
        await api.unfriend(uid);
        successCount++;
      }

      return output.reply(`✅ Processed unfriend for ${successCount} user(s). ${UNIRedux.charm}`);
    },
  },
];

const home = new SpectralCMDHome({ defaultKey: "home", defaultCategory: "Admin" }, configs);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});