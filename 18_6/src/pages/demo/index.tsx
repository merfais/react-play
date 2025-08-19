import { Outlet } from "react-router-dom";
import './style.less'

export default function Demo() {
  return (
    <section className="p-12">
      <Outlet />
    </section>
  )
}

