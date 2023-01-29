import Image from 'next/image';
import Link from 'next/link';

import useTheme from '@/hooks/useTheme';

import Logo from '~/svg/tija-logo.svg';

export default function Header() {
  const theme = useTheme();

  return (
    <header className='my-2 w-full'>
      <div className='flex items-center justify-center'>
        <div className='my-2'>
          <Link href='/'>
            {theme?.logo && theme.logo.includes('https://') ? (
              <Image
                src={theme.logo}
                alt='logo'
                width='0'
                height='0'
                sizes='100vw'
                style={{ width: 150, height: 'auto' }}
              />
            ) : (
              <Logo className='h-12 w-12 opacity-100' />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
