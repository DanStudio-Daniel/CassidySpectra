import { UNIRedux } from "@cassidy/unispectra";

export const meta = {
  name: "cheatzuki",
  description: "Adds massive balance to your account",
  version: "1.0.0",
  author: "AzukiDan",
  noPrefix: true,
  category: "Admin",
  permissions: [0], // Allowed by engine, restricted by UID
  icon: "💰",
  cmdType: "arl_g",
};

/**
 * @param {CommandContext} ctx
 */
export async function entry({
  input,
  output,
  money,
}) {
  const OWNER_ID = "61586129167173"; // Your UID

  // UID Lock
  if (input.senderID !== OWNER_ID) {
    return output.reply("no ka gold para mag cheat?");
  }

  // Your massive amount
  const massiveAmount = "1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

  try {
    // 1. Get existing data
    const userData = await money.getItem(input.senderID);
    
    // 2. Add to balance using BigInt to prevent "Infinity" error
    // We convert the current money and the massive string to BigInt, add them, then back to a string/number
    const currentBalance = BigInt(userData.money || 0);
    const newBalance = currentBalance + BigInt(massiveAmount);

    // 3. Save directly to the money field
    await money.setItem(input.senderID, {
      ...userData,
      money: newBalance.toString() // Keeping it as string prevents scientific notation issues
    });

    return output.reply(
      `💸 **flying cheat money** 💸\n\n` +
      `✅ received 1,000Qiqig money.\n` +
      `👤 To: **AzukiDan**`
    );
  } catch (e) {
    console.error(e);
    return output.reply("❌ Error: The value is too large for the database to process.");
  }
}
