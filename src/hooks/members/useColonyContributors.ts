import { useMemo, useState } from 'react';

import { UserRole } from '~constants/permissions';
import { ColonyContributor, SortDirection } from '~types';
import {
  ContributorTypeFilter,
  StatusType,
} from '~v5/common/TableFiltering/types';

import useMemberFilters from './useMemberFilters';
import { sortByReputationAscending, sortByReputationDescending } from './utils';

const useColonyContributors = ({
  allMembers,
  filterPermissions,
  nativeDomainIds,
  filterStatus,
  contributorTypes,
  sortDirection,
  pageSize,
}: {
  allMembers: ColonyContributor[];
  filterPermissions: Record<UserRole, number[]>;
  nativeDomainIds: number[];
  filterStatus: StatusType | undefined;
  contributorTypes: Set<ContributorTypeFilter>;
  sortDirection: SortDirection;
  pageSize: number;
}) => {
  const [page, setPage] = useState<number>(1);

  const visibleItems = page * pageSize;

  /*
   * To be considered a contributor, you must:
   * have at least one permission or
   * have at least some reputation in the selected domains
   */

  const allContributors = useMemo(
    () =>
      allMembers.filter(
        ({ hasReputation, hasPermissions }) => hasReputation || hasPermissions,
      ) ?? [],
    [allMembers],
  );

  const filteredContributors = useMemberFilters({
    members: allContributors,
    contributorTypes,
    filterPermissions,
    nativeDomainIds,
    filterStatus,
  });

  const sortedContributors =
    sortDirection === SortDirection.Asc
      ? sortByReputationAscending(filteredContributors)
      : sortByReputationDescending(filteredContributors);

  return {
    contributors: sortedContributors,
    pagedContributors: sortedContributors.slice(0, visibleItems),
    canLoadMore: sortedContributors.length > visibleItems,
    loadMore() {
      setPage((prevPage) => prevPage + 1);
    },
    totalContributorCount: allContributors.length,
    totalContributors: allContributors,
  };
};

export default useColonyContributors;
