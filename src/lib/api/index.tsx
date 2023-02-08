/* eslint-disable @typescript-eslint/no-explicit-any */
export const request = async ({
  path,
  method = 'GET',
  data,
  headers,
}: {
  path: string;
  method?: string;
  headers?: any;
  data?: any;
}) => {
  const options: any = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (method === 'POST') {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(path, options);
  if (response.status === 200) {
    return await response.json();
  }
  return null;
};

export const getCalendar = async (
  {
    eventId,
    startDate,
    endDate,
  }: {
    eventId: string;
    startDate: string;
    endDate: string;
  },
  options: any
) => {
  return await request({
    path: `/api/calendar/${eventId}/${startDate}/${endDate}`,
    headers: {
      'CSRF-Token': options.csrfToken,
    },
  });
};
// eslint-disable-next-line unused-imports/no-unused-vars
export const createBooking = async (data: any, options: any) => {
  return await request({
    path: `/api/bookings`,
    method: 'POST',
    data,
    headers: {
      'CSRF-Token': options.csrfToken,
    },
  });
};

// eslint-disable-next-line unused-imports/no-unused-vars
export const cancelBooking = async (bookingId: string, options: any) => {
  return await request({
    path: `/api/bookings/${bookingId}/cancelled`,
    method: 'POST',
    headers: {
      'CSRF-Token': options.csrfToken,
    },
  });
};

export const getPaymentLink = async (data: any, options: any) => {
  return await request({
    path: `/api/payments/payment-link`,
    method: 'POST',
    data,
    headers: {
      'CSRF-Token': options.csrfToken,
    },
  });
};
