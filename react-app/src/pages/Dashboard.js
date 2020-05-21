import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as userActions from "../redux/actions/userActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router-dom";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";
import UserList from "./UserList";

function Dashboard ({ users, auth, httpClient, loading, actions }) {
  const { token } = auth;
  const { sendRequest } = httpClient;
  const [redirectToAddCoursePage, setRedirectToAddCoursePage] = useState(false);

  useEffect(() => {
    if (users.length === 0) {
      actions.loadUsers(sendRequest, token).catch(error => {
        alert("Loading courses failed" + error);
      });
    }

  }, []);

  const handleDeleteUser = async user => {
    // TODO: fix toast
    toast.success("Course deleted");
    try {
      await actions.deleteUser(user, sendRequest, token);
    } catch (error) {
      toast.error("Delete failed. " + error.message, { autoClose: false });
    }
  };

  return (
    
    <>
      {redirectToAddCoursePage && <Redirect to="/user" />}
      <h2>Users</h2>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <button
            style={{ marginBottom: 20 }}
            className="btn btn-primary add-course"
            onClick={() => setRedirectToAddCoursePage(true)}
          >
            Create User
          </button>


          <UserList
            onDeleteClick={handleDeleteUser}
            users={users}
          />
        </>
      )}
    </>
  );
}

Dashboard.propTypes = {
  users: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    users: state.default.users,
    loading: state.default.apiCallsInProgress > 0
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadUsers: bindActionCreators(userActions.loadUsers, dispatch),
      deleteUser: bindActionCreators(userActions.deleteUser, dispatch)
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

