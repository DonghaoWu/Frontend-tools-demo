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

5. Mutation (难点)

- ./graphql/resolvers
- index.js

- Header.component.jsx
- Header.container.jsx

- App.js

- Cart-icon.component.jsx
- Cart-icon.container.jsx

- Header.component.jsx

//-- working 4:45

6. Adding items with apollo

- index.js
- ./graphql/cart.utils.js
- resolvers.js
- Cart-dropdown.component.jsx
- Cart-dropdown.container.js
- Header.component.jsx


- Collection-item.component.jsx
- Collection-item.container.jsx
- Collection-preview.component.jsx

7. npm install lodash
```jsx
import { flowRight } from 'lodash';
// export default compose(
//   //...code 
// )(CollectionItemContainer);

export default flowRight(
  // ...code
)(CollectionItemContainer);
```

8. Cart item count with Apollo

- index.js
- cart.utils.js

```js
export const getCartItemCount = cartItems =>{
  return cartItems.reduce(
    (accumalatedQuantity, cartItem) =>{
      return accumalatedQuantity + cartItem.quantity,
    },0)
}
```

- resolvers.js
- Cart-icon.container.jsx
- Cart-icon.component.jsx

9. compose

- Cart-icon.container.jsx