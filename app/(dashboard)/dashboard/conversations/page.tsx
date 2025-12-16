"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Bot,
  User,
  Send,
  Paperclip,
  MoreVertical,
  CheckCheck,
  Download,
} from "lucide-react";

// Mock conversation data
const conversations = [
  {
    id: "1",
    patient: { name: "سارة أحمد", phone: "+966501234567", avatar: "س" },
    lastMessage: "أريد حجز موعد للبوتوكس يوم الخميس",
    time: "منذ 5 دقائق",
    unread: 2,
    status: "open",
    channel: "whatsapp",
  },
  {
    id: "2",
    patient: { name: "محمد علي", phone: "+966507654321", avatar: "م" },
    lastMessage: "شكراً على المعلومات",
    time: "منذ 30 دقيقة",
    unread: 0,
    status: "open",
    channel: "whatsapp",
  },
  {
    id: "3",
    patient: { name: "فاطمة خالد", phone: "+966509876543", avatar: "ف" },
    lastMessage: "تم تأكيد الموعد",
    time: "منذ ساعة",
    unread: 0,
    status: "closed",
    channel: "chat",
  },
  {
    id: "4",
    patient: { name: "أحمد حسن", phone: "+966502345678", avatar: "أ" },
    lastMessage: "هل يمكنني تغيير موعدي إلى يوم آخر؟",
    time: "منذ ساعتين",
    unread: 1,
    status: "open",
    channel: "whatsapp",
  },
  {
    id: "5",
    patient: { name: "نورة السعيد", phone: "+966508765432", avatar: "ن" },
    lastMessage: "ما هي تكلفة علاج الليزر؟",
    time: "منذ 3 ساعات",
    unread: 0,
    status: "open",
    channel: "chat",
  },
];

const selectedConversationMessages = [
  {
    id: 1,
    sender: "patient",
    content: "مرحباً، أريد الاستفسار عن أسعار البوتوكس",
    time: "10:30 ص",
  },
  {
    id: 2,
    sender: "ai",
    content: "أهلاً وسهلاً! يسعدني مساعدتك. أسعار البوتوكس تبدأ من 1500 ريال للمنطقة الواحدة. هل تودين معرفة المزيد عن التفاصيل أو حجز موعد استشارة مجانية؟",
    time: "10:30 ص",
  },
  {
    id: 3,
    sender: "patient",
    content: "نعم، أريد حجز موعد يوم الخميس إذا أمكن",
    time: "10:32 ص",
  },
  {
    id: 4,
    sender: "ai",
    content: "ممتاز! لدينا مواعيد متاحة يوم الخميس:\n- 10:00 صباحاً\n- 2:00 ظهراً\n- 4:30 عصراً\n\nأي وقت يناسبك؟",
    time: "10:32 ص",
  },
  {
    id: 5,
    sender: "patient",
    content: "الساعة 2 ظهراً ممتازة",
    time: "10:33 ص",
  },
  {
    id: 6,
    sender: "ai",
    content: "تم حجز موعدك يوم الخميس الساعة 2:00 ظهراً. سنرسل لك تذكيراً قبل الموعد بيوم. هل هناك أي استفسار آخر؟ 😊",
    time: "10:33 ص",
  },
];

export default function ConversationsPage() {
  const [selectedId, setSelectedId] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "closed">("all");
  const [message, setMessage] = useState("");

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.patient.name.includes(searchQuery) ||
      conv.patient.phone.includes(searchQuery);
    const matchesStatus = filterStatus === "all" || conv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const handleExport = () => {
    // Export conversation as JSON
    const data = JSON.stringify(selectedConversationMessages, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation-${selectedId}.json`;
    a.click();
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* Conversations List */}
      <div className="w-96 flex-shrink-0 rounded-2xl border border-white/5 bg-slate-900/50">
        {/* Search & Filter */}
        <div className="border-b border-white/5 p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="بحث في المحادثات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pr-10 pl-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none"
            />
          </div>
          <div className="mt-3 flex gap-2">
            {(["all", "open", "closed"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  filterStatus === status
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {status === "all" ? "الكل" : status === "open" ? "مفتوح" : "مغلق"}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="h-[calc(100%-100px)] overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={`flex w-full items-center gap-3 border-b border-white/5 p-4 text-right transition hover:bg-white/5 ${
                selectedId === conv.id ? "bg-cyan-500/10" : ""
              }`}
            >
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 font-semibold text-slate-900">
                  {conv.patient.avatar}
                </div>
                {conv.channel === "whatsapp" && (
                  <div className="absolute -bottom-1 -left-1 rounded-full bg-emerald-500 p-1">
                    <Phone className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 truncate">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{conv.patient.name}</p>
                  <span className="text-xs text-slate-500">{conv.time}</span>
                </div>
                <p className="truncate text-sm text-slate-400">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-500 px-1.5 text-xs font-medium text-white">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col rounded-2xl border border-white/5 bg-slate-900/50">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 font-semibold text-slate-900">
                  {selectedConversation.patient.avatar}
                </div>
                <div>
                  <p className="font-medium text-white">{selectedConversation.patient.name}</p>
                  <p className="text-xs text-slate-400">{selectedConversation.patient.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  title="تصدير المحادثة"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
                  <Mail className="h-5 w-5" />
                </button>
                <button className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {selectedConversationMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "patient" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-md rounded-2xl px-4 py-3 ${
                      msg.sender === "patient"
                        ? "bg-white/10 text-white"
                        : msg.sender === "ai"
                        ? "bg-cyan-500/20 text-cyan-50"
                        : "bg-emerald-500/20 text-emerald-50"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      {msg.sender === "ai" ? (
                        <Bot className="h-4 w-4 text-cyan-400" />
                      ) : msg.sender === "staff" ? (
                        <User className="h-4 w-4 text-emerald-400" />
                      ) : null}
                      <span className="text-xs text-slate-400">
                        {msg.sender === "patient"
                          ? selectedConversation.patient.name
                          : msg.sender === "ai"
                          ? "Hayat AI"
                          : "موظف"}
                      </span>
                    </div>
                    <p className="whitespace-pre-line text-sm">{msg.content}</p>
                    <div className="mt-1 flex items-center justify-end gap-1 text-xs text-slate-500">
                      <span>{msg.time}</span>
                      {msg.sender !== "patient" && (
                        <CheckCheck className="h-4 w-4 text-cyan-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t border-white/5 p-4">
              <div className="flex items-center gap-3">
                <button className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  placeholder="اكتب رسالتك..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none"
                />
                <button className="rounded-lg bg-cyan-500 p-2.5 text-white transition hover:bg-cyan-400">
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                سيتم إرسال الرسالة باسم موظف العيادة. للرد الآلي، اترك المحادثة للمساعد الذكي.
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-slate-600" />
              <p className="mt-4 text-slate-400">اختر محادثة للعرض</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

