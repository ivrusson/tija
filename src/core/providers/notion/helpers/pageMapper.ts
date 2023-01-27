/* eslint-disable @typescript-eslint/no-explicit-any */
export default function pageMapper(page: any) {
  if (page?.object === 'page') {
    const properties: any = {};
    Object.keys(page.properties).map((key: string) => {
      const prop = page.properties[key];
      switch (prop.type) {
        case 'select':
          {
            properties[key] = prop.select.name;
          }
          break;
        case 'multi_select':
          {
            properties[key] = prop.multi_select.map((item: any) => item.name);
          }
          break;
        case 'status':
          {
            properties[key] = prop.select.status;
          }
          break;
        case 'date':
          {
            properties[key] = prop.date;
          }
          break;
        case 'title':
          {
            properties[key] = prop.title
              .map((block: any) => block.plain_text)
              .join(' ');
          }
          break;
        case 'rich_text':
          {
            properties[key] = prop.rich_text
              .map((block: any) => block.plain_text)
              .join(' ');
          }
          break;
        default: {
          properties[key] = prop[prop.type];
        }
      }
    });
    return {
      id: page.id,
      ...properties,
    };
  }
  return null;
}
