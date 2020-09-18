import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import CartProvider from './providers/cart/cart.provider.jsx'

import './index.css';
import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <CartProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </CartProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorker.unregister();
