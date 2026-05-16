import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";

// Global configuration variable para hindi ma-block o ma-break ang event loop
let isAutoAddEnabled = true;

export const meta: CassidySpectra.CommandMeta = {
  name: "autoadd",
  description: "Toggle auto-add feature when an admin leaves or gets kicked.",
  version: "1.5.0",
  author: "AzukiDan",
  category: "Admin",
  permissions: [2], // Role 2 for Admins
  icon: "🔄",
  cmdType: "cplx_g",
};

const configs: Config[] = [
  {
    key: "home",
    description: "Turn autoadd on or off.",
    async handler({ output }, { spectralArgs }) {
      const mode = spectralArgs[0]?.toLowerCase();

      if (!mode || (mode !== "on" && mode !== "off")) {
        return output.reply(`ℹ️ Auto-Add is currently: **${isAutoAddEnabled ? "ON" : "OFF"}**\n👉 Use: autoadd [on|off]`);
      }

      if (mode === "on") {
        isAutoAddEnabled = true;
        return output.reply("✅ Auto-Add has been ENABLED. Admin departures will now be monitored.");
      } else {
        isAutoAddEnabled = false;
        return output.reply("❌ Auto-Add has been DISABLED. Bot will ignore leaving admins.");
      }
    },
  },
];

const home = new SpectralCMDHome({ defaultKey: "home", defaultCategory: "Admin" }, configs);

export const entry = defineEntry(async (ctx) => {
  const { event, api } = ctx;

  // --- INTERCEPTOR FOR ACTIONS/EVENTS ---
  // Kung hindi text command at unsubscribe event ang pumasok, dito dadaan nang hindi hinaharangan ang thread execution
  if (event.type === "event" && event.logMessageType === "log:unsubscribe") {
    if (!isAutoAddEnabled) return; // Rekta pass kapag naka-off para tipid sa resources

    const leftParticipantID = event.logMessageData.leftParticipantFbId;
    const threadID = event.threadID;

    try {
      // Suriin ang permission level ng umalis na UID (Role 2 pataas)
      const userPermission = await ctx.system?.getPermission(leftParticipantID) || 0;

      if (userPermission >= 2) {
        // Hilahin pabalik ang admin
        await api.addUserToGroup(leftParticipantID, threadID);
        
        // Kuhanin ang profile name para sa custom welcome banner
        const userInfo = await api.getUserInfo(leftParticipantID);
        const name = userInfo[leftParticipantID]?.name || "Admin";

        await api.sendMessage(`${name} has been re-added, welcome back master 😎`, threadID);
      }
    } catch (e) {
      console.error(`[Auto-Add Background Error]:`, e);
    }
    return; // Break out para hindi guluhin ang process pool
  }

  // --- FOR STANDARD COMMAND INVOCATION ---
  return home.runInContext(ctx);
});
