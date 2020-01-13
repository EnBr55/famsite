import React from 'react'
import './Sidebar.css'

type props = {
  open: boolean
}

const Sidebar: React.FC<props> = ({ open }) => {
  return (
    <div className='sidebar' style={{
      transform: open ? 'translateX(0)' : 'translateX(-110%)'
    }}>
    </div>
  )
}

export default Sidebar
