1. npm i apollp-boost react-apollo graphql

2. query with no variables

- Spinner.component.jsx
- Collections-overview.component.jsx
- Collections-overview.container.jsx
- ShopPage.component.jsx
- index.js

3. 
`collection.container.jsx`
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

4. query with variables

- CategoryPage.component.jsx
- CategoryPage.container.jsx
- ShopPage.component.jsx

5. Mutation

- ./graphql/resolvers
- index.js

- Header.component.jsx
- Header.container.jsx

- App.js

- Cart-icon.component.jsx
- Cart-icon.container.jsx

- Header.component.jsx