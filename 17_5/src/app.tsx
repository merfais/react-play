import { Suspense } from "react";
import { BrowserRouter} from "react-router-dom";
import { LeftMenu } from './left-menu'
import routes from './router'
import './style/common.less'
import './style/global.less'

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div/>}>
        <LeftMenu />
        <div className="page-container">
          {routes}
        </div>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
