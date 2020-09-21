import React from 'react';

import CollectionPreview from '../Collection-preview/Collection-preview.component';

import './Collections-overview.styles.scss';

const CollectionsOverview = ({ collections }) => (
    <div className='collections-overview'>
        {collections.map(({ id, ...otherCollectionProps }) => (
            <CollectionPreview key={id} {...otherCollectionProps} />
        ))}
    </div>
);

export default CollectionsOverview;