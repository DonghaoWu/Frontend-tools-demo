# FrontEnd-tools-demo

- Kill a port service.
```bash
lsof -i :5000
kill -9 <PID>
```

- command + z  & command + shift + z

### Navigation:

- [Part 1 - Firebase :gem::gem::gem:](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/React-Firebase/Firebase.md)
    - __`Code base: null`__
    - __`Key Words: Firebase, Firestore, Firebase Auth, withRouter, history, match, authorization, componentWillUnmount, listener, load user`__

- [Part 2 - Redux-cart :gem::gem::gem:](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/Redux-Cart/Redux-cart.md)
    - __`Code base: Part1`__ 
    - __`Key Words: Redux, Cart, reselect`__

- [Part 3 - Redux and advanced routing :gem::gem:](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/Redux-Advanced-Routing/Redux-Advanced-Routing.md)
    - __`Code base: Part2`__  
    - __`Key Words: reselect, redux-persist, nested routing, ownProps, data normalization.`__

- [Part 4 - Stripe and Heroku full stack deploy. :gem::gem:](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/Stripe-Deploy/Stripe-Deploy.md)
    - __`Code base: Part3`__
    - __`Key Words: Heroku, stripe front end, stripe back end, full stack deploy, remove dependencies in production mode.`__

- [Part 5 - Advanced Firebase and HOC spinner. :gem::gem::gem:](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/Advanced-Firebase-HOC/Advanced-Firebase-HOC.md)
    - __`Code base: Part4`__
    - __`Key Words: Firebase security, security rules, Upload batch data to Firestore, Fetch data from Firestore, Spinner, Higher Order Component data flow, firestore batch & collection query.`__

- [Part 6 - Redux thunk and container pattern. :gem::gem::gem:](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/Redux-thunk%2BContainer-component/Redux-thunk%2BContainer-component.md)
    - __`Code base: Part5`__
    - __`Key Words: redux-thunk, container + HOC pattern, throw error, async fetching data initial state bug, compose. firebase authorization usual logic.`__

- [Part 7 - Redux saga. :gem::gem::gem:](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/Redux-saga/Reudx-saga.md)
    - __`Code base: Part6`__
    - __`Key Words: Redux-saga set up, redirect in saga, firebase authentication logic refactor.`__

- [Part 8 - Redux hooks. :gem:](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/React-Hooks/React-Hooks.md)
    - __`Code base: Part7`__
    - __`Key Words: React hooks, useState, useEffect.`__

- [Part 9 - Context API. :gem::gem::gem:](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/Context-API/Conterxt-API.md)
    - __`Code base: Part4`__ 
    - __`Key Words: React hooks, useContext, context pattern， context API in class component.`__

- [Part 10 - Graphql+Apollo (remote). :gem::gem::gem:](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/GraphQL-Apollo/GraphQL-Apollo(remote).md)
    - __`Code base: Part4`__ 
    - __`Key Words: GraphQL frontend, Apollo, Spinner.`__

- [Part 11 - Graphql+Apollo (local cache). :gem::gem::gem:](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/GraphQL-Apollo/GraphQL-Apollo(local).md)
    - __`Code base: Part4`__ 
    - __`Key Words: GraphQL frontend, Apollo, local cache.`__

- [Part 12 - Graphql+Apollo (local cache). :gem::gem::gem:](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/GraphQL-Apollo/GraplQL-Apollo(practice).md)
    - __`Code base: Part4`__ 
    - __`Key Words: GraphQL frontend, Apollo, local cache.`__

- [Part 13 - Mobile support, React performance, PWA. :gem::gem::gem:](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/Mobile-Performance-PWA/Mobile-Performance-PWA.md)
    - __`Code base: Part7`__ 
    - __`Key Words: Mobile support, media query, performance, PWA, lazy loading, Suspense, error boundry, React.memo, useCallback, useMemo.`__

- [Part 14 - Cart & Orders & Notifications sagas, Firestore security. :gem::gem::gem:](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/Firebase-Cart-Orders-Notifications/Firebase-Cart-Orders-Notifications.md)
    - __`Code base: Part13`__ 
    - __`Key Words: Store user cart data and orders data in Firestore, notifications feature, Firestore security rules, Redux-saga.`__

- [Part 15 - Firebase auth, Context API, bootstrap. :gem::gem::gem:](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/Firebase-ContextAPI-Auth/Firebase-ContextAPI-AUTH.md)
    - __`Code base: NEW`__
    - __`Doc Repo URL:`__[Firebase Auth demo doc](https://github.com/DonghaoWu/Frontend-tools-demo/tree/master/Firebase-ContextAPI-Auth)
    - __`Deployed Repo URL:`__[Firebase Auth demo Heroku](https://github.com/DonghaoWu/auth-demo-heroku) 
    - __`Key Words: Firebase auth, context API 规范, PrivateRoute, useEffect, useRef, useHistory, Redirect, Firebase auth methods promise.all, dev mode & prod mode, forgot password, deploy CRA on heroku, context pattern, 纯前端APP的Heroku部署.`__

- [Part 16 - Github API, Context API. :gem::gem:](https://github.com/DonghaoWu/github-finder-doc/blob/main/GithubAPI-ContextAPI.md)
    - __`Code base: NEW`__ 
    - __`Doc Repo URL:`__[Github finder doc](https://github.com/DonghaoWu/github-finder-doc)
    - __`Deployed Repo URL:`__[Github finder netlify](https://github.com/DonghaoWu/github-finder-netlify)
    - __`Key Words: React hooks, Github APi, Context patterns, react syntax(语法), netlify, Github api update, convert curl to axios.`__

- [Part 17 - Responsive design. :gem::gem::gem:](https://github.com/DonghaoWu/codeTyke-doc/blob/main/README.md)
    - __`Code base: NEW`__ 
    - __`Doc Repo URL:`__[codeTyke-doc](https://github.com/DonghaoWu/codeTyke-doc)
    - __`Deployed Repo URL:`__[codeTyke-heroku](https://github.com/DonghaoWu/codeTyke-heroku)
    - __`Key Words: React, responsive design, progress bar, multiple checkbox, processing bar, modal, heroku.`__

- [Part 18 - Create a google map clone with Mapbox. :gem:](https://github.com/DonghaoWu/googleMap-clone-doc/blob/main/README.md)
    - __`Code base: NEW`__ 
    - __`Doc Repo URL:`__[googleMap-clone-doc](https://github.com/DonghaoWu/googleMap-clone-doc)
    - __`Key Words: Mapbox.`__

- [Part 18 - Google & NASA API :gem::gem:](https://github.com/DonghaoWu/natural-events-tracker-doc/blob/main/GoogleMap-NASA-API.md)
    - __`Code base: NEW`__ 
    - __`Doc Repo URL:`__[Natural-events-tracker-doc](https://github.com/DonghaoWu/natural-events-tracker-doc)
    - __`Key Words: Google Cloud Platform API, NASA API, Deploy CRA on Heroku, Iconify, google-map-react.`__