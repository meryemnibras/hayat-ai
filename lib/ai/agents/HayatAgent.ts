import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredTool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

type SupportedLang = "ar" | "tr" | "en" | "fr";

const LANGUAGE_LABEL: Record<SupportedLang, string> = {
  ar: "العربية",
  tr: "التركية",
  en: "English",
  fr: "Français",
};

const systemPromptBase = `
أنت "Hayat Agent" مساعد ذكاء اصطناعي للعيادات التجميلية.
- استقبل المريض بلغة دافئة ومتعاطفة، ورد بنفس لغة المريض (عربي، تركي، إنجليزي، فرنسي).
- تحلَّى بحساسية ثقافية خاصة بالخليج وتركيا (اللهجات واللباقة المحلية).
- لا تقدم تشخيصات طبية. قدّم معلومات عامة فقط ووجّه للحجز مع مختص عند الحاجة.
- احمِ خصوصية المريض ولا تطلب بيانات حساسة إلا للضرورة (بحدود الحجز والمتابعة).
- إذا احتجت إجراءً (حجز، استعلام، توصية، تصعيد لموظف) استخدم الأدوات المتاحة.
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
          clinicId: defaultClinicId,
          patientId: input.patientId,
          doctorId: input.doctorId,
          status: "SCHEDULED",
          source: "CHAT",
          title: "Consultation",
          startTime,
          endTime,
          notes: input.notes || "تم الحجز عبر AI Chat",
        },
        include: {
          patient: {
            select: {
              fullName: true,
            },
          },
          doctor: {
            select: {
              fullName: true,
              specialization: true,
            },
          },
        },
      });

      const doctorName = appointment.doctor?.fullName || "طبيب متخصص";
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
             `👤 المريض: ${appointment.patient.fullName}\n` +
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
      const patient = await prisma.patient.findUnique({
        where: { id: input.patientId },
        include: {
          appointments: {
            take: 5,
            orderBy: { startTime: "desc" },
            include: {
              doctor: {
                select: {
                  fullName: true,
                  specialization: true,
                },
              },
            },
          },
        },
      });

      if (!patient) {
        return `❌ لم يتم العثور على المريض بالمعرف: ${input.patientId}`;
      }

      let info = `📋 بيانات المريض:\n\n`;
      info += `👤 الاسم: ${patient.fullName}\n`;
      
      if (patient.email) info += `📧 البريد الإلكتروني: ${patient.email}\n`;
      if (patient.phone) info += `📱 الهاتف: ${patient.phone}\n`;
      if (patient.dateOfBirth) {
        const age = Math.floor((Date.now() - new Date(patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        info += `🎂 العمر: ${age} سنة\n`;
      }
      if (patient.gender && patient.gender !== "UNSPECIFIED") {
        const genderMap: Record<string, string> = {
          MALE: "ذكر",
          FEMALE: "أنثى",
          OTHER: "آخر",
        };
        info += `⚧️ الجنس: ${genderMap[patient.gender] || patient.gender}\n`;
      }
      if (patient.preferredLanguage) info += `🌐 اللغة المفضلة: ${patient.preferredLanguage}\n`;

      if (patient.appointments.length > 0) {
        info += `\n📅 آخر المواعيد (${patient.appointments.length}):\n`;
        patient.appointments.forEach((apt, idx) => {
          const date = new Date(apt.startTime).toLocaleDateString("ar-SA");
          const doctor = apt.doctor?.fullName || "طبيب";
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

      // Find doctors with matching specializations
      const doctors = await prisma.doctor.findMany({
        where: {
          specialization: {
            in: matchingSpecializations,
          },
        },
        take: 5,
        orderBy: {
          yearsExperience: "desc",
        },
        select: {
          id: true,
          fullName: true,
          specialization: true,
          yearsExperience: true,
          hospitalAffiliation: true,
          languagesSpoken: true,
        },
      });

      // Get patient's previous appointments if patientId is provided
      let previousTreatments: string[] = [];
      if (input.patientId && defaultClinicId) {
        const patientAppointments = await prisma.appointment.findMany({
          where: {
            patientId: input.patientId,
            clinicId: defaultClinicId,
            status: {
              in: ["COMPLETED", "CONFIRMED"],
            },
          },
          include: {
            doctor: {
              select: {
                specialization: true,
              },
            },
          },
          take: 10,
          orderBy: {
            startTime: "desc",
          },
        });

        previousTreatments = patientAppointments
          .map((apt) => apt.doctor?.specialization || apt.title)
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
          recommendation += `${idx + 1}. د. ${doctor.fullName}\n`;
          recommendation += `   📌 التخصص: ${doctor.specialization}\n`;
          recommendation += `   ⭐ الخبرة: ${doctor.yearsExperience} سنة\n`;
          if (doctor.hospitalAffiliation) {
            recommendation += `   🏥 التابع ل: ${doctor.hospitalAffiliation}\n`;
          }
          if (doctor.languagesSpoken.length > 0) {
            recommendation += `   🌐 اللغات: ${doctor.languagesSpoken.join(", ")}\n`;
          }
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
            patientId: input.patientId,
            clinicId: defaultClinicId,
            status: "OPEN",
          },
          orderBy: { startedAt: "desc" },
        });

        if (!conversation) {
          conversation = await prisma.conversation.create({
            data: {
              clinicId: defaultClinicId,
              patientId: input.patientId,
              channel: "CHAT",
              status: "OPEN",
              subject: `تصعيد: ${input.reason}`,
              lastMessageAt: new Date(),
            },
          });
        }
      }

      // Create escalation message
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderType: "AI",
          content: `🚨 طلب تصعيد إلى موظف بشري\n\n` +
                   `السبب: ${input.reason}\n` +
                   `مستوى الأهمية: ${input.urgency === "high" ? "عالي" : input.urgency === "normal" ? "عادي" : "منخفض"}\n` +
                   `الوقت: ${new Date().toLocaleString("ar-SA")}`,
          metadata: {
            type: "escalation",
            reason: input.reason,
            urgency: input.urgency,
          },
        },
      });

      // Update conversation
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageAt: new Date(),
          subject: conversation.subject || `تصعيد: ${input.reason}`,
        },
      });

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

  async chat(input: { message: string; patientId?: string }) {
    const lang = this.detectLanguage(input.message);
    const systemMessage = this.buildSystemMessage(lang);
    const prompt = ChatPromptTemplate.fromMessages([
      systemMessage,
      new HumanMessage(input.message),
    ]);

    const modelWithTools = this.model.bindTools(this.tools);
    const initial = await modelWithTools.invoke(await prompt.formatMessages({}));

    if (!initial.tool_calls || initial.tool_calls.length === 0) {
      return { reply: initial.content, language: lang, toolCalls: [] };
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

    const followUp = await modelWithTools.invoke([
      systemMessage,
      new HumanMessage(input.message),
      initial as AIMessage,
      ...toolResults,
    ]);

    return {
      reply: followUp.content,
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
