import { ChatMessage } from '../types';

export interface AIChatService {
  sendMessage(message: string): Promise<ChatMessage[]>;
}

export class MockAIChatService implements AIChatService {
  private messages: ChatMessage[] = [
    {
      id: '1',
      text: "Hi! I'm your AI Chef assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ];

  private responses = [
    "That's a great question! Let me help you with that.",
    "I'd be happy to assist you with your cooking needs.",
    "Here's what I recommend based on your ingredients.",
    "That sounds delicious! Here's how you can make it.",
    "Great choice! Let me guide you through the recipe.",
    "I can help you substitute that ingredient with something else.",
  ];

  async sendMessage(message: string): Promise<ChatMessage[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    this.messages.push(userMessage);

    // Generate AI response
    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: this.responses[Math.floor(Math.random() * this.responses.length)],
      sender: 'ai',
      timestamp: new Date(),
    };

    this.messages.push(aiResponse);

    return [...this.messages];
  }
}
