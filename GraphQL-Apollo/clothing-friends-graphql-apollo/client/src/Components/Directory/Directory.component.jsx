import React from 'react';

import DirectoryItem from '../Directory-item/Directory-item.component';
import DIRECTORY_DATA from './Directory.data.js';

import './Directory.styles.scss';

const Directory = () => {
  return (
    <div className='directory-menu'>
      {DIRECTORY_DATA.map(({ id, ...otherSectionProps }) => (
        <DirectoryItem key={id} {...otherSectionProps} />
      ))}
    </div>
  );
};

export default Directory;