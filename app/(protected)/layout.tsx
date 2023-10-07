import {Fragment} from 'react';
import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import {Header} from '@app/components';
import {redirect} from 'next/navigation';
import {routes} from '@app/config/routes';

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

  if (user === null) {
    return redirect(routes.login);
  }

  return (
    <Fragment>
      <Header user={user} />
      <div className="container">{children}</div>
    </Fragment>
  );
};

export default AuthLayout;

export type {AuthLayoutProperties as DashboardLayoutProps};
