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

type PostProgramExercisePayload = {
  program_id: string;
  exercise_id: string;
};

type PutUserProgramPayload = PostProgramPayload & {id: string};

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

  const newProgramExercises: PostProgramExercisePayload[] = payload.programExercises.map((id) => ({
    program_id: programData.id,
    exercise_id: id,
  }));

  const {error} = await supabase
    .from(programsExercisesTable)
    .insert(newProgramExercises);

  if (!isNil(error)) {
    console.log('Error creating program exercises')
    return NextResponse.json({error: error?.message}, {status: 500});
  }

  return NextResponse.json({success: true}, {status: 201});
};

export const PUT = async (request: NextRequest): Promise<NextResponse> => {
  const payload: UserProgramFormValues = await request.json();
  if (isNil(payload.id)) {
    return NextResponse.json({error: 'Missing id'}, {status: 400});
  }
  const updatedProgram: PutUserProgramPayload = {
    id: payload.id,
    name: payload.name,
    description: payload.description,
    public: payload.isPublic,
  }
  const supabase = createRouteHandlerClient({cookies});
  const {data: userData, error: userError} = await supabase.auth.getSession();

  if (isNil(userData.session) || !isNil(userError)) {
    return NextResponse.json({error: userError?.message ?? 'Error fetching user'}, {status: 401});
  }

  const {error: programError} = await supabase
    .from(programsTable)
    .update({
      ...updatedProgram,
      user_id: userData.session.user.id,
    })
    .eq('id', updatedProgram.id);

  if (!isNil(programError)) {
    console.log('Error updating program')
    return NextResponse.json({error: programError?.message}, {status: 500});
  }

  const updatedProgramExercises: PostProgramExercisePayload[] = payload.programExercises.map((id) => ({
    program_id: updatedProgram.id,
    exercise_id: id,
  }));

  const {error: deleteError} = await supabase
    .from(programsExercisesTable)
    .delete()
    .eq('program_id', payload.id);
  
  if (!isNil(deleteError)) {
    console.log('Error deleting old program exercises')
    return NextResponse.json({error: deleteError?.message}, {status: 500});
  }

  const {error} = await supabase
    .from(programsExercisesTable)
    .insert(updatedProgramExercises)

  if (!isNil(error)) {
    console.log('Error updating program exercises')
    return NextResponse.json({error: error?.message}, {status: 500});
  }

  return NextResponse.json({success: true}, {status: 200});
};

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
    .from(programsTable)
    .delete()
    .eq('id', payload.id);

  if (!isNil(error)) {
    return NextResponse.json({data, error: error?.message}, {status: 500});
  }

  return NextResponse.json({success: true}, {status: 200});
}



export type {
  PostProgramPayload,
  PostProgramExercisePayload,
}