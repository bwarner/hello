import useSWR from 'swr'
import Link from 'next/link';
import Main from '../../lib/layout/main';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function TemplateIndex({ page, page_size, query}) {
  const params = { page, page_size, query };
  const pagination = Object.keys(params).reduce((out, key) => {
     return params[key] ? { ...out, [key]: params[key] } : out;
   }, {});
  let searchParams = new URLSearchParams(pagination);
  const { data, error } = useSWR(`/api/template/list?${searchParams.toString()}`, fetcher);
  if (data) console.log('template data ', data);
  if (error) console.error('error', error);
  return (
    <Main>
      {error && <div>Error Loading Templates</div>}
      {data && data.templates.length > 0 &&
        <table>
          <thead>
            <tr><td>Id</td><th>Title</th></tr>
          </thead>
          <tbody>
            {data.templates.map(t => <tr key={t.template_id}><td><Link href={`/templates/${t.template_id}`}><a>{t.template_id}</a></Link></td><td>{t.title}</td></tr>)}
          </tbody>
        </table>
      }
    </Main>
  )
}

TemplateIndex.getInitialProps = ({ query }) => {
  return query;
}
