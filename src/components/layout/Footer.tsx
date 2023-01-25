import Link from 'next/link';

import Logo from '~/tija-logo.svg';

interface Props {
  children?: React.ReactNode;
}

const Footer: React.FC<Props> = () => {
  return (
    <footer className='absolute bottom-0 left-0 w-full'>
      <div className='container py-4'>
        <div className='layout flex items-center justify-center'>
          <Link href='/'>
            <Logo className='h-12 w-12 opacity-50' />
          </Link>
        </div>
        <div className='layout mb-2 flex items-center justify-center'>
          <Link
            href='https://ivrusson.notion.site/Tija-38ca18ea7c16439fab623b3349171fd1'
            className='flex items-center justify-center gap-1 rounded-md bg-gray-900 py-1 px-2 text-sm text-white no-underline'
          >
            <div>Ceated with</div>
            <div className='text-purple-600'>Tija</div>
          </Link>
        </div>
        <div className='layout flex items-center justify-center'>
          <div className='text-xs text-white'>
            Proudly made by{' '}
            <a className='text-white' href='https://github.com/ivrusson'>
              @ivrusson
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
