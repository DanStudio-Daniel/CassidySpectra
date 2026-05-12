import { CommandMeta, CommandStyle, defineEntry } from "../types";

export const meta: CommandMeta = {
    name: "give",
    otherNames: ["transfer", "pay"],
    description: "Transfer money to another user",
    usage: "{prefix}give [amount] [uid|mention|reply]",
    category: "Economy",
    version: "1.0.0",
    icon: "💸",
    role: 0 // Everyone
};

export const style: CommandStyle = {
    title: "💸 Money Transfer",
    contentFont: "fancy",
    lineDeco: "altar"
};

export const entry = defineEntry({
    async default({ input, output, money, event }) {
        const senderID = event.senderID;
        const amount = parseInt(input.args[0]);

        if (isNaN(amount) || amount <= 0) {
            return await output.reply("❌ Enter a valid amount to transfer.");
        }

        let targetID: string | null = null;

        // Targeting Logic
        if (input.type === "message_reply") {
            targetID = input.messageReply.senderID;
        } else if (input.mentions && Object.keys(input.mentions).length > 0) {
            targetID = Object.keys(input.mentions)[0];
        } else if (input.args[1]) {
            targetID = input.args[1];
        }

        if (!targetID || targetID === senderID) {
            return await output.reply("❌ Invalid target. You cannot transfer to yourself or an empty ID.");
        }

        // Transaction Logic
        const senderBalance = await money.get(senderID);
        if (senderBalance < amount) {
            return await output.reply("❌ You don't have enough money to complete this transfer!");
        }

        try {
            await money.sub(senderID, amount);
            await money.add(targetID, amount);
            await output.reply(`💸 Sent ₱${amount.toLocaleString()} to user ${targetID}.`);
        } catch (e) {
            await output.reply("❌ Transaction failed. Please try again later.");
        }
    }
});
