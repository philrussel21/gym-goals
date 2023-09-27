import {AuthForm} from '@app/components';
import {routes} from '@app/config/routes';
import Link from 'next/link';

const SignUp = () => {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
      <div className="flex flex-col gap-y-4">
        <AuthForm variant="register" />
        <p className="text-white text-center">
          <span>Already have an account? </span>
          <Link href={routes.login}>
            <span className="underline">Sign in</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
