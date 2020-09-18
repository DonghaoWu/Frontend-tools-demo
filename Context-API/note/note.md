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

- consumer : static data / initial data
- provider : dynamic data
- 以下两个变量未处理：
```js
import { setDisplayName } from './redux/display-name/display-name.actions';
import { selectInputDisplayName } from './redux/display-name/display-name.selectors';
```

- 第一步，如何传输 static data
- 第二步，如何传输 dynamic state，不是简单通过 parent component 到 child component。
- 第三步，
- 最后一步，删除 redux 和 react-redux。
- 弄清楚上传与下载的动作代码在哪里发生。

- Provider context pattern

- 