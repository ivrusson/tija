import Link from "next/link";

import Icon from '~/svg/tija-icon.svg';

export const MadeWithTija: React.FC = () => (
  <Link
      href='https://ivrusson.notion.site/Tija-38ca18ea7c16439fab623b3349171fd1'
      className='flex items-center justify-center gap-1 rounded-md bg-gray-900 py-1 px-2 text-sm text-white no-underline box-shadow-md max-w-[200px]'
    >
      <Icon className='h-4 w-4 mr-1 bg-gray-800 rounded-sm opacity-100' />
      <div>Made with</div>
      <div className='text-purple-500'>Tija</div>
    </Link>
)