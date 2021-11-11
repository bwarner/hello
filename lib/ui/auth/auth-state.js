import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function AuthState({user, onLogin, onRegister, onLogout}) {
  return (
    <>
      {user &&
      <span>
        {user.name} signed in.
        <button onClick={onLogout}>Logout</button>
      </span>}
      {!user && <span><button onClick={onLogin}>Login</button></span>}
    </>
  );
}

AuthState.propTypes = {
  user: PropTypes.object,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};