import React from 'react';
import {translate, Interpolate} from 'react-i18next';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router';

function About (props) {
  const {t} = props;
  return (
    <div>
      <Helmet>
        <title>{t('about.title')}</title>
      </Helmet>
      <a
          id="whatToRead"
      />

      <h4>
        {t('about.whatToRead.header')}
      </h4>
      {[0, 1].map(item => (
        <p
            key={item}>
          {t(`about.whatToRead.paragraphs.${item}`)}
        </p>
      ))}

      <h4
          className="about__heading--top-margin">
        {t('about.dictionary.header')}
      </h4>
      <p>
        {t('about.dictionary.paragraph')}
      </p>

      <h4
          className="about__heading--top-margin">
        {t('about.everyDay.header')}
      </h4>
      {[0, 1, 2].map(item => (
        <p
            key={item}>
          {t(`about.everyDay.paragraphs.${item}`)}
        </p>
      ))}

      <h4
          className="about__heading--top-margin">
        {t('about.leitner.header')}
      </h4>
      <p>
        <Interpolate
            i18nKey="about.leitner.paragraphWithLinks"
            link1={
              <a
                  href={t('about.leitner.link1')}>
                {t('about.leitner.link1Text')}
              </a>
            }
            link2={
              <a
                  href={t('about.leitner.link2')}>
                {t('about.leitner.link2Text')}
              </a>
            }
        />
      </p>
      {[0, 1].map(item => (
        <p
            key={item}>
          {t(`about.leitner.paragraphs.${item}`)}
        </p>
      ))}

      <h4
          className="about__heading--top-margin">
        {t('about.howMany.header')}
      </h4>
      {[0, 1, 2].map(item => (
        <p
            key={item}>
          {t(`about.howMany.paragraphs.${item}`)}
        </p>
      ))}
      <p>
        <Interpolate
            i18nKey="about.howMany.paragraphWithLinks"
            link={
              <Link
                  to="/settings">
                {t('about.howMany.linkText')}
              </Link>
            }
        />
      </p>

      <h4
          className="about__heading--top-margin">
        {t('about.selfControl.header')}
      </h4>
      {[0, 1, 2].map(item => (
        <p
            key={item}>
          {t(`about.selfControl.paragraphs.${item}`)}
        </p>
      ))}

      <h4
          className="about__heading--top-margin">
        {t('about.whatElse.header')}
      </h4>
      {[0, 1, 2].map(item => (
        <p
            key={item}>
          {t(`about.whatElse.paragraphs.${item}`)}
        </p>
      ))}
    </div>
  );
}

export default translate()(About);
