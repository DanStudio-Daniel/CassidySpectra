import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";
import { UNIRedux } from "@cassidy/unispectra";

// Helper for timing
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const meta: CassidySpectra.CommandMeta = {
  name: "whatif?",
  description: "Reality check messages",
  otherNames: ["whatif", "hugot"],
  version: "1.0.0",
  usage: "{prefix}{name}",
  noPrefix: true,
  category: "Fun",
  permissions: [0], // Everyone
  waitingTime: 10,  // Cooldown to prevent spam abuse
  icon: "🤔",
  cmdType: "cplx_g",
};

const configs: Config[] = [
  {
    key: "home",
    description: "Send multiple what if messages.",
    async handler({ api, input, output }) {
      const messages = [
        "what if di kana nya mahal",
        "what if kailangan ka lang nya if na boboring sya?",
        "what if may iba na sya?",
        "what if pinaglalaroan kalang?",
        "what if di ka talaga nya minahal?",
        "what if di ka nya gusto?",
        "pinge bente. ✋🤑"
      ];

      for (const msg of messages) {
        // Sending via api directly for multiple individual messages
        await new Promise((resolve) => {
          api.sendMessage(msg, input.threadID, () => resolve(true));
        });
        await sleep(1500); // 1.5 second gap between messages
      }
    },
  }
];

const home = new SpectralCMDHome(
  {
    argIndex: 0,
    defaultKey: "home",
    defaultCategory: "Fun",
  },
  configs
);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});
