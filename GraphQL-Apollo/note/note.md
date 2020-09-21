1. npm i apollp-boost react-apollo graphql
2. 
- Spinner.component.jsx
- Collections-overview.component.jsx
- Collections-overview.container.jsx
- ShopPage.component.jsx
- index.js

3. `collection.container.jsx`
```js
  <Query
    query={GET_COLLECTION_BY_TITLE}
    variables={‌{ title: match.params.collectionId }}
  >
    {({ loading, data }) => {
      if (loading) return <Spinner />;
      const { getCollectionsByTitle } = data; <===== // Like so
      return <CollectionPage collection={getCollectionsByTitle} />;
    }}
  </Query>
```

4. 
- CategoryPage.component.jsx
- CategoryPage.container.jsx
- ShopPage.component.jsx

5. 