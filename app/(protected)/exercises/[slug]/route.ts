import { exercisesTable } from "@app/library/constants";
import { DifficultyType, ExerciseType, MuscleGroupType, Params } from "@app/library/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type ExerciseQuery = {
  name: string;
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
  instructions: string;
}

type ExerciseDTO = {
  name: string;
  type: ExerciseType;
  muscle: MuscleGroupType;
  equipment: string;
  difficulty: DifficultyType;
  instructions: string;
}

export const GET = async (_request: NextRequest, {params}: {params: Params}): Promise<NextResponse> => {
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
    .match({slug: params.slug})
    .single()) as PostgrestSingleResponse<ExerciseQuery>;

    if (data === null || error !== null) {
      throw new Error('Error fetching exercises');
    }
  
  const dto: ExerciseDTO = {
    ...data,
    difficulty: data.difficulty.name,
    type: data.type.name,
    muscle: data.muscle.name,
  }
  return NextResponse.json(dto, {status: 200});

  } catch (error) {
    return NextResponse.json({error: error as string}, {status: 500});
  }
  
}

export type {
  ExerciseQuery,
  ExerciseDTO,
};