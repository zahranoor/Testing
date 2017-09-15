import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Search from './components/Search';
import Listing from './components/Listing';
import { Router, hashHistory, Route, IndexRoute } from 'react-router';
import dotenv from 'dotenv';
dotenv.config({
  silent:true
});

ReactDOM.render(
  <Router history= { hashHistory }>
    <Route path = "/" component = { App }>
      <IndexRoute component = { Search } />
      <Route path="listing" component = { Listing } />
    </Route>
  </Router>,
  document.getElementById('root')
);
