import {UserProgramDTO} from '@app/app/api/dashboard/route';
import Button from './button';
import {isArray} from 'remeda';

type UserProgramListProperties = {
  userPrograms: UserProgramDTO[];
};

const UserProgramList = ({
  userPrograms,
}: UserProgramListProperties): JSX.Element => (
  <div>
    <div className="flex justify-between items-center">
      <h3>User Programs</h3>
      <Button label="Add program" />
    </div>
    <div className="mt-4 space-y-4">
      {isArray(userPrograms) &&
        userPrograms.map((program) => (
          <div key={program.id} className="bg-gray-300 text-black p-4">
            <h4>{program.name}</h4>
            <p>description: {program.description}</p>
            <div className="mt-4 space-y-4">
              {isArray(program.programExercises) &&
                program.programExercises.map((programExercise) => (
                  <div
                    key={programExercise.id}
                    className="bg-gray-600 text-black p-4"
                  >
                    <p>exercise: {programExercise.exercise.name}</p>
                    <p>muscle: {programExercise.exercise.muscle}</p>
                    <p>type: {programExercise.exercise.type}</p>
                    <p>difficulty: {programExercise.exercise.difficulty}</p>
                    <p>equipment: {programExercise.exercise.equipment}</p>
                  </div>
                ))}
            </div>
            <div className="mt-4">
              <Button label="Edit" />
            </div>
          </div>
        ))}
      {!isArray(userPrograms) && <p>No programs found</p>}
    </div>
  </div>
);

export default UserProgramList;

export type {UserProgramListProperties as UserProgramListProps};
