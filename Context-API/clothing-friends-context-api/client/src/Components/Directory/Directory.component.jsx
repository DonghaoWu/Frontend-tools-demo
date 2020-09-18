import React, { useContext } from 'react';

import DirectoryItem from '../Directory-item/Directory-item.component';

import DirectoryContext from '../../contexts/directory/directory.context'

import './Directory.styles.scss';

const Directory = () => {
  const sections = useContext(DirectoryContext);
  return (
    <div className='directory-menu'>
      {sections.map(({ id, ...otherSectionProps }) => (
        <DirectoryItem key={id} {...otherSectionProps} />
      ))}
    </div>
  );
}

export default Directory;