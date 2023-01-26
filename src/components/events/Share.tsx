/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input, InputRef, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { FiCopy, FiLink, FiShare2, FiX } from 'react-icons/fi';

import { EventInfo } from '@/components/events/EventInfo';

interface Props {
  event: any;
}

const Share: React.FC<Props> = ({ event }) => {
  const [eventUrl, setEventUrl] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<InputRef | null>(null);

  useEffect(() => {
    if (typeof window !== undefined) {
      setEventUrl(window.location.href);
    }
  }, []);

  const handleCancel = () => {
    setOpen(false);
  };

  const copyToClipboard = () => {
    const textInput = inputRef?.current;
    if (textInput) {
      textInput.select();
      document.execCommand('copy');
      textInput.focus();
      setCopied(true);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title={<h3>Share this event</h3>}
        closeIcon={<FiX className='h-8 w-8 text-gray-500' />}
        footer={[
          <Button key='back' onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        <div className='py-4'>
          <EventInfo event={event} />
          <Input.Group compact>
            <Input
              ref={inputRef}
              style={{ width: 'calc(100% - 150px)' }}
              prefix={<FiLink className='text-gray-300' />}
              value={eventUrl}
              readOnly={true}
              size='large'
            />
            <Button size='large' onClick={() => copyToClipboard()}>
              <div className='flex items-center justify-center gap-2'>
                <div>{copied ? 'Copied!' : 'Copy'}</div>
                <FiCopy className='h-4 w-4' />
              </div>
            </Button>
          </Input.Group>
        </div>
      </Modal>
      <Button type='default' onClick={() => setOpen(true)}>
        <div className='flex items-center justify-center gap-2'>
          <div>Share</div>
          <FiShare2 className='h-4 w-4' />
        </div>
      </Button>
    </>
  );
};

export default Share;
