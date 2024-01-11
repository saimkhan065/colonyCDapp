import clsx from 'clsx';
import React, { FC } from 'react';

import { useCurrencyContext } from '~context/CurrencyContext';
import { SupportedCurrencies } from '~gql';
import { useMobile } from '~hooks';
import Icon from '~shared/Icon';
import NavLink from '~v5/shared/NavLink';

import { CURRENCY_MENU_ID } from '../UserMenu/consts';

import { userSubmenuItems } from './consts';
import { UserSubmenuProps } from './types';

const displayName = 'common.Extensions.UserNavigation.partials.UserSubmenu';

const UserSubmenu: FC<UserSubmenuProps> = ({ submenuId, setActiveSubmenu }) => {
  const isMobile = useMobile();
  const iconSize = isMobile ? 'small' : 'tiny';
  const { updatePreferredCurrency } = useCurrencyContext();
  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void,
  ) => {
    if (onClick) {
      event.preventDefault();
      onClick(event);
    }
  };

  const handleCurrencyClick = (currency: SupportedCurrencies) => {
    updatePreferredCurrency(currency);
    setActiveSubmenu(null);
  };

  return (
    <ul
      className={`-mb-2 ${submenuId === CURRENCY_MENU_ID ? 'columns-2' : ''}`}
    >
      {userSubmenuItems({ handleCurrencyClick })[submenuId].map((item) => (
        <li
          key={item.id}
          className={clsx(
            'mb-2 last:mb-0 sm:mb-0 hover:bg-gray-50 rounded -ml-4 w-[calc(100%+2rem)]',
            item.className,
          )}
        >
          {item.external ? (
            <a
              href={item.url}
              className={clsx(
                'flex items-center navigation-link',
                item.className,
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={item.onClick}
            >
              <span className="flex items-center shrink-0 mr-2 sm:mr-0 flex-grow">
                <Icon name={item.icon} appearance={{ size: iconSize }} />
                <p className="ml-2 ">{item.label}</p>
              </span>
            </a>
          ) : (
            <NavLink
              to={item.url ?? ''}
              className={clsx(
                'flex items-center navigation-link',
                item.className,
              )}
              onClick={(event) => handleMenuItemClick(event, item.onClick)}
            >
              <span className="flex items-center shrink-0 mr-2 sm:mr-0 flex-grow">
                <Icon name={item.icon} appearance={{ size: iconSize }} />
                <p className="ml-2 ">{item.label}</p>
              </span>
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  );
};

UserSubmenu.displayName = displayName;

export default UserSubmenu;
