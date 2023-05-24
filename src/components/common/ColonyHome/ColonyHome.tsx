import React, { useMemo, useState } from 'react';
import { Outlet, Route, Routes as RoutesSwitch, useLocation } from 'react-router-dom';

import ColonyActions from '~common/ColonyActions';
// import ColonyEvents from '~dashboard/ColonyEvents';

import { COLONY_EVENTS_ROUTE } from '~routes/index';
import NotFoundRoute from '~routes/NotFoundRoute';
import { useColonyContext } from '~hooks';

import ColonyHomeLayout from './ColonyHomeLayout';

const displayName = 'common.ColonyHome';

const ColonyHome = () => {
  const { colony } = useColonyContext();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryDomainIdFilter = searchParams.get('domainFilter');
  const [domainIdFilter, setDomainIdFilter] = useState<number>(Number(queryDomainIdFilter));

  const memoizedSwitch = useMemo(() => {
    if (colony) {
      return (
        <RoutesSwitch>
          <Route
            path={COLONY_EVENTS_ROUTE}
            element={
              <ColonyHomeLayout filteredDomainId={domainIdFilter} onDomainChange={setDomainIdFilter}>
                {/* <ColonyEvents colony={colony} ethDomainId={filteredDomainId} /> */}
                <div>Events (Transactions Log)</div>
              </ColonyHomeLayout>
            }
          />
          <Route
            element={
              <ColonyHomeLayout filteredDomainId={domainIdFilter} onDomainChange={setDomainIdFilter}>
                <Outlet />
              </ColonyHomeLayout>
            }
          >
            <Route path="/" element={<ColonyActions />} />
          </Route>

          <Route path="*" element={<NotFoundRoute />} />
        </RoutesSwitch>
      );
    }
    return null;
  }, [colony, domainIdFilter]);

  return memoizedSwitch;
};

ColonyHome.displayName = displayName;

export default ColonyHome;
