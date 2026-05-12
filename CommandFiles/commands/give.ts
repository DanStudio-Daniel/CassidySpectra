import { SpectralCMDHome, CassCheckly, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";
import { formatCash } from "@cass-modules/ArielUtils";

export const meta: CassidySpectra.CommandMeta = {
  name: "give",
  description: "Transfer money to another user",
  otherNames: ["trans", "transfer"],
  version: "1.0.0",
  usage: "{prefix}{name} [amount] [uid|mention|reply]",
  category: "Finance",
  permissions: [0], // Everyone
  waitingTime: 5,
  icon: "💸",
  cmdType: "cplx_g"
};

const configs: Config[] = [
  {
    key: "default",
    description: "Transfer money",
    args: ["amount", "[target]"],
    validator: new CassCheckly([
      { index: 0, type: "number", required: true, name: "amount" }
    ]),
    async handler({ money, input, output }, { spectralArgs }) {
      const amount = parseInt(spectralArgs[0]);
      if (amount <= 0) return output.reply("❌ Amount must be positive.");

      let targetID: string;

      if (input.replier) {
        targetID = input.replier.senderID;
      } else if (input.hasMentions) {
        targetID = input.firstMention.senderID;
      } else if (spectralArgs[1]) {
        targetID = spectralArgs[1];
      } else {
        return output.reply("❌ Please specify a target via reply, mention, or UID.");
      }

      if (targetID === input.senderID) return output.reply("❌ You cannot give money to yourself.");

      const senderData = await money.getCache(input.senderID);
      if (senderData.money < amount) return output.reply("❌ You don't have enough money!");

      try {
        await money.sub(input.senderID, { money: amount });
        await money.add(targetID, { money: amount });
        
        return output.reply(`💸 You transferred ${formatCash(amount, "💵")} to user ${targetID}.`);
      } catch (e) {
        return output.reply("❌ Transaction failed.");
      }
    }
  }
];

const home = new SpectralCMDHome({
  argIndex: 0,
  defaultKey: "default"
}, configs);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});
