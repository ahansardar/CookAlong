import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(' Supabase credentials not found. Using fallback data.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Recipe {
  id: string
  slug: string
  title: string
  description: string | null
  total_time: string | null
  image_url: string | null
  category: string | null
  is_featured: boolean | null
  created_at: string | null
}

export interface Ingredient {
  id: string
  recipe_id: string
  quantity: string | null
  unit: string | null
  name: string
  position: number
  created_at: string | null
}

export interface Step {
  id: string
  recipe_id: string
  step_number: number
  instruction: string
  duration_in_seconds: number | null
  video_url: string | null
  created_at: string | null
}

export interface RecipeWithDetails extends Recipe {
  ingredients: Ingredient[]
  steps: Step[]
}

export async function getAllRecipes(): Promise<Recipe[]> {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('  Supabase not configured, returning empty array')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('  Error fetching recipes:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('  Error fetching recipes:', error)
    return []
  }
}

export async function getFeaturedRecipes(): Promise<Recipe[]> {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('  Supabase not configured, returning empty array')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('  Error fetching featured recipes:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('  Error fetching featured recipes:', error)
    return []
  }
}

export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('  Supabase not configured, returning empty array')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('  Error fetching recipes by category:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('  Error fetching recipes by category:', error)
    return []
  }
}

export async function getAllCategories(): Promise<string[]> {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('  Supabase not configured, returning empty array')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('category')
      .not('category', 'is', null)

    if (error) {
      console.error('  Error fetching categories:', error)
      return []
    }

    // Extract unique categories
    const categories = Array.from(
      new Set(data?.map((r) => r.category).filter(Boolean))
    ) as string[]
    
    console.log('  Categories fetched:', { 
      rawData: data?.map(r => ({ category: r.category })),
      uniqueCategories: categories 
    })
    
    return categories.sort()
  } catch (error) {
    console.error('  Error fetching categories:', error)
    return []
  }
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
  }
}

export async function getRecipeBySlug(slug: string): Promise<RecipeWithDetails | null> {
  // Check if Supabase is properly configured
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('  Supabase not configured, returning null for fallback')
    return null
  }

  try {
    const { data: recipes, error: recipeError } = await supabase
      .from('recipes')
      .select('*')
      .eq('slug', slug)
      .limit(1)

    if (recipeError) {
      console.error('  Error fetching recipe:', recipeError.message)
      return null
    }

    if (!recipes || recipes.length === 0) {
      console.log('  Recipe not found with slug:', slug)
      return null
    }

    const recipe = recipes[0]

    const { data: ingredients, error: ingredientsError } = await supabase
      .from('ingredients')
      .select('*')
      .eq('recipe_id', recipe.id)
      .order('position', { ascending: true })

    if (ingredientsError) {
      console.error('  Error fetching ingredients:', ingredientsError.message)
    }

    const { data: steps, error: stepsError } = await supabase
      .from('steps')
      .select('*')
      .eq('recipe_id', recipe.id)
      .order('step_number', { ascending: true })

    if (stepsError) {
      console.error('  Error fetching steps:', stepsError.message)
    }

    return {
      ...recipe,
      ingredients: ingredients || [],
      steps: steps || [],
    }
  } catch (error) {
    console.error('  Error fetching recipe details:', error instanceof Error ? error.message : error)
    return null
  }
}
