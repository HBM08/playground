import React from 'react';
import { Link } from 'react-router-dom'

function Nav(props) {
  const { auth, history } = props;
  const { isLoggedIn, goToLoginPage, logout } = auth;

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {isLoggedIn &&
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        }
        <li>
          <button onClick={isLoggedIn ? logout : goToLoginPage}>
            {isLoggedIn ? "Log Out" : "Log In"}
          </button>
        </li>
        <li>
          <button onClick={() => history.push('/register') }>
            Register
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;