import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";

export const meta: CassidySpectra.CommandMeta = {
  name: "joingp",
  description: "Join an existing group chat that the bot is in.",
  version: "1.0.0",
  author: "AzukiDan",
  category: "Admin",
  permissions: [2], // Role 2 for Admins
  icon: "➕",
  cmdType: "cplx_g",
};

const configs: Config[] = [
  {
    key: "home",
    description: "List groups or add the user to a group.",
    async handler({ input, output, api }, { spectralArgs }) {
      const target = spectralArgs[0];
      const senderID = input.senderID;

      try {
        // Fetch existing group chats (Limit to 100 threads)
        const threadList = await api.getThreadList(100, null, ["INBOX"]);
        const groups = threadList.filter(t => t.isGroup);

        // --- SCENARIO 1: LIST GROUPS (joingp) ---
        if (!target) {
          if (groups.length === 0) {
            return output.reply("❌ The bot is not in any group chats.");
          }

          let msg = "╔═════════════════╗\n";
          msg += "   📂  **AVAILABLE GROUPS**\n";
          msg += "╠═════════════════╣\n";
          groups.forEach((g, i) => {
            msg += ` ${i + 1}. ${g.name || "Unnamed Group"}\n    ID: \`${g.threadID}\`\n`;
          });
          msg += "╚═════════════════╝\n";
          msg += "👉 Use: joingp [number] or joingp [group_id]";
          return output.reply(msg);
        }

        // --- SCENARIO 2: JOIN VIA NUMBER OR ID (joingp [num|id]) ---
        let targetThreadID: string | null = null;
        let groupName = "Selected Group";

        // Check if input is a list number (e.g., 1, 2, 3)
        const index = parseInt(target) - 1;
        if (!isNaN(index) && index >= 0 && index < groups.length) {
          targetThreadID = groups[index].threadID;
          groupName = groups[index].name || targetThreadID;
        } else {
          // Check if input matches a direct ThreadID in the list
          const directGroup = groups.find(g => g.threadID === target);
          if (directGroup) {
            targetThreadID = directGroup.threadID;
            groupName = directGroup.name || targetThreadID;
          } else if (target.length >= 14) { 
            // Fallback: If it looks like a valid ID but not in the list cache
            targetThreadID = target;
          }
        }

        if (!targetThreadID) {
          return output.reply("❌ Invalid group number or Group ID.");
        }

        // Add the admin who triggered the command to the target group
        await api.addUserToGroup(senderID, targetThreadID);
        return output.reply(`✅ Successfully added you to: **${groupName}**`);

      } catch (e) {
        console.error(e);
        return output.reply("❌ Failed to add you to the group. Ensure the bot has admin permissions there or that you aren't already in it.");
      }
    },
  },
];

const home = new SpectralCMDHome({ defaultKey: "home", defaultCategory: "Admin" }, configs);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});
