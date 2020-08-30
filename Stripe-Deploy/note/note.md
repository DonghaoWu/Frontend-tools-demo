1. [stripe front end component]

    - Stripe website, make a stript account, developer tag
    - get publicshable key and secret key(for backend charge)
    - stripe.js
    - install dependency
        ```bash
        $ npm i react-stripe-checkout
        ```
    - ./src/Components/Stripe-button/Stripe-button.component.jsx <base on cent>
    - <StripeCheckout /> component is got from react-stripe-checkout library
    - ignore the console error
    - get default test credit card to test the app

    - ./src/Pages/CheckoutPage/CheckoutPage.component.jsx
    - ./src/Pages/CheckoutPage/CheckoutPage.styles.scss
    
    - favicon
    - ./public/index.html
    - ./public/favicon.ico

2. Deploy

    - heroku & heroku CLI
    - heroku commands

    ```bash
    $ heroku --version
    $ heroku login
    $ heroku logout
    $ heroku create <your app name> --buildpack https:github.com/mars/create-react-app-buildpack.git <这种情况适用于没有 run build script>
    $ git push heroku master
    ```

    - firebase website add a new domain:
        -> authentication tag -> sign-in method tag -> authorized domain -> add domain

    - ./src/redux/store.js  <only apply middleware when in development>

3. Stripe in backend, add backend server

    - REST Backend Server
    - REST API
    - create a client folder
    - root directory
        ```bash
        $ npm init
        $ git init
        $ touch server.js
        ```

    - copy packege.json from git and edit engines.
    - check out different dependencies

    - ./server.js
    - ./.env
    - ./.gitignore
    - ./client/packega.json <add proxy>

    - create a new route
    - ./server.js

    - [connnect client to server]
    - commands:
    ```bash
    $ cd ..
    $ cd client
    $ npm i axios
    ```

    - ./src/Components/Stripe-button/Stripe-button.component.jsx

    - [Deploy]
        - commands
            ```bash
            $ heroku login
            $ heroku apps
            $ heroku git:remote -a <your app name>
            $ git remote
            $ heroku buildpacks
            $ heroku buildpacks:remove mars/create-react-app
            $ git add .
            $ git commit -m'something'
            $ git push heroku master --force
            ```

    - about .env file
    - commands
        ```bash
        $ heroku config:set STRIPE_SECRET_KEY= <your stripe secret key>
        ```
    - heroku open