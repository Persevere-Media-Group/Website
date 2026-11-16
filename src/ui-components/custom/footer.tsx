import { Link } from "react-router-dom";
import { MadeByBadge } from "./madeby-badge";
import { SparkleHover } from "@/ui-components/custom/sparkle";

export function Footer() {
  return (
    <footer className="bg-(--color-oxblood) px-4 py-10 text-center">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:text-left">
        <p className="text-sm text-(--color-ivory)/70 sm:justify-self-start">
          © {new Date().getFullYear()} Persevere Media. All rights reserved.
        </p>

        <Link
          to="/privacy-policy"
          className="text-sm text-(--color-ivory)/70 underline underline-offset-2 transition-colors hover:text-(--color-ivory) sm:justify-self-center"
        >
          Privacy Policy
        </Link>

        <div className="sm:justify-self-end">
          <SparkleHover>
            <MadeByBadge />
          </SparkleHover>
        </div>
      </div>
    </footer>
  );
}
