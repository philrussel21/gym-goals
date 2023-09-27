import {ExerciseCard} from '@app/components';
import {ExerciseCardDTO} from '../api/exercises/route';

export const dynamic = 'force-dynamic';

const getData = async () => {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/exercises`);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const Index = async () => {
  const exercises: ExerciseCardDTO[] = await getData();
  return (
    <div className="w-full flex flex-col items-center container">
      <div className="grid gap-4 mt-6">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            name={exercise.name}
            type={exercise.type}
            muscle={exercise.muscle}
            equipment={exercise.equipment}
            difficulty={exercise.difficulty}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
