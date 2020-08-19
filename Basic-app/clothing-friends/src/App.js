import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';

import HomePage from './Pages/HomePage/HomePage.component';
import ShopPage from './Pages/ShopPage/ShopPage.component';

function App() {
  return (
    <div>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/shop' component={ShopPage} />
      </Switch>
    </div>
  );
}

export default App;
