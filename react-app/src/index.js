import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter as Router, Route } from "react-router-dom";
import './index.css';
// Importing the Bulma CSS library
import 'bulma/css/bulma.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './redux/configureStore';

export const store = configureStore();

fetch('http://localhost:5000/health')
  .then(response => {
    if (response.ok) {
      return ReactDOM.render(
        <ReduxProvider store={store}>
          <React.StrictMode>
            <Router>
              <Route component={App} />
            </Router>,
          </React.StrictMode>
        </ReduxProvider>,
        document.getElementById('root')
      );
    }
    throw new Error("Network response was not ok");
  }).catch(err => {
     console.error(err);
     return ReactDOM.render(
      <h1>Backend is not available!</h1>,
      document.getElementById('root')
    );
  });



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
