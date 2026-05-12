import { SpectralCMDHome, Config } from "@cassidy/spectral-home";
import { defineEntry } from "@cass/define";

export const meta: CassidySpectra.CommandMeta = {
  name: "rip",
  description: "Rest in Peace prank for fun",
  otherNames: ["patay", "libing"],
  version: "1.0.0",
  usage: "{prefix}{name}",
  category: "Fun",
  permissions: [0], // Everyone
  waitingTime: 5,
  icon: "⚰️",
  cmdType: "cplx_g",
  noRibbonUI: true,
};

const configs: Config[] = [
  {
    key: "home",
    description: "Send a random funeral card.",
    async handler({ api, input, output, money }) {
      // 1. Get a random user from the group
      const threadInfo = await new Promise<any>((resolve) => {
        api.getThreadInfo(input.threadID, (err, info) => resolve(info));
      });

      const participantIDs = threadInfo?.participantIDs || [input.senderID];
      const randomID = participantIDs[Math.floor(Math.random() * participantIDs.length)];
      
      // Get the user's name from cache or API
      const userData = await money.getCache(randomID);
      const name = userData?.name || "Someone";

      // 2. Reasons list (Your 4 + 5 New ones)
      const reasons = [
        "nag selos na walang karapatan.",
        "nahulog sa maling tao.",
        "iniwan.",
        "ginawang option.",
        "naghintay sa chat na hindi naman darating.", // New 1
        "naniwala sa 'ikaw lang sapat na'.", // New 2
        "masyadong marupok sa maling tao.", // New 3
        "umasa na magiging sila rin sa huli.", // New 4
        "puyat kaka-stalk sa ex niyang may bago na." // New 5
      ];

      const randomReason = reasons[Math.floor(Math.random() * reasons.length)];

      // 3. The Layout
      const funeralCard = [
        `.❀•°•═══ஓ๑♡๑ஓ═══•°•❀`,
        `                  ✞︎ 𝐑.𝐈.𝐏 ✞︎`,
        `               @${name}`,
        `           𝐂𝐀𝐔𝐒𝐄 𝐎𝐅 𝐃𝐄𝐀𝐓𝐇:`,
        `        ${randomReason}`,
        `        🕊️𝑖𝑛 𝑙𝑜𝑣𝑖𝑛𝑔 𝑚𝑒𝑚𝑜𝑟𝑖𝑒𝑠🕊️`,
        `         @${name}`,
        `❀•°════ஓ๑♡๑ஓ════°•❀`
      ].join("\n");

      return output.reply({
        body: funeralCard,
        mentions: [{ tag: `@${name}`, id: randomID }]
      });
    },
  },
];

const home = new SpectralCMDHome({ defaultKey: "home", defaultCategory: "Fun" }, configs);

export const entry = defineEntry(async (ctx) => {
  return home.runInContext(ctx);
});
