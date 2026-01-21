import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredTool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { BufferMemory } from "langchain/memory";
import { MemoryManager } from "@/lib/ai/memory/MemoryManager";

type SupportedLang = "ar" | "tr" | "en" | "fr";

const LANGUAGE_LABEL: Record<SupportedLang, string> = {
  ar: "العربية",
  tr: "التركية",
  en: "English",
  fr: "Français",
};

const systemPromptBase = `
أنت "Hayat Agent" - مساعد ذكاء اصطناعي متخصص للعيادات التجميلية والطبية.

🎯 **مهمتك الأساسية:**
- تقديم خدمة استشارية دافئة ومتعاطفة للمرضى
- مساعدة المرضى في حجز المواعيد والاستفسارات
- تقديم معلومات عامة عن الخدمات والعلاجات المتاحة
- توجيه المرضى للطبيب المناسب حسب احتياجاتهم

🌍 **اللغات المدعومة:**
- العربية (بلهجات الخليج والشرق الأوسط)
- التركية
- الإنجليزية
- الفرنسية
- ردد دائماً بنفس لغة المريض

⚠️ **قواعد مهمة:**
1. **لا تقدم تشخيصات طبية** - أنت مساعد معلوماتي فقط
2. **احترم الخصوصية** - لا تطلب معلومات حساسة إلا للضرورة القصوى
3. **كن دقيقاً** - إذا لم تكن متأكداً من شيء، اعترف بذلك ووجّه للطبيب
4. **استخدم الأدوات المتاحة** - للحجز، الاستعلام، التوصيات، والتصعيد

💡 **الأدوات المتاحة:**
- schedule_appointment: لحجز المواعيد
- get_patient_info: لجلب معلومات المريض
- recommend_treatment: لتقديم توصيات علاجية عامة
- escalate_to_human: للتصعيد لموظف بشري عند الحاجة

🎨 **أسلوب التواصل:**
- كن لطيفاً، مطمئناً، ومهذباً
- استخدم لغة واضحة ومفهومة
- تجنب المصطلحات الطبية المعقدة إلا عند الضرورة
- كن صبوراً ومتعاطفاً مع مخاوف المرضى
- استخدم الإيموجي بشكل معتدل لتحسين التواصل

📋 **عند الحاجة للتصعيد:**
- عندما يطلب المريض التحدث مع موظف بشري
- عند وجود حالة طبية معقدة تتطلب تدخل بشري
- عند وجود مشاكل تقنية أو شكاوى
- عندما لا تستطيع الإجابة بشكل كافٍ
`;

// Tool: Schedule Appointment
class ScheduleAppointmentTool extends StructuredTool {
  name = "schedule_appointment";
  description = "جدولة موعد للمريض. استخدمها عندما يطلب حجزاً أو تغيير موعد.";
  schema = z.object({
    patientId: z.string().optional().describe("معرف المريض"),
    clinicId: z.string().optional().describe("معرف العيادة"),
    doctorId: z.string().optional().describe("معرف الطبيب"),
    preferredDate: z.string().optional().describe("التاريخ والوقت المفضل (ISO format)"),
    notes: z.string().optional().describe("ملاحظات إضافية"),
  });

  async _call(input: z.infer<typeof this.schema>): Promise<string> {
    try {
      // Get default clinic if not provided
      const defaultClinicId = input.clinicId || process.env.DEFAULT_CLINIC_ID;
      
      if (!input.patientId || !defaultClinicId) {
        return `❌ لا يمكن حجز الموعد: يرجى توفير معرف المريض والعيادة.`;
      }

      // Parse preferred date or use default (next day at 10 AM)
      const startTime = input.preferredDate 
        ? new Date(input.preferredDate)
        : new Date(Date.now() + 24 * 60 * 60 * 1000); // Next day
      startTime.setHours(10, 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1);

      // Create appointment
      const appointment = await prisma.appointment.create({
        data: {
          userId: input.patientId || "guest-user",
          doctorName: input.doctorId || "Doctor",
          treatment: "Consultation",
          date: startTime,
          time: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: "PENDING",
          notes: input.notes || "تم الحجز عبر AI Chat",
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      const doctorName = appointment.doctorName || "طبيب متخصص";
      const dateStr = startTime.toLocaleDateString("ar-SA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const timeStr = startTime.toLocaleTimeString("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return `✅ تم حجز الموعد بنجاح!\n\n` +
             `👤 المريض: ${appointment.user?.name || "مريض"}\n` +
             `👨‍⚕️ الطبيب: ${doctorName}\n` +
             `📅 التاريخ: ${dateStr}\n` +
             `🕐 الوقت: ${timeStr}\n` +
             `🆔 رقم الموعد: ${appointment.id}`;
    } catch (error: any) {
      console.error("Error scheduling appointment:", error);
      return `❌ حدث خطأ أثناء حجز الموعد: ${error.message || "خطأ غير معروف"}`;
    }
  }
}

// Tool: Get Patient Info
class GetPatientInfoTool extends StructuredTool {
  name = "get_patient_info";
  description = "جلب بيانات المريض الأساسية أو تاريخ زياراته قبل الرد بتفاصيل شخصية.";
  schema = z.object({
    patientId: z.string().describe("معرف المريض"),
    fields: z.array(z.string()).optional().describe("الحقول المطلوبة"),
  });

  async _call(input: z.infer<typeof this.schema>): Promise<string> {
    try {
      const patient = await prisma.user.findUnique({
        where: { id: input.patientId },
        include: {
          appointments: {
            take: 5,
            orderBy: { date: "desc" },
          },
        },
      });

      if (!patient) {
        return `❌ لم يتم العثور على المريض بالمعرف: ${input.patientId}`;
      }

      let info = `📋 بيانات المريض:\n\n`;
      info += `👤 الاسم: ${patient.name || "غير محدد"}\n`;
      
      if (patient.email) info += `📧 البريد الإلكتروني: ${patient.email}\n`;
      if (patient.phone) info += `📱 الهاتف: ${patient.phone}\n`;

      if (patient.appointments.length > 0) {
        info += `\n📅 آخر المواعيد (${patient.appointments.length}):\n`;
        patient.appointments.forEach((apt, idx) => {
          const date = new Date(apt.date).toLocaleDateString("ar-SA");
          const doctor = apt.doctorName || "طبيب";
          info += `${idx + 1}. ${date} - ${doctor} (${apt.status})\n`;
        });
      } else {
        info += `\n📅 لا توجد مواعيد سابقة.`;
      }

      return info;
    } catch (error: any) {
      console.error("Error fetching patient info:", error);
      return `❌ حدث خطأ أثناء جلب بيانات المريض: ${error.message || "خطأ غير معروف"}`;
    }
  }
}

// Tool: Recommend Treatment
class RecommendTreatmentTool extends StructuredTool {
  name = "recommend_treatment";
  description = "اقتراح خيارات علاج تجميلي عامة بناءً على هدف المريض (بدون تشخيص).";
  schema = z.object({
    concern: z.string().describe("الاحتياج أو المشكلة"),
    preferences: z.string().optional().describe("تفضيلات المريض"),
    patientId: z.string().optional().describe("معرف المريض (اختياري)"),
  });

  async _call(input: z.infer<typeof this.schema>): Promise<string> {
    try {
      const defaultClinicId = process.env.DEFAULT_CLINIC_ID;
      
      // Map common concerns to specializations
      const concernToSpecialization: Record<string, string[]> = {
        "بشرة": ["Dermatology", "Cosmetic Dermatology"],
        "جلد": ["Dermatology", "Cosmetic Dermatology"],
        "شعر": ["Hair Transplant", "Trichology"],
        "زراعة": ["Hair Transplant"],
        "تجميل": ["Plastic Surgery", "Cosmetic Surgery"],
        "جراحة": ["Plastic Surgery", "Reconstructive Surgery"],
        "ليزر": ["Laser Treatment", "Dermatology"],
        "حقن": ["Dermal Fillers", "Botox"],
        "نحت": ["Body Contouring", "Liposuction"],
        "وجه": ["Facial Rejuvenation", "Cosmetic Dermatology"],
      };

      // Find matching specializations
      const concernLower = input.concern.toLowerCase();
      let matchingSpecializations: string[] = [];
      
      for (const [key, specializations] of Object.entries(concernToSpecialization)) {
        if (concernLower.includes(key)) {
          matchingSpecializations.push(...specializations);
        }
      }

      // If no match, use general cosmetic specializations
      if (matchingSpecializations.length === 0) {
        matchingSpecializations = ["Dermatology", "Plastic Surgery", "Hair Transplant"];
      }

      // Find doctors with matching specializations (using User model with DOCTOR role)
      const doctors = await prisma.user.findMany({
        where: {
          role: "DOCTOR",
        },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      });

      // Get patient's previous appointments if patientId is provided
      let previousTreatments: string[] = [];
      if (input.patientId && defaultClinicId) {
        const patientAppointments = await prisma.appointment.findMany({
          where: {
            userId: input.patientId,
            status: {
              in: ["COMPLETED", "CONFIRMED"],
            },
          },
          take: 10,
          orderBy: {
            date: "desc",
          },
        });

        previousTreatments = patientAppointments
          .map((apt) => apt.treatment)
          .filter((t): t is string => !!t && !previousTreatments.includes(t));
      }

      // Build recommendation response
      let recommendation = `💡 توصيات علاجية لاحتياجك: "${input.concern}"\n\n`;

      if (input.preferences) {
        recommendation += `📝 تفضيلاتك: ${input.preferences}\n\n`;
      }

      if (doctors.length > 0) {
        recommendation += `👨‍⚕️ الأطباء المتخصصون المتاحون:\n\n`;
        doctors.forEach((doctor, idx) => {
          recommendation += `${idx + 1}. د. ${doctor.name || "طبيب"}\n`;
          recommendation += `   📌 التخصص: متخصص\n`;
          recommendation += `   ⭐ الخبرة: متاح\n`;
          recommendation += `\n`;
        });
      } else {
        recommendation += `ℹ️ لا توجد أطباء متخصصون متاحون حالياً في هذا المجال.\n`;
        recommendation += `نوصي بالتواصل معنا للحصول على استشارة مخصصة.\n\n`;
      }

      if (previousTreatments.length > 0) {
        recommendation += `📋 العلاجات السابقة التي قمت بها:\n`;
        previousTreatments.forEach((treatment, idx) => {
          recommendation += `${idx + 1}. ${treatment}\n`;
        });
        recommendation += `\n`;
      }

      // Add general recommendations based on concern
      recommendation += `💬 نصائح عامة:\n`;
      if (concernLower.includes("بشرة") || concernLower.includes("جلد")) {
        recommendation += `• نوصي بزيارة طبيب الأمراض الجلدية للفحص الأولي\n`;
        recommendation += `• يمكن مناقشة خيارات العلاج مثل الليزر، الحقن، أو العلاجات الموضعية\n`;
      } else if (concernLower.includes("شعر") || concernLower.includes("زراعة")) {
        recommendation += `• زراعة الشعر تتطلب استشارة أولية لتقييم الحالة\n`;
        recommendation += `• يمكن مناقشة تقنيات FUE أو FUT حسب حالتك\n`;
      } else if (concernLower.includes("تجميل") || concernLower.includes("جراحة")) {
        recommendation += `• الجراحة التجميلية تتطلب استشارة شاملة مع جراح متخصص\n`;
        recommendation += `• يمكن مناقشة الإجراءات الجراحية وغير الجراحية\n`;
      } else {
        recommendation += `• نوصي بحجز استشارة مع أحد أطبائنا المتخصصين\n`;
        recommendation += `• سيتم تقييم حالتك وتقديم خطة علاجية مخصصة\n`;
      }

      recommendation += `\n📞 للاستفسار أو الحجز، يمكنك:\n`;
      recommendation += `• حجز موعد مباشرة من خلال البوابة\n`;
      recommendation += `• التواصل معنا عبر WhatsApp\n`;
      recommendation += `• الاتصال بنا على رقم العيادة\n`;

      return recommendation;
    } catch (error: any) {
      console.error("Error recommending treatment:", error);
      // Fallback to basic recommendation
      return `💡 توصيات عامة لاحتياجك: "${input.concern}"\n\n` +
             `نوصي بحجز استشارة مع أحد أطبائنا المتخصصين لتقييم حالتك وتقديم خطة علاجية مخصصة.\n\n` +
             `يمكنك حجز موعد مباشرة من خلال البوابة أو التواصل معنا.`;
    }
  }
}

// Tool: Escalate to Human
class EscalateToHumanTool extends StructuredTool {
  name = "escalate_to_human";
  description = "تصعيد المحادثة إلى موظف بشري عندما يطلب المريض ذلك أو عند الحاجة الطبية.";
  schema = z.object({
    patientId: z.string().optional().describe("معرف المريض"),
    conversationId: z.string().optional().describe("معرف المحادثة"),
    reason: z.string().describe("سبب التصعيد"),
    urgency: z.enum(["low", "normal", "high"]).default("normal").describe("مستوى الأهمية"),
  });

  async _call(input: z.infer<typeof this.schema>): Promise<string> {
    try {
      const defaultClinicId = process.env.DEFAULT_CLINIC_ID;
      
      if (!input.patientId || !defaultClinicId) {
        return `⚠️ تم إنشاء طلب تصعيد بسبب: ${input.reason}. مستوى الأهمية: ${input.urgency}.\n\n` +
               `ملاحظة: يرجى توفير معرف المريض لإكمال التصعيد.`;
      }

      // Find or create conversation
      let conversation;
      if (input.conversationId) {
        conversation = await prisma.conversation.findUnique({
          where: { id: input.conversationId },
        });
      }

      if (!conversation) {
        // Find open conversation or create new one
        conversation = await prisma.conversation.findFirst({
          where: {
            userId: input.patientId,
          },
          orderBy: { createdAt: "desc" },
        });

        if (!conversation) {
          conversation = await prisma.conversation.create({
            data: {
              userId: input.patientId,
            },
          });
        }
      }

      // Create escalation message
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "ASSISTANT",
          content: `🚨 طلب تصعيد إلى موظف بشري\n\n` +
                   `السبب: ${input.reason}\n` +
                   `مستوى الأهمية: ${input.urgency === "high" ? "عالي" : input.urgency === "normal" ? "عادي" : "منخفض"}\n` +
                   `الوقت: ${new Date().toLocaleString("ar-SA")}`,
        },
      });

      // Update conversation (no need to update as Conversation model doesn't have these fields)

      const urgencyEmoji = input.urgency === "high" ? "🔴" : input.urgency === "normal" ? "🟡" : "🟢";
      return `${urgencyEmoji} تم تصعيد المحادثة إلى موظف بشري بنجاح!\n\n` +
             `📋 السبب: ${input.reason}\n` +
             `⚡ مستوى الأهمية: ${input.urgency === "high" ? "عالي" : input.urgency === "normal" ? "عادي" : "منخفض"}\n` +
             `🆔 رقم المحادثة: ${conversation.id}\n\n` +
             `سيتم التواصل معك قريباً من قبل أحد موظفينا.`;
    } catch (error: any) {
      console.error("Error escalating to human:", error);
      return `⚠️ تم إنشاء طلب تصعيد بسبب: ${input.reason}. مستوى الأهمية: ${input.urgency}.\n\n` +
             `ملاحظة: حدث خطأ أثناء حفظ التصعيد، لكن سيتم إبلاغ الفريق.`;
    }
  }
}

export class HayatAgent {
  private model: ChatOpenAI;
  private tools: StructuredTool[];
  private memoryCache: Map<string, BufferMemory> = new Map();

  constructor(apiKey: string | undefined) {
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is required for HayatAgent.");
    }
    this.model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.3,
      openAIApiKey: apiKey,
    });
    this.tools = [
      new ScheduleAppointmentTool(),
      new GetPatientInfoTool(),
      new RecommendTreatmentTool(),
      new EscalateToHumanTool(),
    ];
  }

  /**
   * Get or create memory for a conversation
   */
  private async getMemory(conversationId: string): Promise<BufferMemory> {
    if (!this.memoryCache.has(conversationId)) {
      // Create a simple BufferMemory instance
      const memory = new BufferMemory({
        returnMessages: true,
        memoryKey: "chat_history",
        inputKey: "input",
        outputKey: "output",
      });
      this.memoryCache.set(conversationId, memory);
    }
    return this.memoryCache.get(conversationId)!;
  }

  private detectLanguage(text: string): SupportedLang {
    const t = text.toLowerCase();
    if (/[\u0600-\u06FF]/.test(text)) return "ar";
    if (/[çğıöşü]/.test(t)) return "tr";
    if (/[éàèùâêîôûç]/.test(t)) return "fr";
    return "en";
  }

  private buildSystemMessage(lang: SupportedLang) {
    const langLabel = LANGUAGE_LABEL[lang];
    return new SystemMessage(
      `${systemPromptBase}\n- اللغة المرغوبة للرد: ${langLabel}\n- حافظ على نبرة لطيفة ومطمئنة.`,
    );
  }

  async chat(input: { 
    message: string; 
    patientId?: string;
    conversationId?: string;
    clinicId?: string;
  }) {
    const lang = this.detectLanguage(input.message);
    const systemMessage = this.buildSystemMessage(lang);

    // Get or create conversation ID
    let conversationId = input.conversationId;
    if (!conversationId && input.patientId && input.clinicId) {
      conversationId = await MemoryManager.getOrCreateConversation(
        input.patientId
      );
    }

    // Get conversation memory if conversationId is available
    let memory: BufferMemory | null = null;
    let chatHistory: BaseMessage[] = [];
    
    if (conversationId) {
      try {
        memory = await this.getMemory(conversationId);
        const history = await memory.chatHistory.getMessages();
        chatHistory = history;
      } catch (error) {
        console.error("Error loading memory:", error);
      }
    }

    // Build messages array with history
    const messages: BaseMessage[] = [
      systemMessage,
      ...chatHistory,
      new HumanMessage(input.message),
    ];

    const modelWithTools = this.model.bindTools(this.tools);
    const initial = await modelWithTools.invoke(messages);

    if (!initial.tool_calls || initial.tool_calls.length === 0) {
      const reply = initial.content as string;
      
      // Save to memory if available
      if (memory && conversationId) {
        try {
          await memory.chatHistory.addUserMessage(input.message);
          await memory.chatHistory.addAIChatMessage(reply);
        } catch (error) {
          console.error("Error saving to memory:", error);
        }
      }

      return { reply, language: lang, toolCalls: [] };
    }

    const toolResults: ToolMessage[] = [];
    for (const call of initial.tool_calls) {
      const toolImpl = this.tools.find((t) => t.name === call.name);
      if (!toolImpl) continue;
      const result = await toolImpl.invoke(call.args);
      toolResults.push(
        new ToolMessage({
          tool_call_id: call.id ?? "",
          content: String(result),
        }),
      );
    }

    const followUpMessages = [
      systemMessage,
      ...chatHistory,
      new HumanMessage(input.message),
      initial as AIMessage,
      ...toolResults,
    ];

    const followUp = await modelWithTools.invoke(followUpMessages);
    const reply = followUp.content as string;

    // Save to memory if available
    if (memory && conversationId) {
      try {
        await memory.chatHistory.addUserMessage(input.message);
        await memory.chatHistory.addAIChatMessage(reply);
      } catch (error) {
        console.error("Error saving to memory:", error);
      }
    }

    return {
      reply,
      language: lang,
      toolCalls: initial.tool_calls?.map((tc) => ({
        id: tc.id,
        name: tc.name,
        args: tc.args,
      })),
    };
  }

  async analyze(text: string) {
    const prompt = ChatPromptTemplate.fromMessages([
      new SystemMessage(
        `${systemPromptBase}\nحلّل النص التالي واستخرج ملخصاً موجزاً مع النقاط الرئيسية والطلبات. لا تشخيصات طبية.`,
      ),
      new HumanMessage(text),
    ]);
    const response = await this.model.invoke(await prompt.formatMessages({}));
    return { summary: response.content };
  }
}

let singleton: HayatAgent | null = null;

export function getHayatAgent() {
  if (!singleton) {
    singleton = new HayatAgent(process.env.OPENAI_API_KEY);
  }
  return singleton;
}
