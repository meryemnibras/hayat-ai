import { BaseChatMessageHistory } from "@langchain/core/chat_history";
import {
  BaseMessage,
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { prisma } from "@/lib/prisma";

/**
 * Prisma-based message history for LangChain
 * Stores and retrieves conversation history from the database
 */
export class PrismaMessageHistory extends BaseChatMessageHistory {
  lc_namespace = ["langchain", "memory", "prisma"];
  private conversationId: string;
  private maxMessages: number;

  constructor(conversationId: string, maxMessages: number = 20) {
    super();
    this.conversationId = conversationId;
    this.maxMessages = maxMessages;
  }

  async getMessages(): Promise<BaseMessage[]> {
    try {
      const messages = await prisma.message.findMany({
        where: {
          conversationId: this.conversationId,
        },
        orderBy: {
          createdAt: "asc",
        },
        take: this.maxMessages,
      });

      return messages.map((msg) => {
        const content = msg.content || "";
        
        // Convert database message to LangChain message
        switch (msg.role) {
          case "ASSISTANT":
            return new AIMessage(content);
          case "USER":
            return new HumanMessage(content);
          default:
            return new HumanMessage(content);
        }
      });
    } catch (error) {
      console.error("Error fetching messages from Prisma:", error);
      return [];
    }
  }

  async addMessage(message: BaseMessage): Promise<void> {
    try {
      // Determine role based on message type
      let role: "USER" | "ASSISTANT" = "USER";
      
      if (message instanceof AIMessage) {
        role = "ASSISTANT";
      } else if (message instanceof SystemMessage) {
        // System messages are not stored in the database
        return;
      }

      // Store message in database
      await prisma.message.create({
        data: {
          conversationId: this.conversationId,
          role,
          content: message.content as string,
        },
      });
    } catch (error) {
      console.error("Error adding message to Prisma:", error);
      throw error;
    }
  }

  async addUserMessage(content: string): Promise<void> {
    await this.addMessage(new HumanMessage(content));
  }

  async addAIChatMessage(content: string): Promise<void> {
    await this.addMessage(new AIMessage(content));
  }

  async clear(): Promise<void> {
    try {
      await prisma.message.deleteMany({
        where: {
          conversationId: this.conversationId,
        },
      });
    } catch (error) {
      console.error("Error clearing messages from Prisma:", error);
      throw error;
    }
  }
}














