import React from 'react'
import './Sidebar.css'
import { UserContext } from '../../Contexts/UserContext'
import { SidebarContext } from '../../Contexts/SidebarContext'
import Hammer from 'react-hammerjs'

const Sidebar: React.FC = () => {
  const user = React.useContext(UserContext)
  const sidebar = React.useContext(SidebarContext)
  const [panned, setPanned] = React.useState(0)

  const handlePan = (e: HammerInput) => {
    sidebar.setSidebar(sidebar.default)
    if (e.isFinal) {
      if (e.deltaX < window.innerWidth / 3) {
        sidebar.setSidebar(undefined)
      }
      setPanned(0)
    } else {
      setPanned(e.deltaX)
    }
  }

  const getTranslation = (): string => {
    if (panned !== 0) {
      return `translateX(calc(${panned}px - 100vw))`
    } else if (sidebar.sidebar !== undefined) {
      return `translateX(0)`
    } else {
      return 'translateX(-110%)'
    }
  }
  return (
    <div className="sidebar-section">
      <Hammer onPan={e => handlePan(e)}>
        <div className="sidebar-controller">
        </div>
      </Hammer>

      <div className='sidebar' style={{ transform: getTranslation(), transition: panned === 0 ? 'all 0.5s ease' : 'all 0.2s ease-out' }}>
        <div className='sidebar-content'>
          {user.name !== '' ? sidebar.sidebar : 'You\'re not logged in.'}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
