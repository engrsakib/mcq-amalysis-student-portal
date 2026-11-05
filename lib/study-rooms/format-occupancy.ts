export function formatOccupancy(participantCount: number, maxParticipants: number): string {
  return `${participantCount} / ${maxParticipants}`;
}

export function isStudyRoomFull(participantCount: number, maxParticipants: number): boolean {
  return participantCount >= maxParticipants;
}

/** @deprecated alias */
export const isRoomFull = isStudyRoomFull;

export function joinErrorMessage(statusCode: number, message?: string): string {
  if (statusCode === 409) {
    return "This study room has reached its maximum participant capacity.";
  }
  return message || "Could not join room";
}
