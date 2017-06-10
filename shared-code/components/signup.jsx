import React from 'react';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';

import * as actionCreators from '../data/action-creators';
import * as constants from '../data/constants';

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
    const {t} = this.props;
    return (
      <div>
        <Helmet>
          <title>{t('signup.title')}</title>
        </Helmet>
        <h2>
          {t('signup.heading')}
        </h2>
        {typeof this.props.signupError === 'number' ?
          <div
              className="home__alert">
            {t(`errors.signup.${this.props.signupError}`)}
          </div> :
          null
        }
        <form
            onSubmit={this.onSignupFormSubmit.bind(this)}>
          <div
              className="signup__form-group">
            <label>
              {t('signup.email')}
              {' '}
              <span
                  className="signup__danger-text">
                *
              </span>
            </label>
            <input
                type="email"
                className="signup__form-control"
                required
                maxLength={constants.MAX_EMAIL_LENGTH}
                onChange={this.onEmailChange.bind(this)}
            />
            <p
                className="signup__help-block">
              {t('signup.notSharingEmail')}
            </p>
          </div>
          <div
              className="signup__form-group">
            <label>
              {t('signup.password')}
              {' '}
              <span
                  className="signup__danger-text">
                *
              </span>
            </label>
            <input
                type="password"
                className="signup__form-control"
                required
                minLength={constants.MIN_PASSWORD_LENGTH}
                maxLength={constants.MAX_PASSWORD_LENGTH}
                pattern={constants.PASSWORD_REGEX.toString().slice(1, -1)}
                onChange={this.onPasswordChange.bind(this)}
            />
            <p
                className="signup__help-block">
              {t('signup.anyCombination')}
            </p>
          </div>
          <div
              className="signup__form-group">
            <label>
              {t('signup.name')}
            </label>
            <input
                type="text"
                className="signup__form-control"
                maxLength={constants.MAX_NAME_LENGTH}
                onChange={this.onNameChange.bind(this)}
            />
            <p
                className="signup__help-block">
              {t('signup.howToAddress')}
            </p>
          </div>
          <input
              type="submit"
              className="signup__submit"
              disabled={this.props.signupRequesting}
              value={t('signup.signUp')}
          />
        </form>
      </div>
    );
  }

}

const StatefulContainer = connect(
  state => ({
    signupRequesting: state.get('requestingLoginOrSignup'),
    signupError: state.getIn(['signup', 'error'])
  }),
  actionCreators
)(Signup);

export default translate()(StatefulContainer);
