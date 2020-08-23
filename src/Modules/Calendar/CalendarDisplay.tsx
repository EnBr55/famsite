import React from 'react'
import './CalendarDisplay.css'

import { calendarEvent } from './Calendar'

import CalendarEvent from './CalendarEvent'

const dayLength = 1000*60*60*24

const sortByDate = (a: calendarEvent, b: calendarEvent) => {
  return a.time > b.time ? 1 : b.time > a.time ? -1 : 0
}

type props = {
  events: calendarEvent[]
  startTime: number
  endTime: number
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const CalendarDisplay: React.FC<props> = ({events, startTime, endTime}) => {

  const numCols = 7

  const createEventsArr = (events: calendarEvent[]) => {
    const eventArr: calendarEvent[][] = []
    for (let i = 0; i < numCols; i++) {
      eventArr[i] = []
    }
    // array of events in descending order from the end of the period
    // ( the first thing popped will be the first event )
    const reversedEvents = Array.from(events.sort(sortByDate).reverse())
    let i = 1
    while (reversedEvents.length) {
      let currentEvent = reversedEvents[reversedEvents.length-1]
      if (currentEvent.time > endTime || currentEvent.time < startTime) {
        reversedEvents.pop()
      } else {
        while (currentEvent.time >= (startTime + i*dayLength)) {
          i++
        }

        let event = reversedEvents.pop()
        if (event !== undefined) {
          eventArr[i-1].push(event)
        }
      }
    }
    return eventArr
  }

  const getCols = (): JSX.Element[] => {
    const cols: JSX.Element[] = []
    const eventArr = createEventsArr(events)
    for (let i=0; i < numCols; i++) {
      cols.push(
        <div className='Column' key={i}>
          <h2>{days[new Date(startTime + i*dayLength).getDay()]}</h2>
          <hr />
          { eventArr[i].map((event) => <CalendarEvent key={event.id} event={event} />) }
        </div>
      )
    }
    return cols
  }

  return (
    <div className='CalendarDisplay'>
      <h2>Week starting at {new Date(startTime).toDateString()} </h2>
      <div className='Columns' style={{'gridTemplateColumns': `repeat(${numCols}, 1fr)`}}>
        {getCols()} 
      </div>
    </div>
  )
}

export default CalendarDisplay
