import React from 'react'
import './Sidebar.css'

type props = {
  open: boolean
  toggleSidebar(): void
}

const Sidebar: React.FC<props> = ({ open, toggleSidebar }) => {
  return (
    <div className='sidebar' style={{ transform: open ? 'translateX(0)' : 'translateX(-110%)' }}>
      <div className='background' onClick={() => toggleSidebar()}>
        <div className='visible' onClick={(e) => {e.stopPropagation()}} style={{ transform: open ? 'translateX(0)' : 'translateX(-110%)' }}>
          BBBBBBBBBBB
        </div>
      </div>
    </div>
  )
}

export default Sidebar
