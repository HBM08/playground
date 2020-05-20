import React, { useContext } from 'react';
import useForm from '../hooks/useForm';
import { AuthContext } from '../context/auth-context';
import { useHttpClient } from '../hooks/http-hook';
import { Link } from 'react-router-dom'

const Login = (props) => {
  const { values, handleChange, handleSubmit } = useForm(login);
  const { error, sendRequest, clearError } = useHttpClient();  
  const auth = useContext(AuthContext)  

  async function login() {
    try {
      const responseData = await sendRequest(
        'http://localhost:5000/api/users/login',
        'POST',
        JSON.stringify({
          email: values.email,
          password: values.password
        })
      );
      auth.login(responseData.userId, responseData.token);
    } catch (err) {
      console.error(err);
    }
  }

  const isNotRegistered = (_error) => {
    return _error === 'Invalid email addres, could not log you in';
  }

  return (
    <div className="section is-fullheight">
      <div className="container">
        <div className="column is-4 is-offset-4">
          <div className="box">
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">Email Address</label>
                <div className="control">
                  <input className="input" type="email" name="email" onChange={(event) => handleChange(event, clearError)} value={values.email} required />
                </div>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input className="input" type="password" name="password" onChange={(event) => handleChange(event, clearError)} value={values.password} required />
                  {error && <div className="error">{error}</div>}
                  {isNotRegistered(error) && <Link to="/register">Register here</Link>}
                </div>
              </div>
              <button type="submit" className="button is-block is-info is-fullwidth">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
