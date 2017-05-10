import {getI18n} from '../locales/i18n';

import React from 'react';
import {connect} from 'react-redux';

import * as actionCreators from '../data/action-creators';

class Signup extends React.Component {

  constructor () {
    super();
    this.state = {
      email: '',
      password: '',
      name: ''
    };
  }

  onEmailChange (event) {
    this.setState({
      email: event.target.value
    });
  }

  onPasswordChange (event) {
    this.setState({
      password: event.target.value
    });
  }

  onNameChange (event) {
    this.setState({
      name: event.target.value
    });
  }

  onSignupFormSubmit (event) {
    event.preventDefault();
    this.props.signup(this.state.email, this.state.password, this.state.name);
  }

  render () {
    return (
      <div>
        <form
            onSubmit={this.onSignupFormSubmit.bind(this)}>
          <input
              type="email"
              onChange={this.onEmailChange.bind(this)}
          />
          <br />
          <input
              type="password"
              onChange={this.onPasswordChange.bind(this)}
          />
          <br />
          <input
              type="text"
              onChange={this.onNameChange.bind(this)}
          />
          <br />
          <input
              type="submit"
              value={getI18n().t('signup.signUp')}
          />
        </form>
      </div>
    );
  }

}

export const SignupContainer = connect(
  () => ({}),
  actionCreators
)(Signup);
