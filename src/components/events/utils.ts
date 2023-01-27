import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getFromTitle = (property: any) => {
  return property.title.map((o: any) => o.plain_text).join(' ');
};

export const getFromRichText = (property: any) => {
  return property.rich_text.map((o: any) => o.plain_text).join(' ');
};

export const getFromNumber = (property: any) => {
  return property.number;
};

export const containsProduct = (product: PageObjectResponse) => {
  if (product.object && product.object === 'page') {
    return true;
  }
  return false;
};

export const getFromNumberToPrice = (property: any, currency = 'EUR', countryCode = 'es-ES') => {
  const price = property.number;
  if (price) {
    const formatter = new Intl.NumberFormat(countryCode, {
      style: 'currency',
      currency,
    });
    return formatter.format(price);
  }

  return property.number;
};