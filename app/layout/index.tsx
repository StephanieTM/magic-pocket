import React from 'react';
import { IRouteConfig, routes } from 'app/routers/routes';
import Header from './Header';
import Body from './Body';
import './index.less';

function getRoutes(allRouters: IRouteConfig[]): IRouteConfig[] {
  const getFlattenRoutes = (routeItem: IRouteConfig[] = allRouters, result: IRouteConfig[] = []): IRouteConfig[] => {
    routeItem.forEach(item => {
      if (item.children) {
        result.concat(getFlattenRoutes(item.children, result));
      } else {
        result.push(item);
      }
    });
    return result;
  };

  return getFlattenRoutes();
}

export default function AppLayout(): JSX.Element {
  const flattenRoutes = getRoutes(routes);

  return (
    <div className="app-container">
      <Header />
      <Body routes={flattenRoutes} />
    </div>
  );
}
