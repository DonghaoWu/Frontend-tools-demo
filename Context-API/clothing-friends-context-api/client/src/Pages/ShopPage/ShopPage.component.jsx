import React from 'react';
import { Route } from 'react-router-dom';

import CollectionsOverview from '../../Components/Collections-overview/Collections-overview.component';
import CategoryPage from '../CategoryPage/CategoryPage.component';

const ShopPage = ({ match }) => (
  <div className='shop-page'>
    <Route exact path={`${match.path}`} component={CollectionsOverview} />
    <Route path={`${match.path}/:collectionId`} component={CategoryPage} />
  </div>
);

export default ShopPage;