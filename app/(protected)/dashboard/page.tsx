import {DashboardDTO} from '@app/app/api/dashboard/route';
import UserExerciseList from '@app/components/user-exercise-list';
import {headers} from 'next/headers';
import {notFound} from 'next/navigation';

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
        <UserExerciseList
          userExercises={data.userExercises}
          exercises={data.exercises}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
