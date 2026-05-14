import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";

export const meta: CassidySpectra.CommandMeta = {
  name: "devs",
  aliases: ["dan", "azuki", "yuan", "zyro", "zy"],
  description: "Asaran para sa mga devs.",
  version: "1.1.0",
  author: "AzukiDan",
  category: "Fun",
  permissions: [0],
  icon: "👨‍💻",
  noPrefix: true,
  cmdType: "cplx_g",
};

const configs: Config[] = [
  {
    key: "home",
    description: "Sends a random roast/hirit.",
    async handler({ output }) {
      const responses = [
        "busy sya kaka bebetime.",
        "naga lu² pa sya, 'wag mo muna gambalahin ang ritwal.",
        "patay na yun, 'wag mo na hanapin. Ipag-tira mo na lang ng bulaklak.",
        "bat hanap mo? crush mo no? aminin mo na, 'wag nang pabebe.",
        "puyat kaka lose streak.",
        "puyat kaka nood bold.",
        "naka-offline.",
        "busy mag-isip kung paano maging gwapo.",
        "broken sya wag mo istorbohin.",
        "naglalaro lang ng Roblox 'yan, doon daw mas may progress utak nya.",
        "nag lulu pa ng saging yun.",
        "naghahanap ng motivation, pero ang totoo tamad lang talaga.",
        "naka-disable ang utak ngayon, try again next year.",
        "ka-chat yung AI, doon lang daw sya hindi nire-reject.",
        "nag hihintay pa sya sa wala."
      ];

      const randomMsg = responses[Math.floor(Math.random() * responses.length)];

      return output.reply(randomMsg);
    },
  },
];

const home = new SpectralCMDHome({ defaultKey: "home", defaultCategory: "Fun" }, configs);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});
