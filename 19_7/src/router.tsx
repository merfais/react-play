import { map } from 'lodash-es'
import { createBrowserRouter, redirect } from "react-router";
import type { RouteObject } from 'react-router';
import Home from '/pages/home'
import NotFound from '/pages/404'
import { demoConfs } from '/pages/demo/route';
import { demo2Confs } from '/pages/demo2/route';

interface IRouteConf extends Omit<RouteObject, 'children'> {
  name?: string;
  children?: Record<string, IRouteConf>;
}
const config = {
  ...demoConfs,
  ...demo2Confs,
}

const home = {
  path: "/",
  element: <Home/>,
  children: {
    index: {
      index: true,
      // element: <Navigate to="/demo/table" replace />
      loader: () =>  redirect('/demo/table'),
    },
    ...config
  },
}

const notFound = {
  path: '*',
  element: <NotFound />,
}

function genRoutes(config: Record<string, IRouteConf>): RouteObject[] {
  const routes = map(config, (item, path) => {
    const { children, ...rest } = item
    delete rest.name

    const conf: RouteObject = rest

    if (!conf.path && !conf.index) {
      conf.path = path
    }
    if (item.children) {
      conf.children = genRoutes(item.children)
    }
    return conf
  })
  return routes
}

const routes = genRoutes({ home, notFound })
const router =  createBrowserRouter(routes);
export default router


export interface IMenuConf {
  path: string;
  name: string;
  children?: IMenuConf[];
}

function genMenu(config: Record<string, IRouteConf>, p: string = ''): IMenuConf[] {
  const menus = map(config, (item, key) => {
    const path = item.path || key
    const name = item.name || path
    const conf: IMenuConf = { path: `${p}/${path}`, name }
    if (item.children) {
      conf.children = genMenu(item.children, path)
    }
    return conf
  })
  return menus
}

export const menuConf = genMenu(config)

