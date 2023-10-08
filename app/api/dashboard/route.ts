import { exercisesTable, programsTable, userExercisesTable, usersTable } from "@app/library/constants";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { PostgrestResponse, PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

type UserDataQuery = {
  first_name: string;
  last_name: string;
  user_exercises: UserExerciseQuery[];
  programs: UserProgramQuery[];
};

type UserDataDTO = {
  firstName: string;
  lastName: string;
  exercises: UserExerciseDTO[];
  programs: UserProgramDTO[];
};

type UserProgramDTO = {
  id: string;
  name: string;
  description: string;
  programExercises: ProgramExerciseDTO[];
};

type UserProgramQuery = {
  id: string;
  name: string;
  description: string;
  program_exercises: ProgramExerciseQuery[];
};

type ProgramExerciseDTO = {
  id: string;
  exercise: ExerciseDTO;
}

type ProgramExerciseQuery = {
  id: string;
  exercise: ExerciseQuery;
}

type UserExerciseQuery = {
  id: string;
  date: string;
  repetitions: number | null;
  sets: number | null;
  weight: number | null;
  distance: number | null;
  exercise : ExerciseQuery;
};

type UserExerciseDTO = {
  id: string;
  date: string;
  repetitions: number | null;
  sets: number | null;
  weight: number | null;
  distance: number | null;
  exercise : ExerciseDTO;
}

type ExerciseQuery = {
  id: string;
  slug: string;
  name: string;
  equipment: string;
  type: {
    name: string;
  };
  muscle: {
    name: string;
  };
  difficulty: {
    name: string;
  };
}

type ExerciseDTO = {
  id: string;
  slug: string;
  name: string;
  equipment: string;
  type: string;
  muscle: string;
  difficulty: string;
}

type ExerciseOptionQuery = {
  name: string;
  id: string;
};

type ExerciseOptionDTO = {
  name: string;
  id: string;
};

type DashboardDTO = {
  userData: UserDataDTO;
  exercises: ExerciseOptionDTO[];
}

type ErrorResponse = {
  error: string;
}

const formatExercise = (exercise: ExerciseQuery): ExerciseDTO => ({
  ...exercise,
  difficulty: exercise.difficulty.name,
  type: exercise.type.name,
  muscle: exercise.muscle.name
});

const formatUserExercise = (userExercise: UserExerciseQuery): UserExerciseDTO => ({
  ...userExercise,
  exercise: formatExercise(userExercise.exercise),
});

const formatUserProgram = (userProgram: UserProgramQuery): UserProgramDTO => ({
  ...userProgram,
  programExercises: userProgram.program_exercises.map((programExercise) => ({
    ...programExercise,
    exercise: formatExercise(programExercise.exercise),
  })),
});

export const GET = async (): Promise<NextResponse<DashboardDTO | ErrorResponse>> => {
  try {
  const supabase = createRouteHandlerClient({cookies});
  const {data: authData, error: authError} = await supabase.auth.getSession();

  if (authData.session === null || authError !== null) {
    return NextResponse.json({error: authError?.message ?? 'Error fetching user'}, {status: 401});
  }

  const {data: userData, error: userDataError} = await supabase
    .from(usersTable)
    .select(`
      *, 
      ${userExercisesTable} (
        *,
        exercise: exercises (
          *,
          difficulty: difficulty_id (name),
          type: exercise_type_id (name),
          muscle: muscle_group_id (name)
        )
      ),
      ${programsTable} (
        *,
        program_exercises (
          *,
          exercise: exercises (
            *,
            difficulty: difficulty_id (name),
            type: exercise_type_id (name),
            muscle: muscle_group_id (name)
          )
        )
      )
    `)
    .eq('id', authData.session.user.id)
    .single() as PostgrestSingleResponse<UserDataQuery>;

  const {data: exercisesData, error: exercisesError} = await supabase
    .from(exercisesTable)
    .select('name, id') as PostgrestResponse<ExerciseOptionQuery>;

  if (userDataError !== null || exercisesError !== null) {
    throw new Error('Database query error');
  }

  console.log(userData.programs[0].program_exercises);

  const userDataDTO: UserDataDTO = {
    firstName: userData.first_name,
    lastName: userData.last_name,
    exercises: userData.user_exercises.map(formatUserExercise),
    programs: userData.programs.map(formatUserProgram),
  };

  const exercisesDTO: ExerciseOptionDTO[] = exercisesData.map((exercise) => ({...exercise}));

  const data = {
    userData: userDataDTO,
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
  ExerciseOptionDTO,
  ExerciseOptionQuery,
  DashboardDTO,
  ErrorResponse,
  UserProgramDTO,
  UserProgramQuery,
  ProgramExerciseDTO,
  ProgramExerciseQuery,
  ExerciseDTO,
  ExerciseQuery,
};