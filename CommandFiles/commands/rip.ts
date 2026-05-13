import { UNIRedux } from "@cassidy/unispectra";

export const meta = {
  name: "rip",
  description: "Shortened borders and no-prefix support.",
  version: "1.6.0",
  author: "AzukiDan",
  category: "Fun",
  permissions: [0],
  noPrefix: true, // Enabled as requested
  icon: "🪦",
  cmdType: "arl_g",
};

export async function entry({ input, output, money, api }) {
  // 1. Identify Target
  const targetID = input.replier ? input.replier.senderID : (input.hasMentions ? input.firstMention.senderID : input.senderID);
  
  // 2. Fetch Thread Participants for Random Mourner
  const threadInfo = await api.getThreadInfo(input.threadID);
  const participantIDs = threadInfo.participantIDs;

  // 3. Exclude Dead User and Bot
  const filteredParticipants = participantIDs.filter(id => id !== targetID && id !== api.getCurrentUserID());

  let randomMournerID;
  if (filteredParticipants.length > 0) {
    randomMournerID = filteredParticipants[Math.floor(Math.random() * filteredParticipants.length)];
  } else {
    randomMournerID = "0";
  }

  // 4. Fetch Names
  const deadData = await money.getItem(targetID);
  const mournerData = randomMournerID !== "0" ? await money.getItem(randomMournerID) : { name: "Someone who didn't care" };

  const deadName = deadData.name && deadData.name !== "Unregistered" ? deadData.name : "Unregistered Soul";
  const mournerName = mournerData.name && mournerData.name !== "Unregistered" ? mournerData.name : "A Stranger";

  // 5. Hugot Reasons
  const hugotReasons = [
    "pinaasa hanggang sa naging bato.", "nagselos nang walang karapatan.",
    "naging option pero hindi naging choice.", "akto na parang sila, pero hindi naman pala.",
    "minahal siya, pero kaibigan lang ang tingin sa kanya.", "iniwan sa ere nung kailangan na.",
    "nag-antay sa chat na 'delivered' lang forever.", "pangalawa sa puso, pero huli sa priority.",
    "nasobrahan sa pagiging marupok.", "nagmahal nang tapat, pero binalewala lang.",
    "naging sandalan nung malungkot siya, pero binalikan din yung nanakit sa kanya.",
    "umasa sa 'see you soon' na hindi na dumating.", "nasaktan sa biro na may katotohanan.",
    "nahulog sa taong hindi siya kayang saluhin.", "pinagpalit sa taong kachat lang pala niya kagabi.",
    "naghintay sa sagot na 'oo', pero 'bahala na' ang nakuha.", "iniwan nung wala nang pakinabang.",
    "nagpuyat para sa kanya, pero siya tulog na pala sa iba.", "nasakal sa pagmamahal na hindi naman sa kanya.",
    "naging rebound lang sa larong hindi siya player.", "nagmahal ng patago, nasaktan ng todo.",
    "binigay lahat, pero 'kulang pa rin' ang sagot.", "naging extra sa storya nilang dalawa.",
    "umasa sa mga pangakong nakasulat sa tubig.", "pinagtagpo pero hindi itinadhana.",
    "naghintay sa tamang panahon na hindi naman dumating.", "naging pampalipas oras lang nung boring ang mundo niya.",
    "nanatiling tapat sa taong marami palang iba.", "naging taga-comfort nung iniwan siya ng mahal niya.",
    "nagtiwala sa mga salitang 'ikaw lang', 'yon pala 'ikaw lang ang kausap sa oras na 'to'.",
    "nasaktan sa pag-alis na walang paalam.", "naging pangarap na hanggang panaginip na lang.",
    "umasa sa spark na mabilis ding nawala.", "nagmahal sa taong hanggang 'friend zone' lang ang kaya."
  ];

  const randomHugot = hugotReasons[Math.floor(Math.random() * hugotReasons.length)];

  // --- STYLING (Shortened Borders) ---
  const borderTop = "╔═════════════════╗";
  const borderMid = "╠═════════════════╣";
  const borderBot = "╚═════════════════╝";
  const arrow = UNIRedux.arrow || "»";

  const message = 
    `${borderTop}\n` +
    `  🪦  **REST IN PEACE**  🪦\n` +
    `${borderMid}\n` +
    `${arrow} **Name:** **${deadName}**\n` +
    `${arrow} **Cause:** ${randomHugot}\n` +
    `${borderMid}\n` +
    ` 🕊️ **In Loving Memory of:** \n` +
    `      ✨ **${mournerName}** ✨\n` +
    `${borderBot}`;

  return output.reply(message);
    }
