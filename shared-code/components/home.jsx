import {translate, Interpolate} from 'react-i18next';

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
    const {t} = this.props;
    return (
      <div>
        {typeof this.props.loginError === 'number' ?
          <div
              className="home__alert">
            {t(`errors.${this.props.loginError}`)}
          </div> :
          null
        }
        <div
            className="home__header">
          <div
              className="home__main">
            <div
                className="home__jumbotron">
              <h2>
                {t('home.header')}
              </h2>
              <p>
                {t('home.subheader')}
              </p>
            </div>
          </div>
          <div
              className="home__login-form">
            <h4
                className="home__login-form__heading">
              {t('home.formHeader')}
            </h4>
            <form
                onSubmit={this.onLoginFormSubmit.bind(this)}>
              <div
                  className="home__login-form__form-group">
                <label>
                  {t('home.email')}
                </label>
                <input
                    className="home__login-form__control"
                    type="email"
                    onChange={this.onEmailChange.bind(this)}
                />
              </div>
              <div
                  className="home__login-form__form-group">
                <label>
                  {t('home.password')}
                </label>
                <input
                    className="home__login-form__control"
                    type="password"
                    onChange={this.onPasswordChange.bind(this)}
                />
              </div>
              <input
                  className="home__login-form__submit"
                  type="submit"
                  disabled={this.props.loginRequesting}
                  value={t('home.signIn')}
              />
              <Link
                  className="home__login-form__sign-up-link"
                  to="/signup">
                {t('home.signUp')}
              </Link>
            </form>
          </div>
        </div>
        <div
            className="home__info">
          <div
              className="home__info__column">
            <h4
                className="home__info__heading">
              {t('home.who.header')}
            </h4>
            <ul>
              {[0, 1, 2].map(index => (
                <li
                    key={index}>
                  {t(`home.who.options.${index}`)}
                </li>
              ))}
            </ul>
            <p>
              {t('home.who.memorize')}
            </p>
          </div>
          <div
              className="home__info__column">
            <h4
                className="home__info__heading">
              {t('home.what.header')}
            </h4>
            {[0, 1, 2, 3].map(index => (
              <p
                  key={index}>
                {t(`home.what.paragraphs.${index}`)}
              </p>
            ))}
          </div>
          <div
              className="home__info__column">
            <h4
                className="home__info__heading">
              {t('home.why.header')}
            </h4>
            <p>
              {t('home.why.sameWithPaper')}
            </p>
            <ul>
              {[0, 1, 2, 3].map(index => (
                <li
                    key={index}>
                  {t(`home.why.advantages.${index}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <h4
            className="home__info__heading">
          <Interpolate
              i18nKey="home.learnMoreOrSignUp"
              learnMore={
                <Link
                    to="/about">
                  {t('home.infoLearnMore')}
                </Link>
              }
              signUp={
                <Link
                    to="/signup">
                  {t('home.infoSignUp')}
                </Link>
              }
          />
        </h4>
      </div>
    );
  }

}

const StatefulContainer = connect(
  state => ({
    loginRequesting: state.get('requestingLoginOrSignup'),
    loginError: state.getIn(['login', 'error'])
  }),
  actionCreators
)(Home);

export default translate()(StatefulContainer);
