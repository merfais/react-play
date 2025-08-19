import { lazy } from 'react'

export const demoConfs = {
  demo: {
    name: 'demo',
    Component: lazy(() => import('.')),
    children: {
      table: {
        Component: lazy(() => import('./table')),
      }
    }
  }
}

