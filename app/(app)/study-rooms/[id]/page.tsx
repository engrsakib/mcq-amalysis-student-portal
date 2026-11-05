import { StudyRoomSessionClient } from "@/components/study-rooms/study-room-session-client";
import { pageMetadata } from "@/lib/site/metadata";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return pageMetadata("Study room session", {
    description: `Live audio study room ${id}`,
  });
}

export default async function StudyRoomSessionPage({ params }: PageProps) {
  const { id } = await params;
  return <StudyRoomSessionClient roomId={id} />;
}
