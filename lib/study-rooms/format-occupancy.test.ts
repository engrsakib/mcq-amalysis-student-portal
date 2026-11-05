import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatOccupancy,
  isStudyRoomFull,
  joinErrorMessage,
} from "./format-occupancy";

describe("formatOccupancy", () => {
  it("formats count and max", () => {
    assert.equal(formatOccupancy(3, 20), "3 / 20");
  });
});

describe("isStudyRoomFull", () => {
  it("is full at capacity", () => {
    assert.equal(isStudyRoomFull(20, 20), true);
    assert.equal(isStudyRoomFull(19, 20), false);
  });
});

describe("joinErrorMessage", () => {
  it("maps 409 to room full copy", () => {
    assert.match(joinErrorMessage(409), /maximum participant/);
  });
});
