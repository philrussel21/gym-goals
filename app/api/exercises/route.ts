import { exercisesTable } from "@app/library/constants";
import { DifficultyType, ExerciseType, MuscleGroupType, SupabaseDatabaseResponse } from "@app/library/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type ExerciseCardQuery = {
  name: string;
  slug: string;
  type: {
    name: ExerciseType;
  };
  muscle: {
    name: MuscleGroupType;
  };
  difficulty: {
    name: DifficultyType;
  };
  equipment: string;
}

type ExerciseCardDTO = {
  slug: string;
  name: string;
  type: ExerciseType;
  muscle: MuscleGroupType;
  equipment: string;
  difficulty: DifficultyType;
}

// TODO: to be changed
const LIMIT = 20;

export const GET = async (): Promise<NextResponse> => {
  try {
  const supabase = createServerComponentClient({cookies});
  const {data, error} = (await supabase
    .from(exercisesTable)
    .select(`
      *,
      difficulty: difficulty_id(name),
      type: exercise_type_id(name),
      muscle: muscle_group_id(name)
    `)
    .limit(LIMIT)) as PostgrestSingleResponse<ExerciseCardQuery[]>;
  
  if (data === null || error !== null) {
    throw new Error('Error fetching exercises');
  }
  
  const dto: ExerciseCardDTO[] = data.map((exercise) => ({
    ...exercise,
    difficulty: exercise.difficulty.name,
    type: exercise.type.name,
    muscle: exercise.muscle.name,
  }));
  return NextResponse.json(dto, {status: 200});

  } catch (error) {
    return NextResponse.json({error: error as string}, {status: 500});
  }
  
}

export type {
  ExerciseCardQuery,
  ExerciseCardDTO,
}