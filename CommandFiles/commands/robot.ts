import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";

export const meta: CassidySpectra.CommandMeta = {
  name: "robot",
  description: "Defensive bot responses",
  otherNames: ["bot", "chatbot"],
  version: "1.0.0",
  usage: "{name}",
  category: "Fun",
  permissions: [0], // Everyone can trigger
  icon: "🤖",
  cmdType: "cplx_g",
  noPrefix: "both" // Responds to plain text
};

const configs: Config[] = [
  {
    key: "home",
    description: "Prove you aren't a robot.",
    async handler({ output }) {
      const responses = [
        "I'm not a robot",
        "hinde ako robot",
        "di nga ako robot",
        "putangina mo di nga ako robot",
        "puta sabing di ako robot",
        "I'm not robot, I'm human"
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      return output.reply(randomResponse);
    },
  }
];

const home = new SpectralCMDHome({ defaultKey: "home", defaultCategory: "Fun" }, configs);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});
