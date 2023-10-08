import { UserExerciseFormValues } from "@app/components/user-exercise-form";
import { userExercisesTable } from "@app/library/constants";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { isNil } from "remeda";

type PostUserExercisePayload = {
  exercise_id: string;
  date: string;
  repetitions: number;
  sets: number;
  weight: number;
  distance: number;
}

type PutUserExercisePayload = PostUserExercisePayload & {id: string};

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const payload: UserExerciseFormValues = await request.json();
  const newExercise: PostUserExercisePayload = {
    date: payload.date,
    repetitions: payload.repetitions,
    sets: payload.sets,
    weight: payload.weight,
    distance: payload.distance,
    exercise_id: payload.exerciseId,
  }
  const supabase = createRouteHandlerClient({cookies});
  const {data: userData, error: userError} = await supabase.auth.getSession();

  if (isNil(userData.session) || !isNil(userError)) {
    return NextResponse.json({error: userError?.message ?? 'Error fetching user'}, {status: 401});
  }

  const {data, error} = await supabase
  .from(userExercisesTable)
  .insert({
    ...newExercise,
    user_id: userData.session.user.id,
  });

  if (!isNil(error)) {
    return NextResponse.json({data, error: error?.message}, {status: 500});
  }

  return NextResponse.json({success: true}, {status: 201});
};

export const PUT = async (request: NextRequest): Promise<NextResponse> => {
  const payload: UserExerciseFormValues = await request.json();
  if (isNil(payload.id)) {
    return NextResponse.json({error: 'Missing id'}, {status: 400});
  }
  const updatedExercise: PutUserExercisePayload = {
    id: payload.id,
    date: payload.date,
    repetitions: payload.repetitions,
    sets: payload.sets,
    weight: payload.weight,
    distance: payload.distance,
    exercise_id: payload.exerciseId,
  }
  const supabase = createRouteHandlerClient({cookies});
  const {data: userData, error: userError} = await supabase.auth.getSession();

  if (isNil(userData.session) || !isNil(userError)) {
    return NextResponse.json({error: userError?.message ?? 'Error fetching user'}, {status: 401});
  }

  const {data, error} = await supabase
  .from(userExercisesTable)
  .update({
    ...updatedExercise,
    user_id: userData.session.user.id,
  })
  .eq('id', updatedExercise.id);

  if (!isNil(error)) {
    return NextResponse.json({error: error?.message}, {status: 500});
  }

  return NextResponse.json({success: true}, {status: 200});
}

export const DELETE = async (request: NextRequest): Promise<NextResponse> => {
  const payload: {id: string} = await request.json();
  if (isNil(payload.id)) {
    return NextResponse.json({error: 'Missing id'}, {status: 400});
  }
  const supabase = createRouteHandlerClient({cookies});
  const {data: userData, error: userError} = await supabase.auth.getSession();

  if (isNil(userData.session) || !isNil(userError)) {
    return NextResponse.json({error: userError?.message ?? 'Error fetching user'}, {status: 401});
  }

  const {data, error} = await supabase
  .from(userExercisesTable)
  .delete()
  .eq('id', payload.id);

  if (!isNil(error)) {
    return NextResponse.json({data, error: error?.message}, {status: 500});
  }

  return NextResponse.json({success: true}, {status: 200});
}

export type {
  PostUserExercisePayload,
  PutUserExercisePayload,
};
