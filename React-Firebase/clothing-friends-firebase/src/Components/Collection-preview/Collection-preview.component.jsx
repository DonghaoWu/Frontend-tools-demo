import React from 'react';

import './Collection-preview.styles.scss';
import CollectionItem from '../Collection-item/Collection-item.component'

const CollectionPreview = ({ title, items }) => {
    return (
        <div className="collection-preview">
            <h1 className='title'>{title.toUpperCase()}</h1>
            <div className='preview'>
                {
                    items
                        .filter((item, idx) => {
                            return idx < 4
                        })
                        .map(({ id, ...otherItemsProps }) => {
                            return <CollectionItem key={id} {...otherItemsProps} />
                        })
                }
            </div>
        </div>
    )
}

export default CollectionPreview;