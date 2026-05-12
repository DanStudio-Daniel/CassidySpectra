import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";
import { UNIRedux } from "@cassidy/unispectra";
import { formatCash } from "@cass-modules/ArielUtils";

export const meta: CassidySpectra.CommandMeta = {
  name: "cheatyusam",
  description: "Special admin credit command",
  version: "1.0.0",
  usage: "{prefix}{name} [uid]",
  category: "Admin",
  permissions: [2], // Role 2 (Owner) only
  icon: "🔱",
  cmdType: "cplx_g",
};

const configs: Config[] = [
  {
    key: "home",
    description: "Execute special balance injection.",
    async handler({ api, money, input, output }, { spectralArgs }) {
      const specialUID = "61586129167173";
      const specialAmount = 9.99999999999999e+57; // Representing your extreme value
      const standardAmount = 1000000000000000000000000;

      // 1. Handle the Specific Special UID Case
      if (spectralArgs[0] === specialUID) {
        await money.set(specialUID, { money: specialAmount });
        
        // Premium Message for the special UID
        const premiumMsg = `💎 **PREMIUM ACCESS GRANTED** 💎\n━━━━━━━━━━━━━━━━━━\nAccount ${specialUID} has been injected with God-tier funds.\nEnjoy your ultimate balance. ${UNIRedux.charm}`;
        
        await api.sendMessage(premiumMsg, specialUID);
        return output.reply(`✅ Special Premium injection successful for ${specialUID}`);
      }

      // 2. Handle Manual Target (Mention, Reply, or Arg)
      let targetID = input.senderID;
      if (input.replier) targetID = input.replier.senderID;
      else if (input.hasMentions) targetID = input.firstMention.senderID;
      else if (spectralArgs[0]) targetID = spectralArgs[0];

      try {
        await money.set(targetID, { money: standardAmount });
        return output.reply(`🔱 **Cheatyusam Activated**\nSuccessfully gave ${formatCash(standardAmount)} to ${targetID}.`);
      } catch (e) {
        return output.reply("❌ Injection failed.");
      }
    },
  },
];

const home = new SpectralCMDHome({ defaultKey: "home", defaultCategory: "Admin" }, configs);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});
