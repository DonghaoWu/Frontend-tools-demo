import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';

import HomePage from './Pages/HomePage/HomePage.component';
import ShopPage from './Pages/ShopPage/ShopPage.component';
import Header from './Components/Header/Header.component';
import SignSignupPage from './Pages/SigninSignupPage/SignSignupPage.component'

function App() {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/shop' component={ShopPage} />
        <Route exact path='/signin' component={SignSignupPage} />
      </Switch>
    </div>
  );
}

export default App;
