import React from 'react'
import './LoadingBar.css'
const LoadingBar: React.FC = () => {
  return (
    <div className="bar-outline">
      <div className="progress-bar">&#8987;</div>
    </div>
  )
}
export default LoadingBar