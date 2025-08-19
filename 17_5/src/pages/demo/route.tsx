import { lazy } from 'react'

export const demoChildrenConf = {
  table: {
    path: 'table',
    component: lazy(() => import('./table')),
  }
}

export const demoConf = {
  demo: {
    path: '/demo',
    component: lazy(() => import('.')),
    children: demoChildrenConf
  }
}


