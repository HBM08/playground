import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Nav from './navigation/Nav'
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <Router>
      <Nav />
      <div className="body">
        <Route path="/" exact component={Home}/>
        <Route path="/dashboard" exact component={Dashboard}/>
      </div>
    </Router>
  );
}

export default App;
