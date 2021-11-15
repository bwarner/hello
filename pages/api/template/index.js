import HellosignSDK from 'hellosign-sdk';
import multiparty from 'multiparty';
import set from 'lodash/fp/set';

const clientId = process.env.NEXT_PUBLIC_HELLOSIGN_CLIENT_ID;
const hellosign = HellosignSDK({ key: process.env.API_KEY });

export const config = {
  api: {
    bodyParser: false,
  },
}
export default async function handler(req, res) {
  const {
    body,
    method,
  } = req
  switch (method) {
    case 'POST': {
      try {
        console.log('recieved body', body);

        var form = new multiparty.Form();
        form.parse(req, async function(err, fields, files) {
          if (err) {
            console.log(err);
            res.status(400).json({ error: err.message ? err.message : err.toString()});
          } else {

            console.log('fields ', fields);
            console.log('files ', files);

            const query = Object.keys(fields).reduce((params, name) => set(name, fields[name][0], params), {});
            console.log('query ', query);
            try {
              const data = await hellosign.template.createEmbeddedDraft({ ...query, test_mode: 1, clientId});
              console.log('createEmbeddedDraft returned ', data);
              res.status(200).json(data);
            } catch(e) {
              console.log('error ', e);
              res.status(400).json({ error: e.message ? e.message : e.toString()});
            }
          }
        });

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