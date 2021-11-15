import { useEffect, useState, useMemo } from 'react';
import set from "lodash/fp/set";
import Main from "../../lib/layout/main";
import useAuth from '../../lib/hooks/login';
import { useRouter } from 'next/router'


export default function CreateDraftTemplate(props) {
  const [userJson] = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const user = userJson ? JSON.parse(userJson) : {};
  const [fileChoice, setFileChoice] = useState(0);
  const { id, name, email, origin, destination, draft } = props;
  const router = useRouter();
  const [request, setRequest] = useState({
    title: `Bill of Lading`,
    signer_roles: 'carrier,shipper',
    metadata: JSON.stringify({ company_id: 101 })
  });

  const onChange = (e) => {
    console.log('request ', request);
    setRequest(set(e.target.name, e.target.value, request));
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('files[0]', e.target.elements['files'].value);

    if (e.target.elements['title'].value) {
      formData.append('title', e.target.elements['title'].value);
    }
    if (e.target.elements['subject'].value) {
      formData.append('subject', e.target.elements['subject'].value);
    }
    if (e.target.elements['message'].value) {
      formData.append('message', e.target.elements['message'].value);
    }
    e.target.elements['signer_roles'].value.split(/,/).map((name, order) => {
      formData.append(`signer_roles[${order}][name]`, name)
      formData.append(`signer_roles[${order}][order]`, order)
    });

    if (e.target.elements['metadata'].value) {
      formData.append('metadata', e.target.elements['metadata'].value);
    }


    const serviceUrl = '/api/template';
    let res = await fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        // 'Content-Type': 'application/json',
      },
      body: formData,
    });

    const body = await res.json();
    debugger;
    if (res.ok && res.status === 200) {
      const { edit_url } = body;
      console.log('response ', body);
      router.push({
        pathname: '/embedded-viewer',
        query: { url:edit_url },
      });
    } else {
      const { error } = body;
      if (error) {
      console.error(error);
      setErrorMessage(error);
      } else {
        setErrorMessage(`error status ${res.status}`)
      }
    }
  };
  return (
    <Main>
      {userJson && <form onSubmit={onSubmit}>
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
        <div>
          <label htmlFor="signer_roles">Signer Roles:
           <input name="signer_roles" value={request.signer_roles} required onChange={onChange} data-lpignore="true"/></label>
        </div>
        <div>
          <label htmlFor="metadata">Metadata:
            <textarea id="metadata" name="metadata" onChange={onChange} value={request.metadata} />
          </label>
        </div>
        <div>
          <label>File URL/File Upload</label>
        <div>
          <label htmlFor="file_choice0">File URL:
            <input id="file_choice0" required type="radio" name="file_choice" value="0" disabled={!!fileChoice} checked={!fileChoice} />
          </label>
          <label htmlFor="file_choice1">Files Upload
            <input id="file_choice1" required type="radio" name="file_choice"  value="1" disabled={!fileChoice} checked={!!fileChoice} />
          </label>
        </div>
        </div>
        <div>
          <label htmlFor="file_url">Files:
            <textarea id="file_url" required type="text" name="file_url" />
          </label>
        </div>
        <div>
          <label htmlFor="files">Files:
            <input id="files" required type="file" name="files" />
          </label>
        </div>
        <button type="submit">Create Draft Template</button>

      </form>}
    </Main>
  )
}

