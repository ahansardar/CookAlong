"use client";
import { useState } from "react";
import { RecipeImage } from "./recipe-image";
import { getRecipeImage } from "@/lib/recipe-imagery";
import Link from "next/link";
import {
  Clock,
  ArrowLeft,
  Play,
  Check,
  ListChecks,
  ChefHat,
} from "lucide-react";
import { SiteHeader } from "./site-header";
import type { RecipeWithDetails } from "@/lib/supabase";
export function RecipePageClient({ recipe }: { recipe: RecipeWithDetails }) {
  const [checked, setChecked] = useState<string[]>([]);
  return (
    <>
      <SiteHeader />
      <main className="shell detail-page">
        <Link className="back-link" href="/#recipes">
          <ArrowLeft size={16} /> Back to the recipe book
        </Link>
        <section className="detail-hero">
          <div>
            <p className="eyebrow">{recipe.category || "FROM THE KITCHEN"}</p>
            <h1>{recipe.title}</h1>
            <p className="detail-description">{recipe.description}</p>
            <div className="detail-meta">
              <span>
                <Clock size={18} />
                {recipe.total_time}
              </span>
              <span>
                <ListChecks size={18} />
                {recipe.steps.length} steps
              </span>
            </div>
            <Link
              className="primary-action"
              href={`/cook-along/${recipe.slug || recipe.id}`}
            >
              <Play size={17} /> Let's cook this
            </Link>
            <p className="small-note">
              One instruction at a time, with a timer when you need it.
            </p>
          </div>
          <div className="recipe-overview">
            {getRecipeImage(recipe) ? (
              <RecipeImage recipe={recipe} detail />
            ) : (
              <>
                <p className="overview-label">BEFORE YOU BEGIN</p>
                <h2>A recipe, not a race.</h2>
                <p>
                  Gather your ingredients and read the steps once before
                  switching to cooking mode.
                </p>
                <dl>
                  <div>
                    <dt>Ingredients</dt>
                    <dd>{recipe.ingredients.length}</dd>
                  </div>
                  <div>
                    <dt>Instructions</dt>
                    <dd>{recipe.steps.length} steps</dd>
                  </div>
                  <div>
                    <dt>Kitchen time</dt>
                    <dd>{recipe.total_time}</dd>
                  </div>
                </dl>
              </>
            )}
          </div>
        </section>
        <div className="recipe-columns">
          <aside className="ingredients-panel">
            <div className="ingredient-heading">
              <h2>Gather your ingredients</h2>
              <span>
                {checked.length}/{recipe.ingredients.length}
              </span>
            </div>
            <p>Tap to check off what you have ready.</p>
            <ul>
              {recipe.ingredients.map((ing, i) => {
                const key = ing.id || String(i);
                return (
                  <li key={key}>
                    <label
                      className={
                        checked.includes(key) ? "ingredient-checked" : ""
                      }
                    >
                      <input
                        type="checkbox"
                        checked={checked.includes(key)}
                        onChange={() =>
                          setChecked((v) =>
                            v.includes(key)
                              ? v.filter((x) => x !== key)
                              : [...v, key]
                          )
                        }
                      />
                      <span className="custom-check">
                        {checked.includes(key) && <Check size={14} />}
                      </span>
                      <span>
                        {ing.quantity && (
                          <strong>
                            {ing.quantity} {ing.unit}{" "}
                          </strong>
                        )}
                        {ing.name}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </aside>
          <section className="instructions-panel">
            <p className="eyebrow">A LITTLE PREP GOES A LONG WAY</p>
            <h2>Here's how it comes together.</h2>
            <p className="instructions-intro">
              Read through once before you start. Timers are a guide; use the
              visual cues in each step too.
            </p>
            <ol>
              {recipe.steps.map((s) => (
                <li key={s.step_number}>
                  <span className="step-number">
                    {String(s.step_number).padStart(2, "0")}
                  </span>
                  <div>
                    <p>{s.instruction}</p>
                    {!!s.duration_in_seconds && (
                      <span className="step-duration">
                        <Clock size={14} />
                        {s.duration_in_seconds >= 60
                          ? `${Math.floor(s.duration_in_seconds / 60)} min${
                              s.duration_in_seconds % 60
                                ? ` ${s.duration_in_seconds % 60} sec`
                                : ""
                            }`
                          : `${s.duration_in_seconds} sec`}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <Link
              className="primary-action"
              href={`/cook-along/${recipe.slug || recipe.id}`}
            >
              <Play size={17} /> Ready? Start cooking
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
