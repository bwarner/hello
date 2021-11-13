import { useState } from 'react';
import faker from 'faker';
import get from 'lodash/fp/get';
import { useRouter } from 'next/router'
import Main from '../../lib/layout/main';
import set from 'lodash/fp/set';

export default function ViewOrder(props) {
  const [order, setOrder] = useState(props.order);
  const [draft, setDraft] = useState(false);

  const router = useRouter();
  const onSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData(e.target);
    const query = Array.from(formData.entries()).reduce((params, [name, value]) => {
      return {...params, ...{[name]: value}};
    }, {});
    query.draft = draft;
    router.push({
      pathname: '/embedded-request',
      query,
    });
  };
  const handleChange=(e)  => {
    setOrder(set(e.target.name, e.target.value, order));
  }
  return (<Main>
    <form onSubmit={onSubmit} autoComplete="off">
    <div>
      <label htmlFor="id">Order: <input name="id" value={order.id} onChange={handleChange} data-lpignore="true"/></label>
    </div>
     <div>
      <label htmlFor="email">Email: <input name="email" value={order.email} onChange={handleChange} data-lpignore="true"/></label>
    </div>
    <div>
      <label htmlFor="name">Name: <input name="name" value={order.name} onChange={handleChange} data-lpignore="true"/></label>
    </div>
    <fieldset>
      <legend>Origin</legend>
      <div>
        <label htmlFor="origin.address1">Address: <input name="origin.address1" value={order.origin.address1} onChange={handleChange} data-lpignore="true"/></label>
      </div>
      <div>
        <label htmlFor="origin.city">City: <input name="origin.city" value={order.origin.city} onChange={handleChange} data-lpignore="true"/></label>
      </div>
      <div>
        <label htmlFor="origin.state">State: <input name="origin.state" value={order.origin.state} onChange={handleChange} data-lpignore="true"/></label>
      </div>
      <div>
        <label htmlFor="origin.zip">Zip: <input name="origin.zip" value={order.origin.zip} onChange={handleChange} data-lpignore="true"/></label>
      </div>
    </fieldset>
    <fieldset>
      <legend>Destination</legend>
      <div>
        <label htmlFor="destination.address1">Address: <input name="destination.address1" value={order.destination.address1} onChange={handleChange} data-lpignore="true"/></label>
      </div>
      <div>
        <label htmlFor="destination.city">City: <input name="destination.city" value={order.destination.city} onChange={handleChange} data-lpignore="true"/></label>
      </div>
      <div>
        <label htmlFor="destination.state">State: <input name="destination.state" value={order.destination.state} onChange={handleChange} data-lpignore="true"/></label>
      </div>
      <div>
        <label htmlFor="destination.zip">Zip: <input name="destination.zip" value={order.destination.zip} onChange={handleChange} data-lpignore="true"/></label>
      </div>
    </fieldset>
    <button type="submit" onClick={()=> setDraft(false)}>Embedded Signing Request</button>
    <button type="submit" onClick={()=> setDraft(true)}>Embedded Draft Request</button><br />
    </form>
  </Main>);
}

export async function getServerSideProps(...args) {

  console.log('page argumetns ', args);
  const state = faker.address.state();

  const order = {
    id: faker.datatype.number(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    origin: {
      address1: faker.address.streetAddress(),
      city: faker.address.city(),
      state,
      zip: faker.address.zipCode(),
    },
    destination: {
      address1: faker.address.streetAddress(),
      city: faker.address.city(),
      state,
      zip: faker.address.zipCode(),
    }
  };

  // Pass data to the page via props
  return { props: { order } };
}
