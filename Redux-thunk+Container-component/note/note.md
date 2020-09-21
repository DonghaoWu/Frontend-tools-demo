- ShopPage edition.

```jsx
  componentDidMount() {
    const { updateCollections } = this.props;
    const collectionRef = firestore.collection('collections');

    collectionRef.get().then(snapshot => {
      const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
      updateCollections(collectionsMap);
      this.setState({ loading: false });
    });
  }
```

```jsx
  snapshotListener = null;

  componentDidMount() {
    const { updateCollections } = this.props;
    const collectionRef = firestore.collection('collections');

    this.snapshotListener = collectionRef.onSnapshot(snapshot => {
      const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
      updateCollections(collectionsMap);
      this.setState({ loading: false });
    });
  }
```

[https://firebase.google.com/docs/firestore/use-rest-api]

```jsx
  snapshotListener = null;

  componentDidMount() {
    const { updateCollections } = this.props;
    const collectionRef = firestore.collection('collections');

    fetch(`https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/collections`).then(res => res.json).then(collections => console.log(collections))
  }
```

- [redux thunk]

    - npm i redux-thunk
    - store.js <add redux-thunk>
    - shop.types.js <add types and delete type>
    - shop.reducers.js <add isFetching & add new reducer cases errorMessages>
    - shop.actions.js
    - shop.selectors.js
    - ShopPage.component.jsx
    - shop.selectors.js <add new selector>

- a bug

- `shop.actions.js`
```js
export const fetchCollectionAsync = () => dispatch => {
    const collectionRef = firestore.collection('collections');
    dispatch(fetchCollectionsStart());

    collectionRef.get()
        .then(snapshot => {
            const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
            dispatch(fetchCollectionsSuccess(collectionsMap));
        })
        .catch(error => dispatch(fetchCollectionsFailure(error.message)));
}
```

- `shop.selectors.js`
```js
export const selectCollection = collectionUrlParam => {
    return createSelector(
        [selectCollections],
        collections => (collections ? collections[collectionUrlParam] : null)
    );
}

export const selectIsCollectionFetching = createSelector(
    [selectShop],
    shop => shop.isFetching
);
```

- `shop.reducer.js`
```js
import { FETCH_COLLECTIONS_START, FETCH_COLLECTIONS_SUCCESS, FETCH_COLLECTIONS_FAILURE } from './shop.types';

const INITIAL_STATE = {
  collections: null,
  isFetching: false,
  errorMessage: undefined
};

const shopReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_COLLECTIONS_START:
      return {
        ...state,
        isFetching: true
      };
    case FETCH_COLLECTIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        collections: action.payload
      };
    case FETCH_COLLECTIONS_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.payload
      };
    default:
      return state;
  }
};

export default shopReducer;
```

- `CollectionPage.component.jsx`

```jsx
import React from 'react';
import { connect } from 'react-redux';

import CollectionItem from '../../Components/Collection-item/Collection-item.component';

import { selectCollection } from '../../redux/shop/shop.selectors';

import './CollectionPage.styles.scss';

const CollectionPage = ({ collection }) => {
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
  );
};

const mapStateToProps = (state, ownProps) => ({
  collection: selectCollection(ownProps.match.params.collectionId)(state)
});

export default connect(mapStateToProps)(CollectionPage);
```

- [ontainer pattern]

    - ShopPage.component.jsx
    - collections-overview.comtainer.jsx <compose>
