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
8. 10/2 大错误，type 复制黏贴的坏处，以下这个隐蔽的错误导致每个不同的动作都引向同一个 reducer。
```js
export const SET_ORDERS_FROM_FIREBASE = 'SET_CART_FROM_FIREBASE';
```

- 这件事说明检查 type 很重要，不然会出现一些奇怪的行为。

9. 关于时间的处理，在本 app 中如果 order success 就会先更新 firebase，接着使用本地数据更新 state，这里有一个问题就是 上传的 createdAt 在 firebase 里面是以 timestamp 形式保存，而本地则使用 new Date()， 是两个不同的格式，所带的 method 也不一样，所以有：
```js
let time = createdAt.toDate ? createdAt.toDate().toString() : createdAt.toString();
```

10. 10/4  dropdown 外关闭 dropdown 的方案：
```js
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import CustomButton from '../Custom-button/Custom-button.component';
import CartItem from '../Cart-item/Cart-item.component';

import { selectCartItems } from '../../redux/cart/cart.selectors';
import { selectCurrentHiddenCart } from '../../redux/hide-cart/hide-cart.selectors';
import { toggleCartHidden } from '../../redux/hide-cart/hide-cart.actions';

import './Cart-dropdown.styles.scss';

class CartDropdown extends React.Component {

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside, false);
    }

    handleClickOutside = (event) => {
        const { cartHidden, toggleCartHidden } = this.props;
        if (event.target.className === 'cart-icon' ||
            event.target.className === 'item-count' ||
            event.target.className === 'shopping-icon' ||
            event.target.tagName === 'svg' ||
            event.target.tagName === 'path') {
            return;
        }
        else if (this.node.contains(event.target)) return;
        else if (!cartHidden) toggleCartHidden();
    }

    render() {
        const { toggleCartHidden, cartItems, history } = this.props;
        return (
            <div ref={node => this.node = node} className='cart-dropdown'>
                <div className='cart-items'>
                    {cartItems.length ? (
                        cartItems.map(cartItem => (
                            <CartItem key={cartItem.id} item={cartItem} />
                        ))
                    ) : (
                            <span className='empty-message'>Your cart is empty</span>
                        )}
                </div>
                <CustomButton
                    onClick={() => {
                        history.push('/checkout');
                        toggleCartHidden();
                    }}
                >
                    GO TO CHECKOUT
        </CustomButton>
            </div>
        )
    }
};

const mapStateToProps = createStructuredSelector({
    cartItems: selectCartItems,
    cartHidden: selectCurrentHiddenCart
});

const mapDispatchToProps = dispatch => {
    return {
        toggleCartHidden: () => dispatch(toggleCartHidden())
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CartDropdown));
```

11. 上面的例子使用`自身 node 作为参数。`

12. 