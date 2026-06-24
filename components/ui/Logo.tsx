import Image from "next/image";
import Link from "next/link";

type LogoVariant = "full" | "wordmark" | "icon";
type LogoSize = "sm" | "md" | "lg";

const sizes: Record<LogoSize, { img: number; link: string }> = {
  sm:  { img: 32,  link: "inline-block" },
  md:  { img: 48,  link: "inline-block" },
  lg:  { img: 120, link: "inline-block" },
};

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  href?: string | null;
  className?: string;
}

/**
 * Logo component — three variants:
 *   full     = circular logo image
 *   wordmark = "Built on PURPOSE" text in brand colours (no image, scales freely)
 *   icon     = tiny circular image only (for favicons, avatars)
 */
export function Logo({
  variant = "full",
  size = "md",
  href = "/",
  className = "",
}: LogoProps) {
  const { img } = sizes[size];

  const content =
    variant === "wordmark" ? (
      <span className={`font-display leading-none ${className}`}>
        <span className="text-ink font-bold">Built </span>
        <span className="text-orange font-normal">on</span>
        <br />
        <span className="text-teal font-black tracking-widest uppercase">
          Purpose
        </span>
      </span>
    ) : (
      <Image
        src="/logo.png"
        alt="Built on Purpose — Maximizing Human Potential"
        width={img}
        height={img}
        className={`rounded-full ${className}`}
        priority={size === "lg"}
      />
    );

  if (!href) return <>{content}</>;

  return (
    <Link href={href} className="inline-flex items-center" aria-label="Built on Purpose">
      {content}
    </Link>
  );
}
