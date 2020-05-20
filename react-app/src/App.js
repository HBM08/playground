import React from 'react';
import { Route } from 'react-router-dom'
import Nav from './navigation/Nav'
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { AuthContext } from './context/auth-context';
import { useAuth } from './hooks/auth-hook';
import PrivateRoute from './navigation/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ManageUser from './pages/ManageUser';

function App(props) {

  const { history } = props;
  const { token, userId, role, goToLoginPage, login, logout } = useAuth(history);
  const auth = {
    isLoggedIn: !!token,
    token,
    userId,
    role,
    goToLoginPage,
    login,
    logout
  }
  return (
    <AuthContext.Provider value={auth}>
        <Nav auth={auth} history={history}/>
        <div className="body">
          <Route path="/" exact component={Home}/>
          <Route path="/login" exact component={Login}/>
          <Route path="/register" exact component={Register}/>
          <PrivateRoute path="/dashboard" component={Dashboard}/>
          <PrivateRoute path="/user" component={ManageUser}/>
        </div>
    </AuthContext.Provider> );
}

export default App;
