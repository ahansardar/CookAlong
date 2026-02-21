import { notFound } from "next/navigation"
import { getRecipeBySlug, getAllRecipes } from "@/lib/supabase"
import { CookAlongPageClient } from "@/components/cook-along-page-client"
import recipes from "@/data/recipes.json"

interface CookAlongPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  try {
    const supabaseRecipes = await getAllRecipes()
    
    if (supabaseRecipes.length > 0) {
      return supabaseRecipes.map((recipe) => ({
        id: recipe.slug || recipe.id,
      }))
    }
  } catch (error) {
    console.error('[v0] Error fetching recipes for static params:', error)
  }

  // Fallback to JSON recipes
  return recipes.map((recipe) => ({
    id: recipe.id,
  }))
}

export default async function CookAlongPage({ params }: CookAlongPageProps) {
  const { id } = await params

  // Try to fetch from Supabase first
  let recipe = await getRecipeBySlug(id)

  // Fallback to JSON data if Supabase fails
  if (!recipe) {
    const fallbackRecipe = recipes.find((r) => r.id === id)
    if (!fallbackRecipe) {
      notFound()
    }

    return <CookAlongPageClient recipe={fallbackRecipe as any} />
  }

  return <CookAlongPageClient recipe={recipe} />
}
