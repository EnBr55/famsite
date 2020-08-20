import React from 'react'
import './CalendarDisplay.css'

const CalendarDisplay: React.FC = () => {
  const numCols = 5

  const getCols = (): JSX.Element[] => {
    const cols: JSX.Element[] = []
    for (let i=0; i < numCols; i++) {
      cols.push(
        <div className='Column'>
          aaaa
        </div>
      )
    }
    return cols
  }
  return (
    <div className='CalendarDisplay' style={{'gridTemplateColumns': `repeat(${numCols}, 1fr)`}}>
      {getCols()} 
    </div>
  )
}

export default CalendarDisplay
