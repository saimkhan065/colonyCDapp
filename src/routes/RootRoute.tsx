import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import {
  AppContextProvider,
  PageHeadingContextProvider,
  PageThemeContextProvider,
  usePageThemeContext,
} from '~context';
import { CurrencyContextProvider } from '~context/CurrencyContext';
import { Theme } from '~frame/Extensions/themes/enum';
import { applyTheme } from '~frame/Extensions/themes/utils';
import { DialogProvider } from '~shared/Dialog';

const RootRouteInner = () => {
  const { isDarkMode } = usePageThemeContext();

  useEffect(() => {
    // applyTheme(isDarkMode ? Theme.dark : Theme.light);
    applyTheme(Theme.light);
  }, [isDarkMode]);

  return (
    <DialogProvider>
      <PageHeadingContextProvider>
        <Outlet />
      </PageHeadingContextProvider>
    </DialogProvider>
  );
};

const RootRoute = () => (
  <PageThemeContextProvider>
    <AppContextProvider>
      <CurrencyContextProvider>
        <RootRouteInner />
      </CurrencyContextProvider>
    </AppContextProvider>
  </PageThemeContextProvider>
);

export default RootRoute;
