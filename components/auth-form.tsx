'use client';

import routes from '@app/config/routes';
import {createClientComponentClient} from '@supabase/auth-helpers-nextjs';
import {useRouter} from 'next/navigation';
import {useCallback, useState} from 'react';

type AuthFormProperties = {
  variant: 'login' | 'register';
};

type FormState = {
  email: string;
  password: string;
};

type State = {
  isLoading: boolean;
  error?: string;
};

const initialFormState: FormState = {
  email: '',
  password: '',
};

const initialState: State = {
  isLoading: false,
};

const AuthForm = ({variant}: AuthFormProperties): JSX.Element => {
  const [formState, setFormState] = useState(initialFormState);
  const [state, setState] = useState(initialState);
  const router = useRouter();

  const handleLogin = useCallback(async ({email, password}: FormState) => {
    setState((current) => ({...current, isLoading: true}));
    try {
      const supabase = createClientComponentClient();
      const {error} = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error !== null) {
        throw new Error(error.message);
      }

      router.refresh();
      router.push(routes.home);
    } catch (error) {
      const {message: errorMessage} = error as {message: string};
      setState((current) => ({
        ...current,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const handleRegister = useCallback(async ({email, password}: FormState) => {
    setState((current) => ({...current, isLoading: true}));
    try {
      const supabase = createClientComponentClient();
      const {error} = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error !== null) {
        throw new Error(error.message);
      }

      router.refresh();
      router.push(routes.home);
    } catch (error) {
      const {message: errorMessage} = error as {message: string};
      setState((current) => ({
        ...current,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (variant === 'login') {
        handleLogin(formState);
      } else {
        handleRegister(formState);
      }
    },
    [formState]
  );

  const handleInputChange = useCallback(
    (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((current) => ({
        ...current,
        [name]: event.target.value,
      }));
    },
    []
  );

  return (
    <form
      className="flex-1 flex flex-col w-full justify-center gap-2 text-white"
      onSubmit={handleSubmit}
    >
      {state.error !== undefined && (
        <p className="p-6 rounded-md bg-red-400">{state.error}</p>
      )}
      <label className="text-md" htmlFor="email">
        Email
      </label>
      <input
        className="rounded-md px-4 py-2 bg-inherit border mb-6"
        name="email"
        placeholder="you@example.com"
        required
        onChange={handleInputChange('email')}
      />
      <label className="text-md" htmlFor="password">
        Password
      </label>
      <input
        className="rounded-md px-4 py-2 bg-inherit border mb-6"
        type="password"
        name="password"
        placeholder="••••••••"
        required
        onChange={handleInputChange('password')}
      />
      <button
        disabled={state.isLoading}
        className="bg-green-700 rounded px-4 py-2 text-white disabled:opacity-30"
      >
        {variant === 'login' ? 'Login' : 'Register'}
      </button>
    </form>
  );
};

export default AuthForm;

export type {AuthFormProperties as AuthFormProps, FormState};
