import { UNIRedux } from "@cassidy/unispectra";

export const meta = {
  name: "rip",
  description: "Rest in peace, buddy.",
  version: "1.3.0",
  author: "AzukiDan",
  category: "Fun",
  noPrefix: "both",
  permissions: [0],
  icon: "🪦",
  cmdType: "arl_g",
};

export async function entry({ input, output, money }) {
  const targetID = input.replier ? input.replier.senderID : (input.hasMentions ? input.firstMention.senderID : input.senderID);
  
  // Fetch data
  const deadUserData = await money.getItem(targetID);
  const killerUserData = await money.getItem(input.senderID);
  
  // Name Fallbacks
  const deadName = deadUserData.name && deadUserData.name !== "Unregistered" ? deadUserData.name : (input.replier?.senderName || "Unknown Soul");
  const killerName = killerUserData.name && killerUserData.name !== "Unregistered" ? killerUserData.name : (input.senderName || "System");

  const reasons = [
    "sa sobrang kakahintay sa reply niya.", "kasi nakalimutan huminga habang nag-ge-games.", 
    "nasobrahan sa kape, naging mabilis ang heart rate hanggang sa lumipad.", "dahil sa sobrang corny na joke.",
    "nabilaukan sa sariling laway.", "sa kakahintay ng update ng script na 'to.",
    "dahil hindi siya ang priority.", "sa sobrang lamig ng reply niya.",
    "nasagasaan ng sariling imagination.", "namatay sa inggit.",
    "dahil sa 999+ ping sa Roblox.", "na-drain ang energy gaya ng battery ng phone mo.",
    "nakalimutan kung paano lumunok.", "dahil sa sobrang overthinking.",
    "nasobrahan sa pagiging delulu.", "natapon ang milk tea.",
    "sa kakahintay ng sahod.", "dahil sa math assignment.",
    "na-ghost ng hindi naman naging sila.", "kinain ng sariling pride.",
    "sa sobrang kakahintay sa 'Goodnight' niya.", "dahil hindi siya crush ng crush niya.",
    "nahulog sa kanal habang nag-se-cellphone.", "nasabugan ng logic.",
    "dahil sa sobrang kaguwapuhan/kagandahan (not really).", "na-stress sa backlogs.",
    "dahil sa low storage na phone.", "nakalimutan ang password ng account.",
    "sa sobrang kakahintay sa rank up.", "dahil sa toxic na kalaro.",
    "na-kick sa group chat.", "dahil sa maling send ng message.",
    "na-seen zone forever.", "dahil sa kagat ng lamok na may abs.",
    "nasobrahan sa puyat.", "dahil sa cringe na memories 5 years ago.",
    "na-fall sa maling tao.", "dahil sa lag na internet.",
    "sa sobrang kakahintay sa loading screen.", "dahil sa typo error.",
    "nakuryente sa sariling charm.", "dahil sa sobrang gutom.",
    "na-scam ng 'to follow' na grades.", "dahil sa walang kwentang debate.",
    "nasakal sa sariling outfit.", "dahil sa boring na k'wentuhan.",
    "na-block ni crush.", "dahil sa sobrang daming ads.",
    "nahulog sa upuan habang tumatawa.", "dahil sa bad timing."
  ];

  const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
  const memoryOf = (targetID === input.senderID) ? "his/her lost braincells" : killerName;

  // --- STYLING BLOCK ---
  const borderTop = "╔═══════════════════╗";
  const borderMid = "╠═══════════════════╣";
  const borderBot = "╚═══════════════════╝";
  const arrow = UNIRedux.arrow || "»";

  const message = 
    `${borderTop}\n` +
    `   🪦  **REST IN PEACE**  🪦\n` +
    `${borderMid}\n` +
    `${arrow} **Name:** *${deadName}*\n` +
    `${arrow} **Status:** *condolence*\n` +
    `${arrow} **Cause:** ${randomReason}\n` +
    `${borderMid}\n` +
    ` 🕊️ *In Loving Memory of:* \n` +
    `      ✨ **${memoryOf}** ✨\n` +
    `${borderBot}`;

  return output.reply(message);
    }
