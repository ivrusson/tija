import Link from 'next/link';
import Image from 'next/image';

import useTheme from '@/hooks/useTheme';

import Logo from '~/svg/tija-logo.svg';

export default function Header() {
  const theme = useTheme();

  return (
    <header className='mt-auto w-full'>
      <div className='layout flex items-center justify-center'>
        <div className='mb-2'>
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
