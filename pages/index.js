import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useCallback, useEffect, useState } from 'react';
import Main from '../lib/layout/main';

const templateId = "e17602c9261a29ede9fe60bfb35b1e71ea22691f";

let client;
const events = [];

export default function Home() {
  const [subject, setSubject] = useState("Bill Of Lading");
  const [message, setMessage] = useState("Enjoy your Move");
  const [name, setName] = useState("Byron");
  const [email, setEmail] = useState("bwarner@oncue.co");
  const [errorMessage, setErrorMessage] = useState("");
  const [ready, setReady] = useState(false);

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const { target } = event;

    const opts = {
      test_mode: 1,
      clientId: process.env.NEXT_PUBLIC_HELLOSIGN_CLIENT_ID,
      template_id: templateId,
      subject,
      message,
      signers: [
        {
          email_address: email,
          name,
          role: 'Client',
        },
      ],
    };
    try {
      const res = await fetch('/api/signature', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(opts),
      });

      const body = await res.json();
      if (res.ok) {
        const { data: { signUrl } } = body;
        client.open(signUrl, {
          testMode: true,
          debug: true,
          skip_domain_verification: true,
        });
      } else {
        const { error } = body;
        console.error(error);
        setErrorMessage(error);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message ? err.message : err.toString());
    }
  }, [subject, message, name, email, client]);

  useEffect(async () => {
    const { default: HelloSign } = await import('hellosign-embedded');
    client = new HelloSign({ clientId: process.env.NEXT_PUBLIC_HELLOSIGN_CLIENT_ID });

    console.log('client created ', client);
    client.on('ready', (data) => {
      console.log('Ready!!!!')
      events.push('Client is Ready');
    });

    client.on('open', (data) => {
      events.push('The document has been opened!');
      console.log('data', JSON.stringify(data, undefined, 2));
    });

    client.on('error', (data) => {
      events.push('Recieved error');
      console.log('data', JSON.stringify(data, undefined, 2));;;
    });

    client.on('cancel', (data) => {
      events.push('Cancelled');
      console.log('data', JSON.stringify(data, undefined, 2));;
    });

    client.on('close', (data) => {
      events.push('Closed');
      console.log('data', JSON.stringify(data, undefined, 2));;
    });
    client.on('sign', (data) => {
      console.log('events before', events);
      events.push(
        'The document has been signed!, Signature ID: ' + data.signatureId
      );
      console.log('events after', events);
    });
    client.on('finish', (data) => {
      events.push('document signing finsihed!');
    });
    setReady(true);
  }, []);

  const aside = () => (<>
    <h2>Signing Client-side events</h2>
    {events.length > 0 &&
      <ul>
        {events.map((event, i) =>
        (<li key={i}>
          <code>{JSON.stringify(event, null, 2)}</code>
        </li>)
        )}
      </ul>}
  </>);

return (
  <Main aside={aside}>
    <div>
      {errorMessage && <span>{errorMessage}</span>}
    </div>
    <form className="my-form" onSubmit={onSubmit}>
      <div className="form-input">
        <label htmlFor="subject">
          Subject
          <input
            name="subject"
            id="subject"
            type="text"
            value={subject}
            required
            onChange={event => setSubject(event.target.value)}
          />
        </label>
      </div>
      <div className="form-input"><label htmlFor="message">
        Message
        <input
          name="message"
          id="message"
          type="text"
          required
          value={message}
          onChange={event => setMessage(event.target.value)}
        />
      </label>
      </div>
      <div className="form-input"><label htmlFor="name">
        Name
        <input name="name"
          id="name"
          type="text"
          required
          value={name}
          onChange={event => setName(event.target.value)}
        />
      </label>
      </div>
      <div className="form-input">
        <label htmlFor="email">
          Email
          <input required name="email" type="email" id="email" value={email} onChange={event => setEmail(event.target.value)} />
        </label>
      </div>
      <div className="form-input">
        <button type="submit" disabled={!ready}>Create</button>
      </div>
    </form>
  </Main>
)
}
