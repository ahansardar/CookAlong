"use client";
import Link from "next/link";
import { ChefHat, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="wordmark" aria-label="Cook-Along home">
          <span className="brand-icon">
            <ChefHat size={22} />
          </span>
          cook<span className="brand-hyphen">-</span>along
          <span className="brand-dot">.</span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/#recipes" className="nav-recipes">
            The recipe book
          </Link>
          <Link href="/request-recipe" className="request-link">
            Request a recipe <ArrowUpRight size={15} />
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
