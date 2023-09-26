import {createServerComponentClient} from '@supabase/auth-helpers-nextjs';
import {cookies} from 'next/headers';
import Link from 'next/link';
import {LogoutButton} from '@app/components';

export const dynamic = 'force-dynamic';

export default async function Index() {
  const supabase = createServerComponentClient({cookies});

  const {
    data: {user},
  } = await supabase.auth.getUser();

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-white">Hello world!</h1>
    </div>
  );
}
