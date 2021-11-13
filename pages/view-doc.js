import Head from 'next/head'
import { useEffect, useRef } from 'react';
import useEvents from '../lib/hooks/events';
import Main from "../lib/layout/main";

export default function EmbeddedSigning({ url }) {
  const [client, events, ready] = useEvents(process.env.NEXT_PUBLIC_HELLOSIGN_CLIENT_ID);
  const containerRef = useRef();

  useEffect(() => {
    if (client) {
      const element = containerRef.current;
      if (element) {
        client.open(url, {
          testMode: true,
          debug: true,
          skipDomainVerification: true,
        });
      } else {
        console.log('ref is empty');
      }
    }
  }, [client]);
  return (
  <Main
   heading="Sign Documents"
   aside={() => {
    return (<ul>
      {events.reverse().map(event => <li key={event.key}>{event.name}</li>)}
    </ul>);
   }}
  >
    <Head>
        <title>Embedded Signing</title>
    </Head>
    <div id="sign-here" ref={containerRef}></div>
  </Main>);
}

EmbeddedSigning.getInitialProps = ({query}) => {
  const { url } = query;
  return {
    url
  };
}