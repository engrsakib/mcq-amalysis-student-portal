import { DEVELOPER_PROFILE } from "@/lib/docs/developer-profile-data";
import { DocsProfileHeader } from "@/components/docs/docs-profile-header";

export function DeveloperProfile() {
  const p = DEVELOPER_PROFILE;

  return (
    <DocsProfileHeader
      name={p.name}
      title={p.title}
      location={p.location}
      image={p.image}
      socialLinks={[
        { href: p.website, label: "Website", iconSrc: "/search.png" },
        { href: p.linkedin, label: "LinkedIn", iconSrc: "/linkedin.png" },
        { href: p.facebook, label: "Facebook", iconSrc: "/fbpage.png" },
        { href: p.github, label: "GitHub", iconSrc: "/github.png" },
        { href: p.leetcode, label: "LeetCode", iconSrc: "/leetcode.png" },
      ]}
    />
  );
}
