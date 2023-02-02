import { NextApiRequest } from 'next';

export default function urlFromRequest(req: NextApiRequest) {
  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] ? 'https' : 'http';

  return `${protocol}://${host}`;
}