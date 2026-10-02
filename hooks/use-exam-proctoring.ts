"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { postProctoringEvent } from "@/lib/api/proctoring";

export const PROCTORING_AWAY_THRESHOLD_MS = 15_000;

export type ProctoringModalState =
  | null
  | { kind: "returnWarning"; awayMs: number }
  | { kind: "leaveConfirm" };

type UseExamProctoringOptions = {
  examNumber: number;
  enabled: boolean;
};

export function useExamProctoring({
  examNumber,
  enabled,
}: UseExamProctoringOptions) {
  const router = useRouter();
  const [modal, setModal] = useState<ProctoringModalState>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const hiddenAtRef = useRef<number | null>(null);
  const postedForHideRef = useRef(false);
  const leaveConfirmedRef = useRef(false);
  const enabledRef = useRef(enabled);
  const examNumberRef = useRef(examNumber);

  enabledRef.current = enabled;
  examNumberRef.current = examNumber;

  const recordBackgroundEvent = useCallback(async (keepalive = false) => {
    const occurredAt = new Date().toISOString();
    const body = {
      eventType: "app_background" as const,
      exam_number: examNumberRef.current,
      occurredAt,
    };
    try {
      await postProctoringEvent(body, keepalive ? { keepalive: true } : undefined);
    } catch (err) {
      if (err instanceof ApiError) {
        console.warn("[proctoring] failed to record event:", err.message);
      } else {
        console.warn("[proctoring] failed to record event:", err);
      }
    }
  }, []);

  const openModal = useCallback((next: NonNullable<ProctoringModalState>) => {
    setModal(next);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setModalVisible(true));
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    window.setTimeout(() => setModal(null), 300);
  }, []);

  const requestLeaveConfirm = useCallback(() => {
    openModal({ kind: "leaveConfirm" });
  }, [openModal]);

  const handleDashboardLeaveClick = useCallback(
    (e: React.MouseEvent) => {
      if (!enabledRef.current) return;
      e.preventDefault();
      requestLeaveConfirm();
    },
    [requestLeaveConfirm]
  );

  const handleConfirmLeave = useCallback(async () => {
    leaveConfirmedRef.current = true;
    closeModal();
    await recordBackgroundEvent(false);
    router.push("/");
  }, [closeModal, recordBackgroundEvent, router]);

  const handleStay = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const onBackground = useCallback(() => {
    if (!enabledRef.current) return;
    hiddenAtRef.current = Date.now();
    if (!postedForHideRef.current) {
      postedForHideRef.current = true;
      void recordBackgroundEvent(true);
    }
  }, [recordBackgroundEvent]);

  const onForeground = useCallback(() => {
    if (!enabledRef.current) return;
    const hiddenAt = hiddenAtRef.current;
    hiddenAtRef.current = null;
    postedForHideRef.current = false;

    if (hiddenAt != null) {
      const awayMs = Date.now() - hiddenAt;
      openModal({ kind: "returnWarning", awayMs });
    }
  }, [openModal]);

  useEffect(() => {
    if (!enabled) return;

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") {
        onBackground();
        return;
      }
      if (document.visibilityState === "visible") {
        onForeground();
      }
    }

    function onPageHide() {
      if (document.visibilityState === "hidden") {
        onBackground();
      }
    }

    function onPageShow() {
      if (document.visibilityState === "visible") {
        onForeground();
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [enabled, onBackground, onForeground]);

  useEffect(() => {
    if (!enabled) return;

    history.pushState({ examProctoringGuard: true }, "", window.location.href);

    function onPopState() {
      if (leaveConfirmedRef.current) return;
      history.pushState(
        { examProctoringGuard: true },
        "",
        window.location.href
      );
      requestLeaveConfirm();
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [enabled, requestLeaveConfirm]);

  useEffect(() => {
    if (!modal) return;
    document.documentElement.classList.add("modal-scroll-lock");
    return () => document.documentElement.classList.remove("modal-scroll-lock");
  }, [modal]);

  return {
    modal,
    modalVisible,
    awayThresholdMs: PROCTORING_AWAY_THRESHOLD_MS,
    handleDashboardLeaveClick,
    handleConfirmLeave,
    handleStay,
    closeReturnWarning: closeModal,
  };
}
