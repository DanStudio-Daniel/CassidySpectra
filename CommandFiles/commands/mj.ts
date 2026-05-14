import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";

export const meta: CassidySpectra.CommandMeta = {
  name: "michaeljackson",
  aliases: ["mj"],
  description: "He-he!",
  version: "1.0.0",
  author: "AzukiDan",
  category: "Fun",
  permissions: [0],
  icon: "🕺",
  noPrefix: true,
  cmdType: "cplx_g",
};

const configs: Config[] = [
  {
    key: "home",
    description: "Sends MJ lines.",
    async handler({ output }) {
      // First reply
      await output.reply("bawal dito UMIIIHIIIII!!");
      
      // Delay nang konti para mas swabe yung second reply
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Second reply
      return output.reply("YAHHH!!!");
    },
  },
];

const home = new SpectralCMDHome({ defaultKey: "home", defaultCategory: "Fun" }, configs);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});
