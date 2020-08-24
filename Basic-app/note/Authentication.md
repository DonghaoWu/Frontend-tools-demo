# Web development tools (Part 25)

### `Key Word: jsonwebtoken, redis, window.localStorage, session, componentDidMount load user, authorization middleware.`

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/WebDev-tools-demo/blob/master/README.md)

## `Section: Authentication.` (Basic)

### `Summary`: In this documentation, we learn to add authentication to application.

### `Check Dependencies & Tools:`

- jsonwebtoken
- redis

------------------------------------------------------------

#### `本章背景：`
- 本章的设置分为 frontend 和 backend 的设置。
- 在 backend 主要设置 route：
```js
app.post('/signin', (req, res) => { signin.signinAuthentication(req, res, db, bcrypt) })
```

- 在 front end 主要设置 App.js 和 Signin.js，这两个 组件都会用到上面的 backend route。

- 理想情况下，可以把上面的 route 拆分成两条，分别用于 App.js 和 Signin.js。

- 设计图形：

<p align="center">
<img src="../assets/p25-01.png" width=90%>
</p>

------------------------------------------------------------
- 设计思路：

1. 后端思路：一个用户接触 signin route，系统会调用 signinAuthentication，在这里面会先做一个判断，在 req.headers 有没有 authorization key？

    - 有，就调用 hasTokenAndGetIdFromRedis，使用已知的 authorization 值去 redis 查询__`获得 id 并 json 返回。`__

    - 没有，就调用 noTokenSigninAndGetUser，先检查里面包含的 email 和 password 是否符合，成功后获得 id 和 email，然后把 email 作为参数配合 jsonwebtoken 转化成 token 并储存在 redis 里面。__`最后把 id，token 还有一些另外信息打包成 session 然后 json 返回。`__

    - 这里要说明的是 redis 里面的信息每条是以 token 为 key，id 为 value 的，而 token 其实使用 email 转化而来。

2. 前端思路：

    - 每次开始读取 App.js 的时候都要先检查 window.localStorage 有没有 token，如果有就调用 backend 的 signin route，其实就是调用 hasTokenAndGetIdFromRedis，最后返回 id，`然后根据 id 获取用户其他信息，最后转换到 home 页并加载用户信息到 state。`

    - 如果 App.js 检测不到 token，就按照 initialState 转到 Signin page，在 Signin page 填写 email 和 password 之后，在 onSubmitSignin 处调用 backend 的 signin route，其实就是调用 noTokenSigninAndGetUser，`最后返回包含 id 和 token 的 session data，把 token 保存在 window.localStorage 中，然后根据 id 获取用户其他信息，最后转换到 home 页并加载用户信息到 state。`

3. 后期工作：
    - signout 加入 delete session 功能。（已完成）
    - table 加入 age 和 pet 属性。 （已完成）
    - register 加入 session 内容。 （已完成, 修改 Register.js 和 register.js）
    - 前端登录后手动撤掉 session 后调用其他功能会返回 Signin page，token 被删除或失效。（已完成）
    - 后端发现没 token 调用会报错，也就是说测试一个功能要从前端和后端一同测试，给出前端的反应行为，同时在后端也要在 postman 上面测试反应行为。（已完成）


    - 增加前端错误信息显示条，比如说前端和后端都遇到错误，前端进行页面跳转并显示来自后端的错误信息。
    - 提升 code 的逻辑，减少重复。
    - 增加 errorHandler。
------------------------------------------------------------

### <span id="25.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/WebDev-tools-demo/blob/master/README.md)

- [25.1 Install dependencies (backend).](#25.1)
- [25.2 Work on back end signin route.](#25.2)
- [25.3 Store token and load user automatically in Front end.](#25.3)
- [25.4 Middleware.](#25.4)
- [25.5 Others.](#25.5)

------------------------------------------------------------

### <span id="25.1">`Step1: Install dependencies (backend).`</span>

- #### Click here: [BACK TO CONTENT](#25.0)

1. Install depenencies.

    ```bash
    $ npm i jsonwebtoken
    $ npm i redis
    ```

2. Apply

    __`Location:./demo-apps/backend-smart-brain-api-Auth/controllers/signin.js`__

    ```js
    const jwt = require('jsonwebtoken');
    const redis = require('redis');

    // setup Redis:

    const redisClient = redis.createClient(process.env.REDIS_URI);
    ```


#### `Comment:`
1. redis 连接本地, 当然还要使用本地连接 redis 的命令 

  ```js
  const redisClient = redis.createClient({ host: '127.0.0.1' });
  ```

  - start local redis server:
  ```bash
  $ cd
  $ cd redis-6.0.6 # depends on your redis version
  $ src/redis-server
  ```

  - redis docker: 
  ```js
  const redisClient = redis.createClient(process.env.REDIS_URI);
  ```

  ```.env
  REDIS_URI=redis://redis:6379
  ```

### <span id="25.2">`Step2: Work on back end signin route.`</span>

- #### Click here: [BACK TO CONTENT](#25.0)

1.  Change the function name

    __`Location:./demo-apps/backend-smart-brain-api-Auth/server.js`__


```diff
- app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

+ app.post('/signin', (req, res) => { signin.signinAuthentication(req, res, db, bcrypt) })
```

2. Add the new function.

    __`Location:./demo-apps/backend-smart-brain-api-Auth/controllers/signin.js`__

```js
const signinAuthentication = (req, res, db, bcrypt) => {
  const { authorization } = req.headers;
  return authorization ? hasTokenAndGetIdFromRedis(req, res)
    : noTokenSigninAndGetUser(req, res, db, bcrypt)
      .then(data => {
        return data.id && data.email ? createSession(data) : Promise.reject(data)
      })
      .then(session => {
        return res.json(session);
      })
      .catch(err => {
        return res.status(400).json(err)
      });
}
```

3. Add function hasTokenAndGetIdFromRedis. （有 token 的时候就用 token 在 redis 中取得 id。）

    __`Location:./demo-apps/backend-smart-brain-api-Auth/controllers/signin.js`__

```js
const hasTokenAndGetIdFromRedis = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized.');
    }
    return res.json({ id: reply })
  })
}
```

4. Promise the handleSignin function, and change the name to noTokenSigninAndGetUser.（无 token 的时候先验证 email 和 password， 然后在 postgres database 中获得 email 和 id。）

    __`Location:./demo-apps/backend-smart-brain-api-Auth/controllers/signin.js`__

```diff

-const handleSignin = (db, bcrypt) => (req, res) => {
-  const { email, password } = req.body;
-  if (!email || !password) {
-    return res.status(400).json('incorrect form submission');
-  }
-  db.select('email', 'hash').from('login')
-    .where('email', '=', email)
-    .then(data => {
-      const isValid = bcrypt.compareSync(password, data[0].hash);
-      if (isValid) {
-        return db.select('*').from('users')
-          .where('email', '=', email)
-          .then(user => {
-            res.json(user[0])
-          })
-          .catch(err => res.status(400).json('unable to get user'))
-      } else {
-        res.status(400).json('wrong credentials')
-      }
-    })
-    .catch(err => res.status(400).json('wrong credentials'))
-}


+const noTokenSigninAndGetUser = (req, res, db, bcrypt) => {
+  const { email, password } = req.body;
+  if (!email || !password) {
+    return Promise.reject('incorrect form submission');
+  }
+  return db.select('email', 'hash').from('login')
+    .where('email', '=', email)
+    .then(data => {
+      const isValid = bcrypt.compareSync(password, data[0].hash);
+      if (isValid) {
+        return db.select('*').from('users')
+          .where('email', '=', email)
+          .then(user => {
+            return Promise.resolve(user[0]);
+          })
+          .catch(err => Promise.reject('unable to get user'))
+      } else {
+        return Promise.reject('wrong credentials (wrong password)')
+      }
+    })
+    .catch(err => Promise.reject('wrong credentials (wrong email)'))
+}
```

5. Create session.（接上，获得 id 和 email 之后以 email 作为参数生成 token，然后储存在 redis 中，最后返回一个包含 id 和 token 等信息的 session data）。

    __`Location:./demo-apps/backend-smart-brain-api-Auth/controllers/signin.js`__

```js
const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
}

const setToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, id))
}

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return {
        success: 'true',
        userId: id,
        token: token
      }
    })
    .catch(err => {
      return Promise.reject(`creact session failed.`)
    })
}
```
------------------------------------------------------------

#### `Comment:`
1. 无论是有没有 token，经过 signin route 之后，所有成功的话都可以返回一个包含 user id 信息的 data。
2. :star::star:至于为什么没有 token 的情况除了返回 id 之外还返回 token，因为前端成功 signin 之后需要拿 token 放在 window.localStorage 中作为缓存。

3. 完整文件：

```js
const jwt = require('jsonwebtoken');
const redis = require('redis');

// setup Redis:
const redisClient = redis.createClient(process.env.REDIS_URI);

const noTokenSigninAndGetUser = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            return Promise.resolve(user[0]);
          })
          .catch(err => Promise.reject('unable to get user'))
      } else {
        return Promise.reject('wrong credentials (wrong password)')
      }
    })
    .catch(err => Promise.reject('wrong credentials (wrong email)'))
}

const hasTokenAndGetIdFromRedis = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized.');
    }
    return res.json({ id: reply })
  })
}

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
}

const setToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, id))
}

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return {
        success: 'true',
        userId: id,
        token: token
      }
    })
    .catch(err => {
      return Promise.reject(`creact session failed.`)
    })
}

const signinAuthentication = (req, res, db, bcrypt) => {
  const { authorization } = req.headers;
  return authorization ? hasTokenAndGetIdFromRedis(req, res)
    : noTokenSigninAndGetUser(req, res, db, bcrypt)
      .then(data => {
        return data.id && data.email ? createSession(data) : Promise.reject(data)
      })
      .then(session => {
        return res.json(session);
      })
      .catch(err => {
        return res.status(400).json(err)
      });
}

module.exports = {
  signinAuthentication: signinAuthentication
}
```

### <span id="25.3">`Step3: Store token and load user automatically in Front end.`</span>

- #### Click here: [BACK TO CONTENT](#25.0)

1. Handle no token (Signin.js).

    __`Location:./demo-apps/frontend-smart-brain-Auth/src/components/Signin/Signin.js`__


```js
  saveAuthTokenInSession = (token) => {
    window.localStorage.setItem('token', token);
  }

  onSubmitSignIn = () => {
    fetch('http://localhost:4000/signin', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword
      })
    })
      .then(response => response.json())
      .then(session => {
        if (session.userId && session.success === 'true') {
          this.saveAuthTokenInSession(session.token);
          fetch(`http://localhost:4000/profile/${session.userId}`, {
            method: 'get',
            headers: {
              'Content-type': 'application/json',
              'Authorization': session.token
            }
          })
            .then(res => res.json())
            .then(user => {
              if (user && user.email) {
                this.props.loadUser(user);
                this.props.onRouteChange('home');
              }
            })
            .catch(err => {
              console.log(err);
            })
        }
      })
      .catch(err => {
        console.log(err);
      })
  }
```

2. Handle token (App.js).

    __`Location:./demo-apps/frontend-smart-brain-Auth/src/App.js`__

```js
  componentDidMount() {
    const token = window.localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:4000/signin', {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
          'Authorization': token
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.id) {
            fetch(`http://localhost:4000/profile/${data.id}`, {
              method: 'get',
              headers: {
                'Content-type': 'application/json',
                'Authorization': token
              }
            })
              .then(res => res.json())
              .then(user => {
                if (user && user.email) {
                  this.loadUser(user);
                  this.onRouteChange('home');
                }
              })
          }
        })
        .catch(err => {
          console.log('failed');
        })
    }
  }
```

#### `Comment:`
1. 这就是 react 前端处理 authentication 的常用操作，当然一条 route 分两个 componet 公用的方法可以改善。
2. :star::star::star:但上面用到的 componentDidMount 和 window.localStorage 的思路都是 authentication 里面必须的。

### <span id="25.4">`Step4: Middleware.`</span>

- #### Click here: [BACK TO CONTENT](#25.0)

1. Create a middleware.

    __`Location:./demo-apps/backend-smart-brain-api-Auth/middlewares/authorization.js`__

```js
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URI);

const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json('Unauthorized')
    }
    return redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(401).json('Unauthorized');
        }
        console.log('pass middleware');
        return next();
    })
}

module.exports = {
    requireAuth,
}
```

2. Add middleware to routes.

    __`Location:./demo-apps/backend-smart-brain-api-Auth/server.js`__

```diff
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
+ const auth = require('./middlewares/authorization');

const db = knex({
  client: process.env.POSTGRES_CLIENT,
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
  }
});

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => { res.send(`This message is from server.js. You will get this message when visit http://localhost:4000/`) })
app.post('/signin', (req, res) => { signin.signinAuthentication(req, res, db, bcrypt) })
app.post('/register', (req, res) => { register.registerAuthentication(req, res, db, bcrypt) })
+ app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) })
+ app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) });
+ app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) })
+ app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) })

app.listen(4000, () => {
  console.log('app is running on port 4000');
})
```

3. Add header in Front end api call.

    __`Location:./demo-apps/frontend-smart-brain-Auth/src/App.js`__

```diff
  onButtonSubmit = () => {
+   const token = window.localStorage.getItem('token');
+   if (!token) {
+     this.setState(initialState);
+     window.localStorage.removeItem('token');
+     return;
+   }
    this.setState({ imageUrl: this.state.input });
    fetch('http://localhost:4000/imageurl', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
+       'Authorization': token,
      },
      body: JSON.stringify({
        input: this.state.input
      })
    }).then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:4000/image', {
            method: 'put',
            headers: {
              'Content-type': 'application/json',
+             'Authorization': token,
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)

        }
        this.displayFaceBox(this.calculateFaceLocations(response))
      })
      .catch(err => console.log(err));
  }
```


__`Location:./demo-apps/frontend-smart-brain-Auth/src/components/Profile/Profile.js`__

```diff
    onProfileUpdate = (data) => {
+       const token = window.localStorage.getItem('token');
+       if (!token) {
+           this.props.loadUser(this.props.initialState);
+           window.localStorage.removeItem('token');
+           this.props.onRouteChange('signin');
+           this.props.toggleModal();
+           return;
+       }
        fetch(`http://localhost:4000/profile/${this.props.user.id}`, {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
+               'Authorization': token,
            },
            body: JSON.stringify({
                formInput: data
            })
        }).then(resp => {
            if (resp.status === 200 || resp.status === 304) {
                this.props.toggleModal();
                this.props.loadUser({ ...this.props.user, ...data });
            }
        }).catch(console.log)
    }
```

#### `Comment:`
1. 这个 middleware 的作用是从 req.headers 中提取 token，然后查询 redis，如果没有结果就停止进程 return，如果有就不用传输数据，直接进入 route 的下一步。

2. :star::star:这个 middleware 可以加上一个 errorHandler 在 server.js 的，后面增加。

3. 上面的前端代码增加了处理 token 无效或者手动删除 session 的情况。

### <span id="25.5">`Step5: Others.`</span>

- #### Click here: [BACK TO CONTENT](#25.0)

1. 在 docker 中使用 redis cli：
```bash
$ docker-compose exec redis redis-cli
```

2. 查看正在运行的 redis 端口：

```bash
$ ps aux | grep redis
```

#### `Comment:`
1. 

------------------------------------------------------------

__`本章用到的全部资料：`__

1. [Bearer token I](https://security.stackexchange.com/questions/108662/why-is-bearer-required-before-the-token-in-authorization-header-in-a-http-re)

2. [Bearer token II](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)


- #### Click here: [BACK TO CONTENT](#25.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/WebDev-tools-demo/blob/master/README.md)