/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transition } from '@headlessui/react';
import { Button, Form, Input, Select } from 'antd';
import dayjs from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import { useEffect, useState } from 'react';

import { createBooking } from '@/lib/api';
import { getDialCodes } from '@/lib/countries';
import { dateToUtc } from '@/lib/helper';

import { EventInfo } from '@/components/events/EventInfo';
import Share from '@/components/events/Share';
import { containsProduct, getFromNumber } from '@/components/events/utils';

dayjs.extend(dayLocaleData);
interface Props {
  csrfToken: string;
  event: any;
  data: any;
  onSubmit: (data: any) => void;
  onStep: (step: string) => void;
}

const dialCodes = getDialCodes();

const CustomerStep = ({ csrfToken, event, data, onSubmit, onStep }: Props) => {
  const [show, setShow] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setShow(true);
  }, []);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    const product = event.properties.Product;
    const bookingData = {
      ...data,
      ...values,
      eventId: data.eventId,
      startDate: dateToUtc(data.currentTime),
      endDate: dateToUtc(
        data.currentTime
          .clone()
          .add(getFromNumber(event.properties.Duration), 'm')
      ),
      product: containsProduct(product)
        ? {
            id: product.id,
            quantity: 1,
          }
        : null,
    };

    const booking = await createBooking(bookingData, { csrfToken });

    if (booking) {
      onSubmit({
        ...values,
        booking,
      });
    }

    setSubmitting(false);
  };

  const phoneDialSelector = (
    <Form.Item
      name='prefix'
      noStyle
      rules={[
        {
          required: true,
          message: 'Please select a prefix!',
        },
      ]}
    >
      <Select
        showSearch
        placeholder='+34'
        style={{ width: 80 }}
        disabled={submitting}
      >
        {dialCodes.map((code: number) => (
          <Select.Option key={code} value={code}>
            +{code}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );

  return (
    <Transition
      show={show}
      enter='transition duration-500 ease-out'
      enterFrom='transform scale-95 opacity-0'
      enterTo='transform scale-100 opacity-100'
      leave='transition duration-500 ease-out'
      leaveFrom='transform scale-100 opacity-100'
      leaveTo='transform scale-95 opacity-0'
    >
      <div className='mx-auto my-8'>
        <div className='bodergray-200 rounded-lg border bg-white p-4 shadow-lg'>
          <div className='grid grid-cols-12 gap-2'>
            <div className='relative col-span-4'>
              <EventInfo event={event} />
              <div className='p-2 text-sm text-gray-700'>
                {data.currentTime &&
                  data.currentTime.format('dddd, MMMM D, YYYY h:mm A')}
              </div>
              <div className='absolute right-0 top-0 h-full w-[1px] bg-gray-200' />
            </div>
            <div className='relative col-span-6 p-4'>
              <Form
                form={form}
                name='event-customer-form'
                layout='vertical'
                onFinish={onFinish}
                autoComplete='off'
              >
                <Form.Item
                  label='First Name'
                  name='firstName'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your first name',
                    },
                  ]}
                >
                  <Input
                    size='large'
                    placeholder='Type your first name'
                    disabled={submitting}
                  />
                </Form.Item>

                <Form.Item
                  label='Last Name'
                  name='lastName'
                  rules={[
                    { required: true, message: 'Please input your last name' },
                  ]}
                >
                  <Input
                    size='large'
                    placeholder='Type your last name'
                    disabled={submitting}
                  />
                </Form.Item>

                <Form.Item
                  label='Email'
                  name='email'
                  rules={[
                    {
                      type: 'email',
                      message: 'Must be a valid email address',
                    },
                    {
                      required: true,
                      message: 'Please input your email',
                    },
                  ]}
                >
                  <Input
                    type='email'
                    size='large'
                    placeholder='Type your last name'
                    disabled={submitting}
                  />
                </Form.Item>

                <Form.Item
                  name='phone'
                  label='Phone Number'
                  rules={[
                    {
                      required: true,
                      message: 'Please input your phone number',
                    },
                    {
                      message: 'Must be a valid phone number',
                      validator: (_, value) => {
                        if (value) {
                          const fullPhone =
                            '+' + form.getFieldValue('prefix') + value;
                          if (isValidPhoneNumber(fullPhone)) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject('Phone pattenr dont match');
                          }
                        }
                      },
                    },
                  ]}
                >
                  <Input
                    type='tel'
                    size='large'
                    placeholder='600 00 00 00'
                    addonBefore={phoneDialSelector}
                    onChange={(e) => {
                      const phone = e.target.value;
                      if (phone.length > 8) {
                        try {
                          const parsedPhone = parsePhoneNumber(phone);
                          if (parsedPhone.countryCallingCode) {
                            form.setFieldValue(
                              'prefix',
                              parseInt(parsedPhone.countryCallingCode)
                            );
                          }
                          if (parsedPhone.nationalNumber) {
                            form.setFieldValue(
                              'phone',
                              parsedPhone.nationalNumber
                            );
                          }
                          form.validateFields();
                        } catch (e) {
                          // nothing
                        }
                      }
                    }}
                    disabled={submitting}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Form>
              <div className='absolute right-0 top-0 h-full w-[1px] bg-gray-200' />
            </div>
            <div className='col-span-3'></div>
            <div className='col-span-12 pt-2'>
              <div className='flex items-center justify-between'>
                <Share event={event} />
                <div className='flex items-center justify-end'>
                  <Button
                    type='link'
                    size='large'
                    onClick={() => onStep('calendar')}
                    disabled={submitting}
                  >
                    Back
                  </Button>
                  <Button
                    type='primary'
                    size='large'
                    onClick={() => form.submit()}
                    loading={submitting}
                  >
                    Confirm appointment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default CustomerStep;
