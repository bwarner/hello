import Head from 'next/head'
import { useEffect, useRef } from 'react';
import styles from '../../styles/Home.module.css';
import Main from "../../lib/layout/main";
import Data from '../../lib/ui/data';

export default function Templates(props) {
  console.log('Templates props', props);
  const { error, data } = props;
  return (
    <Main
      heading={data.title}
    >
      <Head>
        <title>List Templates</title>
      </Head>
      {error && <div>{error}</div>}
      {data && <dl className={styles.dlist}>
        <dt>template_id</dt>
        <dd>{data.template_id}</dd>
        <dt>can_edit</dt>
        <dd>{Boolean(data.can_edit)}</dd>
        <dt>title</dt>
        <dd>{data.title}</dd>
        <dt>reusable_form_id</dt>
        <dd>{data.reusable_form_id}</dd>
        <dt>message</dt>
        <dd>{data.message}</dd>
        <dt>metadata</dt>
        <dd><Data object={data.metadata} /></dd>
        <dt>created_at</dt>
        <dd>{data.created_at}</dd>
        <dt>is_embedded</dt>
        <dd>{data.is_embedded}</dd>
        <dt>updated_at</dt>
        <dd>{data.updated_at}</dd>
        <dt>signer_roles</dt>
        <dd><Data object={data.signer_roles} /></dd>
        <dt>custom_fields</dt>
        <dd><Data object={data.custom_fields} /></dd>
        <dt>named_form_fields</dt>
        <dd><Data object={data.named_form_fields} /></dd>
      </dl>}
    </Main>);
}

export async function getServerSideProps({ req, query }) {
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const baseUrl = req ? `${protocol}://${req.headers.host}` : '';
  const { id } = query;
  try {
    const response = await fetch(`${baseUrl}/api/template/${id}`);
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