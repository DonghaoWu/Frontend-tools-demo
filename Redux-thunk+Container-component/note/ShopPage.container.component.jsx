import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import CollectionsOverviewContainer from '../../Components/Collections-overview/Collections-overview.container';
import CollectionPageContainer from '../CollectionPage/CollectionPage.container';

import { fetchCollectionAsync } from '../../redux/shop/shop.actions';

class ShopPage extends React.Component {
  componentDidMount() {
    this.props.fetchCollectionAsync();
  }

  render() {
    const { match } = this.props;
    return (
      <div className='shop-page'>
        <Route exact path={`${match.path}`} component={CollectionsOverviewContainer} />
        <Route path={`${match.path}/:collectionId`} component={CollectionPageContainer} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchCollectionAsync: () => dispatch(fetchCollectionAsync()),
});

export default connect(null, mapDispatchToProps)(ShopPage);