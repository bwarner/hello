
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
      // const {
      //   signers,
      //   clientId,
      //   template_id,
      //   subject,
      //   message,
      // } = body;

      // Update or create data in your database
      const opts = {
        test_mode: 1,
        clientId,
        ...body,
      };
      try {
        console.log('createEmbeddedWithTemplate ', opts);
        const result = await hellosign.signatureRequest.createEmbeddedWithTemplate(opts);
        console.log('createEmbeddedWithTemplate result  ', JSON.stringify(result, null, 2));
        const { signature_request: { signing_url: signingUrl, signatures: [signature] } } = result;
        const { embedded: { sign_url: signUrl }} = await hellosign.embedded.getSignUrl(signature.signature_id)
        console.log(`The signUrl is: ${signUrl}`);
        res.status(200).json({ data: { signUrl } });
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