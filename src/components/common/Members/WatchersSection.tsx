import React, { useState, useCallback, ReactNode } from 'react';
import classnames from 'classnames';
import { FormattedMessage, defineMessages } from 'react-intl';

import MembersList from '~shared/MembersList';
import LoadMoreButton from '~shared/LoadMoreButton';
import { Props as SortingProps } from '~shared/MembersList/SortingRow';
import { Watcher, MemberUser } from '~types';
import { useColonyMembersSorting } from '~hooks';

import styles from './MembersSection.css';

const displayName = 'common.Members.WatchersSection';

const MSG = defineMessages({
  watchersTitle: {
    id: `${displayName}.watchersTitle`,
    defaultMessage: 'Watchers',
  },
  watchersDescription: {
    id: `${displayName}.watchersDescription`,
    defaultMessage: "Members who don't currently have any reputation",
  },
  noMembersFound: {
    id: `${displayName}.noMembersFound`,
    defaultMessage: 'No members found',
  },
});

interface Props {
  members: Watcher[];
  canAdministerComments: boolean;
  extraItemContent?: (user: MemberUser) => ReactNode;
  itemsPerSection?: number;
}

const WatchersSection = ({
  members,
  canAdministerComments,
  extraItemContent,
  itemsPerSection = 10,
}: Props & Partial<SortingProps>) => {
  const [dataPage, setDataPage] = useState<number>(1);

  const paginatedMembers = members.slice(0, itemsPerSection * dataPage);
  const handleDataPagination = useCallback(() => {
    setDataPage(dataPage + 1);
  }, [dataPage]);

  const { sortedMembers } = useColonyMembersSorting(paginatedMembers, false);

  return (
    <>
      <div className={styles.bar}>
        <div className={classnames(styles.title)}>
          <FormattedMessage {...MSG.watchersTitle} />
        </div>
        <div className={styles.description}>
          <FormattedMessage {...MSG.watchersDescription} />
        </div>
      </div>
      {paginatedMembers.length ? (
        <div className={styles.membersList}>
          <MembersList
            extraItemContent={extraItemContent}
            members={sortedMembers}
            canAdministerComments={canAdministerComments}
            showUserReputation={false}
          />
        </div>
      ) : (
        <div className={styles.noResults}>
          <FormattedMessage {...MSG.noMembersFound} />
        </div>
      )}
      {itemsPerSection * dataPage < members.length && (
        <LoadMoreButton onClick={handleDataPagination} isLoadingData={false} />
      )}
    </>
  );
};

WatchersSection.displayName = displayName;

export default WatchersSection;
