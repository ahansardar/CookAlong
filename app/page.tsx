import { SiteHeader } from "@/components/site-header";
import { RecipeListClient } from "@/components/recipe-list-client";
import { ArrowDown, Timer, ListChecks, ChefHat } from "lucide-react";
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="shell">
        <section className="home-hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span /> YOUR LITTLE KITCHEN COMPANION
            </p>
            <h1>
              Good food.
              <br />
              One step <em>at a time.</em>
            </h1>
            <p className="hero-description">
              Less scrolling. More cooking. Find something delicious, gather
              your ingredients, and let us guide you from the first chop to the
              last bite.
            </p>
            <a href="#recipes" className="primary-action">
              Find your next dish <ArrowDown size={18} />
            </a>
            <div className="hero-notes">
              <span>
                <ListChecks size={16} /> Clear instructions
              </span>
              <span>
                <Timer size={16} /> Built-in timers
              </span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-caption">
              A little patience.
              <br />
              <i>A lot of flavour.</i>
            </div>
            <img src="/kitchen-bowl.svg" alt="" />
          </div>
        </section>
        <RecipeListClient />
        <section className="closing-note">
          <ChefHat size={25} />
          <div>
            <h2>Your kitchen. Your pace.</h2>
            <p>
              Read ahead, check off your ingredients, and cook one step at a
              time.
            </p>
          </div>
        </section>
      </main>
      <footer className="shell site-footer">
        <span className="footer-brand">cook-along.</span>
        <span>Made by Ahan Sardar with love</span>
        <span>From recipe to real life.</span>
      </footer>
    </>
  );
}
