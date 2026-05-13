import { UNIRedux } from "@cassidy/unispectra";

export const meta = {
  name: "setgems",
  description: "Set or give gems to a user manually",
  version: "1.0.0",
  author: "AzukiDan",
  category: "Admin",
  permissions: [2], // Role 2 (Owner)
  icon: "💎",
  cmdType: "arl_g",
};

/**
 * @param {CommandContext} ctx
 */
export async function entry({
  input,
  output,
  money,
  Collectibles,
}) {
  const args = input.arguments;
  const amount = parseInt(args[0]);

  if (isNaN(amount)) {
    return output.reply("❌ Please provide a valid amount.\nUsage: setgems <amount> [target]");
  }

  // 1. Determine Target UID (Self, Reply, Mention, or Arg)
  let targetID = input.senderID;
  if (input.replier) {
    targetID = input.replier.senderID;
  } else if (input.hasMentions) {
    targetID = input.firstMention.senderID;
  } else if (args[1]) {
    targetID = args[1];
  }

  try {
    // 2. Fetch User Data
    const userData = await money.getItem(targetID);
    const collectibles = new Collectibles(userData.collectibles || []);

    // 3. Update Gems
    // Using .set or .raise depending on if you want to REPLACE or ADD
    // Since it's 'setgems', I'll use set. If you want to add, use collectibles.raise("gems", amount)
    collectibles.set("gems", amount);

    // 4. Save back to Database
    await money.setItem(targetID, {
      ...userData,
      collectibles: Array.from(collectibles),
    });

    return output.reply(
      `👤 **Admin Update**\n\n` +
      `✅ Successfully set **${amount.toLocaleString()}** 💎 Gems for user:\n` +
      `🆔 \`${targetID}\``
    );
  } catch (e) {
    console.error(e);
    return output.reply("❌ Failed to update database. Check if the UID is valid.");
  }
  }
