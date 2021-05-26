
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
      const {
        signers,
        clientId,
        template_id,
        subject,
        message,
      } = body;

      // Update or create data in your database
      const opts = {
        test_mode: 1,
        clientId,
        template_id,
        subject,
        message,
        signers,
      };
      try {
      const result = await hellosign.signatureRequest.createEmbeddedWithTemplate(opts);
      console.log('createEmbeddedWithTemplate result  ', result);
      const { signature_request: { signatures } } = result;
      const { embedded: { sign_url: signingUrl } } = await hellosign.embedded.getSignUrl(signatures[0]);
      console.log(`The signing url is: ${signingUrl} signatures ${signatures}`);
        res.status(200).json({ data: { signingUrl, signatures } });
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