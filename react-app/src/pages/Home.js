import React, { useContext } from 'react';
import { AuthContext } from '../context/auth-context';

function Home() {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}

export default Home;
