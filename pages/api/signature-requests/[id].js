
import HellosignSDK from 'hellosign-sdk';

const clientId = process.env.NEXT_PUBLIC_HELLOSIGN_CLIENT_ID;
const hellosign = HellosignSDK({ key: process.env.API_KEY });
export default async function handler(req, res) {
  const {
    query: {id},
    method,
  } = req
  switch (method) {
    case 'GET': {
      try {
        const result = await hellosign.signatureRequest.get(id);
        console.log('signature request result  ', JSON.stringify(result.signature_request, null, 2));
        res.status(200).json( result.signature_request );
      } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message ? err.message : err.toString()});
      }
    }
    break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}