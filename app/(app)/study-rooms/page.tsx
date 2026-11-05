import { StudyRoomListClient } from "@/components/study-rooms/study-room-list-client";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata = pageMetadata("Study Rooms", {
  description: "Join audio study rooms for group discussion and collaborative learning.",
});

export default function StudyRoomsPage() {
  return <StudyRoomListClient />;
}
