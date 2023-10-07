import {DashboardDTO} from '@app/app/api/dashboard/route';
import {headers} from 'next/headers';
import {notFound} from 'next/navigation';
import {isArray, isNil} from 'remeda';

const getData = async (): Promise<DashboardDTO | null> => {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/dashboard`, {
      headers: headers(),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};

const DashboardPage = async () => {
  const data = await getData();
  if (data === null) {
    return notFound();
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="mt-4">
        <h2>User Exercises</h2>
        <div className="mt-4">
          {isArray(data.userExercises) &&
            data.userExercises.map((exercise) => (
              <div key={exercise.id}>
                <h3>{exercise.exercise.name}</h3>
                <p>type: {exercise.exercise.difficulty}</p>
                <p>muscle: {exercise.exercise.muscle}</p>
                <p>equipment: {exercise.exercise.type}</p>
                <p>date: {exercise.date}</p>
                {!isNil(exercise.weight) && <p>weight: {exercise.weight}</p>}
                {!isNil(exercise.repetitions) && (
                  <p>reps: {exercise.repetitions}</p>
                )}
                {!isNil(exercise.sets) && <p>sets: {exercise.sets}</p>}
                {!isNil(exercise.distance) && (
                  <p>duration: {exercise.distance}</p>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
