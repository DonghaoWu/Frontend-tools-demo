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

- [ontainer pattern]

    - ShopPage.component.jsx
    - collections-overview.comtainer.jsx <compose>
    - 
