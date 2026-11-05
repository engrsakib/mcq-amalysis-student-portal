import { Globe } from "lucide-react";
import { DocsProfileHeader } from "@/components/docs/docs-profile-header";
import {
  BrandFacebookIcon,
  BrandInstagramIcon,
  BrandLinkedinIcon,
  BrandXIcon,
  BrandYoutubeIcon,
} from "@/components/docs/docs-brand-icons";
import { FOUNDER_PROFILE } from "@/lib/docs/founder-profile-data";

const iconClass = "size-4 shrink-0";

export function FounderProfile() {
  const p = FOUNDER_PROFILE;

  return (
    <DocsProfileHeader
      name={p.name}
      title={p.title}
      location={p.location}
      image={p.image}
      socialLinks={[
        {
          href: p.website,
          label: "Website",
          icon: <Globe className={iconClass} />,
        },
        {
          href: p.facebook,
          label: "Facebook",
          icon: <BrandFacebookIcon className={iconClass} />,
        },
        {
          href: p.youtube,
          label: "YouTube",
          icon: <BrandYoutubeIcon className={iconClass} />,
        },
        {
          href: p.linkedin,
          label: "LinkedIn",
          icon: <BrandLinkedinIcon className={iconClass} />,
        },
        {
          href: p.instagram,
          label: "Instagram",
          icon: <BrandInstagramIcon className={iconClass} />,
        },
        {
          href: p.x,
          label: "X",
          icon: <BrandXIcon className={iconClass} />,
        },
      ]}
    />
  );
}
