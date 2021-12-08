import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';

export type ILoadComponent = Promise<{ default: ComponentType<RouteComponentProps>}>;

export interface IRouteConfig {
  title: string;
  link?: string;
  code?: string;
  key?: string;
  children?: IRouteConfig[];
  component?: () => ILoadComponent;
  hideInMenu?: boolean;
  icon?: JSX.Element;
}

export const routes: IRouteConfig[] = [
  {
    title: 'Home',
    code: 'home',
    link: '/',
    component: () => import('src/components/homepage'),
  },
  {
    title: 'Demos',
    code: 'Demos',
    link: '/demos',
    component: () => import('src/components/demos'),
  },
  {
    title: 'Custom Tree',
    link: '/demos/custom-tree',
    component: () => import('src/components/demos/custom-tree'),
    hideInMenu: true,
  },
];
