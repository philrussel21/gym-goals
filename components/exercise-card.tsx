import {
  DifficultyType,
  ExerciseType,
  MuscleGroupType,
} from '@app/library/types';

type ExerciseCardProperties = {
  name: string;
  type: ExerciseType;
  muscle: MuscleGroupType;
  equipment: string;
  difficulty: DifficultyType;
};

const ExerciseCard = ({
  name,
  type,
  muscle,
  equipment,
  difficulty,
}: ExerciseCardProperties): JSX.Element => (
  <section className="bg-gray-300 p-4 rounded-md">
    <h3 className="text-2xl font-bold">{name}</h3>
    <p className="text-lg font-semibold">{type}</p>
    <p className="text-lg font-semibold">{muscle}</p>
    <p className="text-lg font-semibold">{equipment}</p>
    <p className="text-lg font-semibold">{difficulty}</p>
  </section>
);

export default ExerciseCard;

export type {ExerciseCardProperties as ExerciseCardProps};
