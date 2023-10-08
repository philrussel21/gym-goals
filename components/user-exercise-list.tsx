'use client';

import {ExerciseDTO, UserExerciseDTO} from '@app/app/api/dashboard/route';
import {isArray, isNil} from 'remeda';
import Button from './button';
import UserExerciseForm, {UserExerciseFormValues} from './user-exercise-form';
import {Dialog} from '@headlessui/react';
import {useCallback, useState} from 'react';
import {
  PostUserExercisePayload,
  PutUserExercisePayload,
} from '@app/app/api/user-exercise/route';
import {useRouter} from 'next/navigation';

type UserExerciseListProperties = {
  userExercises: UserExerciseDTO[];
  exercises: ExerciseDTO[];
};

type FormVariant = 'add' | 'update';

type State = {
  isFormShowing: boolean;
  isFormLoading: boolean;
  formDefaultValues?: UserExerciseFormValues & {id: string};
  formVariant: FormVariant;
};

const initialState: State = {
  isFormShowing: false,
  isFormLoading: false,
  formDefaultValues: undefined,
  formVariant: 'add',
};

const UserExerciseList = ({
  userExercises,
  exercises,
}: UserExerciseListProperties): JSX.Element => {
  const [state, setState] = useState<State>(initialState);
  const router = useRouter();

  const handleAddClick = useCallback(() => {
    setState((current) => ({
      ...current,
      isFormShowing: true,
      formDefaultValues: undefined,
      formVariant: 'add',
    }));
  }, []);

  const handleEditClick = useCallback(
    (userExercise: UserExerciseDTO) => () => {
      setState((current) => ({
        ...current,
        isFormShowing: true,
        formDefaultValues: {
          id: userExercise.id,
          exerciseId: userExercise.exercise.id,
          date: userExercise.date,
          repetitions: userExercise.repetitions ?? 0,
          sets: userExercise.sets ?? 0,
          weight: userExercise.weight ?? 0,
          distance: userExercise.distance ?? 0,
        },
        formVariant: 'update',
      }));
    },
    []
  );

  const handleModalClose = useCallback(() => {
    setState(initialState);
  }, []);

  const addExercise = useCallback(async (payload: PostUserExercisePayload) => {
    return await fetch('/api/user-exercise', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }, []);

  const updateExercise = useCallback(
    async (payload: PutUserExercisePayload) => {
      return await fetch('/api/user-exercise', {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    []
  );

  const handleSubmit = useCallback(
    async (data: UserExerciseFormValues) => {
      setState((current) => ({...current, isFormLoading: true}));
      const payload = {
        ...data,
        repetitions: isNaN(data.repetitions) ? 0 : data.repetitions,
        sets: isNaN(data.sets) ? 0 : data.sets,
        weight: isNaN(data.weight) ? 0 : data.weight,
        distance: isNaN(data.distance) ? 0 : data.distance,
        exercise_id: data.exerciseId,
      };
      try {
        let response;
        if (state.formVariant === 'add') {
          response = await addExercise(payload);
        } else {
          const updatePayload = {
            ...payload,
            id: state.formDefaultValues?.id ?? '',
          };
          response = await updateExercise(updatePayload);
        }
        if (!response.ok && data === null) {
          throw new Error('Error creating new user exercise');
        }
        router.refresh();
        setState((current) => ({...current, isFormShowing: false}));
      } catch (error) {
        console.log(error);
      } finally {
        setState((current) => ({...current, isFormLoading: false}));
      }
    },
    [state.formVariant, state.formDefaultValues]
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2>User Exercises</h2>
        <Button label="Add exercise" onClick={handleAddClick} />
      </div>
      <div className="mt-4 space-y-4">
        {isArray(userExercises) &&
          userExercises.map((exercise) => (
            <div key={exercise.id} className="bg-gray-300 text-black p-4">
              <h3>{exercise.exercise.name}</h3>
              <p>difficulty: {exercise.exercise.difficulty}</p>
              <p>muscle: {exercise.exercise.muscle}</p>
              <p>type: {exercise.exercise.type}</p>
              <p>date: {exercise.date}</p>
              {!isNil(exercise.weight) && <p>weight: {exercise.weight}</p>}
              {!isNil(exercise.repetitions) && (
                <p>reps: {exercise.repetitions}</p>
              )}
              {!isNil(exercise.sets) && <p>sets: {exercise.sets}</p>}
              {!isNil(exercise.distance) && (
                <p>duration: {exercise.distance}</p>
              )}
              <div className="flex space-x-4 mt-4">
                <Button label="Edit" onClick={handleEditClick(exercise)} />
                <Button label="Delete" />
              </div>
            </div>
          ))}
        {!isArray(userExercises) && <p>No exercises found</p>}
      </div>
      <Dialog
        open={state.isFormShowing}
        onClose={handleModalClose}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white">
            <div className="flex justify-between items-center">
              <Dialog.Title>Complete your order</Dialog.Title>
              <Button label="Close" onClick={handleModalClose} />
            </div>
            <div className="mt-4">
              <UserExerciseForm
                isLoading={state.isFormLoading}
                exercises={exercises}
                defaultValues={state.formDefaultValues}
                submitLabel={state.formVariant === 'add' ? 'Add' : 'Update'}
                onSubmit={handleSubmit}
              />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default UserExerciseList;

export type {UserExerciseListProperties as UserExerciseListProps};
