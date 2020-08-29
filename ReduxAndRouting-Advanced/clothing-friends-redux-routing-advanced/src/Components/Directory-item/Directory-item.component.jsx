import React from 'react';
import './Directory-item.styles.scss';
import { withRouter } from 'react-router-dom';

const DirectoryItem = ({ title, imageUrl, size, history, linkUrl, match }) => {
    return (
        <div className={`${size} directory-item`}>
            <div className='background-image' style={{ backgroundImage: `url(${imageUrl})` }} />
            <div className='content' onClick={() => history.push(`${match.url}${linkUrl}`)}>
                <h1 className='title'>{title.toUpperCase()}</h1>
                <span className='subtitle'>SHOP NOW</span>
            </div>
        </div>
    )
};

export default withRouter(DirectoryItem);