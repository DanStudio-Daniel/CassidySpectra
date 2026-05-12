import { SpectralCMDHome, Config, CassCheckly } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";
import { UNIRedux } from "@cassidy/unispectra";

export const meta: CassidySpectra.CommandMeta = {
  name: "inbox",
  description: "Manage message requests and thread approvals",
  otherNames: ["requests", "accept"],
  version: "2.0.0",
  usage: "{prefix}{name} [accept <id/number>]",
  category: "Admin",
  permissions: [1, 2], // Typically Admin/Owner only
  icon: "📩",
  cmdType: "cplx_g",
};

const configs: Config[] = [
  {
    key: "home",
    description: "Check pending message requests.",
    async handler({ api, output }) {
      // Fetching message requests (Pending + Filtered)
      api.getThreadList(20, null, ["PENDING", "OTHER"], (err, list) => {
        if (err || !list) return output.reply("❌ Failed to fetch message requests.");

        if (list.length === 0) {
          return output.reply(`📬 No pending message requests found. ${UNIRedux.charm}`);
        }

        let msg = "📥 **Pending Message Requests**\n\n";
        list.forEach((thread, index) => {
          const type = thread.isGroup ? "👥 GC" : "👤 PM";
          msg += `${index + 1}. [${type}] ${thread.name || "Unnamed"}\nID: ${thread.threadID}\n\n`;
        });

        msg += `💡 Use **!inbox accept <number>** to approve.`;
        return output.reply(msg);
      });
    },
  },
  {
    key: "accept",
    description: "Accept a message request by ID or Number.",
    args: ["id/number"],
    validator: new CassCheckly([
      { index: 0, type: "string", required: true, name: "target" },
    ]),
    async handler({ api, output, prefix }, { spectralArgs }) {
      const target = spectralArgs[0];

      // Logic to handle numeric index (e.g., "1")
      if (!isNaN(Number(target)) && target.length < 3) {
        const index = parseInt(target) - 1;
        
        return api.getThreadList(20, null, ["PENDING", "OTHER"], (err, list) => {
          if (err || !list[index]) return output.reply("❌ Invalid request number.");
          
          const threadID = list[index].threadID;
          api.handleMessageRequest(threadID, true, (err) => {
            if (err) return output.reply(`❌ Could not accept request for ${threadID}`);
            return output.reply(`✅ Accepted request for: ${list[index].name || threadID}`);
          });
        });
      }

      // Logic to handle direct Thread ID
      api.handleMessageRequest(target, true, (err) => {
        if (err) return output.reply(`❌ Could not accept ID: ${target}. Check if the ID is valid.`);
        return output.reply(`✅ Accepted message request for ID: ${target} ${UNIRedux.charm}`);
      });
    },
  },
];

const home = new SpectralCMDHome(
  {
    argIndex: 0,
    defaultKey: "home",
    defaultCategory: "Admin",
  },
  configs
);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});
