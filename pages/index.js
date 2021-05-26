import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useCallback, useState } from 'react';

const templateId="e17602c9261a29ede9fe60bfb35b1e71ea22691f";

export default function Home() {
  const [subject, setSubject] = useState("Bill Of Lading");
  const [message, setMessage] = useState("Enjoy your Move");
  const [name, setName] = useState("Byron");
  const [email, setEmail] = useState("bwarner@oncue.co");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();

    const HelloSign = (await import('hellosign-embedded')).default;

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
    const client = new HelloSign();
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
        const { data: { signingUrl } } = body;
        client.open(signingUrl, {
          clientId: process.env.NEXT_PUBLIC_HELLOSIGN_CLIENT_ID,
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
  }, [subject, message, name, email]);

  return (
    <div className={styles.container}>
      <Head>
        <title>HelloSign Test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
          <h1 className={styles.title}>
            Testing Embedding Signing
        </h1>
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
              <input required name="email" type="email"  id="email" value={email} onChange={event => setEmail(event.target.value)} />
            </label>
            </div>
            <div className="form-input">
              <button type="submit">Create</button>
            </div>
          </form>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
