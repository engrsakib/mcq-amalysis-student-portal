"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ConnectionState,
  Room,
  RoomEvent,
  Track,
} from "livekit-client";
import { ArrowLeft, Mic, MicOff, Send } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  fetchStudyRoomMessages,
  joinStudyRoom,
  leaveStudyRoom,
  postStudyRoomMessage,
  releaseStudyRoomAdmission,
  type StudyRoomMessage,
  type StudyRoomSummary,
} from "@/lib/api/study-room";
import { ApiError } from "@/lib/api/client";
import {
  connectStudyRoomSocket,
  STUDY_ROOM_SOCKET_EVENTS,
} from "@/lib/socket/study-room-socket";
import { joinErrorMessage } from "@/lib/study-rooms/format-occupancy";
import { cn } from "@/lib/utils";

type SocketMessagePayload = StudyRoomMessage & { roomId?: string };

type Props = {
  roomId: string;
  initialRoom?: StudyRoomSummary;
};

export function StudyRoomSessionClient({ roomId, initialRoom }: Props) {
  const [roomInfo, setRoomInfo] = useState<StudyRoomSummary | undefined>(
    initialRoom
  );
  const [status, setStatus] = useState<string>("Connecting…");
  const [micEnabled, setMicEnabled] = useState(false);
  const [messages, setMessages] = useState<StudyRoomMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const lkRoomRef = useRef<Room | null>(null);
  const joinedRef = useRef(false);

  const cleanup = useCallback(async () => {
    const lk = lkRoomRef.current;
    lkRoomRef.current = null;
    if (lk) {
      lk.removeAllListeners();
      await lk.disconnect();
    }
    if (joinedRef.current) {
      joinedRef.current = false;
      try {
        await leaveStudyRoom(roomId);
      } catch {
        /* ignore */
      }
    }
  }, [roomId]);

  useEffect(() => {
    let cancelled = false;

    async function connect() {
      try {
        const join = await joinStudyRoom(roomId);
        if (cancelled) {
          await releaseStudyRoomAdmission(roomId);
          return;
        }
        setRoomInfo(join.room);
        joinedRef.current = true;

        const lkRoom = new Room({ adaptiveStream: true, dynacast: true });
        lkRoomRef.current = lkRoom;

        lkRoom.on(RoomEvent.ConnectionStateChanged, (state) => {
          setStatus(state === ConnectionState.Connected ? "Connected" : String(state));
        });

        lkRoom.on(RoomEvent.TrackSubscribed, (track) => {
          if (track.kind === Track.Kind.Audio) {
            const el = track.attach();
            el.className = "hidden";
            document.body.appendChild(el);
          }
        });

        await lkRoom.connect(join.livekitUrl, join.token);
        await lkRoom.localParticipant.setMicrophoneEnabled(false);
        setMicEnabled(false);

        const history = await fetchStudyRoomMessages(roomId);
        if (!cancelled) setMessages(history);
      } catch (e) {
        if (e instanceof ApiError) {
          setError(joinErrorMessage(e.statusCode, e.message));
        } else {
          setError(e instanceof Error ? e.message : "Could not join room");
        }
        await releaseStudyRoomAdmission(roomId).catch(() => undefined);
      }
    }

    void connect();

    return () => {
      cancelled = true;
      void cleanup();
    };
  }, [roomId, cleanup]);

  useEffect(() => {
    const socket = connectStudyRoomSocket();
    if (!socket) return;

    socket.emit("study-room:subscribe", roomId);

    const onMessage = (payload: SocketMessagePayload) => {
      if (payload.roomId && payload.roomId !== roomId) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === payload.id)) return prev;
        return [...prev, payload];
      });
    };

    const onCapacity = (payload: {
      roomId: string;
      participantCount: number;
      maxParticipants?: number;
    }) => {
      if (payload.roomId !== roomId) return;
      setRoomInfo((prev) =>
        prev
          ? {
              ...prev,
              participantCount: payload.participantCount,
              maxParticipants: payload.maxParticipants ?? prev.maxParticipants,
            }
          : prev
      );
    };

    const onClosed = (payload: { roomId?: string; id?: string }) => {
      const closedId = payload.roomId ?? payload.id;
      if (closedId && closedId !== roomId) return;
      setError("This study room was closed by an admin.");
      void cleanup();
    };

    socket.on(STUDY_ROOM_SOCKET_EVENTS.MESSAGE, onMessage);
    socket.on(STUDY_ROOM_SOCKET_EVENTS.CAPACITY_UPDATED, onCapacity);
    socket.on(STUDY_ROOM_SOCKET_EVENTS.CLOSED, onClosed);

    return () => {
      socket.emit("study-room:unsubscribe", roomId);
      socket.off(STUDY_ROOM_SOCKET_EVENTS.MESSAGE, onMessage);
      socket.off(STUDY_ROOM_SOCKET_EVENTS.CAPACITY_UPDATED, onCapacity);
      socket.off(STUDY_ROOM_SOCKET_EVENTS.CLOSED, onClosed);
      socket.disconnect();
    };
  }, [roomId, cleanup]);

  useEffect(() => {
    const onBeforeUnload = () => {
      void cleanup();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [cleanup]);

  async function toggleMic() {
    const lk = lkRoomRef.current;
    if (!lk) return;
    const next = !micEnabled;
    try {
      await lk.localParticipant.setMicrophoneEnabled(next);
      setMicEnabled(next);
    } catch {
      setError("Microphone permission denied or unavailable.");
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const msg = await postStudyRoomMessage(roomId, text);
    setMessages((prev) => [...prev, msg]);
    setDraft("");
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-destructive">{error}</p>
        <Link href="/study-rooms" className={cn(buttonVariants({ variant: "outline" }), "mt-4")}>
          Back to study rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 lg:flex-row">
      <div className="flex-1 space-y-4">
        <Link
          href="/study-rooms"
          className={cn(buttonVariants({ variant: "ghost" }), "gap-2 px-0")}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Leave listing
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-ink">
            {roomInfo?.title ?? "Study room"}
          </h1>
          {roomInfo?.topic ? (
            <p className="text-sm text-primary">Topic: {roomInfo.topic}</p>
          ) : null}
          <p className="mt-1 text-sm text-ink">
            {roomInfo?.participantCount ?? "—"} / {roomInfo?.maxParticipants ?? "—"}{" "}
            participants · {status}
          </p>
        </div>
        {roomInfo?.guidelines ? (
          <p className="rounded-xl border border-border/60 bg-primary-soft/30 p-3 text-sm text-ink">
            {roomInfo.guidelines}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={toggleMic}
            className={cn(
              buttonVariants({ variant: micEnabled ? "default" : "outline" }),
              "h-11 gap-2"
            )}
          >
            {micEnabled ? (
              <Mic className="size-4" aria-hidden />
            ) : (
              <MicOff className="size-4" aria-hidden />
            )}
            {micEnabled ? "Mute" : "Unmute"}
          </button>
          <Link
            href="/study-rooms"
            onClick={() => void cleanup()}
            className={cn(buttonVariants({ variant: "destructive" }), "h-11")}
          >
            Leave room
          </Link>
        </div>
      </div>

      <aside className="flex h-[420px] w-full flex-col rounded-2xl border border-border/60 bg-card lg:w-96">
        <div className="border-b px-3 py-2 text-sm font-semibold text-ink">Chat</div>
        <div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm">
          {messages.map((m) => (
            <div key={m.id}>
              <span className="font-medium text-primary">{m.senderName}</span>
              <span className="text-xs text-ink"> · {new Date(m.createdAt).toLocaleTimeString()}</span>
              <p className="text-ink">{m.body}</p>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex gap-2 border-t p-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Message the room"
            className="min-w-0 flex-1 rounded-lg border px-2 py-2 text-sm"
            maxLength={2000}
          />
          <button type="submit" className={cn(buttonVariants({ variant: "default" }), "size-11 p-0")}>
            <Send className="size-4" aria-hidden />
          </button>
        </form>
      </aside>
    </div>
  );
}
