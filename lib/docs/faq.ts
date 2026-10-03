export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is",
    question: "What is MCQ Analysis?",
    answer:
      "MCQ Analysis is a student-focused platform for government job and competitive exam preparation. Practice verified past questions, join live routines, track results on the leaderboard, and review mistake patterns to improve faster.",
  },
  {
    id: "who-for",
    question: "Who is the platform for?",
    answer:
      "The platform is built for students preparing for BCS, bank, teacher recruitment, and other MCQ-based competitive exams in Bangladesh. You need a registered account to access exams and personalized analytics on the web portal.",
  },
  {
    id: "android",
    question: "Is there an Android app?",
    answer:
      "Yes. MCQ Analysis is available on Google Play with quizzes, leaderboard, and mistake analysis. You can use the same phone number to sign in on web and mobile where supported.",
  },
  {
    id: "account",
    question: "How do I create an account?",
    answer:
      "Tap Get started on this site or open the login page, then register with your phone number. Verify your number when prompted and set a secure password. You can update your profile anytime under Settings.",
  },
  {
    id: "exams",
    question: "How do live and practice exams work?",
    answer:
      "Browse the exam catalog, read the briefing, and start when you are ready. Timer, proctoring rules, and submission flow depend on each exam type. After submission, view results and activity history from your dashboard.",
  },
  {
    id: "data",
    question: "How is my data used?",
    answer:
      "We use your account and exam data to deliver the service, show your progress, and improve content. See our Privacy Policy for details on storage, cookies, and your rights.",
  },
  {
    id: "support",
    question: "How can I get help?",
    answer:
      "Use Important Links in the portal for official channels, or message us on Facebook Messenger from the home page support widget when you are signed in.",
  },
];

export const FAQ_PREVIEW_COUNT = 3;
