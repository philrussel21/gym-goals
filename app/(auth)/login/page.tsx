import {AuthForm} from '@app/components';
import Link from 'next/link';

const Login = () => {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
      <div className="flex flex-col gap-y-4">
        <AuthForm variant="login" />
        <p className="text-white text-center">
          <span>Don't have an account? </span>
          <Link href="/sign-up">
            <span className="underline">Register</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
