interface Props {}

const Footer: React.FC<Props> = () => {
  return (
    <div className='flex w-full items-center justify-center gap-2'>
      <div className='text-sm text-white'>
        <a className='text-yellow-600' href='https://github.com/ivrusson'>
          Tija
        </a>{' '}
        project.
      </div>
      <div className='text-xs text-white'>
        Created by{' '}
        <a className='text-yellow-600' href='https://github.com/ivrusson'>
          @ivrusson
        </a>
      </div>
    </div>
  );
};

export default Footer;
