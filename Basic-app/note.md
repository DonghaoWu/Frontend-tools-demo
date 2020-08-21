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

- 8月20日，继续学习 ShopPage

- 增加 `ShopPage.component.jsx`,`Collection-preview.component.jsx`, `Collection-item.component.jsx`

`Collection-preview.component.jsx`

```jsx
import React from 'react';

import './Collection-preview.styles.scss';

const CollectionPreview = ({ title, items }) => {
    return (
        <div className="collection-preview">
            <h1 className='title'>{title.toUpperCase()}</h1>
            <div className='preview'>
                {
                    items
                        .filter((item, idx) => {
                            return idx < 4
                        })
                        .map((item) => {
                            return <div key={item.id}>{item.name}</div>
                        })
                }
            </div>
        </div>
    )
}

export default CollectionPreview;
```

`ShopPage.component.jsx`

```jsx
import React from 'react';
import SHOP_DATA from './shop.data';
import CollectionPreview from '../../Components/Collection-preview/Collection-preview.component'

class ShopPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collections: SHOP_DATA
        }
    }

    render() {
        const { collections } = this.state;
        return (
            <div className='shop-page'>
                {
                    collections.map(({ id, ...otherSectionProps }) => {
                        return <CollectionPreview key={id} {...otherSectionProps} />
                    })
                }
            </div>
        )
    }
}

export default ShopPage;
```

- 8月21日，在 header component 。 注意 Header 在app.js 中的位置是在 switch 上面的。

- react form `Signin.component.jsx` `Register.component.jsx`

- otherProps 的活用，把剩下的 property 全都放在一个叫做otherProps 的变量上面。

`form-input`
```jsx
import React from 'react';

import './Form-input.styles.scss';

const FormInput = ({ handleChange, label, ...otherProps }) => {
    return (
        <div className='group'>
            <input className='form-input' onChange={handleChange} {...otherProps} />
            {label ? (
                <label
                    className={`${
                        otherProps.value.length ? 'shrink' : ''
                        } form-input-label`}
                >
                    {label}
                </label>
            ) : null}
        </div>)
};

export default FormInput;
```

- 清楚 children 是什么, 这是一个特定词，用其他变量代替都不可以。

```jsx
import React from 'react';
import './Custom-button.styles.scss';

const CustomButton = ({ children, ...otherProps }) => {
    return (
        <button className="custom-button" {...otherProps}>
            {children}
        </button>
    )
}

export default CustomButton;
```

- 这种传递 参数到下一层，而且直接在 button 中使用{...otherProps} 的方法第一次见。

- 8月20日，学习 firebase

- documentation is your friend.

- how toset up firebase

- frontend and backend

- server database authentication

- backend coding

- firebase is a backend intergration solution.

- we don't need to work on back end with firebase.

- firebase from google.

- Add a firebase to application.

- add project: project name. crwn-db

- develop ; authentication section

- database section

- configure: add firebase to your web app, register app: crwn db

- copy the script to app, CDN
```js
<script>
var firebaseConfig ={};
```

- install dependency

```bash
npm i firebase
```

- google signin in firebase

- new folder: ./src/firebase.utils.js

```js
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
```

- 这里需要的是一个 config variable。
- authentication tag: set up sign0in method.
- google logo: enable, 

- sign in component
```js
import {signInWithGoogle} from '../../firebase.utils';

<CustomButton onClick={signInWithGoogle}>{' '} Sign in with Google {' '}</CustomButton>
```

- 接下来分析如何使用 signInWIthGoogle, 并使用返回的用户资料。

- authentication tag: users tag, -identifier, -provider.

- App.js

```js
import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';

import HomePage from './Pages/HomePage/HomePage.component';
import ShopPage from './Pages/ShopPage/ShopPage.component';
import Header from './Components/Header/Header.component';
import SignSignupPage from './Pages/SigninSignupPage/SignSignupPage.component'

import { auth } from '../../firebase.utils';

class App extends React.Component() {

    constructor() {
        super();
        this.state = {
            currentUser: null,
        }
    }

    unsubscribeFromAuth = null;

    componentDidMount() {
        this.unsubscribeFromAuth = auth.onAuthStateChanged(user => {
            this.setState({ currentUser: user })
        })
    }

    componentWillUnmount(){
        this.unsubscribeFromAuth();
    }

    render() {
        return (
            <div>
                <Header currentUser={this.state.currentUser}/>
                <Switch>
                    <Route exact path='/' component={HomePage} />
                    <Route exact path='/shop' component={ShopPage} />
                    <Route exact path='/signin' component={SignSignupPage} />
                </Switch>
            </div >
        );
    }
}

export default App;
```

- Header;

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.styles.scss';
import { ReactComponent as Logo } from '../../assets/crown.svg';
import {auth} from '../..//firebase/firebase.utils';

const Header = ({currentUser}) => {
    return (
        <div className='header'>
            <Link to='/'>
                <Logo className='logo'></Logo>
            </Link>
            <div className='options'>
                <Link className='option' to='/shop'>SHOP</Link>
                <Link className='option' to='/contact'>CONTACT</Link>
                {
                    currentUser?
                (<div className='option' onClick={()=>auth.signOut()}>SIGN OUT</div>)
                : (<Link className='option' to='/signin'>SIGN IN</Link>)
                }
            </div>
        </div>
    )
}

export default Header;
```

```js
import React from 'react';
import './Custom-button.styles.scss';

const CustomButton = ({ children, isGoogleSignIn,...otherProps }) => {
    return (
        <button className={`${isGoogleSignIn ? 'google-sign-in':''} custom-button`}{...otherProps}>
            {children}
        </button>
    )
}

export default CustomButton;
```

- 上面使用的是条件分配 style

```js
import React from 'react';

import './Sign-in.styles.scss';
import FormInput from '../Form-input/Form-input.component';
import CustomButton from '../Custom-button/Custom-button.component';
import {signInWithGoogle} from '../../firebase.utils';

class Signin extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: ''
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ email: '', password: '' });
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        return (
            <div className='sign-in'>
                <h2>I already have an account.</h2>
                <span>Sign in with your email and password.</span>
                <form onSubmit={this.handleSubmit}>
                    <FormInput
                        name='email'
                        type='email'
                        label='email'
                        handleChange={this.handleChange}
                        value={this.state.email}
                        required
                    />
                    <FormInput
                        name='password'
                        type='password'
                        label='password'
                        handleChange={this.handleChange}
                        value={this.state.password}
                        required
                    />
                    <div className='buttons'>
                    <CustomButton type="submit" >Sign in</CustomButton>
                    <CustomButton onClick={signInWithGoogle isGoogleSignIn}>{' '} Sign in with Google {' '}</CustomButton>
                    </div>
                </form>
            </div>
        )
    }
}

export default Signin;
```

- isGoogleSignIn 出错。

- 接着学习，firebase firestore

- database tag

- start in test mode

- allow read, write;

- enable

- rules tag

- collection data type: object type, document ID-field-type-value

- collections & documents, collection 是大类，document 是具体一个。

- how things store in database and how to retrieve data from firebase

- firestore returns us two tyoes of objects: references and snapshots. Of these objects, they can be either document or collection versions.

- firestore will always return us these objects, even if nbothing existsat from that query.

```js
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {};

export const creatUserProfileDocument = async(userAuth, addtionalData)=>{
    if(!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);

    const snapShot = await userRef.get();

    if(!snapShot.exists){
        const {displayName, email} = userAuth;
        const createdAt = new Date();

        try{
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            })

        }catch(error){
            console.log('error creating user', error.message);
        }
    }

    return userRef;
}

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
```



- documentRef returns a documentSnapshot object.
- collectionRef returns a querySnapshot object.

- database rules publish tag

```js
service cloud.firestore{
    match /databases/{database}/documents{
        match /{document=**}{
            allow read, write;
        }
    }
}
```

- store user data in our app

```js
    componentDidMount() {
        this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
            if(userAuth){
                const userRef = await createUserProfileDocument(userAuth);

                userRef.onSnapshot(snapshot =>{
                    console.log(snapshot.data());
                    this.setState({
                        currentUser:{
                            id:snapshot.id,
                            ...snapshot.data()
                        }
                    },()=>{
                        console.log(this.state.currentUser);
                    })
                })
            }
            else{
                this.setState({currentUser:userAuth});
            }
        })
    }
```


- sign up component

- sign up component

```js
import React from 'react';

import FormInput from '';
import Custombutton from '';

import {auth, createUserProfileDocument} from '';

class SignUp extends React.Component{
    constructor(){
        super();
        this.state = {
            displayName:'',
            email:'',
            password:'',
            confirmPassword:'',
        }
    }

    handleSubmit = async (event)=>{
        event.preventDefault();

        const {displayName, email,password, confirmPassword} = this.state;

        if(password !== confirmPassword){
            alert("passwords don't match!");
            return;
        }

        try{
            const {user} = await auth.createUserWIthEmailAndPassword(email,password);

            await createuserProfileDocument(user,{displayName});

            this.setState({
                displayName:'',
                email:'',
                password:'',
                confirmPassword:'',
            })
        }catch(error){
            console.error(error)
        }
    }

    handleChange = event=>{
        this.setstate({[event.target.name]:event.target.value})
    }

    render(){
        return(
            <div className='sign-up'>
            <h2 className='title'>I do not have an account.</h2>
            <sapn>Sign up with your email and password.</span>
            <from className='sign-up-form' onSubmit={this.handleSubmit}>
            <FormInput
                type='text'
                name='displayName'
                value={displayName}
                onChange={this.handleChange}
                label='Display Name'
                required
            />
            <FormInput
                type='email'
                name='email'
                value={email}
                onChange={this.handleChange}
                label='Email'
                required
            />
            <FormInput
                type='password'
                name='password'
                value={password}
                onChange={this.handleChange}
                label='Password'
                required
            />
            <FormInput
                type='password'
                name='confirmPassword'
                value={confirmPassword}
                onChange={this.handleChange}
                label='Confirm Password'
                required
            />
            </form>
                <CustomButton type='submit'>SIGN UP</CustomButton>
            
            </div>
        )
    }
}

export default SignUp;
```

```css
.sign-up {
  display: flex;
  flex-direction: column;
  width: 380px;

  .title {
    margin: 10px 0;
  }
}
```

- Bring in sign in and sign up components

```jsx
<div className='sign-in-and-sign-up'>
<SignIn />
<SignUp />
</div>
```

```css
.sign-in-and-sign-up {
  width: 850px;
  display: flex;
  justify-content: space-between;
  margin: 30px auto;
}
```

- enable allow write authentication.

- Authentication tag -> email/password -> enable -> save

- implement sign in with email and password

- 
- sign-in component
```js
import {auth} from ...

handleSubmit = async (event)=>{
    event.preventDefault();

    try{
        await auth.signInwithEmailAndPassword(email, password);
        this.setState({email:'',assword:''});
    }catch(error){
        console.log(error);
    }
}
```


