"use client";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Recipe } from "@/lib/supabase";
export function RecipeCard({
  recipe,
  index = 0,
}: {
  recipe: Recipe;
  index?: number;
}) {
  return (
    <Link className="recipe-tile" href={`/recipe/${recipe.slug || recipe.id}`}>
      {recipe.image_url && (
        <div className="tile-image">
          <img src={recipe.image_url} alt={recipe.title} loading="lazy" />
        </div>
      )}
      <div className="tile-body">
        <div className="recipe-entry-meta">
          <span>{recipe.category || "From the kitchen"}</span>
          <span>{String(index + 1).padStart(2, "0")}</span>
        </div>
        <h3>{recipe.title}</h3>
        <p>{recipe.description || "A new favourite, one step at a time."}</p>
        <div className="tile-meta">
          <span>
            <Clock size={14} />
            {recipe.total_time || "Take your time"}
          </span>
          <span className="recipe-read">
            Open recipe <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
