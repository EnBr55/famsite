import React from 'react'

type sidebarContext = {
  sidebar?: JSX.Element
  setSidebar(element: JSX.Element): void
}

const defaultSidebar: sidebarContext = {
  sidebar: undefined,
  setSidebar: () => {}
}

export const SidebarContext = React.createContext(defaultSidebar)
export const SidebarProvider = SidebarContext.Provider
