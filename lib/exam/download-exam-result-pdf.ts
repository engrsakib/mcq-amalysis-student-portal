import { prepareHtml2CanvasClone } from "@/lib/exam/html2canvas-prepare-clone";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const JPEG_QUALITY = 0.92;
const CAPTURE_SCALE = 2;
const EXPORT_WIDTH_PX = 768;

function waitForNextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

export async function downloadExamResultPdf(
  element: HTMLElement,
  fileName: string
): Promise<void> {
  const rect = element.getBoundingClientRect();
  if (rect.height <= 0 || rect.width <= 0) {
    throw new Error("Nothing to export. Refresh the page and try again.");
  }

  await document.fonts.ready;
  await waitForNextFrame();

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(element, {
    scale: CAPTURE_SCALE,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
    onclone: (clonedDoc, clonedElement) => {
      prepareHtml2CanvasClone(element, clonedDoc, clonedElement);
      clonedElement.style.width = `${EXPORT_WIDTH_PX}px`;
      clonedElement.style.maxWidth = `${EXPORT_WIDTH_PX}px`;
      clonedElement.style.backgroundColor = "#ffffff";
    },
  });

  if (canvas.width === 0 || canvas.height === 0) {
    throw new Error("Could not capture the results page.");
  }

  const imgData = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidthMm = A4_WIDTH_MM;
  const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;
  let heightLeftMm = imgHeightMm;
  let positionMm = 0;

  pdf.addImage(imgData, "JPEG", 0, positionMm, imgWidthMm, imgHeightMm);
  heightLeftMm -= A4_HEIGHT_MM;

  while (heightLeftMm > 0) {
    positionMm = heightLeftMm - imgHeightMm;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, positionMm, imgWidthMm, imgHeightMm);
    heightLeftMm -= A4_HEIGHT_MM;
  }

  pdf.save(fileName);
}

export function examResultPdfFileName(examNumber: number): string {
  return `exam-${examNumber}-results.pdf`;
}
