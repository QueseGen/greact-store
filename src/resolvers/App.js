import React, {Component} from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <Switch>
      <Redirect from="/" to="/auth" exact/>
      <Router path="/auth" component={AuthPage}/>
      </Switch>
      </BrowserRouter>
)}
}

export default App;
