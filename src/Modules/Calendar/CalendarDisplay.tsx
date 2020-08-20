import React from 'react'
import './CalendarDisplay.css'

const CalendarDisplay: React.FC = () => {
  const numCols = 5


  const events = new Array(numCols)

  events[2] = [<div>hi</div>, <div>bye</div>]

  const getCols = (): JSX.Element[] => {
    const cols: JSX.Element[] = []
    for (let i=0; i < numCols; i++) {
      cols.push(
        <div className='Column' key={i}>
          { events[i] }
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
