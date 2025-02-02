import clsx from 'clsx';
import React, { FC } from 'react';

import MotionBadge from '~v5/common/ActionSidebar/partials/Motions/partials/MotionBadge/MotionBadge';

import UserInfoList from './partials/UserInfoList';
import { UserInfoSectionListProps } from './types';

const displayName = 'v5.UserInfoSectionList';

const UserInfoSectionList: FC<UserInfoSectionListProps> = ({
  sections,
  className,
}) =>
  sections.length ? (
    <ul className={clsx(className, 'w-full flex flex-col gap-6')}>
      {sections.map(({ key, heading, items }) => (
        <li key={key}>
          <div
            className={clsx('w-full', {
              'mb-3': !!items.length,
            })}
          >
            <MotionBadge {...heading} />
          </div>
          <UserInfoList items={items} />
        </li>
      ))}
    </ul>
  ) : null;

UserInfoSectionList.displayName = displayName;

export default UserInfoSectionList;
