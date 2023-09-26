import {LogoutButton} from '@app/components';
import {LinkType} from '@app/library/types';
import {User} from '@supabase/supabase-js';
import Link from 'next/link';

type HeaderProperties = {
  user: User;
};

const Header = ({user}: HeaderProperties): JSX.Element => (
  <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
    <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            Hey, {user.email}!
            <LogoutButton />
          </div>
        ) : (
          <Link
            href="/login"
            className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  </nav>
);

export default Header;

export type {HeaderProperties as HeaderProps};
