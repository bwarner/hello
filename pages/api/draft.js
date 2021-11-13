
import HellosignSDK from 'hellosign-sdk';

const clientId = process.env.NEXT_PUBLIC_HELLOSIGN_CLIENT_ID;
const hellosign = HellosignSDK({ key: process.env.API_KEY });
export default async function handler(req, res) {
  const {
    body,
    method,
  } = req
  switch (method) {
    case 'POST': {
      // Update or create data in your database
      const opts = {
        test_mode: 1,
        clientId,
        ...body,
      };
      try {
        console.log('createEmbeddedWithTemplate ', opts);
        const result = await hellosign.unclaimedDraft.createEmbeddedWithTemplate(opts);
        console.log('createEmbeddedWithTemplate result  ', JSON.stringify(result, null, 2));
        const {
          unclaimed_draft: {
          claim_url,
          signing_redirect_url,
          test_mode,
          signature_request_id
          }
        } = result;
        console.log(`The signUrl is: ${claim_url}`);
        res.status(200).json({ data: { claim_url } });
      } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message ? err.message : err.toString()});
      }
      break
    }
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}