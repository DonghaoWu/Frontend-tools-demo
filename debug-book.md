1. 9/16: App.js 里面的 `setDisplayName('');` 是否可以取消？
2. 在 App.js 作为一个 class component 实现了接收 context api 的功能，注意 class component 是不能使用 useContext 的。
3. 9/17 App.js 中提取的变量 displayName 的只会在 `注册动作` 时起作用。
4. 9/17 App.js `const { setName, displayName } = this.context;`类似这种提取动态变量的语句要放在 listener 中。
5. 9/17 context api 中没有实现购物车记忆功能。
6. context API 新用法，class component 接受 context：
    ```js
    static contextType = CartContext;
    ```
6. 9/26 apollo 中没有实现购物车记忆功能。
7. 9/26 graphql+apollo Header.component: 
    ```diff
    - clearCart();
    + await clearCart();
    ```
8. 