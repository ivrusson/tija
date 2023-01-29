import Image from 'next/image';

import { MadeWithTija } from '@/components/MadeWithTija';

import ivrusson from '~/images/ivrusson.png';

interface Props {
  children?: React.ReactNode;
}

const Footer: React.FC<Props> = () => {
  return (
    <footer className='my-2 w-full'>
      <div className='container py-4'>
        <div className='my-2 flex items-center justify-center'>
          <MadeWithTija />
        </div>
        <div className='flex items-center justify-center'>
          <div className='text-xs text-white'>
            Proudly created by{' '}
            <a
              href='https://github.com/ivrusson'
              target='_blank'
              className='gap-1 text-white'
              rel='noreferrer'
            >
              <Image
                src={ivrusson}
                alt='@ivrusson'
                width='0'
                height='0'
                sizes='100vw'
                className='mx-1 overflow-hidden rounded-full'
                style={{ width: 18, height: 'auto' }}
              />
              ivrusson
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
