import { genRoutes } from '/src/router'
import { demoChildrenConf } from './route'
import './style.less'

const routes = genRoutes(demoChildrenConf, '/demo')

export default function Demo() {
  return (
    <section className="p-12">
      {routes}
    </section>
  )
}

