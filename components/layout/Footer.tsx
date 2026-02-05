"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-10 py-4 text-sm text-gray-500 text-center">
      <Link href="/privacy" className="hover:underline mx-2">
        Privacy Policy
      </Link>

      <span className="mx-1">|</span>

      <Link href="/terms" className="hover:underline mx-2">
        Terms
      </Link>

      <span className="mx-1">|</span>

      <Link href="/contact" className="hover:underline mx-2">
        Contact
      </Link>
    </footer>
  );
}
