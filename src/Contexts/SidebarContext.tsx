import React from 'react'

type sidebarContext = {
  sidebar?: JSX.Element
  default: JSX.Element
  setSidebar(element: (JSX.Element | undefined)): void
}

const defaultSidebar: sidebarContext = {
  sidebar: undefined,
  default: <div></div>,
  setSidebar: (sidebarElement: JSX.Element | undefined) => {}
}

export const SidebarContext = React.createContext(defaultSidebar)
export const SidebarProvider = SidebarContext.Provider
