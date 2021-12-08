import { Dispatch, SetStateAction } from 'react';
import { IRouteConfig } from '../routers/routes';

export interface IValue {
  apps: Array<IApplication|Record<string, never>>;
  menus: IRouteConfig[];
  currentApp: IApplication|Record<string, never>;
  setCurrentApp: Dispatch<SetStateAction<IApplication|Record<string, never>>>;
  appDrawerVisible: boolean;
  setAppDrawerVisible: Dispatch<SetStateAction<boolean>>;
  isMobile: boolean;
}

export interface IApplication extends IRouteConfig {
  menus: IRouteConfig[];
  code: string;
  key: string;
}

export interface IBodyProps {
  routes: IRouteConfig[];
}
