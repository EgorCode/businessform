import { useState, useCallback } from "react";
import { aiService, AIMessage } from "@/services/aiService";
import { useAIAssistant } from "@/contexts/AIAssistantContext";

export function useAIChat() {
    const { messages, addMessage, subscriptionTier } = useAIAssistant();
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);

    const handleSend = useCallback(() => {
        if (!input.trim()) return;

        const userMessage: AIMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        addMessage(userMessage);
        setInput("");
        setIsThinking(true);

        // Используем реальный AI сервис для получения ответа с учетом подписки
        aiService.sendMessage(input, messages, subscriptionTier).then(response => {
            const aiMessage: AIMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response.message,
                timestamp: new Date(),
                category: response.category
            };
            addMessage(aiMessage);
            setIsThinking(false);
        }).catch(error => {
            console.error('AI Service Error:', error);
            // В случае ошибки показываем стандартное сообщение об ошибке
            const aiMessage: AIMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз или переформулируйте вопрос.",
                timestamp: new Date(),
                category: "general"
            };
            addMessage(aiMessage);
            setIsThinking(false);
        });
    }, [input, messages, addMessage, subscriptionTier]);

    const handleQuickQuestion = useCallback((question: string) => {
        setInput(question);
        setTimeout(() => handleSend(), 100);
    }, [handleSend]);

    return {
        input,
        setInput,
        isThinking,
        handleSend,
        handleQuickQuestion
    };
}
