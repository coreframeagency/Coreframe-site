import Image from "next/image";
import Link from "next/link";

interface WordmarkProps {
  className?: string;
}

export function Wordmark({ className = "" }: WordmarkProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="COREFRAME — Home"
    >
      <Image
        src="/wordmark.png"
        alt="coreframe."
        width={1024}
        height={179}
        priority
        className="h-[18px] w-auto md:h-[20px]"
      />
    </Link>
  );
}

/**
 * PLACEHOLDER: Official COREFRAME logo mark (icon only)
 * Use in contexts where the full wordmark is too large.
 */
export function LogoMark({ className = "" }: WordmarkProps) {
  return (
    <Link
      href="/"
      className={`inline-flex h-8 w-8 items-center justify-center border border-[var(--cf-warm-white)]/20 font-display text-xs text-[var(--cf-warm-white)] ${className}`}
      aria-label="COREFRAME — Home"
    >
      {/* PLACEHOLDER: Replace with official logo mark */}
      CF
    </Link>
  );
}
