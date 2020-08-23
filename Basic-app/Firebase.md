1. register firebase, set up project name

2. get firebase web config variable

3. install firebase dependency

4. firebase firestore auth 三个组件，其中 firestore 和 auth 没有用到。
```diff
+ firebase -> initializeApp -> auth
+                           -> firestore
+                           -> provider

+ auth    
+ provider  ---> signInWithGoogle
```


5. Firebase API: 
```diff
`firebase.utils.js`
+ firebase.auth.GoogleAuthProvider()
+ auth.signInWithPopup(provider)
+ firestore.doc(`users/${userAuth.uid}`) --> get document with uid
+ userRef.get() --> Get a snapShop
+ userRef.set() --> Create a snapShop
``
```

6. firebase.utils.js 产生的几个变量：

- firebase，需要配置 config
- firestore，需要 firebase 已经配置好
- auth，需要 firebase 已经配置好
- signInWIthGoogle，需要 firebase API：
```diff
+ new firebase.auth.GoogleAuthProvider()
+ provider.setCustomParameters({ prompt: 'select_account' });
+ auth.signInWithPopup(provider)
```

- loadUserDataFromFirestore, 两个参数，一个是 userAuth， 另外一个是 additionalData。

- loadUserDataFromFirestore 执行逻辑：
    - 如果第一参数为 null，则直接停止；
    - 如果第一参数不为空，则取自带 key：`uid`
    - 使用 `uid` 和 firebase 自带API `firestore.doc(`users/${userAuth.uid}`)`，查找对应 user data
    - 无论有没有这个数据，都会返回 user data，返回的 user data 都会自带一个 firebase API：await userRef.get();
    - snapShot 里面有一个变量：exists，如果有就返回 user data，如果没有就使用 firebase 自带 API 创造一个 user data。

- 从上面看来，`firestore.doc` 返回一个`用户数据`，而验证这个用户数据是否真是存在就要使用 `.get` 从而产生 `snapShot`，snapShot 里面有一个变量 `exits` 可以证明这个用户数据是否存在在 firebase，如果存在就直接返回`用户数据`，如果不存在就使用 第一参数中的 `email, displayName`，还有另外的第二参数 additionalData，目前生成的 cretedAt 一并组成一个新的`用户数据`返回。

- 所以第一参数 `userAuth` 里面是包含至少 3 个参数，分别是 uid，displayName，email。

- 返回的 userData `userRef` 里面包含至少 3 个参数，分别是 displayName，email，createdAt。

```bash
Public Methods
public abstract void onAuthStateChanged (FirebaseAuth auth)
This method gets invoked in the UI thread on changes in the authentication state:

- Right after the listener has been registered
- When a user is signed in
- When the current user is signed out
- When the current user changes
```

- 下面来讨论 loadUserDataFromFirestore 的应用场景：

1. App.js

- 使用情景：先使用 firebase API，auth.onAuthStateChanged 判断是否有参数，这是一个理解难点，关键这里要判断参数是从哪里来的，

- onAuthStateChanged 是一个 listener，当 firebase 侦测到有用户 登录、注册、登出、更换时，自带 API ：`auth.onAuthStateChanged` 都会被调用，结合本 App.js 在启动的时候在 `compoenntDidMount` 打开 `auth.onAuthStateChanged`是为了侦测对应的 `用户信息` 有没有改变，在这里的调用相当于向 firebase 查询有没有`登陆中的用户有没有更改状态`。

- 具体操作是这样，`auth.onAuthStateChanged`打开了侦测，如果有更改信息（登录，注册、更换）时，就使用该信息（userAuth）作为 loadUserDataFromFirestore 的参数，生成一个用户数据（userRef），

```diff
有用户登录：
+ onAuthStateChanged 发现有用户登录了
+ onAuthStateChanged 有了第一参数
+ 调用 loadUserDataFromFirestore
+ 调用 firestore.doc 查找对应用户信息 userRef
+ 返回数据，使用 userRef.get() 返回 snapShot
+ 根据 snapShot.exists 判断用户信息是否存在在 firestore
+ 如果存在，则直接返回 userRef。
- 上面这一步应该会用到
+ 如果不存在，则生成一个新的 userRef 返回，然后返回新的 userRef。
- 上面这一步应该不会用到，要在注册用户的时候才会用到。
```

- 注意 componentDidMount 只执行一次。

2. Sign-up.component.js





- :star:8月21日，更新了 Header.component.jsx 和 App.js ，主要是增加 redirect 功能。

- 完成上面的功能之后再探索 auth.onAuthStateChanged