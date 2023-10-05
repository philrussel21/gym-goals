import { formatToName } from "@app/library/helpers";
import { DifficultyType, ExerciseType, MuscleGroupType, Params } from "@app/library/types";
import { NextRequest, NextResponse } from "next/server";

type ExerciseQuery = {
  name: string;
  type: ExerciseType;
  muscle: MuscleGroupType;
  equipment: string;
  difficulty: DifficultyType;
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
  const name = formatToName(params.slug);
  const response = await fetch(`${process.env.BASE_API_URL}?name=${name}`, {
    headers: {
      'X-Api-Key': process.env.API_KEY ?? '',
    }
  });

  if (!response.ok) {
    return NextResponse.json('Cannot find exercise', {status: 404});
  }

  const data: ExerciseQuery[] = await response.json();
  const dto: ExerciseDTO | null = data.length > 1 ? data[0] : null;

  return NextResponse.json(dto, {status: 200});
}

export type {
  ExerciseQuery,
  ExerciseDTO,
};