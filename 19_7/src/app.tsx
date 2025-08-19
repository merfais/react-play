import { RouterProvider } from "react-router/dom";
import router from './router'
import './style/common.less'
import './style/global.less'

function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
