```bash
git clone <link>
git remote remove origin

create a repo in github

git remote add origin <link>
git add .
git commit -m'first commit'
git push

npm i

npx create-react-app clothing-friends
```

sass

```bash
npm i node-sass
```

- inline background image css in react component `(MenuItem.component.jsx)`

- 8月19日晚，重点是 `(MenuItem.component.jsx)`和 `(Directory.component.jsx)`还有 `(MenuItem.styles.scss)` 

- 8月20日，学习 react routing

- SPA & SSR

- React-router

- front end routing

- react router dom

```bash
npm react-router-dom
```
```jsx
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
```

```js
      <Route exact path='/' component={Homepage} />
```

- exact 的作用。

- 有 Switch 跟没有的区别

- demo: 

```jsx
      <Route path='/topics/:topicId' component={TopicDetail} />
```

- 就算父组件没有像子组件传递任何已定义 props，但是子组件仍然会继承 很多 props，其中包括 match，history,location
- routing paramerters

- history, location, match

- path property: 

- match property: props.match.params.topicId

- history: Link, two ways to navigate in react-router-dom, one is Link,another is history push

- Link component, what to re-render

```jsx
<button onClick = {()=>props.history.push('/topics')}></button>
```

- 第二种做法的好处是

- location:

- 总结： history，注意 push

- location, 注意 pathname

- match, 注意 params，url， 如使用当前 url

```js
<Link to={`${props.match.url}/${props.match.params.topicsId}`}>next</Link>
```

- 以上展示的是 dynamic routing，表示无论之前的 route 怎么改变，后面的都不会改变从而不需要修改。作用类似于 `__dirname`

- 使用 withRouter， 为什么要使用？ 因为从上到下传递 history 是很重复且无效的动作，使用 withRouter 就可以直接拿到 history 和 match，需要从最上层的 Homepage 往下传，如，如果需要传递，就是这样：

```jsx
import React from 'react';
import './Menu-item.styles.scss';

const MenuItem = ({ title, imageUrl, size, history, linkUrl, match }) => {
    return (
        <div className={`${size} menu-item`}>
            <div className='background-image' style={{ backgroundImage: `url(${imageUrl})` }} />
            <div className='content' onClick={() => history.push(`${match.url}${linkUrl}`)}>
                <h1 className='title'>{title.toUpperCase()}</h1>
                <span className='subtitle'>SHOP NOW</span>
            </div>
        </div>
    )
};

export default MenuItem;
```

- 上面的 props 中 title, imageUrl, size, linkUrl, match,history, 都是从 Directory 中取得，并且 history 和 match 还需要从 Homepage 中传给 Directory, 注意，如果不传递，history 和 match 都是 `undefined`.

- 有了 withRouter 就可以省略这个步骤，即：

```jsx
import React from 'react';
import './Menu-item.styles.scss';
import { withRouter } from 'react-router-dom';

const MenuItem = ({ title, imageUrl, size, history, linkUrl, match }) => {
    console.log(history);
    console.log(match, '====>')
    return (
        <div className={`${size} menu-item`}>
            <div className='background-image' style={{ backgroundImage: `url(${imageUrl})` }} />
            <div className='content' onClick={() => history.push(`${match.url}${linkUrl}`)}>
                <h1 className='title'>{title.toUpperCase()}</h1>
                <span className='subtitle'>SHOP NOW</span>
            </div>
        </div>
    )
};

export default withRouter(MenuItem);
```

- 还可以使用 Link 来处理：

```jsx
import React from 'react';
import './Menu-item.styles.scss';
import { Link } from 'react-router-dom';

const MenuItem = ({ title, imageUrl, size, linkUrl }) => {
    return (
        <div className={`${size} menu-item`}>
            <div className='background-image' style={{ backgroundImage: `url(${imageUrl})` }} />

            <div className='content'>
                <Link to={`/${linkUrl}`}>
                    <h1 className='title'>{title.toUpperCase()}</h1>
                    <span className='subtitle'>SHOP NOW</span>
                </Link>
            </div>
        </div>
    )
};

export default MenuItem;
```

- 具体这三种方式有什么不同和优缺点，后面补充。

- React-router-dom 这一章的重点在于 3个 properties 还有 withRouter。`(MenuItem.component.jsx)` 和 `(Directory.component.jsx)`

```js
    render() {
        return (
            <div className='directory-menu'>
                {
                    this.state.sections.map(({ title, imageUrl, id, size, linkUrl }) => {
                        return <MenuItem key={id} title={title} imageUrl={imageUrl} size={size} linkUrl={linkUrl}/>
                    })
                }
            </div>
        )
    }

```

```js
    render() {
        return (
            <div className='directory-menu'>
                {
                    this.state.sections.map(({ id, ...otherSectionProps}) => {
                        return <MenuItem key={id} {...otherSectionProps}/>
                    })
                }
            </div>
        )
    }
```



- 8月20日，继续学习

