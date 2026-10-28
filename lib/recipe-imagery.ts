import type { Recipe } from "./supabase";

type RecipeImage = { src: string; thumbnail?: string; alt: string; caption?: string };
const curated: Record<string, { file: string; original?: string; caption?: string }> = {
  "shahi-paneer-pulav": { file: "shahi-paneer-pulav", original: "1772038957244-cccdb249-4177-4211-81eb-e5dccfedb498" },
  "paneer-butter-masala": { file: "paneer-butter-masala", original: "1771669327385-cc4e7dc2-05d7-4f47-af9c-3934172d9395" },
  "duck-curry-rice": { file: "duck-curry", original: "1771669666494-1bfa532e-1c3f-4eab-9d78-23baa27e1d58" },
  "sil-batta-duck-curry-rice": { file: "duck-curry" },
  "chicken-momo": { file: "chicken-momos", original: "1771669756769-8c57feb3-e0c4-4b5b-94df-1cc0583e4457" },
  "chicken-momo-detailed": { file: "chicken-momos" },
  "gajar-ka-halwa": { file: "gajar-ka-halwa", original: "1771669789013-bde0d4ca-1189-46ca-a5d2-12fe55df8e81" },
  "traditional-gajar-ka-halwa": { file: "gajar-ka-halwa" },
  "elite-air-fried-satin-fish": { file: "air-fried-fish", caption: "Illustrated serving idea" },
};

export function getRecipeImage(recipe: Pick<Recipe, "slug" | "id" | "title" | "image_url">): RecipeImage | null {
  const entry = curated[recipe.slug || recipe.id];
  // Respect any future user-uploaded replacement; do not change database records.
  if (entry && (!recipe.image_url || (entry.original && recipe.image_url.includes(entry.original)))) {
    return {
      src: `/recipes/${entry.file}-illustration.webp`,
      thumbnail: `/recipes/${entry.file}-illustration-thumb.webp`,
      alt: `Cookbook illustration of ${recipe.title.trim()}`,
      caption: "Illustrated serving idea",
    };
  }
  return recipe.image_url ? { src: recipe.image_url, alt: recipe.title.trim() } : null;
}
