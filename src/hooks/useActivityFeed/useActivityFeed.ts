import { useEffect, useMemo, useState } from 'react';

import {
  SearchableColonyActionSortableFields,
  SearchableSortDirection,
  useSearchActionsQuery,
} from '~gql';
import { useNetworkMotionStates } from '~hooks';
import { notNull } from '~utils/arrays';

import useColonyContext from '../useColonyContext';

import {
  filterActionByMotionState,
  getActionsByPageNumber,
  getSearchActionsFilterVariable,
  makeWithMotionStateMapper,
} from './helpers';
import {
  ActivityFeedFilters,
  ActivityFeedOptions,
  ActivityFeedSort,
  UseActivityFeedReturn,
} from './types';

const ITEMS_PER_PAGE = 2;

const useActivityFeed = (
  filters?: ActivityFeedFilters,
  sort?: ActivityFeedSort,
  { pageSize = ITEMS_PER_PAGE }: ActivityFeedOptions = {},
): UseActivityFeedReturn => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();

  const [pageNumber, setPageNumber] = useState(1);
  /**
   * Requested actions count is the total number of actions we want to fetch
   * It's set one page ahead to prefetch the next page actions
   */
  const requestedActionsCount = pageSize * (pageNumber + 1);

  useEffect(() => {
    setPageNumber(1);
  }, [filters]);

  const { data, fetchMore, loading } = useSearchActionsQuery({
    variables: {
      filter: getSearchActionsFilterVariable(colonyAddress, filters),
      sort: sort || {
        field: SearchableColonyActionSortableFields.CreatedAt,
        direction: SearchableSortDirection.Desc,
      },
      limit: pageSize * 2,
    },
    fetchPolicy: 'network-only',
  });

  const { items, nextToken } = data?.searchColonyActions ?? {};

  const motionIds = useMemo(
    () =>
      items
        ?.map((action) => action?.motionData?.motionId ?? '')
        .filter(Boolean) || [],
    [items],
  );
  const {
    motionStatesMap,
    loading: motionStatesLoading,
    refetch: refetchMotionStates,
  } = useNetworkMotionStates(motionIds);

  const actions = useMemo(
    () =>
      (items?.filter(notNull) ?? []).map(
        makeWithMotionStateMapper(motionStatesMap),
      ),
    [items, motionStatesMap],
  );

  const loadingMotionStateFilter =
    motionStatesLoading && !!filters?.motionStates?.length;

  const filteredActions = actions.filter((action) =>
    filterActionByMotionState(action, filters?.motionStates),
  );

  const fetchMoreActions =
    !!nextToken &&
    filteredActions.length < requestedActionsCount &&
    !loadingMotionStateFilter;
  useEffect(() => {
    if (fetchMoreActions) {
      fetchMore({ variables: { nextToken } });
    }
  }, [fetchMore, fetchMoreActions, nextToken]);

  const hasNextPage =
    pageNumber * pageSize < filteredActions.length ||
    fetchMoreActions ||
    loadingMotionStateFilter;
  const hasPrevPage = pageNumber > 1;

  const goToNextPage = () => {
    if (loading || fetchMoreActions || loadingMotionStateFilter) {
      return;
    }
    setPageNumber((number) => number + 1);
  };

  const goToPreviousPage = () => {
    if (pageNumber === 1) {
      return;
    }
    setPageNumber((number) => number - 1);
  };

  const visibleActions = getActionsByPageNumber(
    filteredActions,
    pageNumber,
    pageSize,
  );
  const nextPageActions = getActionsByPageNumber(
    filteredActions,
    pageNumber + 1,
    pageSize,
  );

  const loadingFirstPage =
    (loading || fetchMoreActions || loadingMotionStateFilter) &&
    visibleActions.length < pageSize;
  const loadingNextPage =
    (loading || fetchMoreActions || loadingMotionStateFilter) &&
    nextPageActions.length < pageSize;

  return {
    loadingFirstPage,
    loadingNextPage,
    loadingMotionStates: motionStatesLoading,
    actions: visibleActions,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPreviousPage,
    pageNumber,
    refetchMotionStates,
  };
};

export default useActivityFeed;
