import React, { useContext, useEffect } from 'react';
import { connect } from "react-redux";
import useForm from '../hooks/useForm';
import { AuthContext } from '../context/auth-context';
import { useHttpClient } from '../hooks/http-hook';
import { saveUser, loadUsers } from "../redux/actions/userActions";
import { toast } from "react-toastify";


const ManageUser = ({ users, loading, history, loadUsers, saveUser }) => {
  const { values, handleChange, handleSubmit } = useForm(createUser);
  const { error, sendRequest, clearError } = useHttpClient();  
  const auth = useContext(AuthContext)  

  useEffect(() => {
    if (users.length === 0) {
      loadUsers(sendRequest, auth.token).catch(error => {
        alert("Loading courses failed" + error);
      });
    }
  }, []);

  async function createUser() {
    saveUser(values, sendRequest, auth.token).then(() => {
      toast.success("User created.");
      history.push("/dashboard");
    })
    .catch(error => {
      alert('Message could not be created because of error ', error);
    });
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
              <button type="submit" className="button is-block is-info is-fullwidth">{loading ? 'Creating...' : 'Create user'}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  console.log(state)
  return {
    users: state.default.users,
    loading: state.default.apiCallsInProgress > 0
  };
}

const mapDispatchToProps = {
  saveUser,
  loadUsers
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageUser);