/* eslint-disable @typescript-eslint/no-explicit-any */
export default function findProperties(page: any, properties: string[]) {
  if (page?.object === 'page') {
    const out: any = {};
    Object.keys(page.properties).map((key: string) => {
      const prop = page.properties[key];
      if (properties.includes(key)) {
        out[key] = prop;
      }
    });
    return out;
  }
  return null;
}
