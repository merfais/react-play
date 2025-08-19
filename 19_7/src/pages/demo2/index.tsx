import { Outlet } from "react-router";
import './style.less'

export default function Demo() {
  return (
    <div className="flex-grow height-100p">
      这里是demo2主页面
      <Outlet />
    </div>
  )
}

