import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

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

// Tool schemas
const scheduleAppointmentSchema = z.object({
  patientId: z.string().optional().describe("معرف المريض"),
  preferredDate: z.string().optional().describe("التاريخ المفضل"),
  notes: z.string().optional().describe("ملاحظات إضافية"),
});

const getPatientInfoSchema = z.object({
  patientId: z.string().describe("معرف المريض"),
  fields: z.array(z.string()).optional().describe("الحقول المطلوبة"),
});

const recommendTreatmentSchema = z.object({
  concern: z.string().describe("الهدف أو المشكلة التجميلية"),
  preferences: z.string().optional().describe("تفضيلات المريض"),
});

const escalateToHumanSchema = z.object({
  reason: z.string().describe("سبب التصعيد"),
  urgency: z.enum(["low", "normal", "high"]).default("normal").describe("مستوى الأهمية"),
});

// Create tools with the correct 2-argument signature
const scheduleAppointmentTool = tool(
  async (input: z.infer<typeof scheduleAppointmentSchema>) => {
    return `تم إنشاء طلب حجز (تجريبي) للمريض=${input.patientId ?? "غير محدد"} في الوقت=${input.preferredDate ?? "سيتم التنسيق"} مع ملاحظة=${input.notes ?? "لا توجد"}.`;
  },
  {
    name: "schedule_appointment",
    description: "جدولة موعد للمريض. استخدمها عندما يطلب حجزاً أو تغيير موعد.",
    schema: scheduleAppointmentSchema,
  }
);

const getPatientInfoTool = tool(
  async (input: z.infer<typeof getPatientInfoSchema>) => {
    return `بيانات المريض (تجريبية) patientId=${input.patientId}, fields=${input.fields?.join(", ") ?? "الكل"}.`;
  },
  {
    name: "get_patient_info",
    description: "جلب بيانات المريض الأساسية أو تاريخ زياراته قبل الرد بتفاصيل شخصية.",
    schema: getPatientInfoSchema,
  }
);

const recommendTreatmentTool = tool(
  async (input: z.infer<typeof recommendTreatmentSchema>) => {
    return `توصيات عامة (تجريبية) لاحتياج: ${input.concern} مع تفضيلات: ${input.preferences ?? "لا توجد"}.`;
  },
  {
    name: "recommend_treatment",
    description: "اقتراح خيارات علاج تجميلي عامة بناءً على هدف المريض (بدون تشخيص).",
    schema: recommendTreatmentSchema,
  }
);

const escalateToHumanTool = tool(
  async (input: z.infer<typeof escalateToHumanSchema>) => {
    return `تم إنشاء تذكرة تصعيد (تجريبية) بسبب: ${input.reason}. مستوى الأهمية: ${input.urgency}.`;
  },
  {
    name: "escalate_to_human",
    description: "تصعيد المحادثة إلى موظف بشري عندما يطلب المريض ذلك أو عند الحاجة الطبية.",
    schema: escalateToHumanSchema,
  }
);

export class HayatAgent {
  private model: ChatOpenAI;
  private tools = [
    scheduleAppointmentTool,
    getPatientInfoTool,
    recommendTreatmentTool,
    escalateToHumanTool,
  ];

  constructor(apiKey: string | undefined) {
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is required for HayatAgent.");
    }
    this.model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.3,
      openAIApiKey: apiKey,
    });
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
      `${systemPromptBase}\n- اللغة المرغوبة للرد: ${langLabel}\n- حافظ على نبرة لطيفة ومطمئنة.`
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
      let result: string;
      switch (call.name) {
        case "schedule_appointment":
          result = await scheduleAppointmentTool.invoke(call.args as z.infer<typeof scheduleAppointmentSchema>);
          break;
        case "get_patient_info":
          result = await getPatientInfoTool.invoke(call.args as z.infer<typeof getPatientInfoSchema>);
          break;
        case "recommend_treatment":
          result = await recommendTreatmentTool.invoke(call.args as z.infer<typeof recommendTreatmentSchema>);
          break;
        case "escalate_to_human":
          result = await escalateToHumanTool.invoke(call.args as z.infer<typeof escalateToHumanSchema>);
          break;
        default:
          continue;
      }
      toolResults.push(
        new ToolMessage({
          tool_call_id: call.id ?? `tool_${Date.now()}`,
          content: result,
        })
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
        `${systemPromptBase}\nحلّل النص التالي واستخرج ملخصاً موجزاً مع النقاط الرئيسية والطلبات. لا تشخيصات طبية.`
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
