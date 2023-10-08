'use client';

import {ExerciseOptionDTO, UserProgramDTO} from '@app/app/api/dashboard/route';
import Button from './button';
import {isArray, isEmpty, isNil} from 'remeda';
import {Dialog} from '@headlessui/react';
import UserProgramForm, {UserProgramFormValues} from './user-program-form';
import {useRouter} from 'next/navigation';
import {useCallback, useState} from 'react';

type UserProgramListProperties = {
  userPrograms: UserProgramDTO[];
  exercises: ExerciseOptionDTO[];
};

type FormVariant = 'add' | 'update';

type State = {
  isFormShowing: boolean;
  isFormLoading: boolean;
  formDefaultValues?: UserProgramFormValues & {id: string};
  formVariant: FormVariant;
};

const initialState: State = {
  isFormShowing: false,
  isFormLoading: false,
  formDefaultValues: undefined,
  formVariant: 'add',
};

const UserProgramList = ({
  userPrograms,
  exercises,
}: UserProgramListProperties): JSX.Element => {
  const [state, setState] = useState<State>(initialState);
  const router = useRouter();

  const addProgram = useCallback(async (payload: UserProgramFormValues) => {
    return await fetch('/api/user-program', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }, []);

  const handleAddClick = useCallback(() => {
    setState((current) => ({
      ...current,
      isFormShowing: true,
      formDefaultValues: undefined,
      formVariant: 'add',
    }));
  }, []);

  const handleEditClick = useCallback(() => {
    // TODO: implement
  }, []);

  const handleSubmit = useCallback(
    async (data: UserProgramFormValues) => {
      setState((current) => ({...current, isFormLoading: true}));
      try {
        let response;
        if (state.formVariant === 'add') {
          response = await addProgram(data);
        } else {
          // TODO: impelement update
          response = await addProgram(data);
        }
        if (!response.ok && isNil(data)) {
          throw new Error('Error creating new program');
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

  const handleModalClose = useCallback(() => {
    setState(initialState);
  }, []);

  const handleDelete = useCallback(() => {
    // TODO: implement
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3>User Programs</h3>
        <Button label="Add program" onClick={handleAddClick} />
      </div>
      <div className="mt-4 space-y-4">
        {isArray(userPrograms) &&
          !isEmpty(userPrograms) &&
          userPrograms.map((program) => (
            <div key={program.id} className="bg-gray-300 text-black p-4">
              <h4>{program.name}</h4>
              <p>description: {program.description}</p>
              <p>isPublic: {program.isPublic.toString()}</p>
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
        {!isArray(userPrograms) ||
          (isEmpty(userPrograms) && <p>No programs found</p>)}
      </div>
      <Dialog
        open={state.isFormShowing}
        onClose={handleModalClose}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-gray-100">
            <div className="flex justify-between items-center">
              <Dialog.Title>
                {`${state.formVariant === 'add' ? 'Add' : 'Update'} Program`}
              </Dialog.Title>
              <Button label="Close" onClick={handleModalClose} />
            </div>
            <div className="mt-4">
              <UserProgramForm
                isLoading={state.isFormLoading}
                exercises={exercises}
                defaultValues={state.formDefaultValues}
                submitLabel={state.formVariant === 'add' ? 'Add' : 'Update'}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
              />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default UserProgramList;

export type {UserProgramListProperties as UserProgramListProps};
