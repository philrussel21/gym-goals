import {ExerciseCard} from '@app/components';
import {ExerciseCardDTO} from '../api/exercises/route';
import Link from 'next/link';
import {headers} from 'next/headers';

export const dynamic = 'force-dynamic';

const getData = async () => {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/exercises`, {
      headers: headers(),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const Index = async () => {
  const exercises: ExerciseCardDTO[] = await getData();
  return (
    <div className="w-full flex flex-col items-center">
      <div className="grid gap-4 mt-6">
        {exercises.map((exercise) => (
          <Link href={`/exercise/${exercise.slug}`} key={exercise.slug}>
            <ExerciseCard
              name={exercise.name}
              type={exercise.type}
              muscle={exercise.muscle}
              equipment={exercise.equipment}
              difficulty={exercise.difficulty}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Index;
