import { exercisesTable, userExercisesTable } from "@app/library/constants";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { PostgrestResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

type UserExerciseQuery = {
  id: string;
  date: string;
  repetitions: number | null;
  sets: number | null;
  weight: number | null;
  distance: number | null;
  exercise : {
    id: string,
    slug: string;
    name: string;
    type: {
      name: string;
    };
    muscle: {
      name: string;
    };
    difficulty: {
      name: string;
    };
  };
};

type UserExerciseDTO = {
  id: string;
  date: string;
  repetitions: number | null;
  sets: number | null;
  weight: number | null;
  distance: number | null;
  exercise : {
    id: string,
    slug: string;
    name: string;
    type: string;
    muscle: string;
    difficulty: string;
  };
}

type ExerciseQuery = {
  name: string;
  id: string;
};

type ExerciseDTO = {
  name: string;
  id: string;
};

type DashboardDTO = {
  userExercises: UserExerciseDTO[];
  exercises: ExerciseDTO[];
}

type ErrorResponse = {
  error: string;
}

export const GET = async (): Promise<NextResponse<DashboardDTO | ErrorResponse>> => {
  try {
  const supabase = createRouteHandlerClient({cookies});
  const {data: userData, error: userError} = await supabase.auth.getSession();

  if (userData.session === null || userError !== null) {
    return NextResponse.json({error: userError?.message ?? 'Error fetching user'}, {status: 401});
  }

  const {data: userExerciseData, error: userExerciseError} = await supabase
    .from(userExercisesTable)
    .select(`
      *, 
      exercise: exercise_id(
        id,
        name,
        slug,
        difficulty: difficulty_id(name),
        type: exercise_type_id(name),
        muscle: muscle_group_id(name)
      )`)
    .eq('user_id', userData.session.user.id) as PostgrestResponse<UserExerciseQuery>;

  const {data: exercisesData, error: exercisesError} = await supabase
    .from(exercisesTable)
    .select('name, id') as PostgrestResponse<ExerciseQuery>;

  if (userExerciseError !== null || exercisesError !== null) {
    throw new Error('Database query error');
  }

  const userExercisesDTO = userExerciseData.map((userExercise) => ({
    ...userExercise,
    exercise: {
      ...userExercise.exercise,
      difficulty: userExercise.exercise.difficulty.name,
      type: userExercise.exercise.type.name,
      muscle: userExercise.exercise.muscle.name
    }
  }));

  const exercisesDTO = exercisesData.map((exercise) => ({...exercise}));

  const data = {
    userExercises: userExercisesDTO,
    exercises: exercisesDTO,
  };

  return NextResponse.json(data, {status: 200});
  } catch (error) {
    return NextResponse.json({error: error as string}, {status: 500});
  }
}

export type {
  UserExerciseQuery,
  UserExerciseDTO,
  ExerciseQuery,
  ExerciseDTO,
  DashboardDTO,
  ErrorResponse
};