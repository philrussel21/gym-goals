'use client';

import {ExerciseDTO} from '@app/app/api/dashboard/route';
import {useForm} from 'react-hook-form';
import Button from './button';
import {isNil} from 'remeda';

type UserExerciseFormProperties = {
  isLoading: boolean;
  exercises: ExerciseDTO[];
  defaultValues?: UserExerciseFormValues;
  submitLabel: string;
  onSubmit: (data: UserExerciseFormValues) => void;
  onDelete: () => void;
};

type UserExerciseFormValues = {
  id?: string;
  exerciseId: string;
  date: string;
  repetitions: number;
  sets: number;
  weight: number;
  distance: number;
};

const UserExerciseForm = ({
  isLoading,
  exercises,
  defaultValues,
  submitLabel,
  onSubmit,
  onDelete,
}: UserExerciseFormProperties): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<UserExerciseFormValues>({
    defaultValues,
  });

  return (
    <form className="p-4 bg-white text-black" onSubmit={handleSubmit(onSubmit)}>
      <h2>User Exercise Form</h2>
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="exerciseId">Exercise</label>
          <select id="exerciseId" {...register('exerciseId', {required: true})}>
            <option value="">Select an exercise</option>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
          {errors.exerciseId && <p>{errors.exerciseId.message}</p>}
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            {...register('date', {required: true})}
          />
          {errors.date && <p>{errors.date.message}</p>}
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="repetitions">Repetitions</label>
          <input
            id="repetitions"
            type="number"
            placeholder="Reps"
            {...register('repetitions', {valueAsNumber: true})}
          />
          {errors.repetitions && <p>{errors.repetitions.message}</p>}
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="sets">Sets</label>
          <input
            id="sets"
            type="number"
            placeholder="Sets"
            {...register('sets', {valueAsNumber: true})}
          />
          {errors.sets && <p>{errors.sets.message}</p>}
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="weight">Weight (kg)</label>
          <input
            id="weight"
            type="number"
            placeholder="Weight"
            {...register('weight', {valueAsNumber: true})}
          />
          {errors.weight && <p>{errors.weight.message}</p>}
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="distance">Distance (km)</label>
          <input
            id="distance"
            type="number"
            placeholder="Distance"
            {...register('distance', {valueAsNumber: true})}
          />
          {errors.distance && <p>{errors.distance.message}</p>}
        </div>
        <div className="flex space-x-4 mt-4">
          <Button type="submit" label={submitLabel} disabled={isLoading} />
          {!isNil(defaultValues?.id) && (
            <Button
              label="Delete"
              type="button"
              disabled={isLoading}
              onClick={onDelete}
            />
          )}
        </div>
      </div>
    </form>
  );
};

export default UserExerciseForm;

export type {
  UserExerciseFormProperties as UserExerciseFormProps,
  UserExerciseFormValues,
};
