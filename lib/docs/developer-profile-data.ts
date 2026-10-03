export const DEVELOPER_PROFILE = {
  name: "Md. Nazmus Sakib",
  title: "AI/ML Engineer & Full-Stack Developer",
  location: "Dhaka, Bangladesh",
  image: "/developer.jpg",
  website: "https://www.engrsakib.com/",
  linkedin: "https://www.linkedin.com/in/engrsakib/",
  facebook: "https://www.facebook.com/engrsakib",
  github: "https://github.com/engrsakib",
  leetcode: "https://leetcode.com/u/engrsakib/",
  codeforces: "https://codeforces.com/profile/engrsakib",
  codechef: "https://www.codechef.com/users/engrsakib",
  telegram: "https://t.me/ENGRSAKIB02",
  telegramUsername: "@ENGRSAKIB02",
};

export const DEVELOPER_OBJECTIVE =
  "Passionate Software Engineer with strong problem-solving skills and hands-on experience in both backend development and data-driven applications. Eager to contribute expertise in building scalable systems and ML pipelines to a dynamic team, delivering reliable products that help students and organizations move faster with confidence.";

export type DeveloperExperience = {
  id: string;
  company: string;
  period: string;
  role: string;
  highlights: string[];
};

export const DEVELOPER_EXPERIENCE: DeveloperExperience[] = [
  {
    id: "digital-pylot",
    company: "Digital Pylot",
    period: "Apr 2026 — Present",
    role: "Full Stack Developer",
    highlights: [
      "Microservices & event-driven architecture: built a robust SimFree e-SIM backend with NestJS, Fastify, and Apache Kafka, plus Socket.IO for real-time, high-concurrency workflows.",
      "Offline-first data persistence: resilient client-side layer with IndexedDB schema updates and outbox sync for reliable persistence and event handling during network interruptions.",
      "Containerization & DevSecOps: Docker and Docker Compose for secure environments, PM2 for production processes, and automated Prisma migrations on VPS hosts.",
    ],
  },
  {
    id: "zepax",
    company: "Zepax",
    period: "Sept 2025 — Mar 2026",
    role: "AI/ML Developer · Backend & AI Engineer",
    highlights: [
      "Architected microservices backend supporting 200K+ daily users.",
      "Optimized database queries, boosting order processing speed by 85%.",
      "Integrated LLMs via APIs, reducing manual grading time by 35%.",
    ],
  },
  {
    id: "quantum",
    company: "Quantum Elevate",
    period: "Mar 2024 — Aug 2025",
    role: "Jr. AI & Full Stack Developer",
    highlights: [
      "Built AI-powered patient reporting with NLP (~85% efficiency gain).",
      "Shipped high-concurrency hospital features with Next.js and Socket.io.",
      "Delivered predictive diagnostic features for clinical workflows.",
    ],
  },
];

export type SkillCategory = {
  id: string;
  title: string;
  items: string[];
};

export const DEVELOPER_SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "languages",
    title: "Programming languages",
    items: ["JavaScript (ES6+)", "TypeScript", "Go (Golang)", "Python", "SQL"],
  },
  {
    id: "ml",
    title: "Machine learning & AI",
    items: [
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Neural networks",
      "Prompt engineering",
      "Model evaluation",
    ],
  },
  {
    id: "backend",
    title: "Backend & database",
    items: [
      "Node.js",
      "Fastify",
      "NestJS",
      "Gin (Go)",
      "PostgreSQL (PostGIS)",
      "MongoDB",
      "Redis",
      "Prisma",
      "Microservices",
    ],
  },
  {
    id: "tools",
    title: "Tools & frontend",
    items: [
      "Docker",
      "Git",
      "CI/CD",
      "Next.js",
      "React.js",
      "Tailwind CSS",
      "Socket.io",
      "Swagger",
    ],
  },
];

export type DeveloperProject = {
  id: string;
  title: string;
  description: string;
  tech: string[];
};

export const DEVELOPER_PROJECTS: DeveloperProject[] = [
  {
    id: "astraerp",
    title: "AstraERP — Modern ERP system",
    description:
      "Modular, role-based enterprise management with geofencing attendance and structured API design for multi-tenant operations.",
    tech: [
      "Go",
      "Gin",
      "GORM",
      "PostgreSQL",
      "PostGIS",
      "Redis",
      "Docker",
      "JWT",
      "Swagger",
    ],
  },
  {
    id: "dass42",
    title: "Automated mental health assessment (DASS-42)",
    description:
      "Clinical assessment pipeline using ML to predict depression, anxiety, and stress, with Gradio UI and automated PIL reporting with SMOTETomek preprocessing.",
    tech: ["Python", "Scikit-learn", "Gradio", "Pandas", "NumPy"],
  },
];

export type CompetitionStat = {
  id: string;
  platform: string;
  stat: string;
  href?: string;
};

export const DEVELOPER_COMPETITIONS: CompetitionStat[] = [
  {
    id: "leetcode",
    platform: "LeetCode",
    stat: "350+ problems solved",
    href: DEVELOPER_PROFILE.leetcode,
  },
  {
    id: "codeforces",
    platform: "Codeforces",
    stat: "Pupil · max rating 1310 · ~213 problems",
    href: DEVELOPER_PROFILE.codeforces,
  },
  {
    id: "codechef",
    platform: "CodeChef",
    stat: "Rating 1665 · ~93 problems",
    href: DEVELOPER_PROFILE.codechef,
  },
  {
    id: "outsbook",
    platform: "Outsbook",
    stat: "Rank 26 · ~292 problems",
  },
];

export const DEVELOPER_EDUCATION = {
  institution: "Dhaka International University",
  period: "2023 — April 2026 (expected)",
  degree: "B.Sc. in Computer Science and Engineering",
};
