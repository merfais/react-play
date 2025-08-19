import { lazy } from 'react'

export const demo2ChildrenConf = {
  // table: {
  //   path: 'table',
  //   component: lazy(() => import('./table')),
  // }
}

export const demo2Conf = {
  demo2: {
    path: '/demo2',
    component: lazy(() => import('.')),
    children: demo2ChildrenConf,
  }
}

