import { UserExerciseFormValues } from "@app/components/user-exercise-form";
import { userExercisesTable } from "@app/library/constants";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type UserExerciseQuery = {
  exercise_id: string;
  date: string;
  repetitions: number | null;
  sets: number | null;
  weight: number | null;
  distance: number | null;
}

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const payload: UserExerciseFormValues = await request.json();
  const newExercise: UserExerciseQuery = {
    date: payload.date,
    repetitions: payload.repetitions,
    sets: payload.sets,
    weight: payload.weight,
    distance: payload.distance,
    exercise_id: payload.exerciseId,
  }
  const supabase = createRouteHandlerClient({cookies});
  const {data: userData, error: userError} = await supabase.auth.getSession();

  if (userData.session === null || userError !== null) {
    console.log(userError)
    return NextResponse.json({error: userError?.message ?? 'Error fetching user'}, {status: 401});
  }

  const {data, error} = await supabase
  .from(userExercisesTable)
  .insert({
    ...newExercise,
    user_id: userData.session.user.id,
  });

  if (error !== null) {
    return NextResponse.json({data, error: error?.message}, {status: 500});
  }

  return NextResponse.json({success: true}, {status: 201});
};