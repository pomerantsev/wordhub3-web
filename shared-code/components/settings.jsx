import React from 'react';
import {translate, Interpolate} from 'react-i18next';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router';

import * as actionCreators from '../data/action-creators';
import * as constants from '../data/constants';

class Settings extends React.Component {

  constructor () {
    super();
    this.state = {};
  }

  componentWillMount () {
    const userSettings = this.props.userSettings;
    this.setState({
      dailyLimit: userSettings.get('dailyLimit'),
      name: userSettings.get('name'),
      interfaceLanguageId: userSettings.get('interfaceLanguageId')
    });
  }

  componentWillUnmount () {
    this.props.userSettingsLeave();
  }

  onDailyLimitChange (event) {
    this.setState({
      dailyLimit: Number(event.target.value)
    });
  }

  onNameChange (event) {
    this.setState({
      name: event.target.value
    });
  }

  onInterfaceLanguageChange (event) {
    this.setState({
      interfaceLanguageId: Number(event.target.value)
    });
  }

  onFormSubmit (event) {
    event.preventDefault();
    this.props.updateUserSettings({
      dailyLimit: this.state.dailyLimit,
      name: this.state.name,
      interfaceLanguageId: this.state.interfaceLanguageId
    });
  }

  render () {
    const {t} = this.props;
    return (
      <div>
        <Helmet>
          <title>{t('settings.title')}</title>
        </Helmet>
        {this.props.userSettingsSuccess ?
          <div
              className="settings__success">
            {t('settings.successMessage')}
          </div> :
          null
        }
        {this.props.online ?
          null :
          <div
              className="settings__warning">
            {t('settings.offlineAlert')}
          </div>
        }
        <h2>
          {t('settings.heading')}
        </h2>
        {typeof this.props.userSettingsError === 'number' ?
          <div
              className="settings__alert">
            {t(`errors.${this.props.userSettingsError}`)}
          </div> :
          null
        }
        <form
            onSubmit={this.onFormSubmit.bind(this)}>
          <fieldset
              disabled={this.props.userSettingsUpdating}>
            <div
                className="settings__form-group">
              <label>
                {t('settings.dailyLimit')}
              </label>
              <input
                  type="number"
                  className="settings__form-control"
                  required
                  min={1}
                  max={constants.MAX_DAILY_LIMIT}
                  value={this.state.dailyLimit}
                  onChange={this.onDailyLimitChange.bind(this)}
              />
              <p
                  className="settings__help-block">
                <Interpolate
                    i18nKey="settings.dailyLimitHint"
                    dailyLimitHintLink={
                      <Link
                          to="/about#everyDay">
                        {t('settings.dailyLimitHintLinkText')}
                      </Link>
                    }
                />
              </p>
            </div>
            <div
                className="settings__form-group">
              <label>
                {t('settings.name')}
              </label>
              <input
                  type="text"
                  className="settings__form-control"
                  maxLength={constants.MAX_NAME_LENGTH}
                  value={this.state.name}
                  onChange={this.onNameChange.bind(this)}
              />
            </div>
            <div
                className="settings__form-group">
              <label>
                {t('settings.interfaceLanguage')}
              </label>
              <select
                  className="settings__form-control"
                  required
                  value={this.state.interfaceLanguageId}
                  onChange={this.onInterfaceLanguageChange.bind(this)}>
                {constants.interfaceLanguages.map(language => (
                  <option
                      key={language.id}
                      value={language.id}>
                    {t(`settings.interfaceLanguages.${language.id}`)}
                  </option>
                ))}
              </select>
            </div>
            <input
                type="submit"
                className="settings__submit"
                value={t('settings.save')}
            />
          </fieldset>
        </form>
      </div>
    );
  }

}

const StatefulContainer = connect(
  state => ({
    userSettings: state.getIn(['userData', 'userSettings']),
    userSettingsUpdating: state.getIn(['userData', 'userSettingsUpdating']),
    userSettingsSuccess: state.getIn(['userData', 'userSettingsSuccess']),
    userSettingsError: state.getIn(['userData', 'userSettingsError']),
    online: state.get('online')
  }),
  actionCreators
)(Settings);

export default translate()(StatefulContainer);
