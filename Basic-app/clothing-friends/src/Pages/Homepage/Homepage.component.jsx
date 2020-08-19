import React from 'react';
import './Homepage.styles.scss';
import Directory from '../../Components/Directory/Directory.component'

const HomePage = () => (
    <div className='homepage'>
        <h1>Welcome to my Homepage</h1>
        <Directory />
    </div>
);

export default HomePage;