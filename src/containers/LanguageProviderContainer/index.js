/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages
 */

import get from 'lodash/get';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useInjectReducer } from 'hooks/useInjector';
import { createIntl, createIntlCache, IntlProvider } from 'react-intl';

import { selectReducer, selectSliceName, initialState } from './slices';

import { translationMessages, DEFAULT_LOCALE } from 'i18n';

dayjs.locale(DEFAULT_LOCALE);
// eslint-disable-next-line import/no-mutable-exports
export let intl = createIntl(
  {
    locale: DEFAULT_LOCALE,
    messages: translationMessages[DEFAULT_LOCALE],
  },
  createIntlCache(),
);

export const formatMessageUtil = (intlObj = intl) => (id) =>
  intlObj.formatMessage({ id });

export function LanguageProviderContainer({ messages, children }) {
  useInjectReducer({ key: selectSliceName, reducer: selectReducer });
  const locale = useSelector((state) =>
    get(state, [selectSliceName, 'locale'], initialState.locale),
  );

  useEffect(() => {
    if (!messages) return;

    // This is optional but highly recommended
    // since it prevents memory leak
    const cache = createIntlCache();
    intl = createIntl(
      {
        locale,
        messages: messages[locale],
      },
      cache,
    );
    dayjs.locale(locale);
  }, [locale, messages]);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {React.Children.only(children)}
    </IntlProvider>
  );
}

LanguageProviderContainer.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  locale: PropTypes.string,
  messages: PropTypes.object,
  children: PropTypes.element.isRequired,
};

export default LanguageProviderContainer;
