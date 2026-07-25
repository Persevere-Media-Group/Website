import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-(--color-oxblood) px-4 py-10 text-center">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-(--color-ivory)/70" style={{ fontFamily: "var(--font-body)" }}>
          © {new Date().getFullYear()} Persevere Media. All rights reserved.
        </p>

        <Link
          to="/privacy-policy"
          className="text-sm text-(--color-ivory)/70 underline underline-offset-2 transition-colors hover:text-(--color-ivory)"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
