'use client';

import {createClientComponentClient} from '@supabase/auth-helpers-nextjs';
import {useRouter} from 'next/navigation';
import {useCallback} from 'react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    const supabase = createClientComponentClient();
    const {error} = await supabase.auth.signOut();

    if (error !== null) {
      console.error(error);
    } else {
      router.push('/login');
    }
  }, [router]);
  return (
    <button
      className="py-2 px-4 rounded-md no-underline bg-gray-800 hover:bg-gray-600"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
