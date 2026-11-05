"use client";

import { io, type Socket } from "socket.io-client";
import { getAccessToken } from "@/lib/auth/cookies";
import { getSocketBaseUrl } from "@/lib/socket/get-socket-url";

export const STUDY_ROOM_SOCKET_EVENTS = {
  CAPACITY_UPDATED: "study-room:capacity-updated",
  MESSAGE: "study-room:message",
  CLOSED: "study-room:closed",
  OPENED: "study-room:opened",
  CREATED: "study-room:created",
  UPDATED: "study-room:updated",
} as const;

export type CapacityUpdatedPayload = {
  roomId: string;
  participantCount: number;
  maxParticipants: number;
};

export function connectStudyRoomSocket(): Socket | null {
  const token = getAccessToken();
  if (!token) return null;
  return io(getSocketBaseUrl(), {
    path: "/socket.io",
    auth: { token },
    transports: ["websocket", "polling"],
  });
}
