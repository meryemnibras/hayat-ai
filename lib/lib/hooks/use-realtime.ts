"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type RealtimeEvent =
  | "new_message"
  | "new_appointment"
  | "appointment_update"
  | "new_patient"
  | "conversation_update";

export interface RealtimePayload {
  event: RealtimeEvent;
  data: Record<string, unknown>;
  timestamp: string;
}

type EventCallback = (payload: RealtimePayload) => void;

// ─────────────────────────────────────────────────────────────────────────────
// WebSocket Hook
// ─────────────────────────────────────────────────────────────────────────────

interface UseWebSocketOptions {
  url?: string;
  reconnect?: boolean;
  reconnectDelay?: number;
  onMessage?: EventCallback;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useWebSocket({
  url,
  reconnect = true,
  reconnectDelay = 3000,
  onMessage,
  onConnect,
  onDisconnect,
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!url || wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      setIsConnected(true);
      onConnect?.();
    });

    ws.addEventListener("message", (event) => {
      const payload = safeParse(event.data) as RealtimePayload;
      onMessage?.(payload);
    });

    ws.addEventListener("error", (err) => {
      console.error("[realtime] websocket error", err);
    });

    ws.addEventListener("close", () => {
      setIsConnected(false);
      onDisconnect?.();

      // Reconnect logic
      if (reconnect) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, reconnectDelay);
      }
    });
  }, [url, reconnect, reconnectDelay, onMessage, onConnect, onDisconnect]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [connect]);

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { isConnected, send };
}

// ─────────────────────────────────────────────────────────────────────────────
// Event Subscription Hook (Polling fallback)
// ─────────────────────────────────────────────────────────────────────────────

interface UseRealtimeEventsOptions {
  clinicId: string;
  events?: RealtimeEvent[];
  onEvent?: EventCallback;
  pollingInterval?: number;
}

export function useRealtimeEvents({
  clinicId,
  events = ["new_message", "new_appointment"],
  onEvent,
  pollingInterval = 5000,
}: UseRealtimeEventsOptions) {
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  useEffect(() => {
    if (!clinicId) return;

    const checkForUpdates = async () => {
      try {
        const response = await fetch(
          `/api/realtime/poll?clinicId=${clinicId}&since=${lastCheck.toISOString()}&events=${events.join(",")}`
        );

        if (response.ok) {
          const updates = (await response.json()) as RealtimePayload[];
          updates.forEach((payload) => onEvent?.(payload));
          setLastCheck(new Date());
        }
      } catch (error) {
        console.error("[realtime] polling error", error);
      }
    };

    const interval = setInterval(checkForUpdates, pollingInterval);
    return () => clearInterval(interval);
  }, [clinicId, events, onEvent, pollingInterval, lastCheck]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Real-time Hook (Combined)
// ─────────────────────────────────────────────────────────────────────────────

interface UseDashboardRealtimeOptions {
  clinicId: string;
  onNewMessage?: (data: unknown) => void;
  onNewAppointment?: (data: unknown) => void;
  onConversationUpdate?: (data: unknown) => void;
}

export function useDashboardRealtime({
  clinicId,
  onNewMessage,
  onNewAppointment,
  onConversationUpdate,
}: UseDashboardRealtimeOptions) {
  const [stats, setStats] = useState({
    unreadMessages: 0,
    todayAppointments: 0,
    activeConversations: 0,
  });

  const handleEvent = useCallback(
    (payload: RealtimePayload) => {
      switch (payload.event) {
        case "new_message":
          setStats((prev) => ({
            ...prev,
            unreadMessages: prev.unreadMessages + 1,
          }));
          onNewMessage?.(payload.data);
          break;

        case "new_appointment":
          setStats((prev) => ({
            ...prev,
            todayAppointments: prev.todayAppointments + 1,
          }));
          onNewAppointment?.(payload.data);
          break;

        case "conversation_update":
          onConversationUpdate?.(payload.data);
          break;
      }
    },
    [onNewMessage, onNewAppointment, onConversationUpdate]
  );

  // Try WebSocket first, fallback to polling
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL;

  const { isConnected } = useWebSocket({
    url: wsUrl ? `${wsUrl}?clinicId=${clinicId}` : undefined,
    onMessage: handleEvent,
  });

  // Use polling as fallback if WebSocket is not available
  useRealtimeEvents({
    clinicId,
    onEvent: handleEvent,
    pollingInterval: isConnected ? 60000 : 5000, // Poll less frequently if WS is connected
  });

  return { stats, isConnected };
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function safeParse(data: unknown): unknown {
  if (typeof data !== "string") return data;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

// Notification sound utility
export function playNotificationSound() {
  if (typeof window === "undefined") return;

  try {
    const audio = new Audio("/sounds/notification.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Autoplay might be blocked
    });
  } catch {
    // Audio not supported
  }
}

// Browser notification utility
export async function showBrowserNotification(title: string, body: string) {
  if (typeof window === "undefined") return;

  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "/icon.png" });
  } else if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification(title, { body, icon: "/icon.png" });
    }
  }
}
