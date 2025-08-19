import { map } from 'lodash-es'
import { Switch, Route, Redirect} from "react-router-dom";
import type { RouteProps } from "react-router-dom";
import NotFound from '/pages/404'
import { demoConf } from '/pages/demo/route';
import { demo2Conf } from '/pages/demo2/route';

interface IRouteConf extends Omit<RouteProps, 'children' | 'path'> {
  path?: string;
  name?: string;
  children?: Record<string, IRouteConf>;
}
const config = {
  ...demoConf,
  ...demo2Conf,
}

const home = {
  path: "/",
  render: () => {
    return <Redirect to="/demo" />
  }
}

const notFound = {
  path: '*',
  component: NotFound,
}

export function genRoutes(config: Record<string, IRouteConf>, parent?: string) {
  const routes = map(config, (item, key) => {
    const conf: RouteProps = { ...item }
    delete conf.children

    let path = item.path || key
    if (path?.[0] !== '/') {
      path = `/${path}`
    }
    if (parent) {
      path = `${parent}${path}`
    }
    conf.path = path

    if (conf.exact === undefined) {
      conf.exact = !item.children
    }
    return <Route key={key} { ...conf} />
  })

  return (
    <Switch>
      {routes}
    </Switch>
  )
}

const routes = genRoutes({ home, ...config, notFound })
export default routes

export interface IMenuConf {
  path: string;
  name: string;
  children?: IMenuConf[];
}

function genMenu(config: Record<string, IRouteConf>, p: string = ''): IMenuConf[] {
  const menus = map(config, (item, key) => {
    let path = item.path || key
    if (path?.[0] !== '/') {
      path = `/${path}`
    }
    if (p) {
      path = `${p}${path}`
    }
    const name = item.name || key
    const conf: IMenuConf = { path, name }
    if (item.children) {
      conf.children = genMenu(item.children, path)
    }
    return conf
  })
  return menus
}

export const menuConf = genMenu(config)

