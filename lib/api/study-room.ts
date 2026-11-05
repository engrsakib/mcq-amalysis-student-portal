import { apiGetAuth, apiPostAuth } from "@/lib/api/authorized";

export type StudyRoomSummary = {
  id: string;
  title: string;
  description?: string;
  topic?: string;
  guidelines?: string;
  status: string;
  maxParticipants: number;
  participantCount: number;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
};

export type StudyRoomJoinPayload = {
  token: string;
  livekitUrl: string;
  roomName: string;
  identity: string;
  room: StudyRoomSummary;
};

export type StudyRoomMessage = {
  id: string;
  senderName: string;
  body: string;
  createdAt: string;
  userId: string;
};

export async function fetchStudyRooms() {
  return apiGetAuth<StudyRoomSummary[]>("/study-room");
}

export async function fetchStudyRoom(id: string) {
  return apiGetAuth<StudyRoomSummary>(`/study-room/${id}`);
}

export async function joinStudyRoom(id: string) {
  return apiPostAuth<StudyRoomJoinPayload>(`/study-room/${id}/join`, {});
}

export async function leaveStudyRoom(id: string) {
  return apiPostAuth<{ success: boolean }>(`/study-room/${id}/leave`, {});
}

export async function releaseStudyRoomAdmission(id: string) {
  return apiPostAuth<{ success: boolean }>(
    `/study-room/${id}/admission-release`,
    {}
  );
}

export async function fetchStudyRoomMessages(id: string) {
  return apiGetAuth<StudyRoomMessage[]>(`/study-room/${id}/messages`);
}

export async function postStudyRoomMessage(id: string, body: string) {
  return apiPostAuth<StudyRoomMessage>(`/study-room/${id}/messages`, { body });
}
