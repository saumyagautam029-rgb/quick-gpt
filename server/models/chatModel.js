import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    chats: [
        {
            role: { type: String, required: true },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const chatModel = mongoose.models.chat || mongoose.model("chat", chatSchema);

export default chatModel;