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
        {typeof this.props.loginError === 'number' ?
          <div
              className="home__alert">
            {getI18n().t(`errors.login.${this.props.loginError}`)}
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
                {getI18n().t('home.header')}
              </h2>
              <p>
                {getI18n().t('home.subheader')}
              </p>
            </div>
          </div>
          <div
              className="home__login-form">
            <h4
                className="home__login-form__heading">
              {getI18n().t('home.formHeader')}
            </h4>
            <form
                onSubmit={this.onLoginFormSubmit.bind(this)}>
              <div
                  className="home__login-form__form-group">
                <label>
                  {getI18n().t('home.email')}
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
                  {getI18n().t('home.password')}
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
                  value={getI18n().t('home.signIn')}
              />
              <Link
                  className="home__login-form__sign-up-link"
                  to="/signup">
                {getI18n().t('home.signUp')}
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
              {getI18n().t('home.who.header')}
            </h4>
            <ul>
              {[0, 1, 2].map(index => (
                <li
                    key={index}>
                  {getI18n().t(`home.who.options.${index}`)}
                </li>
              ))}
            </ul>
            <p>
              {getI18n().t('home.who.memorize')}
            </p>
          </div>
          <div
              className="home__info__column">
            <h4
                className="home__info__heading">
              {getI18n().t('home.what.header')}
            </h4>
            {[0, 1, 2, 3].map(index => (
              <p
                  key={index}>
                {getI18n().t(`home.what.paragraphs.${index}`)}
              </p>
            ))}
          </div>
          <div
              className="home__info__column">
            <h4
                className="home__info__heading">
              {getI18n().t('home.why.header')}
            </h4>
            <p>
              {getI18n().t('home.why.sameWithPaper')}
            </p>
            <ul>
              {[0, 1, 2, 3].map(index => (
                <li
                    key={index}>
                  {getI18n().t(`home.why.advantages.${index}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/*<h4>
          {getI18n().t('home.learnMoreOrSignUp', {
            learnMore: (<Link to="/about">Hello</Link>),
            signUp: (<Link to="/signup">World</Link>)
          })}
        </h4>*/}
      </div>
    );
  }

}

export const HomeContainer = connect(
  state => ({
    loginError: state.getIn(['login', 'error'])
  }),
  actionCreators
)(Home);
