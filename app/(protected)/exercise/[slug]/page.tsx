import {ExerciseDTO} from '@app/app/api/exercises/[slug]/route';
import {Params} from '@app/library/types';
import Link from 'next/link';
import {notFound} from 'next/navigation';

const getData = async (slug: string) => {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/exercises/${slug}`
    );
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

type ExerciseDetailsPageProps = {
  params: Params;
};

const ExerciseDetailsPage = async ({
  params: {slug},
}: ExerciseDetailsPageProps) => {
  const exercise: ExerciseDTO = await getData(slug);

  if (exercise === null) {
    return notFound();
  }

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-6">{exercise.name}</h1>
      <p>type: {exercise.type}</p>
      <p>muscle: {exercise.muscle}</p>
      <p>equipment: {exercise.equipment}</p>
      <p>difficulty: {exercise.difficulty}</p>
      <p>instructions: {exercise.instructions}</p>
      <Link href="/">Back to exercises</Link>
    </div>
  );
};

export default ExerciseDetailsPage;
