import { UNIRedux } from "@cassidy/unispectra";

export const meta = {
  name: "groups",
  description: "Manage and notify groups (UID Locked).",
  version: "1.1.0",
  author: "AzukiDan",
  category: "Admin",
  permissions: [0], // Role 0, but UID locked
  icon: "👨‍👩‍👧‍👦",
  cmdType: "arl_g",
};

/**
 * @param {CommandContext} ctx
 */
export async function entry({ input, output, api }) {
  const OWNER_ID = "61586129167173"; // Your UID

  // --- UID SECURITY CHECK ---
  if (input.senderID !== OWNER_ID) {
    return output.reply("🚫 System: Restricted access. only azuki can use this.");
  }

  const args = input.arguments;
  const action = args[0]?.toLowerCase();

  // Fetch all threads
  const list = await api.getThreadList(100, null, ["INBOX"]);
  const groups = list.filter(t => t.isGroup && t.threadID !== input.threadID);

  // --- SUB-COMMAND: LIST ---
  if (!action || action === "list") {
    if (groups.length === 0) return output.reply("❌ No other groups found.");

    let msg = "╔═════════════════╗\n";
    msg += "   📂  **GROUP LIST**\n";
    msg += "╠═════════════════╣\n";
    groups.forEach((g, i) => {
      msg += ` ${i + 1}. ${g.name || "Unnamed Group"}\n    ID: \`${g.threadID}\`\n`;
    });
    msg += "╚═════════════════╝";
    return output.reply(msg);
  }

  // --- SUB-COMMAND: OUT ---
  if (action === "out") {
    const index = parseInt(args[1]) - 1;
    const targetGroup = groups[index];

    if (!targetGroup) return output.reply("❌ Invalid group number.");

    try {
      await api.removeUserFromGroup(api.getCurrentUserID(), targetGroup.threadID);
      return output.reply(`✅ Left Group: **${targetGroup.name || targetGroup.threadID}**`);
    } catch (e) {
      return output.reply("❌ Failed to leave group.");
    }
  }

  // --- SUB-COMMAND: SENDNOTI ---
  if (action === "sendnoti") {
    const target = args[1]?.toLowerCase();
    const message = args.slice(2).join(" ");

    if (!target || !message) {
      return output.reply("❌ Usage: groups sendnoti [number|all] <message>");
    }

    if (target === "all") {
      for (const g of groups) {
        // Adding a slight delay to prevent spam detection on mobile
        await new Promise(res => setTimeout(res, 1000));
        await api.sendMessage(message, g.threadID);
      }
      return output.reply(`✅ Broadcast sent to ${groups.length} groups.`);
    } else {
      const index = parseInt(target) - 1;
      const targetGroup = groups[index];

      if (!targetGroup) return output.reply("❌ Invalid group number.");

      await api.sendMessage(message, targetGroup.threadID);
      return output.reply(`✅ Sent to: **${targetGroup.name}**`);
    }
  }
  }
