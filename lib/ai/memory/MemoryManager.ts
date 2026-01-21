import { prisma } from "@/lib/prisma";

/**
 * Memory Manager for AI conversations
 * Handles conversation context and history
 */
export class MemoryManager {
  /**
   * Get or create conversation for a user
   */
  static async getOrCreateConversation(
    userId: string,
  ): Promise<string> {
    // Find existing conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Create new conversation if not found
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId,
        },
      });
    }

    return conversation.id;
  }

  /**
   * Get conversation history
   */
  static async getConversationHistory(conversationId: string, limit: number = 10) {
    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return messages.reverse().map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  /**
   * Save message to conversation
   */
  static async saveMessage(
    conversationId: string,
    role: "USER" | "ASSISTANT",
    content: string
  ) {
    await prisma.message.create({
      data: {
        conversationId,
        role,
        content,
      },
    });
  }
}
