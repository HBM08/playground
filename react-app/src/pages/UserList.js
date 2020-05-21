import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const UserList = ({ users, onDeleteClick }) => {

  useEffect(() => {
    // rerender when users change
    console.log("In list", users)
  }, [users]);

  return <table className="table">
    <thead>
      <tr>
        <th>User Name</th>
        <th>Email</th>
        <th>Phone Number</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {users && users.map(user => {
        return (
          <tr key={user.id}>
            <td>
              <Link to={"/user/" + user.slug}>{user.data.userName}</Link>
            </td>
            <td>{user.data.email}</td>
            <td>{user.data.phone}</td>
            <td>
              <button
                className="btn btn-outline-danger"
                onClick={() => onDeleteClick(user)}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
};

UserList.propTypes = {
  users: PropTypes.array,
  onDeleteClick: PropTypes.func.isRequired
};

export default UserList;
