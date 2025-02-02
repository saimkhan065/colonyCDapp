import { createIntl, createIntlCache } from '@formatjs/intl';
import { nanoid } from 'nanoid';
import { ReactNode, cloneElement, isValidElement } from 'react';
import { MessageDescriptor } from 'react-intl';

import {
  AnyMessageValues,
  ComplexMessageValues,
  Message,
  SimpleMessageValues,
  UniversalMessageValues,
} from '~types';

import actionMessages from '../i18n/en-actions';
import eventsMessages from '../i18n/en-events';
import motionStatesMessages from '../i18n/en-motion-states';
import systemMessages from '../i18n/en-system-messages';
import colonyMessages from '../i18n/en.json';

// https://formatjs.io/docs/intl

const cache = createIntlCache();

/* For use outside of React components */
/**
 *
 * @param messages A messages object of the form: { id: message }
 * @param locale Specify the locale. Defaults to 'en'.
 * @returns Intl object, with helpful utils such as `formatMessage`
 */
export const intl = <T = string>(
  messages: Record<string, string> = {},
  locale = 'en',
) =>
  createIntl<T>(
    {
      messages: {
        ...colonyMessages,
        ...actionMessages,
        ...eventsMessages,
        ...systemMessages,
        ...motionStatesMessages,
        ...messages,
      },
      locale,
    },
    cache,
  );

export const isMessageDescriptor = (
  message?: Message,
): message is MessageDescriptor =>
  typeof message === 'object' &&
  ('id' in message || 'description' in message || 'defaultMessage' in message);

const { formatMessage: formatIntlMessage } = intl<ReactNode>();

const addKeyToFormattedMessage = (
  formattedMessage: ReturnType<typeof formatIntlMessage>,
  key?: string,
) => {
  if (Array.isArray(formattedMessage)) {
    return formattedMessage.map((element) =>
      addKeyToFormattedMessage(element, key),
    );
  }

  if (isValidElement(formattedMessage)) {
    // apply key when formatting ComplexMessageValues
    return cloneElement(formattedMessage, { key: key ?? nanoid() });
  }

  return formattedMessage;
};

// Overloads. Ensures return type is correctly inferred from type of messageValues.
export function formatText(
  message: Message,
  messageValues?: SimpleMessageValues,
): string;
export function formatText(
  message: Message,
  messageValues?: ComplexMessageValues,
  keyForComplexMessageValues?: string,
): ReactNode;
export function formatText(
  message: Message,
  messageValues?: UniversalMessageValues,
  keyForComplexMessageValues?: string,
): ReactNode;
export function formatText(
  message: Message,
  messageValues?: AnyMessageValues,
  keyForComplexMessageValues?: string,
): ReactNode;
// Implementation
export function formatText(
  message: Message,
  messageValues?: UniversalMessageValues,
  /*
   * If you're experiencing an infinite render loop when calling this function
   * it's possibly due to the ever-changing random key that's generated.
   * Pass in a static key to avoid this.
   */
  keyForComplexMessageValues?: string,
) {
  if (isMessageDescriptor(message)) {
    const formattedMessage = formatIntlMessage(message, messageValues);
    return addKeyToFormattedMessage(
      formattedMessage,
      keyForComplexMessageValues,
    );
  }

  return message;
}
