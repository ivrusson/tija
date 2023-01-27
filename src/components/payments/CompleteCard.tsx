import { Button } from 'antd';
import { FiExternalLink } from 'react-icons/fi';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  session: any;
  invoice: any;
}

const CompletedCard: React.FC<Props> = ({ invoice }) => {
  return (
    <div className='completed-payment-card'>
      <div className='bodergray-200 rounded-lg border bg-white p-4 shadow-lg'>
        <div className='grid grid-cols-12 gap-2'>
          <div className='col-span-12'>
            <div className='flex min-h-[320px] place-items-center'>
              <div className='w-full text-center'>
                <h2>👌 Payment completed successfully!</h2>
                <p>Check your invoice in the following button:</p>
                <Button
                  onClick={() =>
                    window.open(invoice.hosted_invoice_url, '_blank')
                  }
                >
                  <div className='flex items-center justify-center gap-2'>
                    <div>Check your invoice</div>
                    <FiExternalLink className='h-4 w-4' />
                  </div>
                </Button>
              </div>
            </div>
          </div>
          <div className='col-span-12'></div>
        </div>
      </div>
    </div>
  );
};

export default CompletedCard;
