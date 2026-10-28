"use client";
import { useEffect, useState, useMemo } from "react";
import { Search, X, ArrowUpRight, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { RecipeCard } from "./recipe-card";
import { getAllRecipes, type Recipe } from "@/lib/supabase";
export function RecipeListClient() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [quick, setQuick] = useState(false);
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setQuery(p.get("search") || "");
    setCategory(p.get("category") || "");
    let active = true;
    getAllRecipes().then((r) => {
      if (active) {
        setRecipes(r);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);
  const categories = useMemo(
    () =>
      Array.from(
        new Set(recipes.map((r) => r.category).filter(Boolean))
      ) as string[],
    [recipes]
  );
  const filtered = recipes.filter(
    (r) =>
      (!category || r.category === category) &&
      `${r.title} ${r.description || ""}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!quick || minutes(r.total_time) <= 30)
  );
  function update(q: string, c: string) {
    setQuery(q);
    setCategory(c);
    const p = new URLSearchParams();
    if (q) p.set("search", q);
    if (c) p.set("category", c);
    history.replaceState(null, "", p.size ? `/?${p}#recipes` : "/#recipes");
  }
  return (
    <section id="recipes" className="recipe-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE RECIPE BOOK</p>
          <h2>What sounds good today?</h2>
        </div>
        <span className="collection-count">Something worth making.</span>
      </div>
      <div className="search-row">
        <label className="search-field">
          <Search size={20} />
          <span className="sr-only">Search recipes</span>
          <input
            type="search"
            placeholder="Find a dish, a flavour, a little inspiration..."
            value={query}
            onChange={(e) => update(e.target.value, category)}
          />
          {query && (
            <button
              aria-label="Clear search"
              onClick={() => update("", category)}
            >
              <X size={18} />
            </button>
          )}
        </label>
        <button
          className={`quick-filter ${quick ? "selected" : ""}`}
          aria-pressed={quick}
          onClick={() => setQuick(!quick)}
        >
          <SlidersHorizontal size={17} /> Under 30 min
        </button>
      </div>
      <div className="filter-row" aria-label="Recipe categories">
        <button
          aria-pressed={!category}
          className={!category ? "active" : ""}
          onClick={() => update(query, "")}
        >
          All recipes
        </button>
        {categories.map((c) => (
          <button
            aria-pressed={category === c}
            key={c}
            className={category === c ? "active" : ""}
            onClick={() => update(query, c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="results-meta" aria-live="polite">
        <span>
          {loading
            ? "Opening the recipe book..."
            : `${filtered.length} ${
                filtered.length === 1 ? "recipe" : "recipes"
              }${query ? ` matching “${query}”` : " to make your own"}`}
        </span>
        <span className="results-hint">
          Pick a dish. We'll take it from there.
        </span>
      </div>
      {loading ? (
        <div className="recipe-grid" aria-busy="true">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="recipe-skeleton" />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="recipe-grid">
          {filtered.map((r, i) => (
            <RecipeCard recipe={r} key={r.id} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={28} />
          <h3>No dishes found. Keep exploring.</h3>
          <p>Try a different name or clear your filters.</p>
          <button
            className="primary-action"
            onClick={() => {
              update("", "");
              setQuick(false);
            }}
          >
            Show all recipes
          </button>
          <Link href="/request-recipe">
            Or request a recipe <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}
function minutes(value: string | null) {
  if (!value) return Infinity;
  const h = value.match(/(\d+)\s*(?:hours?|hrs?|h)\b/i);
  const m = value.match(/(\d+)\s*(?:minutes?|mins?|m)\b/i);
  return h || m ? Number(h?.[1] || 0) * 60 + Number(m?.[1] || 0) : Infinity;
}
