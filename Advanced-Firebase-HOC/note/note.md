1. [moving shop data to Firebase] <code + data type change>

- NoSQL database
- ./client/src/firebase/firebase.utils.js

```js
const objectsToAdd = {
    hats:{
        id: 1,
        title: 'Hats',
        routeName: 'hats',
        items: [
            {
                id: 1,
                name: 'Brown Brim',
                imageUrl: 'https://i.ibb.co/ZYW3VTp/brown-brim.png',
                price: 25
            }
        ]
    },
    sneakers:{
        id: 2,
        title: 'Sneakers',
        routeName: 'sneakers',
        items: [
            {
                id: 10,
                name: 'Adidas NMD',
                imageUrl: 'https://i.ibb.co/0s3pdnc/adidas-nmd.png',
                price: 220
            }
        ]
    }
}
```

```js
export const amy = (collecitonKey, objectsToAdd) =>{
    const collectionRef = firestore.collection(collectionKey);
    console.log(collectionRef);

    const batch = firestore.batch();

    objectsToAdd.forEach(obj =>{
        const newDocRef = collectionRef.doc(obj.title);
        batch.set(newDocRef, obj)
    });

    batch.commit();
}
```

- ./src/App.js <add state to App.js> <run the code once then delete>
    - 
    ```js
    componentDidMount: amy('collections',collectionsArray.map(({title, items}) => {
        return {title, items}
    }))
    ```

- ./client/src/firebase/firebase.utils.js
    < concertCollectionsSnapShotToMap >

2. [Bring shop data to our app]

- ./src/Pages/ShopPage/ShopPage.compoennt.jsx <fetch data here>
- change to class component
- ./client/src/firebase/firebase.utils.js


3. [Adding shop data to redux]

- ./client/src/firebase/firebase.utils.js
- ./redux/shop/shop.types.js
- ./redux/shop/shop.actions.js
- ./src/Pages/ShopPage/ShopPage.compoennt.jsx 


4. [Firebase security]

```js
service cloud.firestore {
    match /databases/{database}/documents{
        match /{document=**}{
            allow read, write: if true
        }
    }
}
```

```js
service cloud.firestore {
    match /databases/{database}/documents{
        match /{document=**}{
            allow read, write: if false
        }
    }
}
```

```js
service cloud.firestore {
    match /databases/{database}/documents{
        match /users/{userId}{
            allow read, write: if request.auth != null && request.auth.uid == userId
        }
    }
}
```

```diff
+ get
+ users/uid
+ custom
+ uid, 
+ run
```

- Authenticated off === (request.auth === null)

- user security 2

```js
service cloud.firestore {
    match /databases/{database}/documents{
        match /users/{userId}{
            allow get: if request.auth != null && request.auth.uid == userId;
            allow create: if request.auth != null && request.auth.uid == userId;
        }
    }
}
```

- collections security

```js
service cloud.firestore {
    match /databases/{database}/documents{
        match /users/{userId}{
            allow get, write: if request.auth != null && request.auth.uid == userId;
        }
    }
    match /collections/{collectionId}{
        allow read;
        allow write: if request.auth != null && request.auth.uid == 'admin uid'
    }
}
```

- add cart security challenge

5. [HOC]

- shop.reducer.js <collections: null>
- SHopPage.component.jsx
- shop.selectors.js
- CollectionPage.component.jsx
- Components/with-spinner/with-spinner.component.jsx

```jsx
import React from 'react';

import { SpinnerContainer, SpinnerOverlay } from './with-spinner.styles.scss';

const WithSpinner = (WrappedComponent) => {
    const Spinner = ({ isLoading, ...otherProps }) => {
        isLoadig ? (
            <SpinnerOverlay>
                <SPinnerContainer />
            </SpinnerOverlay>
        ) : (
                <WrappedComponent {...otherProps} />
            )
    }
    return Spinner;
}

export default WithSpinner;
```
- Components/with-spinner/with-spinner.styles.scss
- ShopPage.component.jsx

```jsx
import WithSpinner from './';
const CollectionsOverviewWithSpinner = WithSpinner(CollectionsOverview);
const CollectionPageWithSpinner = WithSpinner(CollectionPage);

    class ShopPage extends React.Component {
        constructor(){
            super();

            this.state = {
                loading:true
            }
        }

        componentDidMount() {
            const { updateCollections } = this.props;
            const collectionRef = firestore.collection('collections');

            collectionRef.get().then(snapshot => {
                const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
                updateCollections(collectionsMap);
                this.setState({ loading: false });
            });
        }

        render() {
            const { match } = this.props;
            const {loading} = this.state;
            return (
                <div className='shop-page'>
                    <Route exact path={`${match.path}`} render={(props) => <CollectionsOverviewWithSpinner isLoading={loading} {...props}/>}/>
                    <Route path={`${match.path}/:collectionId`} render={(props) => <CollectionPageWithSpinner isLoading={loading} {...props}/>} />
                </div>
            )
        }
    }
```