import PropTypes from 'prop-types';
export default function Address({ address1, city, state, zip }) {
debugger;
  return (
  <address>
    <p>{address1}</p>
    <p>{city}, {state} {zip}</p>
  </address>
  );
}

Address.propType = {
  address1: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  zip: PropTypes.string.isRequired,
};