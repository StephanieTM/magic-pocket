import { createModel } from '@rematch/core';
import { IApplication } from 'app/layout/interface';
import { getApplication } from 'app/layout/utils';
import { IRouteConfig, routes } from 'app/routers/routes';
import { RootModel } from './index';

interface GlobalState {
  apps: IApplication[];
  currentApp: IApplication|Record<string, never>;
  menus: IRouteConfig[];
  appDrawerVisible: boolean;
  isMobile: boolean;
};

const appList = getApplication(routes);

export const global = createModel<RootModel>()({
  state: {
    apps: appList,
    currentApp: {},
    menus: [],
    appDrawerVisible: false,
    isMobile: false,
  } as GlobalState,
  reducers: {
    setCurrentApp(state, currentApp: GlobalState['currentApp']) {
      return { ...state, currentApp, menus: currentApp.menus || [] };
    },
    setAppDrawerVisible(state, appDrawerVisible: GlobalState['appDrawerVisible']) {
      return { ...state, appDrawerVisible };
    },
    setIsMobile(state, isMobile: GlobalState['isMobile']) {
      return { ...state, isMobile };
    },
  },
});
