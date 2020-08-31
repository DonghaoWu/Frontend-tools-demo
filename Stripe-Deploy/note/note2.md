```diff
+ 1. stripe website 
+ 2. stripe publishable key 
+ 3. npm i react-stripe-checkout 
+ 4. ./src/Components/Stripe-button/Stripe-button.component.jsx
+ 5. ./src/Pages/CheckoutPage/CheckoutPage.component.jsx
+ 6. ./src/Pages/CheckoutPage/CheckoutPage.styles.scss

- 7. ./public/index.html x
- 8. ./public/favicon.ico x
- 9. ./src/redux/store.js x

+ 10. new client folder
+ 11. ./package.json
+ 12. ./.gitignore
+ 13. ./.env
+ 14. ./server.js

+ 15. ./client/packege.json <add proxy>
+ 16. npm i axios <client>
+ 17. ./src/Components/Stripe-button/Stripe-button.component.jsx
```

18. create heroku app and push

    - commands
        ```bash
        $ git init
        $ heroku login
        $ heroku apps
        $ heroku create <your app name>
        $ heroku git:remote -a <your app name>
        $ git remote
        $ git add .
        $ git commit -m'something'
        $ git push heroku master --force
        ```

19. add secret key in heroku
20. unhide firebase api key
21. add firebase Authorized domain