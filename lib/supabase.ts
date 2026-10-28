import { createClient } from "@supabase/supabase-js";
import bundledRecipes from "@/data/recipes.json";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(" Supabase credentials not found. Using fallback data.");
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  total_time: string | null;
  image_url: string | null;
  category: string | null;
  is_featured: boolean | null;
  created_at: string | null;
}

export interface Ingredient {
  id: string;
  recipe_id: string;
  quantity: string | null;
  unit: string | null;
  name: string;
  position: number;
  created_at: string | null;
}

export interface Step {
  id: string;
  recipe_id: string;
  step_number: number;
  instruction: string;
  duration_in_seconds: number | null;
  video_url: string | null;
  created_at: string | null;
}

export interface RecipeWithDetails extends Recipe {
  ingredients: Ingredient[];
  steps: Step[];
}

const categories: Record<string, string> = {
  "traditional-gajar-ka-halwa": "Sweet treats",
  "paneer-butter-masala": "Vegetarian",
  "chicken-momo-detailed": "Chicken",
  "sil-batta-duck-curry-rice": "Slow cooking",
};
function fallbackRecipes(): RecipeWithDetails[] {
  return bundledRecipes.map((r) => ({
    ...transformJsonRecipeToSupabaseFormat(r),
    category: categories[r.id] || "Home cooking",
  }));
}
export async function getAllRecipes(): Promise<Recipe[]> {
  if (!supabase) return fallbackRecipes();
  try {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data?.length) return fallbackRecipes();
    return data;
  } catch {
    return fallbackRecipes();
  }
}
export async function getFeaturedRecipes(): Promise<Recipe[]> {
  return (await getAllRecipes()).filter((r) => r.is_featured);
}
export async function getRecipesByCategory(
  category: string
): Promise<Recipe[]> {
  return (await getAllRecipes()).filter((r) => r.category === category);
}
export async function getAllCategories(): Promise<string[]> {
  return Array.from(
    new Set(
      (await getAllRecipes())
        .map((r) => r.category)
        .filter((c): c is string => !!c)
    )
  ).sort();
}

export function transformJsonRecipeToSupabaseFormat(
  jsonRecipe: any
): RecipeWithDetails {
  return {
    id: jsonRecipe.id,
    slug: jsonRecipe.id,
    title: jsonRecipe.title,
    description: jsonRecipe.description || null,
    total_time: jsonRecipe.totalTime || null,
    image_url: jsonRecipe.imageUrl || null,
    category: jsonRecipe.category || null,
    is_featured: jsonRecipe.isFeatured || false,
    created_at: null,
    ingredients: (jsonRecipe.ingredients || []).map(
      (ing: any, index: number) => ({
        id: `${jsonRecipe.id}-ing-${index}`,
        recipe_id: jsonRecipe.id,
        quantity: ing.quantity || null,
        unit: ing.unit || null,
        name: ing.name,
        position: index,
        created_at: null,
      })
    ),
    steps: (jsonRecipe.steps || []).map((step: any) => ({
      id: `${jsonRecipe.id}-step-${step.stepNumber}`,
      recipe_id: jsonRecipe.id,
      step_number: step.stepNumber,
      instruction: step.instruction,
      duration_in_seconds: step.durationInSeconds || null,
      video_url: step.videoUrl || null,
      created_at: null,
    })),
  };
}

export async function getRecipeBySlug(
  slug: string
): Promise<RecipeWithDetails | null> {
  const fallback = () => fallbackRecipes().find((r) => r.slug === slug) || null;
  if (!supabase) return fallback();
  try {
    const { data: recipe, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !recipe) return fallback();
    const [ingredients, steps] = await Promise.all([
      supabase
        .from("ingredients")
        .select("*")
        .eq("recipe_id", recipe.id)
        .order("position"),
      supabase
        .from("steps")
        .select("*")
        .eq("recipe_id", recipe.id)
        .order("step_number"),
    ]);
    if (ingredients.error || steps.error) return fallback();
    return {
      ...recipe,
      ingredients: ingredients.data || [],
      steps: steps.data || [],
    };
  } catch {
    return fallback();
  }
}
