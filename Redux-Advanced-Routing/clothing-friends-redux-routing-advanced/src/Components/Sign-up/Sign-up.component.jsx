import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import FormInput from '../Form-input/Form-input.component';
import CustomButton from '../Custom-button/Custom-button.component';

import { auth, signInWithGoogle } from '../../firebase/firebase.utils';
import { setDisplayName } from '../../redux/display-name/display-name.actions';
import { selectInputDisplayName } from '../../redux/display-name/display-name.selectors';

import './Sign-up.styles.scss';

class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            displayName: '',
            email: '',
            password: '',
            confirmPassword: ''
        };
    }

    handleSubmit = async event => {
        event.preventDefault();
        const { displayName, email, password, confirmPassword } = this.state;
        if (password !== confirmPassword) {
            alert("passwords don't match");
            return;
        }

        try {
            console.log(this.props)
            this.props.setDisplayName(displayName);
            await auth.createUserWithEmailAndPassword(email, password);

            this.setState({ displayName: '', email: '', password: '', confirmPassword: '' });
        } catch (error) {
            console.error(error);
        }
    };

    handleChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    render() {
        const { displayName, email, password, confirmPassword } = this.state;
        return (
            <div className='sign-up'>
                <h2 className='title'>I do not have a account</h2>
                <span>Sign up with your email and password</span>
                <form className='sign-up-form' onSubmit={this.handleSubmit}>
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
                    <div className='buttons'>
                        <CustomButton type='submit'> Sign Up </CustomButton>
                        <CustomButton type='button' onClick={signInWithGoogle} google={true}>
                            Sign Up with Google
                        </CustomButton>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    displayName: selectInputDisplayName
});

const mapDispatchToProps = dispatch => ({
    setDisplayName: input => dispatch(setDisplayName(input)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUp);