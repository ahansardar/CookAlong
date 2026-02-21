# Supabase Integration Setup

This Cook Along Recipe website is now configured to fetch data from Supabase instead of local JSON files.

## Environment Variables

Add these environment variables to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under **Settings > API**.

## Database Schema

The following tables are required in your Supabase database:

### recipes
```sql
CREATE TABLE public.recipes (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  total_time text,
  image_url text,
  category text,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE INDEX idx_recipes_slug ON public.recipes(slug);
CREATE INDEX idx_recipes_category ON public.recipes(category);
```

### ingredients
```sql
CREATE TABLE public.ingredients (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  quantity text,
  unit text,
  name text NOT NULL,
  position integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE INDEX idx_ingredients_recipe_id ON public.ingredients(recipe_id);
```

### steps
```sql
CREATE TABLE public.steps (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  instruction text NOT NULL,
  duration_in_seconds integer,
  video_url text,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE INDEX idx_steps_recipe_id ON public.steps(recipe_id);
CREATE INDEX idx_steps_step_number ON public.steps(step_number);
```

## Data Structure

The application maps Supabase data to the following structure:

- **Recipe**: Identified by `slug` or `id`, contains title, description, total_time, and related ingredients/steps
- **Ingredients**: Associated with recipes via `recipe_id`, ordered by `position`
- **Steps**: Associated with recipes via `recipe_id`, ordered by `step_number`

## Fallback Behavior

If Supabase is not configured or unavailable, the app will automatically fall back to using the local JSON files (`data/recipes.json`). This ensures the application remains functional during development or if Supabase connectivity is temporarily unavailable.

## Data Migration

To migrate existing data from the JSON files to Supabase:

1. Copy the structured data from `data/recipes.json`
2. Create recipes records with appropriate slugs
3. Insert ingredients associated with each recipe
4. Insert steps associated with each recipe

The slug field should be URL-friendly (lowercase, hyphens instead of spaces) for better routing.
