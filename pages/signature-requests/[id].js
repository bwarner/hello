import Head from 'next/head'
import { useEffect, useRef } from 'react';
import styles from '../../styles/Home.module.css';
import Main from "../../lib/layout/main";
import Data from '../../lib/ui/data';

export default function SignatureRequest(props) {
  console.log('SigningRequest props', props);
  const { error, data } = props;
  return (
    <Main
      heading="Signing Request"
    >
      <Head>
        <title>Signing Request</title>
      </Head>
      {error && <div>{error}</div>}
      {data && <dl className={styles.dlist}>
        <dt>signature_request_id</dt>
        <dd>{data.signature_request_id}</dd>
        <dt>test_mode</dt>
        <dd>{Boolean(data.test_mode)}</dd>
        <dt>title</dt>
        <dd>{data.title}</dd>
        <dt>subject</dt>
        <dd>{data.subject}</dd>
        <dt>message</dt>
        <dd>{data.message}</dd>
        <dt>metadata</dt>
        <dd><Data object={data.metadata} /></dd>
        <dt>created_at</dt>
        <dd>{data.created_at}</dd>
        <dt>details_url</dt>
        <dd><a href={data.details_url}>Detail Url</a></dd>
        <dt>signatures</dt>
        <dd>{data.signature_request_id}</dd>
        <dt>signatures</dt>
        <dd><Data object={data.signatures} /></dd>
        <dt>template_ids</dt>
        <dd>{data.template_ids.join(",")}</dd>
      </dl>}
    </Main>);
}

export async function getServerSideProps({ req, query }) {
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const baseUrl = req ? `${protocol}://${req.headers.host}` : '';
  const { id } = query;
  try {
    const response = await fetch(`${baseUrl}/api/signature-requests/${id}`);
    if (response.ok) {
      const data = await response.json();
      return { props: { data }};
    } else {
      console.log('status ', await response.statusText);
      return { props: { error: `error fetching data for id: ${id}` } };
    }
  } catch (error) {
    return { props: { error: error.message, apple: 1 } };
  }
}