import React from "react";

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
        <header className="space-y-3 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            خريطة المشروع (Project ROADMAP)
          </h1>
          <p className="text-sm text-slate-300">
            هذه الصفحة تشرح كيف يعمل مشروع Hayat AI Clinic، وما هي الملفات
            الرئيسية، وكيف تتدفق البيانات من المستخدم إلى الذكاء الاصطناعي
            وقاعدة البيانات، بالإضافة إلى أين يمكن إضافة مميزات جديدة مثل
            الصوت.
          </p>
        </header>

        {/* Section 1: الصورة العامة */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-primary-300">
            1. الصورة العامة للنظام
          </h2>
          <p className="text-sm text-slate-200">
            يتكوّن النظام من أربع طبقات رئيسية:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 text-slate-200">
            <li>
              <span className="font-semibold">واجهة المستخدم (Frontend)</span>:
              صفحات Next.js + مكوّنات الشات.
            </li>
            <li>
              <span className="font-semibold">واجهات برمجية (API Routes)</span>:
              تستقبل طلبات المستخدمين (ويب / واتساب / دفع).
            </li>
            <li>
              <span className="font-semibold">طبقة الذكاء الاصطناعي (AI)</span>:
              HayatAgent + LangChain + OpenAI.
            </li>
            <li>
              <span className="font-semibold">قاعدة البيانات (Database)</span>:
              Prisma + PostgreSQL لتخزين المستخدمين، المواعيد، والمحادثات.
            </li>
          </ul>
        </section>

        {/* Section 2: الواجهة */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-primary-300">
            2. واجهة المستخدم (UI)
          </h2>
          <p className="text-sm text-slate-200">
            أهم ملفات الواجهة التي يتعامل معها المستخدم:
          </p>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-xs space-y-2">
            <p className="font-semibold text-primary-200">ملفات رئيسية:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <code className="bg-slate-800 px-1 rounded">
                  src/app/page.tsx
                </code>{" "}
                — صفحة الشات الرئيسية مع المساعد Hayat.
              </li>
              <li>
                <code className="bg-slate-800 px-1 rounded">
                  app/(dashboard)/dashboard/...
                </code>{" "}
                — صفحات إدارة العيادة (اللوحة).
              </li>
              <li>
                <code className="bg-slate-800 px-1 rounded">
                  app/(portal)/portal/...
                </code>{" "}
                — بوابة المرضى / المستخدمين.
              </li>
              <li>
                <code className="bg-slate-800 px-1 rounded">
                  src/components/chat/*
                </code>{" "}
                — مكوّنات واجهة الشات (الرسائل، الإدخال، الأسئلة السريعة...).
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: API & AI Flow */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-primary-300">
            3. تدفق الطلب من الواجهة إلى الذكاء الاصطناعي
          </h2>
          <ol className="list-decimal list-inside text-sm space-y-1 text-slate-200">
            <li>
              المستخدم يكتب رسالة في{" "}
              <code className="bg-slate-800 px-1 rounded">
                ChatInput
              </code>{" "}
              داخل{" "}
              <code className="bg-slate-800 px-1 rounded">
                src/components/chat/ChatInput.tsx
              </code>
              .
            </li>
            <li>
              يتم استدعاء API مثل{" "}
              <code className="bg-slate-800 px-1 rounded">
                src/app/api/chat/stream/route.ts
              </code>{" "}
              أو{" "}
              <code className="bg-slate-800 px-1 rounded">
                src/app/api/chat/route.ts
              </code>
              .
            </li>
            <li>
              الـ API يستدعي طبقة الذكاء الاصطناعي عبر{" "}
              <code className="bg-slate-800 px-1 rounded">
                src/lib/ai-chat.ts
              </code>{" "}
              و{" "}
              <code className="bg-slate-800 px-1 rounded">
                lib/ai/agents/HayatAgent.ts
              </code>
              .
            </li>
            <li>
              <code className="bg-slate-800 px-1 rounded">
                HayatAgent
              </code>{" "}
              يقوم بقراءة البيانات من{" "}
              <code className="bg-slate-800 px-1 rounded">
                src/data/clinic-data.ts
              </code>{" "}
              ويستخدم LangChain + OpenAI لتوليد الرد.
            </li>
            <li>
              يتم حفظ المحادثة في قاعدة البيانات عبر Prisma (جداول{" "}
              <code className="bg-slate-800 px-1 rounded">Conversation</code>{" "}
              و{" "}
              <code className="bg-slate-800 px-1 rounded">Message</code>).
            </li>
            <li>يعود الرد إلى الواجهة ويُعرض في مكوّنات الشات.</li>
          </ol>
        </section>

        {/* Section 4: قاعدة البيانات */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-primary-300">
            4. قاعدة البيانات (Prisma + PostgreSQL)
          </h2>
          <p className="text-sm text-slate-200">
            يتم تعريف بنية الجداول في الملف:
          </p>
          <p className="text-xs">
            <code className="bg-slate-800 px-1 rounded">
              prisma/schema.prisma
            </code>
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 text-slate-200">
            <li>
              <span className="font-semibold">User</span>: بيانات المستخدمين
              (مريض، طبيب، إداري...).
            </li>
            <li>
              <span className="font-semibold">Appointment</span>: المواعيد
              وحالتها.
            </li>
            <li>
              <span className="font-semibold">Conversation / Message</span>:
              المحادثات مع Hayat AI (ويب + واتساب).
            </li>
          </ul>
        </section>

        {/* Section 5: التكامل مع WhatsApp و Stripe */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-primary-300">
            5. التكاملات (Integrations)
          </h2>
          <div className="grid gap-4 md:grid-cols-2 text-sm text-slate-200">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 space-y-2">
              <h3 className="font-semibold text-primary-200">WhatsApp</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Webhook:{" "}
                  <code className="bg-slate-800 px-1 rounded">
                    app/api/webhooks/whatsapp/route.ts
                  </code>
                </li>
                <li>
                  إرسال الرسائل:{" "}
                  <code className="bg-slate-800 px-1 rounded">
                    lib/whatsapp/client.ts
                  </code>
                </li>
                <li>
                  يعتمد على Twilio + متغيرات البيئة الخاصة به.
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 space-y-2">
              <h3 className="font-semibold text-primary-200">Stripe</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  تهيئة Stripe:{" "}
                  <code className="bg-slate-800 px-1 rounded">
                    src/lib/stripe.ts
                  </code>
                </li>
                <li>
                  إنشاء جلسة دفع:{" "}
                  <code className="bg-slate-800 px-1 rounded">
                    src/app/api/checkout/route.ts
                  </code>
                </li>
                <li>
                  Webhook الدفع:{" "}
                  <code className="bg-slate-800 px-1 rounded">
                    src/app/api/webhooks/stripe/route.ts
                  </code>
                  .
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 6: أين أضيف تقنية الصوت؟ */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-primary-300">
            6. أين يمكن إضافة تقنية الصوت للـ AI؟
          </h2>
          <p className="text-sm text-slate-200">
            لإضافة صوت (إدخال أو إخراج) نقترح العمل على مكوّنات الشات الحالية:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 text-slate-200">
            <li>
              <span className="font-semibold">إدخال صوت (Speech-to-Text)</span>:{" "}
              تعديل{" "}
              <code className="bg-slate-800 px-1 rounded">
                src/components/chat/ChatInput.tsx
              </code>{" "}
              لإضافة زر مايك واستخدام Web Speech API أو استدعاء API خارجي.
            </li>
            <li>
              <span className="font-semibold">إخراج صوت (Text-to-Speech)</span>:{" "}
              تعديل{" "}
              <code className="bg-slate-800 px-1 rounded">
                src/components/chat/ChatMessage.tsx
              </code>{" "}
              لإضافة زر تشغيل صوت واستخدام{" "}
              <code className="bg-slate-800 px-1 rounded">
                window.speechSynthesis
              </code>{" "}
              أو API خارجي (مثل ElevenLabs أو غيره).
            </li>
            <li>
              يمكن أيضاً إنشاء ملف مساعد مثل{" "}
              <code className="bg-slate-800 px-1 rounded">
                src/lib/voice.ts
              </code>{" "}
              لوضع منطق الصوت في مكان واحد.
            </li>
          </ul>
        </section>

        {/* Section 7: خطوات الفهم السريعة */}
        <section className="space-y-3 border-t border-slate-800 pt-6">
          <h2 className="text-xl font-semibold text-primary-300">
            7. خطوات سريعة لفهم المشروع عملياً
          </h2>
          <ol className="list-decimal list-inside text-sm space-y-1 text-slate-200">
            <li>
              ابدأ من{" "}
              <code className="bg-slate-800 px-1 rounded">
                src/app/page.tsx
              </code>{" "}
              لترى كيف تظهر واجهة الشات.
            </li>
            <li>
              انتقل إلى{" "}
              <code className="bg-slate-800 px-1 rounded">
                src/components/chat/*
              </code>{" "}
              لفهم مكوّنات الرسائل والإدخال.
            </li>
            <li>
              بعدها راجع{" "}
              <code className="bg-slate-800 px-1 rounded">
                src/app/api/chat/stream/route.ts
              </code>{" "}
              لترى كيف يتم استدعاء HayatAgent.
            </li>
            <li>
              افتح{" "}
              <code className="bg-slate-800 px-1 rounded">
                lib/ai/agents/HayatAgent.ts
              </code>{" "}
              لترى شخصية المساعد والمنطق التفصيلي.
            </li>
            <li>
              أخيراً، راجع{" "}
              <code className="bg-slate-800 px-1 rounded">
                prisma/schema.prisma
              </code>{" "}
              لفهم كيف تُخزَّن البيانات في قاعدة البيانات.
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}


