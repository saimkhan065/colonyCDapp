/* eslint-disable max-len */
import React, { FC, useCallback } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { CheckboxProps } from './types';
import styles from './Checkbox.module.css';

const displayName = 'v5.common.Checkbox';

const Checkbox: FC<CheckboxProps> = ({
  name,
  disabled,
  id,
  register,
  label,
  onChange,
  classNames,
  isChecked,
}) => {
  const { formatMessage } = useIntl();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
    },
    [onChange],
  );

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
          id={id}
          checked={isChecked}
          disabled={disabled}
          className="peer absolute top-0 left-0 overflow-hidden w-0 h-0 opacity-0"
          onChange={(event) => handleChange(event)}
        />
        <span
          className={clsx(
            styles.checkboxBox,
            'peer-checked:bg-blue-400 peer-checked:border-blue-400 peer-disabled:bg-gray-40 peer-disabled:border-gray-40 peer-checked:after:border-l peer-checked:after:border-b',
          )}
        />
        {formatMessage(label)}
      </label>
    </div>
  );
};

Checkbox.displayName = displayName;

export default Checkbox;
