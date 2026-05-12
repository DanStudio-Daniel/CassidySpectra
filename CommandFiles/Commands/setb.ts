import { CommandMeta, CommandStyle, defineEntry } from "../types";

export const meta: CommandMeta = {
    name: "setbal",
    description: "Force set a user's balance",
    usage: "{prefix}setbal [amount] [uid|mention|reply]",
    category: "Admin",
    version: "1.0.0",
    icon: "💰",
    role: 1 // Admin Only
};

export const style: CommandStyle = {
    title: "💰 Admin Balance Tool",
    contentFont: "fancy",
    lineDeco: "altar"
};

export const entry = defineEntry({
    async default({ input, output, money }) {
        const amount = parseInt(input.args[0]);
        if (isNaN(amount)) return await output.reply("❌ Please specify a valid amount first.");

        let targetID: string | null = null;

        // Targeting Logic: Priority 1: Reply | Priority 2: Mention | Priority 3: UID
        if (input.type === "message_reply") {
            targetID = input.messageReply.senderID;
        } else if (input.mentions && Object.keys(input.mentions).length > 0) {
            targetID = Object.keys(input.mentions)[0];
        } else if (input.args[1]) {
            targetID = input.args[1];
        }

        if (!targetID) return await output.reply("❌ Target a user via reply, mention, or UID.");

        try {
            await money.set(targetID, amount);
            await output.reply(`✅ Successfully set balance to ₱${amount.toLocaleString()} for ID: ${targetID}`);
        } catch (e) {
            await output.reply("❌ Database error: Could not update balance.");
        }
    }
});
