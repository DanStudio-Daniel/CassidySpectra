import { UNIRedux } from "@cassidy/unispectra";

// Global tracker to handle stopping spam per thread
const activeSpams = new Map();

export const meta = {
  name: "spam",
  description: "Send messages every 3 seconds. Use 'stop' to end.",
  version: "1.1.0",
  author: "AzukiDan",
  category: "Tools",
  permissions: [2], // Role 2 (Owner)
  icon: "✉️",
  cmdType: "arl_g",
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * @param {CommandContext} ctx
 */
export async function entry({ input, output }) {
  const args = input.arguments;
  const threadID = input.threadID;

  // Check for stop command
  if (args[0] === "stop") {
    if (activeSpams.has(threadID)) {
      activeSpams.set(threadID, false); // Trigger the stop flag
      return output.reply("🛑 Spamming stopped.");
    } else {
      return output.reply("❌ No active spamming in this thread.");
    }
  }

  const amount = parseInt(args[0]);
  const text = args.slice(1).join(" ");

  if (isNaN(amount) || !text) {
    return output.reply("❌ Usage: spam <amount> <text> OR spam stop");
  }

  // Safety cap for mobile hosting
  if (amount > 1000) {
    return output.reply("❌ Limit is 1000.");
  }

  // Set the active flag for this thread
  activeSpams.set(threadID, true);

  for (let i = 0; i < amount; i++) {
    // Check if stop was called
    if (activeSpams.get(threadID) === false) {
      activeSpams.delete(threadID);
      return; 
    }

    await output.reply(text);
    
    if (i < amount - 1) {
      await delay(1000); // 3-second interval
    }
  }

  // Cleanup after loop finishes naturally
  activeSpams.delete(threadID);
  }
