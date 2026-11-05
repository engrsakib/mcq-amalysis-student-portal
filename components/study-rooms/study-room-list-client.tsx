"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mic2, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  fetchStudyRooms,
  type StudyRoomSummary,
} from "@/lib/api/study-room";
import {
  connectStudyRoomSocket,
  STUDY_ROOM_SOCKET_EVENTS,
  type CapacityUpdatedPayload,
} from "@/lib/socket/study-room-socket";
import { formatOccupancy, isStudyRoomFull } from "@/lib/study-rooms/format-occupancy";
import { cn } from "@/lib/utils";

function RoomCard({ room }: { room: StudyRoomSummary }) {
  const full = isStudyRoomFull(room.participantCount, room.maxParticipants);
  const isActive = room.status === "active";
  const isUpcoming = room.status === "scheduled";

  return (
    <article className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-ink">{room.title}</h3>
      {room.topic ? (
        <p className="mt-1 text-sm text-primary">Topic: {room.topic}</p>
      ) : null}
      {room.description ? (
        <p className="mt-2 line-clamp-2 text-sm text-ink">{room.description}</p>
      ) : null}
      <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink">
        <Users className="size-4 text-primary" aria-hidden />
        {formatOccupancy(room.participantCount, room.maxParticipants)}
      </p>
      {isUpcoming && room.scheduledStartAt ? (
        <p className="mt-1 text-xs text-ink">
          Opens: {new Date(room.scheduledStartAt).toLocaleString()}
        </p>
      ) : null}
      <div className="mt-4">
        {isActive && !full ? (
          <Link
            href={`/study-rooms/${room.id}`}
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-11 gap-2 bg-primary hover:bg-primary-hover"
            )}
          >
            <Mic2 className="size-4" aria-hidden />
            Join room
          </Link>
        ) : isActive && full ? (
          <span className="text-sm font-medium text-destructive">Room full</span>
        ) : (
          <span className="text-sm font-medium text-ink capitalize">
            {room.status}
          </span>
        )}
      </div>
    </article>
  );
}

export function StudyRoomListClient() {
  const [rooms, setRooms] = useState<StudyRoomSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudyRooms()
      .then(setRooms)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const socket = connectStudyRoomSocket();
    if (!socket) return;

    const onCapacity = (payload: CapacityUpdatedPayload) => {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === payload.roomId
            ? { ...r, participantCount: payload.participantCount }
            : r
        )
      );
    };

    const refresh = () => {
      fetchStudyRooms().then(setRooms).catch(() => undefined);
    };

    socket.on(STUDY_ROOM_SOCKET_EVENTS.CAPACITY_UPDATED, onCapacity);
    socket.on(STUDY_ROOM_SOCKET_EVENTS.OPENED, refresh);
    socket.on(STUDY_ROOM_SOCKET_EVENTS.CLOSED, refresh);
    socket.on(STUDY_ROOM_SOCKET_EVENTS.CREATED, refresh);
    socket.on(STUDY_ROOM_SOCKET_EVENTS.UPDATED, refresh);

    let poll: ReturnType<typeof setInterval> | null = null;
    socket.on("disconnect", () => {
      poll = setInterval(refresh, 30_000);
    });
    socket.on("connect", () => {
      if (poll) clearInterval(poll);
    });

    return () => {
      socket.off(STUDY_ROOM_SOCKET_EVENTS.CAPACITY_UPDATED, onCapacity);
      socket.disconnect();
      if (poll) clearInterval(poll);
    };
  }, []);

  const active = rooms.filter((r) => r.status === "active");
  const upcoming = rooms.filter((r) => r.status === "scheduled");

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <header>
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">Study Rooms</h1>
        <p className="mt-2 text-sm text-ink sm:text-base">
          Learn together. Discuss together. Audio-first group study powered by LiveKit.
        </p>
      </header>

      {loading ? <p className="text-sm text-ink">Loading rooms…</p> : null}
      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Active rooms</h2>
        {active.length === 0 ? (
          <p className="text-sm text-ink">No active study rooms right now.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {active.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink">Upcoming rooms</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-ink">No scheduled rooms.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {upcoming.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
