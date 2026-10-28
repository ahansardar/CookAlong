"use client";
import { useState } from "react";
import type { Recipe } from "@/lib/supabase";
import { getRecipeImage } from "@/lib/recipe-imagery";

export function RecipeImage({ recipe, detail = false }: { recipe: Recipe; detail?: boolean }) {
  const image = getRecipeImage(recipe);
  const [failed, setFailed] = useState(false);
  if (!image || failed) return null;
  return (
    <figure className={`${detail ? "recipe-photo recipe-photo-detail" : "tile-image recipe-photo"}${image.caption === "Illustrated serving idea" ? " recipe-illustration" : ""}`}>
      <img
        src={detail ? image.src : (image.thumbnail || image.src)}
        srcSet={image.thumbnail ? `${image.thumbnail} 480w, ${image.src} 1000w` : undefined}
        sizes={detail ? "(max-width: 760px) 100vw, 45vw" : "(max-width: 760px) 100vw, 40vw"}
        alt={image.alt}
        width={1000}
        height={750}
        loading={detail ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
      />
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  );
}
