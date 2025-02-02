/* eslint-disable max-len */
import clsx from 'clsx';
import React, { FC, PropsWithChildren, useId } from 'react';

import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';

import { CheckboxProps } from './types';

import styles from './Checkbox.module.css';

const displayName = 'v5.common.Checkbox';

const Checkbox: FC<PropsWithChildren<CheckboxProps>> = ({
  name = '',
  disabled,
  id,
  register,
  label = '',
  onChange,
  classNames,
  isChecked,
  children,
}) => {
  const generatedId = useId();

  return (
    <div
      className={clsx(classNames, {
        'pointer-events-none opacity-50': disabled,
      })}
    >
      <label
        htmlFor={id}
        className="flex relative w-full text-gray-700 text-md cursor-pointer"
      >
        <input
          type="checkbox"
          {...register?.(name)}
          name={name}
          id={id || generatedId}
          checked={isChecked}
          disabled={disabled}
          className="peer absolute top-0 left-0 overflow-hidden w-0 h-0 opacity-0"
          onChange={onChange}
        />
        <span
          className={clsx(styles.checkboxBox, {
            'border-blue-400 text-blue-400 bg-base-white': isChecked,
            'border-gray-200 bg-base-white': !isChecked,
          })}
        >
          {isChecked && (
            <span className="absolute">
              <Icon
                name="check"
                appearance={{ size: 'extraExtraTiny' }}
                className="text-blue-400"
              />
            </span>
          )}
        </span>

        <div className="flex items-center gap-2">
          {children}
          {label && formatText(label)}
        </div>
      </label>
    </div>
  );
};

Checkbox.displayName = displayName;

export default Checkbox;
