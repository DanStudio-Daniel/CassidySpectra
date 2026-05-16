import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";

export const meta: CassidySpectra.CommandMeta = {
  name: "gcdel",
  description: "Delete conversation history of a group chat.",
  version: "1.1.0",
  author: "AzukiDan",
  category: "Admin",
  permissions: [2], // Role 2 for Admins
  icon: "🗑️",
  cmdType: "cplx_g",
};

const configs: Config[] = [
  {
    key: "home",
    description: "List groups or delete conversation history.",
    async handler({ input, output, api }, { spectralArgs }) {
      const target = spectralArgs[0];

      try {
        // Fetch existing group chats (Limit to 100 threads)
        const threadList = await api.getThreadList(100, null, ["INBOX"]);
        const groups = threadList.filter(t => t.isGroup);

        // --- SCENARIO 1: LIST GROUPS (gcdel) ---
        if (!target) {
          if (groups.length === 0) {
            return output.reply("❌ The bot is not in any active group chats.");
          }

          let msg = "╔═════════════════╗\n";
          msg += "   🗑️  **DELETE CONVERSATION**\n";
          msg += "╠═════════════════╣\n";
          groups.forEach((g, i) => {
            msg += ` ${i + 1}. ${g.name || "Unnamed Group"}\n    ID: \`${g.threadID}\`\n`;
          });
          msg += "╚═════════════════╝\n";
          msg += "👉 Use: gcdel [number] or gcdel [group_id]";
          return output.reply(msg);
        }

        // --- SCENARIO 2: DELETE VIA NUMBER OR ID (gcdel [num|id]) ---
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
            // Fallback for direct IDs not cached in the list
            targetThreadID = target;
          }
        }

        if (!targetThreadID) {
          return output.reply("❌ Invalid group number or Group ID.");
        }

        // Alert if deleting the current thread
        if (targetThreadID === input.threadID) {
          await output.reply("⚠️ Wiping conversation history for this chat...");
        }

        // Execute conversation deletion
        await api.deleteThread(targetThreadID);

        // Send success message if it was handled remotely
        if (targetThreadID !== input.threadID) {
          return output.reply(`🗑️ Successfully deleted conversation for: **${groupName}**`);
        }

      } catch (e) {
        console.error(e);
        return output.reply("❌ Failed to delete conversation. Ensure the bot has proper access permissions.");
      }
    },
  },
];

const home = new SpectralCMDHome({ defaultKey: "home", defaultCategory: "Admin" }, configs);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});
