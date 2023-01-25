export const getFromTitle = (property: any) => {
  return property.title.map((o: any) => o.plain_text).join(' ');
};

export const getFromRichText = (property: any) => {
  return property.rich_text.map((o: any) => o.plain_text).join(' ');
};

export const getFromNumber = (property: any) => {
  return property.number;
};
