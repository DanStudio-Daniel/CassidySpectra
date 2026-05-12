import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";
import { UNIRedux } from "@cassidy/unispectra";

export const meta: CassidySpectra.CommandMeta = {
  name: "leave",
  description: "Make the bot leave the current group",
  otherNames: ["out", "flyhigh"],
  version: "1.0.0",
  usage: "{prefix}{name}",
  noPrefix: true,
  category: "Admin",
  author: "AzukiDan",
  permissions: [1, 2], // Role 1 and 2 only
  waitingTime: 0,
  icon: "🏃",
  cmdType: "cplx_g",
  noRibbonUI: true,
};

export const style: CassidySpectra.CommandStyle = {
  titleFont: "bold",
  title: "🏃 Bot Departure",
  contentFont: "fancy",
};

const configs: Config[] = [
  {
    key: "home",
    description: "Leave the group chat.",
    async handler({ api, input, output }) {
      await output.reply(`bot leaving...${UNIRedux.charm}`);
      
      // In most Cassidy-based frameworks, the bot's own ID is stored in api.getCurrentUserID()
      const botID = api.getCurrentUserID();
      
      return api.removeUserFromGroup(botID, input.threadID, (err) => {
        if (err) return output.reply("wala kang karapatan na ipaalis ako.");
      });
    },
  }
];

const home = new SpectralCMDHome(
  {
    argIndex: 0,
    isHypen: false,
    globalCooldown: 5,
    defaultKey: "home",
    errorHandler: (error, ctx) => {
      ctx.output.error(error);
    },
    defaultCategory: "Admin",
  },
  configs
);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});
