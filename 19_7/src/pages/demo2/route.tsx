import { lazy } from 'react'

export const demo2Confs = {
  demo2: {
    name: 'demo2',
    Component: lazy(() => import('.')),
    // children: {
    //   table: {
    //     Component: lazy(() => import('.')),
    //   }
    // }
  }
}

