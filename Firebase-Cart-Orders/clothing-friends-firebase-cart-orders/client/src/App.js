import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Header from './Components/Header/Header.component';
import Spinner from './Components/Spinner/Spinner.component';
import ErrorBoundary from './Components/Error-boundary/Error-boundary.component.jsx';
import Notification from './Components/Notification/Notification.component';

import { selectCurrentUser } from './redux/user/user.selectors';
import { selectCurrentHiddenCart } from './redux/hide-cart/hide-cart.selectors';

import { toggleCartHidden } from './redux/hide-cart/hide-cart.actions';
import { checkUserSession } from './redux/user/user.actions';

import './App.scss';

const HomePage = lazy(() => import('./Pages/HomePage/HomePage.component'));
const ShopPage = lazy(() => import('./Pages/ShopPage/ShopPage.component'));
const SignInAndSignUpPage = lazy(() => import('./Pages/SignInSignUpPage/SignInAndSignUpPage.component'));
const CheckoutPage = lazy(() => import('./Pages/CheckoutPage/CheckoutPage.component'));
const OrdersPage = lazy(() => import('./Pages/OrdersPage/OrdersPage.component'));

class App extends React.Component {

  componentDidMount() {
    const { checkUserSession } = this.props;
    checkUserSession();
  }

  render() {
    const { currentUser } = this.props;
    return (
      <div ref={node => this.node = node}>
        <Header currentUser={currentUser} />
        <div className='notices-container' >
          <Notification />
        </div>
        <Switch>
          <ErrorBoundary>
            <Suspense fallback={<Spinner />}>
              <Route exact path="/signin">{currentUser ? <Redirect to="/" /> : <SignInAndSignUpPage />}</Route>
              <Route exact path='/' component={HomePage} />
              <Route path='/shop' component={ShopPage} />
              <Route exact path='/checkout' component={CheckoutPage} />
              <Route exact path='/orders' component={OrdersPage} />
            </Suspense>
          </ErrorBoundary>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  cartHidden: selectCurrentHiddenCart
});

const mapDispatchToProps = dispatch => ({
  checkUserSession: () => dispatch(checkUserSession()),
  toggleCartHidden: () => dispatch(toggleCartHidden())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
