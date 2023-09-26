import {Fragment} from 'react';
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import {Header} from '@app/components';
import {redirect} from 'next/navigation';

type AuthLayoutProperties = {
  children: React.ReactNode;
};

const AuthLayout = async ({
  children,
}: AuthLayoutProperties): Promise<JSX.Element> => {
  const supabase = createServerComponentClient({cookies});

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (user !== null) {
    return redirect('/');
  }

  return <Fragment>{children}</Fragment>;
};

export default AuthLayout;

export type {AuthLayoutProperties as DashboardLayoutProps};
