export type PasswordRequirementId =
  | "length"
  | "uppercase"
  | "lowercase"
  | "special";

export type PasswordRequirement = {
  id: PasswordRequirementId;
  label: string;
  met: boolean;
};

const SPECIAL_CHAR_RE = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

export const PASSWORD_REQUIREMENTS: {
  id: PasswordRequirementId;
  label: string;
  test: (value: string) => boolean;
}[] = [
  { id: "length", label: "At least 8 characters", test: (v) => v.length >= 8 },
  {
    id: "uppercase",
    label: "One uppercase letter (A–Z)",
    test: (v) => /[A-Z]/.test(v),
  },
  {
    id: "lowercase",
    label: "One lowercase letter (a–z)",
    test: (v) => /[a-z]/.test(v),
  },
  {
    id: "special",
    label: "One special character (!@#$…)",
    test: (v) => SPECIAL_CHAR_RE.test(v),
  },
];

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return PASSWORD_REQUIREMENTS.map(({ id, label, test }) => ({
    id,
    label,
    met: test(password),
  }));
}

export function validatePassword(password: string): {
  ok: boolean;
  reasons: string[];
} {
  const requirements = getPasswordRequirements(password);
  const reasons = requirements.filter((r) => !r.met).map((r) => r.label);
  return { ok: reasons.length === 0, reasons };
}

export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4;

export type PasswordStrength = {
  level: PasswordStrengthLevel;
  label: "Too weak" | "Weak" | "Fair" | "Strong" | "Very strong";
  percent: number;
};

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { level: 0, label: "Too weak", percent: 0 };
  }

  const metCount = getPasswordRequirements(password).filter((r) => r.met).length;
  let level: PasswordStrengthLevel = 0;
  if (metCount === 1) level = 1;
  else if (metCount === 2) level = 2;
  else if (metCount === 3) level = 3;
  else if (metCount >= 4) {
    level = password.length >= 12 ? 4 : 3;
  }

  const labels: PasswordStrength["label"][] = [
    "Too weak",
    "Weak",
    "Fair",
    "Strong",
    "Very strong",
  ];

  return {
    level,
    label: labels[level],
    percent: (level / 4) * 100,
  };
}

const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER = "abcdefghijkmnopqrstuvwxyz";
const DIGITS = "23456789";
const SPECIAL = "!@#$%^&*()-_=+[]{}";

function pickChar(pool: string): string {
  const bytes = new Uint8Array(1);
  crypto.getRandomValues(bytes);
  return pool[bytes[0] % pool.length]!;
}

function shuffle(value: string): string {
  const arr = value.split("");
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const bytes = new Uint8Array(1);
    crypto.getRandomValues(bytes);
    const j = bytes[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr.join("");
}

/** Cryptographically random password that satisfies all policy rules. */
export function generateStrongPassword(length = 16): string {
  const size = Math.max(8, length);
  const all = UPPER + LOWER + DIGITS + SPECIAL;
  const required = [
    pickChar(UPPER),
    pickChar(LOWER),
    pickChar(SPECIAL),
    pickChar(DIGITS),
  ];
  const rest: string[] = [];
  for (let i = required.length; i < size; i += 1) {
    rest.push(pickChar(all));
  }
  return shuffle([...required, ...rest].join(""));
}
