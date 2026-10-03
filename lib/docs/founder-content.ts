export type ProseSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export const FOUNDER_SECTIONS: ProseSection[] = [
  {
    id: "vision",
    title: "Vision",
    paragraphs: [
      "MCQ Analysis was founded to give every serious exam candidate a fair, structured path to success—without noise, guesswork, or expensive barriers.",
      "We believe preparation should be measurable: every mock exam, every wrong answer, and every improvement should be visible so students know exactly where to focus next.",
    ],
  },
  {
    id: "mission",
    title: "Mission",
    paragraphs: [
      "Our mission is to combine verified question banks, live exam routines, and deep mistake analysis into one student-first experience on web and Android.",
    ],
    bullets: [
      "Deliver accurate, exam-aligned MCQ content",
      "Help students build consistent daily practice habits",
      "Surface weak topics through analytics, not intuition alone",
      "Stay accessible on mobile for learners across Bangladesh",
    ],
  },
  {
    id: "values",
    title: "What we stand for",
    paragraphs: [
      "Students come first. We prioritize clarity in the interface, honesty in metrics, and respect for your time during high-pressure preparation seasons.",
    ],
    bullets: [
      "Integrity in content and results",
      "Privacy-aware account and exam data handling",
      "Continuous improvement from student feedback",
    ],
  },
  {
    id: "community",
    title: "Community & impact",
    paragraphs: [
      "Thousands of students use MCQ Analysis alongside live classes and self-study. We partner with educators and content teams to keep routines aligned with real exam patterns.",
      "If you are building a cohort or institution program, reach out through our official channels listed in Important Links after you sign in.",
    ],
  },
];
