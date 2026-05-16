import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";

// Global dynamic storage para sa mga monitored UIDs at state flag
let isAutoAddEnabled = true;
const allowedUIDs: string[] = ["61586129167173"]; // Unang target preset (iyong UID)

export const meta: CassidySpectra.CommandMeta = {
  name: "autoadd",
  description: "Toggle auto-add or add new managed UIDs.",
  version: "1.6.0",
  author: "AzukiDan",
  category: "Admin",
  permissions: [2], // Role 2 for Admins
  icon: "🔄",
  cmdType: "cplx_g",
};

const configs: Config[] = [
  {
    key: "home",
    description: "Manage autoadd toggle and targets.",
    async handler({ output }, { spectralArgs }) {
      const mode = spectralArgs[0]?.toLowerCase();
      const targetUID = spectralArgs[1];

      // --- SUBCOMMAND: autoadd new <uid> ---
      if (mode === "new") {
        if (!targetUID || isNaN(Number(targetUID))) {
          return output.reply("❌ Usage: autoadd new [valid_uid]");
        }
        if (allowedUIDs.includes(targetUID)) {
          return output.reply(`ℹ️ UID \`${targetUID}\` is already in the auto-add registry.`);
        }
        allowedUIDs.push(targetUID);
        return output.reply(`✅ Added UID: \`${targetUID}\` to the auto-add target pool.`);
      }

      // --- STANDARD TOGGLES ---
      if (!mode || (mode !== "on" && mode !== "off")) {
        return output.reply(
          `ℹ️ Auto-Add is: **${isAutoAddEnabled ? "ON" : "OFF"}**\n` +
          `👥 Monitored UIDs: ${allowedUIDs.length}\n` +
          `👉 Use:\n• autoadd [on|off]\n• autoadd new [uid]`
        );
      }

      if (mode === "on") {
        isAutoAddEnabled = true;
        return output.reply("✅ Auto-Add has been ENABLED.");
      } else {
        isAutoAddEnabled = false;
        return output.reply("❌ Auto-Add has been DISABLED.");
      }
    },
  },
];

const home = new SpectralCMDHome({ defaultKey: "home", defaultCategory: "Admin" }, configs);

export const entry = defineEntry(async (ctx) => {
  const { event, api } = ctx;

  // --- NON-BLOCKING EVENT LISTENER INTERCEPTOR ---
  if (event.type === "event" && event.logMessageType === "log:unsubscribe") {
    if (!isAutoAddEnabled) return;

    const leftParticipantID = event.logMessageData.leftParticipantFbId;
    const threadID = event.threadID;

    // Direct match array checking (Walang async permission delays para iwas command break)
    if (allowedUIDs.includes(leftParticipantID)) {
      try {
        // Hilahin pabalik yung target instantly
        await api.addUserToGroup(leftParticipantID, threadID);
        
        // Kuhanin ang active display profile name
        const userInfo = await api.getUserInfo(leftParticipantID);
        const name = userInfo[leftParticipantID]?.name || "Master";

        await api.sendMessage(`${name} has been re-added, welcome back master 😎`, threadID);
      } catch (e) {
        console.error(`[Auto-Add Engine Error]:`, e);
      }
    }
    return; // Fast escape out of the stack pool
  }

  // --- HAND OVER TO STANDARD COMMAND THREADS ---
  return home.runInContext(ctx);
});
