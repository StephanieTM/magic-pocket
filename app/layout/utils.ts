import { matchPath } from 'react-router';
import { IRouteConfig } from 'app/routers/routes';
import { IApplication } from './interface';

export * from './interface';

export function getFirstLink(routes: IRouteConfig[] = []): string {
  for (let i = 0; i < routes.length; i += 1) {
    const currentRoute = routes[i];
    if (currentRoute.link) {
      return currentRoute.link;
    }

    const link = getFirstLink(currentRoute.children);
    if (link) {
      return link;
    }
  }
  return '';
}

export function getApplication(apps: IRouteConfig[]): IApplication[] {
  return apps
    .filter(app => app.children && app.children.length && !app.hideInMenu)
    .map(({ children, ...app }) => ({
      link: getFirstLink(children),
      menus: children || [],
      key: app.code as string,
      code: app.code as string,
      ...app,
    }));
}

export function isMatch(pathname: string, route: IRouteConfig): boolean {
  if (!route.children) {
    return !!matchPath(pathname, { path: route.link, exact: true });
  }

  for (let i = 0; i < route.children.length; i++) {
    if (isMatch(pathname, route.children[i])) {
      return true;
    }
  }

  return false;
}

export function findActiveApp(apps: IApplication[]): IApplication|Record<string, never> {
  const matchedApp = apps.filter(app => isMatch(window.location.pathname, app));

  if (matchedApp.length) {
    return matchedApp[0];
  }

  return apps[0] || {};
}

export function isMatchedUrl(keyword = ''): boolean {
  const { pathname } = location;
  const pathnameLen = pathname.length;
  const indexLocation = pathname.indexOf('' + keyword);
  if (indexLocation > -1) {
    if (indexLocation + keyword.length === pathnameLen) {
      return true;
    } else if (pathnameLen > indexLocation + keyword.length) {
      const nextStr = pathname[indexLocation + 1];
      if (nextStr === '/' || nextStr === '?') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function findMatchedMenu(menus: IRouteConfig[] = [], appCode: string): { selectedKeys: string[]; openKeys: string[] } {
  for (const menu of menus) {
    if (!menu.children || !menu.children.length) {
      if (isMatchedUrl(menu.link)) {
        return {
          selectedKeys: [getMenuKey(menu, appCode)],
          openKeys: [],
        };
      }
    } else {
      for (const child of menu.children) {
        if (isMatchedUrl(child.link)) {
          return {
            selectedKeys: [getMenuKey(child, appCode)],
            openKeys: [getMenuKey(menu, appCode)],
          };
        }
      }
    }
  }
  return {
    selectedKeys: [],
    openKeys: [],
  };
}

export function getMenuKey({ children, title, link }: IRouteConfig, appCode = ''): string {
  if (!children || !children.length) {
    return link as string;
  }
  return `${appCode}-${title}`;
}
