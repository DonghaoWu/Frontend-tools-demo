import React from 'react';
import { Route } from 'react-router-dom';

import { default as CollectionsOverview } from '../../Components/Collections-overview/Collections-overview.container';
import { default as CategoryPage } from '../CategoryPage/CategoryPage.container';

const ShopPage = ({ match }) => (
  <div className='shop-page'>
    <Route exact path={`${match.path}`} component={CollectionsOverview} />
    <Route path={`${match.path}/:collectionId`} component={CategoryPage} />
  </div>
);

export default ShopPage;