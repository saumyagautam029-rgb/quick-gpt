import 'dotenv/config';
import Groq from "groq-sdk";
import chatModel from "../models/chatModel.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const handleChat = async (req, res) => {
    try {
        const { userId, prompt } = req.body;

        if (!prompt) {
            return res.json({ success: false, message: "Prompt is required" });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful, intelligent AI assistant." },
                { role: "user", content: prompt }
            ],
            model: "openai/gpt-oss-20b",
        });

        const aiResponse = completion.choices[0]?.message?.content || "No response generated";

        if (userId) {
            let chat = await chatModel.findOne({ userId });
            if (!chat) {
                chat = new chatModel({ userId, chats: [] });
            }
            chat.chats.push({ role: "user", content: prompt });
            chat.chats.push({ role: "assistant", content: aiResponse });
            await chat.save();
        }

        res.json({ success: true, response: aiResponse });
    } catch (error) {
        console.log("Chat Controller Error:", error);
        res.json({ success: false, message: error.message });
    }
};

export { handleChat };