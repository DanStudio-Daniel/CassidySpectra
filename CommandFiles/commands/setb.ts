import { SpectralCMDHome, CassCheckly, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";
import { formatCash } from "@cass-modules/ArielUtils";

export const meta: CassidySpectra.CommandMeta = {
  name: "setbal",
  description: "Force set a user's balance",
  otherNames: ["setmoney"],
  version: "1.0.0",
  usage: "{prefix}{name} [amount] [uid|mention|reply]",
  category: "Admin",
  permissions: [2], // Admin only
  waitingTime: 0,
  icon: "💰",
  cmdType: "cplx_g"
};

const configs: Config[] = [
  {
    key: "default",
    description: "Set balance",
    args: ["amount", "[target]"],
    validator: new CassCheckly([
      { index: 0, type: "number", required: true, name: "amount" }
    ]),
    async handler({ money, input, output }, { spectralArgs }) {
      const amount = parseInt(spectralArgs[0]);
      let targetID = input.senderID;

      // Targeting: Reply > Mention > UID Arg
      if (input.replier) {
        targetID = input.replier.senderID;
      } else if (input.hasMentions) {
        targetID = input.firstMention.senderID;
      } else if (spectralArgs[1]) {
        targetID = spectralArgs[1];
      }

      try {
        await money.set(targetID, { money: amount });
        return output.reply(`✅ Successfully set balance to ${formatCash(amount, "💵")} for ID: ${targetID}`);
      } catch (e) {
        return output.reply("❌ Error updating balance.");
      }
    }
  }
];

const home = new SpectralCMDHome({
  argIndex: 0,
  defaultKey: "default",
  defaultCategory: "Admin"
}, configs);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});
