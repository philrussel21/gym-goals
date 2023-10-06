import { PostgrestError } from "@supabase/supabase-js";

type LinkType = {
  label: string;
  url: string;
}

type Params = {
  slug: string;
};

type SupabaseDatabaseResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
}

const EXERCISE_TYPES = ['cardio', 'olympic_weightlifting', 'plyometrics', 'powerlifting', 'strength', 'stretching', 'strongman'] as const;
type ExerciseType = typeof EXERCISE_TYPES[number];

const MUSCLE_GROUPS = ['abdominals','abductors','adductors','biceps','calves','chest','forearms','glutes','hamstrings','lats','lower_back','middle_back','neck','quadriceps','traps','triceps']
type MuscleGroupType = typeof MUSCLE_GROUPS[number];

const DIFFICULTY = ['beginner','intermediate','expert'];
type DifficultyType = typeof DIFFICULTY[number];

export type {
  Params,
  LinkType,
  ExerciseType,
  MuscleGroupType,
  DifficultyType,
  SupabaseDatabaseResponse,
}