"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/piecharts", label: "Pie Chart" },
    { href: "/searchbar", label: "Search" },
  ];

  return (
    <nav
      style={{
        display: "flex",
        gap: "1.5rem",
        padding: "1rem 2rem",
        backgroundColor: "#282c34",
      }}
    >
      {links.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            style={{
              color: isActive ? "#61dafb" : "white",
              fontWeight: isActive ? "bold" : "normal",
              textDecoration: "none",
              fontSize: "1.1rem",
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
