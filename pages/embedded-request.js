import { useEffect, useState, useMemo } from 'react';
import set from "lodash/fp/set";
import Main from "../lib/layout/main";
import useAuth from '../lib/hooks/login';
import faker from 'faker';
import { useRouter } from 'next/router'


export default function CreateEmbeddedRequest(props) {
  const [userJson] = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const user = userJson ? JSON.parse(userJson) : {};
  const { id, name, email, origin, destination, draft } = props;
  const router = useRouter();
  const [request, setRequest] = useState({
    title: `Bill of Lading #${id}`,
    subject: 'Moving Job',
    message: faker.lorem.sentence(),
    template_id: 'e17602c9261a29ede9fe60bfb35b1e71ea22691f',
    requester_email_address: 'bwarner@oncue.co',
    signers: [
      {
        name: '',
        email_address: '',
        role: 'Client',
      },
      {
        name,
        email_address: email,
        role: 'Client',
      },
    ]
  });
  useEffect(() => {
    setRequest(old => set('signers[0]', {
      name: user.name || '',
      email_address: user.email || '',
      role: 'carrier',
    }, old));
  },
    [userJson]);

  const onChange = (e) => {
    console.log('request ', request);
    setRequest(set(e.target.name, e.target.value, request));
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // const query = Array.from(formData.entries()).reduce((params, [name, value]) => ({ ...params, ...{ [name]: value } }), {});
    const query = Array.from(formData.entries()).reduce((params, [name, value]) => set(name, value, params), {});

    const serviceUrl = draft == 'true' ? '/api/draft' : '/api/signature';
    let res = await fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });

    const body = await res.json();
    if (res.ok) {
      const { data: { signUrl } } = body;
      console.log('response ', body);
      const url = draft === 'true' ? body.data.claim_url : body.data.signUrl;
      router.push({
        pathname: '/embedded-viewer',
        query: { url },
      });
    } else {
      const { error } = body;
      console.error(error);
      setErrorMessage(error);
    }
  };
  return (
    <Main>
      {userJson && <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="title">Title:
            <input id="title" name="title" required onChange={onChange} value={request.title} />
          </label>
        </div>
        <div>
          <label htmlFor="subject">Subject:
            <input id="subject" name="subject" required onChange={onChange} value={request.subject} />
          </label>
        </div>
        <div>
          <label htmlFor="message">Message:
            <input id="message" name="message" required onChange={onChange} value={request.message} />
          </label>
        </div>
        <div>
          <label htmlFor="requester_email_address">Requester Email: <input name="requester_email_address" value={request.requester_email_address} onChange={onChange} data-lpignore="true"/></label>
        </div>
        <div>
          <label htmlFor="template_id">TemplateID:
            <input id="template_id" name="template_id" required onChange={onChange} value={request.template_id} />
          </label>
        </div>
        <fieldset>
          <legend>Signers</legend>
          <div>
            <label htmlFor="signers_0_name">Signer:
              <input id="signers_0_name" name="signers[0].name" required onChange={onChange} value={request.signers[0].name} />
            </label>
          </div>
          <div>
            <label htmlFor="signers_0_email">Email:
              <input id="signers_0_email" name="signers[0].email_address" required onChange={onChange} value={request.signers[0].email_address} />
            </label>
          </div>
          <div>
            <label htmlFor="signers_0_role">Role:
              <input id="signers_0_role" type="text" name="signers[0].role" required onChange={onChange} value={request.signers[0].role} />
            </label>
          </div>
          <div>
            <label htmlFor="signers_1_name">Signer:
              <input id="signers_1_name" name="signers[1].name" required onChange={onChange} value={request.signers[1].name} />
            </label>
          </div>
          <div>
            <label htmlFor="signers_1_email">Email:
              <input id="signers_1_email" name="signers[1].email_address" required onChange={onChange} value={request.signers[1].email_address} />
            </label>
          </div>
          <div>
            <label htmlFor="signers_1_role">Role:
              <input id="signers_1_role" type="text" name="signers[1].role" required onChange={onChange} value={request.signers[1].role} />
            </label>
          </div>
        </fieldset>
        <button type="submit">Create Embedded Request</button>

      </form>}
    </Main>
  )
}

CreateEmbeddedRequest.getInitialProps = async ({ query }) => {
  return Object.entries(query).reduce((order, [name, value]) => set(name, value, order), {});
}
