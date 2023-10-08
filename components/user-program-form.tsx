'use client';

import {ExerciseOptionDTO} from '@app/app/api/dashboard/route';
import {useForm} from 'react-hook-form';
import Button from './button';
import {isNil} from 'remeda';

type UserProgramFormProperties = {
  isLoading: boolean;
  exercises: ExerciseOptionDTO[];
  defaultValues?: UserProgramFormValues;
  submitLabel: string;
  onSubmit: (data: UserProgramFormValues) => void;
  onDelete: () => void;
};

type UserProgramFormValues = {
  id?: string;
  name: string;
  description: string;
  programExercises: string[];
  isPublic: boolean;
};

const UserProgramForm = ({
  isLoading,
  exercises,
  defaultValues,
  submitLabel,
  onSubmit,
  onDelete,
}: UserProgramFormProperties): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<UserProgramFormValues>({
    defaultValues,
  });

  return (
    <form className="p-4" onSubmit={handleSubmit(onSubmit)}>
      <h2>User Program Form</h2>
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="name"
            placeholder="Name"
            {...register('name', {required: true})}
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Description"
            {...register('description')}
          />
          {errors.description && <p>{errors.description.message}</p>}
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="programExercises">Select Exercises</label>
          <select
            multiple
            id="programExercises"
            {...register('programExercises', {required: true})}
          >
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
          {errors.programExercises && <p>{errors.programExercises.message}</p>}
        </div>
        <div className="space-x-2">
          <input id="isPublic" type="checkbox" {...register('isPublic')} />
          <label htmlFor="isPublic">Public</label>
          {errors.isPublic && <p>{errors.isPublic.message}</p>}
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

export default UserProgramForm;

export type {
  UserProgramFormProperties as UserProgramFormProps,
  UserProgramFormValues,
};
