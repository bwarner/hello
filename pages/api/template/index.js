import HellosignSDK from 'hellosign-sdk';
import multiparty from 'multiparty';
import set from 'lodash/fp/set';
import fs from 'fs';

const client_id = process.env.NEXT_PUBLIC_HELLOSIGN_CLIENT_ID;
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
        console.log('received body', body);

        var form = new multiparty.Form();
        form.parse(req, async function(err, fields, files) {
          if (err) {
            console.log(err);
            res.status(400).json({ error: err.message ? err.message : err.toString()});
          } else {
            console.log('fields ', fields);
            console.log('files ', files);
            const query = Object.keys(fields).reduce((params, name) => set(name, fields[name][0], params), {});
            const keys = Object.keys(files);
            if (keys.length > 0) {
              let fileBuffers = [];
              keys.map(key => files[key]).forEach(fileInfos => {
                fileBuffers = fileBuffers.concat(fileInfos.map(fileInfo => fileInfo.path));
              });
              query.file = fileBuffers;
            }
            try {
              const opts = { ...query, clientId: client_id, test_mode: 1};
              console.log('opts ', opts);
              const data = await hellosign.template.createEmbeddedDraft(opts);
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