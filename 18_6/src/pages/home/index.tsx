import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { LeftMenu } from './left-menu'
import './style.less'

export default function Home() {
  return (
    <>
      <LeftMenu />
      <div className="page-container">
        <Suspense fallback={<div />}>
          <Outlet />
        </Suspense>
      </div>
    </>
  )
}
