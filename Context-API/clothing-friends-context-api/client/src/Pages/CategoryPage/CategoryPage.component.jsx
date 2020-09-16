import React, { useContext } from 'react';

import CollectionItem from '../../Components/Collection-item/Collection-item.component';

import CollectionsContext from '../../contexts/collections/collections.context';

import './CategoryPage.styles.scss';

const CategoryPage = ({ match }) => {
  const collections = useContext(CollectionsContext);
  const collection = collections[match.params.collectionId];
  const { title, items } = collection;

  return (
    <div className='collection-page'>
      <h2 className='title'>{title}</h2>
      <div className='items'>
        {items.map(item => (
          <CollectionItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
};

export default CategoryPage;