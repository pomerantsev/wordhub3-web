import React from 'react';
import {translate, Interpolate} from 'react-i18next';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router';

function Intro (props) {
  const {t} = props;
  return (
    <div>
      <Helmet>
        <title>{t('intro.title')}</title>
      </Helmet>
      <ol>

        <li
            className="intro__item">
          <Interpolate
              i18nKey="intro.liRead"
              liReadLink={
                <Link
                    to="/about#whatToRead">
                  {t('intro.liReadLinkText')}
                </Link>
              }
          />
        </li>

        <li
            className="intro__item">
          <Interpolate
              i18nKey="intro.liDictionary"
              liDictionaryLink1={
                <Link
                    to="/about#dictionary">
                  {t('intro.liDictionaryLink1Text')}
                </Link>
              }
              liDictionaryLink2={
                <Link
                    to="/about#everyDay">
                  {t('intro.liDictionaryLink2Text')}
                </Link>
              }
          />
        </li>

        <li
            className="intro__item">
          <Interpolate
              i18nKey="intro.liRepeat"
              liRepeatLink={
                <Link
                    to="/about#everyDay">
                  {t('intro.liRepeatLinkText')}
                </Link>
              }
          />
        </li>

        <li
            className="intro__item">
          <Interpolate
              i18nKey="intro.liAnswer"
              liAnswerLink={
                <Link
                    to="/about#selfControl">
                  {t('intro.liAnswerLinkText')}
                </Link>
              }
          />
        </li>

        <li
            className="intro__item">
          {t('intro.liLookUp')}
        </li>

        <li
            className="intro__item">
          <Interpolate
              i18nKey="intro.liIntervals"
              liIntervalsLink={
                <Link
                    to="/about#leitner">
                  {t('intro.liIntervalsLinkText')}
                </Link>
              }
          />
        </li>

        <li
            className="intro__item">
          <Interpolate
              i18nKey="intro.liThree"
              liThreeLink={
                <Link
                    to="/about#leitner">
                  {t('intro.liThreeLinkText')}
                </Link>
              }
          />
        </li>

        <li
            className="intro__item">
          {t('intro.liContext')}
        </li>

        <li
            className="intro__item">
          <Interpolate
              i18nKey="intro.liDay"
              liDayLink={
                <Link
                    to="/about#leitner">
                  {t('intro.liDayLinkText')}
                </Link>
              }
          />
        </li>

        <li
            className="intro__item">
          <Interpolate
              i18nKey="intro.liVocab"
              liVocabLink={
                <Link
                    to="/about#howMany">
                  {t('intro.liVocabLinkText')}
                </Link>
              }
          />
        </li>

      </ol>
    </div>
  );
}

export default translate()(Intro);
