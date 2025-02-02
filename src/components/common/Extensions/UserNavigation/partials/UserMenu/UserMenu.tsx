import clsx from 'clsx';
import React, { FC, useState } from 'react';

// @BETA: Disabled for now
// import ThemeSwitcher from '~common/Extensions/ThemeSwitcher';

import { useCurrencyContext } from '~context/CurrencyContext';
import { useAppContext, useTablet } from '~hooks';
import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';
import { splitWalletAddress } from '~utils/splitWalletAddress';
import Button from '~v5/shared/Button';
import Link from '~v5/shared/Link';
import PopoverBase from '~v5/shared/PopoverBase';
import TitleLabel from '~v5/shared/TitleLabel';

import UserSubmenu from '../UserSubmenu';
import WalletConnectedTopMenu from '../WalletConnectedTopMenu';

import { currencyIconTitles, userMenuItems } from './consts';
import { UserMenuItemName, UserMenuProps } from './types';

import styles from './UserMenu.module.css';

const displayName = 'common.Extensions.UserNavigation.partials.UserMenu';

const UserMenu: FC<UserMenuProps> = ({
  tooltipProps,
  setTooltipRef,
  isVerified,
}) => {
  const isTablet = useTablet();
  const { connectWallet, disconnectWallet, user, wallet } = useAppContext();
  const { profile } = user || {};
  const [activeSubmenu, setActiveSubmenu] = useState<UserMenuItemName | null>(
    null,
  );

  const iconName = isTablet ? 'caret-down' : 'caret-right';
  const iconSize = isTablet ? 'small' : 'extraSmall';
  const { currency } = useCurrencyContext();

  const closeSubmenu = () => {
    setActiveSubmenu(null);
  };

  return (
    <PopoverBase
      setTooltipRef={setTooltipRef}
      tooltipProps={tooltipProps}
      withTooltipStyles={!isTablet}
      classNames={clsx(
        'w-full p-6 bg-base-white md:rounded-lg md:border md:border-gray-100 md:w-80 md:shadow-default overflow-hidden',
        {
          '!translate-y-0 !top-full h-[calc(100dvh-var(--top-content-height))]':
            isTablet,
        },
      )}
    >
      <div
        className={clsx('transition-transform', {
          '-translate-x-0': !activeSubmenu,
          '-translate-x-[100vw] absolute': activeSubmenu,
        })}
      >
        {wallet ? (
          <WalletConnectedTopMenu
            userName={
              profile?.displayName ??
              splitWalletAddress(user?.walletAddress ?? '')
            }
            isVerified={isVerified}
            walletAddress={wallet.address}
            avatar={profile?.thumbnail || profile?.avatar || ''}
          />
        ) : (
          <>
            <div className={styles.mobileButtons}>
              <Button
                mode="tertiary"
                size="small"
                isFullRounded
                iconName="cardholder"
                iconSize="extraTiny"
              >
                {formatText({ id: 'connectWallet' })}
              </Button>
              <Button
                mode="tertiary"
                size="small"
                isFullRounded
                iconName="list"
                iconSize="extraTiny"
              >
                {formatText({ id: 'help' })}
              </Button>
            </div>
            <div className="w-full pb-4 mb-6 sm:pb-0">
              <Button mode="quinary" isFullSize onClick={connectWallet}>
                {formatText({ id: 'connectWallet' })}
              </Button>
            </div>
          </>
        )}
        <div
          className={clsx('w-full pb-4 border-b border-b-gray-200 sm:pb-3', {
            'mb-0': !wallet,
            'mb-5': wallet,
          })}
        >
          <TitleLabel text={formatText({ id: 'userMenu.optionsTitle' })} />
          <ul className="text-left">
            <li className="mb-2 sm:mb-0 hover:bg-gray-50 rounded -ml-4 w-[calc(100%+2rem)]">
              <Link to="/" className="navigation-link">
                <Icon
                  name="circles-three-plus"
                  appearance={{ size: iconSize }}
                />
                <p className="ml-2">
                  {formatText({ id: 'userMenu.getStartedTitle' })}
                </p>
              </Link>
            </li>
            {userMenuItems.map(({ id, icon, name: itemName }) => (
              <li
                key={id}
                className="mb-2 sm:mb-0 hover:bg-gray-50 rounded -ml-4 w-[calc(100%+2rem)]"
              >
                <button
                  type="button"
                  className="navigation-link"
                  onClick={() => setActiveSubmenu(itemName)}
                  aria-expanded={activeSubmenu === itemName}
                  aria-controls="actionsWithVisibility"
                >
                  <span className="flex items-center shrink-0 mr-2 sm:mr-0 flex-grow">
                    <Icon name={icon} appearance={{ size: iconSize }} />
                    <p className="ml-2">{formatText({ id: itemName })}</p>
                  </span>
                  <Icon name={iconName} appearance={{ size: 'extraTiny' }} />
                </button>
              </li>
            ))}

            <li className="mb-0 hover:bg-gray-50 rounded -ml-4 w-[calc(100%+2rem)]">
              <button
                type="button"
                className="navigation-link"
                onClick={() => setActiveSubmenu(UserMenuItemName.CURRENCY)}
                aria-expanded={activeSubmenu === UserMenuItemName.CURRENCY}
                aria-controls="actionsWithVisibility"
              >
                <span className="flex items-center shrink-0 mr-2 sm:mr-0 flex-grow">
                  <Icon
                    name={currencyIconTitles[currency]}
                    appearance={{ size: iconSize }}
                  />
                  <p className="ml-2">{currency.toUpperCase()}</p>
                </span>
                <Icon name={iconName} appearance={{ size: 'extraTiny' }} />
              </button>
            </li>
          </ul>
        </div>
        {wallet && (
          <div className="w-full">
            <TitleLabel text={formatText({ id: 'userMenu.other' })} />
            <div className="navigation-link hover:bg-gray-50 rounded -ml-4 w-[calc(100%+2rem)]">
              <Icon name="plugs" appearance={{ size: iconSize }} />
              <button type="button" className="ml-2" onClick={disconnectWallet}>
                {formatText({ id: 'userMenu.disconnectWalletTitle' })}
              </button>
            </div>
          </div>
        )}
        {/* @BETA: Disabled for now */}
        {/* <ThemeSwitcher /> */}
      </div>
      <div
        className={clsx('transition-transform', {
          'translate-x-0': activeSubmenu,
          'translate-x-full': !activeSubmenu,
        })}
      >
        {activeSubmenu && (
          <>
            <button
              type="button"
              aria-label={formatText({ id: 'ariaLabel.backToMainMenu' })}
              className={clsx(styles.buttonBack, 'group text-4 mb-2')}
              onClick={closeSubmenu}
            >
              <Icon name="caret-left" appearance={{ size: 'extraExtraTiny' }} />

              <TitleLabel
                className="ml-2"
                text={formatText({ id: activeSubmenu })}
              />
            </button>
            <UserSubmenu
              submenuId={activeSubmenu}
              closeSubmenu={closeSubmenu}
            />
          </>
        )}
      </div>
    </PopoverBase>
  );
};

UserMenu.displayName = displayName;

export default UserMenu;
