import {getI18n} from '../locales/i18n';

import log from 'loglevel';

import React from 'react';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';

import * as actionCreators from '../data/action-creators';
import * as getters from '../data/getters';

class Repetitions extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor () {
    super();
    this.state = {
      frontSideVisible: true
    };

    this.rotateFlashcard = this.rotateFlashcard.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.runRepetition = this.runRepetition.bind(this);
  }

  componentWillMount () {
    this.checkCurrentRepetition(this.props);
  }

  componentDidMount () {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillReceiveProps (nextProps) {
    this.checkCurrentRepetition(nextProps);

    if (this.props.currentRepetition !== nextProps.currentRepetition) {
      this.setState({
        frontSideVisible: true
      });
    }
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  checkCurrentRepetition (props) {
    if (!props.currentRepetition) {
      props.router.replace('/stats');
    }
  }

  rotateFlashcard () {
    this.setState({
      frontSideVisible: !this.state.frontSideVisible
    });
  }

  onKeyDown (event) {
    if (event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
      switch (event.which) {
      case 37:
        this.runRepetition(false);
        break;
      case 39:
        this.runRepetition(true);
        break;
      }
    }
    if (event.which === 32) {
      event.preventDefault();
      this.rotateFlashcard();
    }
  }

  runRepetition (successful) {
    this.startTime = Date.now();
    this.props.runRepetition(this.props.currentRepetition, successful);
  }

  render () {
    if (this.startTime) {
      log.debug('Updating repetitions took ' + (Date.now() - this.startTime) + ' ms');
      this.startTime = null;
    }
    if (!this.props.currentRepetition) {
      return null;
    }
    const repetition = this.props.repetitions.get(this.props.currentRepetition);
    const flashcard = this.props.flashcards.get(repetition.get('flashcardUuid'));
    return (
      <div>
        <Helmet>
          <title>{getI18n().t('repetitions.title')}</title>
        </Helmet>
        <div
            className="repetitions__flashcard"
            onClick={this.rotateFlashcard}>{
          `${this.state.frontSideVisible ? flashcard.get('frontText') : flashcard.get('backText')}`
        }</div>
        <div
            className="repetitions__responses-container">
          <div
              className="repetitions__response--left">
            <button
                className="repetitions__button"
                onClick={this.runRepetition.bind(this, false)}>
              {getI18n().t('repetitions.dontRemember')}
            </button>
            <div
                className="repetitions__responses-hotkey">
              Shift + {'\u2190'}
            </div>
          </div>
          <div
              className="repetitions__response--right">
            <button
                className="repetitions__button"
                onClick={this.runRepetition.bind(this, true)}>
              {getI18n().t('repetitions.remember')}
            </button>
            <div
                className="repetitions__responses-hotkey">
              Shift + {'\u2192'}
            </div>
          </div>
          <div
              className="repetitions__responses-hotkey-center">
            {getI18n().t('repetitions.turnOver')} : Space
          </div>
        </div>
        <div
            className="repetitions__progress">
          <div
              className="repetitions__progress__bar"
              style={{
                transform: `scaleX(${1 - this.props.remainingRepetitionsForToday.size / this.props.repetitionsForToday.size})`
              }}>
          </div>
        </div>
      </div>
    );
  }

}

export const RepetitionsContainer = connect(
  state => ({
    repetitionsForToday: state.getIn(['userData', 'repetitionsForToday']),
    remainingRepetitionsForToday: getters.getRemainingRepetitionsForToday(state.getIn(['userData'])),
    currentRepetition: state.getIn(['userData', 'currentRepetition']),
    repetitions: state.getIn(['userData', 'repetitions']),
    flashcards: state.getIn(['userData', 'flashcards'])
  }),
  actionCreators
)(Repetitions);
