import {getI18n} from '../locales/i18n';

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import * as actionCreators from '../data/action-creators';

class Home extends React.Component {

  constructor () {
    super();
    this.state = {
      email: '',
      password: ''
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

  onLoginFormSubmit (event) {
    event.preventDefault();
    this.props.login(this.state.email, this.state.password);
  }

  render () {
    return (
      <div>
        <form
            onSubmit={this.onLoginFormSubmit.bind(this)}>
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
              type="submit"
              value={getI18n().t('home.login')}
          />
        </form>
        <div>
          <Link
              to="/signup">
            {getI18n().t('home.signUp')}
          </Link>
        </div>
      </div>
    );
  }

}

export const HomeContainer = connect(
  () => ({}),
  actionCreators
)(Home);
