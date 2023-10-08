import { UserProgramFormValues } from "@app/components/user-program-form";
import { programsExercisesTable, programsTable } from "@app/library/constants";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { isNil } from "remeda";

type PostProgramPayload = {
  name: string;
  description: string;
  public: boolean;
};

type PostPorgramExercisePayload = {
  program_id: string;
  exercise_id: string;
};

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const payload: UserProgramFormValues = await request.json();
  const newProgram: PostProgramPayload = {
    name: payload.name,
    description: payload.description,
    public: payload.isPublic,
  }
  const supabase = createRouteHandlerClient({cookies});
  const {data: userData, error: userError} = await supabase.auth.getSession();

  if (isNil(userData.session) || !isNil(userError)) {
    return NextResponse.json({error: userError?.message ?? 'Error fetching user'}, {status: 401});
  }

  const {data: programData, error: programError} = await supabase
    .from(programsTable)
    .insert({
      ...newProgram,
      user_id: userData.session.user.id,
    })
    .select('id')
    .single() as PostgrestSingleResponse<{id: string}>;

  if (isNil(programData) || !isNil(programError)) {
    return NextResponse.json({error: programError?.message}, {status: 500});
  }

  const newProgramExercises: PostPorgramExercisePayload[] = payload.programExercises.map((id) => ({
    program_id: programData.id,
    exercise_id: id,
  }));
  console.log('PROGRAM DATA', programData);
  console.log('PAYLOAD', payload);
  console.log('NEW PROGRAM EXERCISES', newProgramExercises);

  const {error} = await supabase
    .from(programsExercisesTable)
    .insert(newProgramExercises);

  if (!isNil(error)) {
    console.log('Error creating program exercises')
    return NextResponse.json({error: error?.message}, {status: 500});
  }

  return NextResponse.json({success: true}, {status: 201});
};

export type {
  PostProgramPayload,
  PostPorgramExercisePayload,
}