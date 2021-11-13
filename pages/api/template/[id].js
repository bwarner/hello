
import HellosignSDK from 'hellosign-sdk';

const clientId = process.env.NEXT_PUBLIC_HELLOSIGN_CLIENT_ID;
const hellosign = HellosignSDK({ key: process.env.API_KEY });
export default async function handler(req, res) {
  const {
    query,
    method,
  } = req
  switch (method) {
    case 'GET': {
      try {
        console.log('query ', query);
        const data = await hellosign.template.get(query.id);
        res.status(200).json(data.template);
      } catch (err) {
        res.status(400).json({ error: err.message ? err.message : err.toString()});
      }
      break
    }
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}