import React from 'react'
import './Hamburger.css'

type props = {
  toggleSidebar(): void
}

const Hamburger: React.FC<props> = ({ toggleSidebar }) => {
  return (
    <div className='hamburger' onClick={() => toggleSidebar()}>
      <hr/>
      <hr/>
      <hr/>
    </div>
  )
}

export default Hamburger
