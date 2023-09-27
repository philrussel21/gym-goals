import { formatToSlug } from "@app/library/helpers";
import { DifficultyType, ExerciseType, MuscleGroupType } from "@app/library/types";
import { NextResponse } from "next/server";

type ExerciseCardQuery = {
  name: string;
  type: ExerciseType;
  muscle: MuscleGroupType;
  equipment: string;
  difficulty: DifficultyType;
}

type ExerciseCardDTO = {
  id: string;
  name: string;
  type: ExerciseType;
  muscle: MuscleGroupType;
  equipment: string;
  difficulty: DifficultyType;
}

export const GET = async (): Promise<NextResponse> => {
  const response = await fetch(`${process.env.BASE_API_URL}`, {
    headers: {
      'X-Api-Key': process.env.API_KEY ?? '',
    }
  });
  const data:ExerciseCardQuery[] = await response.json();
  const dto: ExerciseCardDTO[] = data.map((exercise) => ({
    id: formatToSlug(exercise.name),
    ...exercise,
  }));
  return NextResponse.json(dto, {status: 200});
}

export type {
  ExerciseCardQuery,
  ExerciseCardDTO,
}