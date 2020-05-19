import React, { useContext } from 'react';
import useForm from '../hooks/useForm';
import { AuthContext } from '../context/auth-context';
import { useHttpClient } from '../hooks/http-hook';
import { Link } from 'react-router-dom'

const Register = (props) => {
  const { values, handleChange, handleSubmit } = useForm(register);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();  
  const auth = useContext(AuthContext)  

  async function register() {
    try {
      const responseData = await sendRequest(
        'http://localhost:5000/api/users/signup',
        'POST',
        JSON.stringify({
          userName: values.userName,
          phone: values.phone,
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
                <label className="label">User Name</label>
                <div className="control">
                  <input className="input" type="userName" name="userName" onChange={(event) => handleChange(event, clearError)} value={values.userName} required />
                </div>
              </div>
              <div className="field">
                <label className="label">Phone Number</label>
                <div className="control">
                  <input className="input" type="phone" name="phone" onChange={(event) => handleChange(event, clearError)} value={values.phone} required />
                </div>
              </div>
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
                </div>
              </div>
              <button type="submit" className="button is-block is-info is-fullwidth">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
