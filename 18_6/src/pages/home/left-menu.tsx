import { memo } from "react"
import { map } from 'lodash-es'
import { NavLink } from "react-router-dom";
import { menuConf } from '/src/router'
import type { IMenuConf } from "/src/router";

export const LeftMenu = memo(function LeftMenu() {
  const menu = genMenu(menuConf)
  return (
    <div className="left-menu-container p-fixed height-100p">
      <ul>
        {menu}
      </ul>
    </div>
  )
})

function genMenu(conf: IMenuConf[]) {
  const menu = map(conf, item => {
    const { children, ...rest } = item
    if (children?.length) {
      return (
        <li key={rest.path} className="">
          <div className="parent item pl-20px">
            {rest.name}
          </div>
          <ul className="pl-20px">
            {genMenu(children)}
          </ul>
        </li>
      )
    }
    return <MenuItem key={rest.path} {...rest} />
  })
  return menu
}

interface IItemProps {
  path: string;
  name: string;
}

const MenuItem = memo(function MenuItem(props: IItemProps) {
  const { path, name } = props
  return (
    <li key={path} className="child item pl-20px">
      <NavLink to={path}>{name}</NavLink>
    </li>
  )
})
