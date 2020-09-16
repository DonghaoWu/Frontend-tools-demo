1. redux base + local data
2. 

- collectionPage.component.jsx
- shop.reducer.js
- shop.data.js


- contexts/collections/collections.context.js
- contexts/collections/shop.data.js

```js
import { createContext } from 'react';
import SHOP_DATA from './shop.data'

const CollectionsContext = createContext(SHOP_DATA);

export default CollectionsContext;
```

- collectionPage.component.jsx

```js
import CollecitonsContext from '../../contexts/collections/collections.context.js';

const CollectionPage = ({ match }) =>{
    return(
        <CollectionsContext.consumer>
        {
            collections => {
                const collection = collections[match.params.collectionId];
                const { title, items } = collection;
                return(
                    <div className='collection-page'>
                    <h2 className='title'>{title}</h2>
                    <div className='items'>
                        {items.map(item => (
                            <CollectionItem key={item.id} item={item} />
                        ))}
                    </div>
                )
            } 
        }
        </CollectionsContext.consumer>
    )
}
export default CollectionPage;
```

```js
import React, { useContext } from 'react';

import CollectionItem from '../../Components/Collection-item/Collection-item.component';

import CollecitonsContext from '../../contexts/collections/collections.context.js';

import './CollectionPage.styles.scss';

const CollectionPage = ({ match }) => {
    const collections = useContext(CollectionsContext);
    const collection = collections[match.params.collectionId];
    const { title, items } = collection;

    return(
        <div className='collection-page'>
            <h2 className='title'>{title}</h2>
            <div className='items'>
                {items.map(item => (
                    <CollectionItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    )
}
export default CollectionPage;
```