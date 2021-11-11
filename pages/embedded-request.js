import { useEffect, useState, useMemo } from 'react';
import set from "lodash/fp/set";
import Main from "../lib/layout/main";
import useAuth from '../lib/hooks/login';
import faker from 'faker';
import { useRouter } from 'next/router'


const clientId = process.env.NEXT_PUBLIC_HELLOSIGN_CLIENT_ID;
export default function CreateEmbeddedRequest(props) {
  const [userJson] = useAuth();
  const user = useMemo(() => JSON.parse(userJson));
  const { id, name, email, origin, destination } = props;
  const router = useRouter();
  const [request, setRequest] = useState({
    test_mode: true,
    clientId,
    title: `Bill of Lading #${id}`,
    subject: 'Moving Job',
    message: faker.lorem.sentence(),
    signers: [
      {
        name: '',
        email_address: '',
        role: 'carrier',
      },
      {
        name,
        email_address: email,
        role: 'shipper',
      },
    ]
  });
  useEffect(() => setRequest(old => set('signers[0]', {
    name: user?.name,
    email_address: user?.email,
    role: 'carrier',
  }, old)),
    [user]);

  const onChange = (event) => {
    setRequest(set(e.target.name, e.target.value, request));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = Array.from(formData.entries()).reduce((params, [name, value]) => ({ ...params, ...{ [name]: value } }), {});
    router.push({
      pathname: '/embedded-signing',
      query,
    });
  };
  return (
    <Main>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="title">Title:
            <input id="title" name="title" onChange={onChange} value={request.title} />
          </label>
        </div>
        <div>
          <label htmlFor="subject">Subject:
            <input id="subject" name="subject" onChange={onChange} value={request.subject} />
          </label>
        </div>
        <div>
          <label htmlFor="message">Message:
            <input id="message" name="message" onChange={onChange} value={request.message} />
          </label>
        </div>
        <fieldset>
          <legend>Signers</legend>
          <div>
            <label htmlFor="signers_0_name">Signer:
              <input id="signers_0_name" name="signers[0].name" onChange={onChange} value={request.signers[0].name} />
            </label>
          </div>
          <div>
            <label htmlFor="signers_0_email">Email:
              <input id="signers_0_email" name="signers[0].email_address" onChange={onChange} value={request.signers[0].email_address} />
            </label>
          </div>
          <div>
            <label htmlFor="signers_0_role">Role:
              <input id="signers_0_role" type="text" name="signers[0].role" onChange={onChange} value="carrier" />
            </label>
          </div>
          <div>
            <label htmlFor="signers_1_name">Signer:
              <input id="signers_1_name" name="signers[1].name" onChange={onChange} value={name} />
            </label>
          </div>
          <div>
            <label htmlFor="signers_1_email">Email:
              <input id="signers_1_email" name="signers[1].email_address" onChange={onChange} value={email} />
            </label>
          </div>
          <div>
            <label htmlFor="signers_1_role">Role:
              <input id="signers_1_role" type="text" name="signers[1].role" onChange={onChange} value="shipper" />
            </label>
          </div>
        </fieldset>
        <button type="submit">Create Embedded Request</button>

      </form>
    </Main>
  )
}

CreateEmbeddedRequest.getInitialProps = async ({ query }) => {
  console.log('query entries ', Object.entries(query));
  const order = Object.entries(query).reduce((order, [name, value]) => set(name, value, order), {});
  return order;
}
