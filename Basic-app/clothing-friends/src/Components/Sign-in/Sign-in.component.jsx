import React from 'react';

import './Sign-in.styles.scss';
import FormInput from '../Form-input/Form-input.component';
import CustomButton from '../Custom-button/Custom-button.component'

class Signin extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: ''
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ email: '', password: '' });
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        return (
            <div className='sign-in'>
                <h2>I already have an account.</h2>
                <span>Sign in with your email and password.</span>
                <form onSubmit={this.handleSubmit}>
                    <FormInput
                        name='email'
                        type='email'
                        label='email'
                        handleChange={this.handleChange}
                        value={this.state.email}
                        required
                    />
                    <FormInput
                        name='password'
                        type='password'
                        label='password'
                        handleChange={this.handleChange}
                        value={this.state.password}
                        required
                    />
                    <CustomButton type="submit" >Sign in</CustomButton>
                </form>
            </div>
        )
    }
}

export default Signin;