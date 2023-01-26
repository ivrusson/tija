export function parseKeyDatabase(key: string) {
  const firstChar = key.toUpperCase();
  return firstChar + key.replace('DB_', '').toLowerCase().slice(1);
}