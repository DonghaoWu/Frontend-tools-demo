import React from 'react';

import UserProfile from './Components/User-profile.component';
import UserList from './Components/User-list.component';

import './App.scss';

function App() {
  return (
    <div className='App'>
      <UserList dataSource='https://jsonplaceholder.typicode.com/users' />
      <UserProfile
        name='Donghao'
        email='Donghao@gmail.com'
        dataSource='https://jsonplaceholder.typicode.com/posts'
      />
    </div>
  );
}

export default App;