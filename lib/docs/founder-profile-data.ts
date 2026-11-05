export const FOUNDER_PROFILE = {
  name: "Gazi Mizanur Rahman",
  title:
    "BCS Cadre | Bestselling Author | Career Specialist | Motivational Speaker | Teacher | Trainer | Educationist | Researcher | Columnist",
  location: "Cumilla / Dhaka, Bangladesh",
  image: "/Gzimizan.jpg",
  website: "https://www.gazimizanurrahman.com/",
  facebook: "https://www.facebook.com/GaziMizanOfficial",
  youtube: "https://www.youtube.com/@BCSPreliminaryAnalysis",
  linkedin: "https://www.linkedin.com/in/GaziMizanOfficial/",
  instagram: "https://www.instagram.com/GaziMizanOfficial",
  x: "https://x.com/GaziMizan_DU",
  facebookGroup: "https://www.facebook.com/groups/gazimizan",
  rokomariAuthor:
    "https://www.rokomari.com/book/author/69669/gazi-mizanur-rahman-bcs",
  boiferryAuthor:
    "https://boiferry.com/author/gazi-mizanur-rahman-bcs",
};

/** Inline link segments for biography paragraphs */
export type FounderTextSegment =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

export type FounderBioParagraph = {
  id: string;
  segments: FounderTextSegment[];
};

export const FOUNDER_BIO_PARAGRAPHS: FounderBioParagraph[] = [
  {
    id: "intro",
    segments: [
      {
        type: "text",
        value:
          "Gazi Mizanur Rahman is a widely recognised and highly popular personality among career enthusiasts and job seekers in Bangladesh. Through his inspirational speeches, writings, and career guidance, he has positively influenced the lives of thousands of people, particularly young men and women. Many have achieved significant success in their personal and professional lives by following his motivational advice and practical recommendations.",
      },
    ],
  },
  {
    id: "awards",
    segments: [
      {
        type: "text",
        value:
          'In recognition of his contributions to education and career development among the younger generation through Facebook, he received the "Successful Community Leader" recognition from ',
      },
      { type: "link", label: "Facebook", href: FOUNDER_PROFILE.facebook },
      {
        type: "text",
        value: " in 2022. He was also honoured with the \"Bestselling Author\" award by ",
      },
      { type: "link", label: "Boiferry.com", href: FOUNDER_PROFILE.boiferryAuthor },
      { type: "text", value: " in 2023 and by " },
      { type: "link", label: "Rokomari.com", href: FOUNDER_PROFILE.rokomariAuthor },
      { type: "text", value: " in 2024." },
    ],
  },
  {
    id: "background",
    segments: [
      {
        type: "text",
        value:
          "Born on 25 October 1990 in Cumilla, Bangladesh, Gazi Mizanur Rahman is a BCS Cadre Officer, bestselling author, motivational speaker, career specialist, career consultant, educationist, and columnist.",
      },
    ],
  },
  {
    id: "education-summary",
    segments: [
      {
        type: "text",
        value:
          "He completed his Higher Secondary Certificate (HSC) from Cumilla Victoria Government College and subsequently earned both his Bachelor's and Master's degrees from the University of Dhaka.",
      },
    ],
  },
  {
    id: "career-start",
    segments: [
      {
        type: "text",
        value:
          "He began his professional career as a Senior Officer at Pubali Bank. He currently serves as an officer in the Bangladesh Civil Service (BCS) Education Cadre.",
      },
    ],
  },
  {
    id: "seminars",
    segments: [
      {
        type: "text",
        value:
          "Alongside his professional responsibilities, he actively contributes to career development and educational awareness as a career specialist. He regularly participates as a speaker in career-oriented seminars at ",
      },
      {
        type: "link",
        label: "public universities",
        href: "https://www.youtube.com/watch?v=jgTIdIjLF-U&t=28s",
      },
      {
        type: "text",
        value:
          ", schools, colleges, and various district and divisional cities across Bangladesh. Through these programmes, he provides students with practical advice, career guidance, and valuable insights into academic and professional development.",
      },
    ],
  },
  {
    id: "media-outreach",
    segments: [
      {
        type: "text",
        value:
          "Furthermore, he shares career-related advice and guidance based on his personal experiences through national ",
      },
      {
        type: "link",
        label: "television channels",
        href: "https://www.youtube.com/watch?v=TpHPUDL3M1E&t=2s",
      },
      { type: "text", value: ", " },
      {
        type: "link",
        label: "newspapers",
        href: "https://www.dhakapost.com/jobs-career/31418",
      },
      { type: "text", value: ", " },
      { type: "link", label: "Facebook", href: FOUNDER_PROFILE.facebookGroup },
      { type: "text", value: ", and " },
      { type: "link", label: "YouTube", href: FOUNDER_PROFILE.youtube },
      { type: "text", value: "." },
    ],
  },
  {
    id: "olympiad",
    segments: [
      {
        type: "text",
        value:
          'With the aim of raising career awareness, developing essential skills, and empowering the younger generation across Bangladesh, he has initiated the "Bangladesh Career Olympiad", an ambitious nationwide initiative designed to reach all 64 districts of Bangladesh.',
      },
    ],
  },
  {
    id: "closing",
    segments: [
      {
        type: "text",
        value:
          "Through his dedication to education, career counselling, motivational speaking, and youth development, Gazi Mizanur Rahman continues to inspire young people to pursue their ambitions, enhance their capabilities, and build successful careers.",
      },
    ],
  },
];

export type FounderAward = {
  id: string;
  year: string;
  title: string;
  issuer: string;
  href: string;
};

export const FOUNDER_AWARDS: FounderAward[] = [
  {
    id: "facebook-2022",
    year: "2022",
    title: "Successful Community Leader",
    issuer: "Facebook",
    href: FOUNDER_PROFILE.facebook,
  },
  {
    id: "boiferry-2023",
    year: "2023",
    title: "Bestselling Author",
    issuer: "Boiferry.com",
    href: FOUNDER_PROFILE.boiferryAuthor,
  },
  {
    id: "rokomari-2024",
    year: "2024",
    title: "Bestselling Author",
    issuer: "Rokomari.com",
    href: FOUNDER_PROFILE.rokomariAuthor,
  },
];

export type FounderExperience = {
  id: string;
  organization: string;
  period: string;
  role: string;
  highlights: string[];
};

export const FOUNDER_EXPERIENCE: FounderExperience[] = [
  {
    id: "bcs",
    organization: "Bangladesh Civil Service (Education Cadre)",
    period: "Present",
    role: "BCS Cadre Officer",
    highlights: [
      "Serves in the General Education cadre while continuing public career education work.",
      "Balances official duties with seminars, writing, and youth development initiatives.",
    ],
  },
  {
    id: "pubali",
    organization: "Pubali Bank Limited",
    period: "Early career",
    role: "Senior Officer",
    highlights: [
      "Started professional career in banking before joining the civil service.",
      "Built discipline and client-facing skills that inform his career guidance work today.",
    ],
  },
];

export const FOUNDER_EDUCATION = [
  {
    id: "du",
    institution: "University of Dhaka",
    credential: "Bachelor's and Master's degrees",
  },
  {
    id: "hsc",
    institution: "Cumilla Victoria Government College",
    credential: "Higher Secondary Certificate (HSC)",
  },
];

export type FounderYoutubeFeature = {
  id: string;
  title: string;
  caption?: string;
  videoUrl: string;
};

export const FOUNDER_YOUTUBE_FEATURES: FounderYoutubeFeature[] = [
  {
    id: "university-seminar",
    title: "Career seminar at a public university",
    caption: "Speaker session on career orientation and exam preparation.",
    videoUrl: "https://www.youtube.com/watch?v=jgTIdIjLF-U&t=28s",
  },
  {
    id: "television",
    title: "National television appearance",
    caption: "Career and education discussion on national TV.",
    videoUrl: "https://www.youtube.com/watch?v=TpHPUDL3M1E&t=2s",
  },
];

export type FounderPressItem = {
  id: string;
  title: string;
  outlet: string;
  description: string;
  href: string;
};

export const FOUNDER_PRESS: FounderPressItem[] = [
  {
    id: "dhaka-post",
    title: "Jobs & career column",
    outlet: "Dhaka Post",
    description:
      "Career guidance and job-market insights published in the national press.",
    href: "https://www.dhakapost.com/jobs-career/31418",
  },
];

export const FOUNDER_INITIATIVE = {
  title: "Bangladesh Career Olympiad",
  description:
    "A nationwide initiative to raise career awareness, build essential skills, and empower young people—designed to reach all 64 districts of Bangladesh.",
};

export type FounderBook = {
  id: string;
  title: string;
  href?: string;
};

export const FOUNDER_BOOKS: FounderBook[] = [
  { id: "bcs-prelim", title: "BCS Preliminary Analysis", href: FOUNDER_PROFILE.rokomariAuthor },
  { id: "primary", title: "প্রাইমারি শিক্ষক নিয়োগ Analysis", href: FOUNDER_PROFILE.rokomariAuthor },
  { id: "nibondhon", title: "শিক্ষক নিবন্ধন Analysis", href: FOUNDER_PROFILE.rokomariAuthor },
  { id: "real-model", title: "BCS Real Model Test", href: FOUNDER_PROFILE.rokomariAuthor },
  { id: "primary-model", title: "প্রাইমারি শিক্ষক নিয়োগ মডেল টেস্ট", href: FOUNDER_PROFILE.rokomariAuthor },
  { id: "viva", title: "Viva Analysis", href: FOUNDER_PROFILE.rokomariAuthor },
  { id: "recent", title: "Recent Analysis", href: FOUNDER_PROFILE.rokomariAuthor },
  { id: "dream", title: "তুমিও পারবে স্বপ্নকে ছুঁতে", href: FOUNDER_PROFILE.boiferryAuthor },
  { id: "turn", title: "ঘুরে দাঁড়াও আরেকবার", href: FOUNDER_PROFILE.boiferryAuthor },
  { id: "ci", title: "ক্যারিয়ার ইন্টেলিজেন্স", href: FOUNDER_PROFILE.boiferryAuthor },
  { id: "focus", title: "পড়ালেখায় মনোযোগী হওয়ার কৌশল", href: FOUNDER_PROFILE.boiferryAuthor },
  { id: "stories", title: "ছাত্র-শিক্ষকের কিচ্ছা", href: FOUNDER_PROFILE.boiferryAuthor },
];

export type FounderBookShop = {
  id: string;
  name: string;
  href: string;
};

export const FOUNDER_BOOK_SHOPS: FounderBookShop[] = [
  { id: "rokomari", name: "Rokomari.com", href: "https://www.rokomari.com/" },
  { id: "alambook", name: "Alam Book", href: "https://alambook.com/" },
  { id: "wafilife", name: "Wafilife", href: "https://www.wafilife.com/" },
  { id: "boibazar", name: "Boibazar", href: "https://www.boibazar.com/" },
  { id: "eboighar", name: "Eboighar", href: "https://www.eboighar.com/" },
  { id: "kitabghor", name: "Kitabghor", href: "https://www.kitabghor.com/" },
  { id: "mamunbooks", name: "Mamun Books", href: "https://www.mamunbooks.com/" },
];

export const FOUNDER_BOOKS_PATH = "/docs/founder/books";
