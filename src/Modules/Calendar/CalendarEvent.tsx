import React from 'react'
import './CalendarEvent.css'
import { calendarEvent } from './Calendar'
import FullscreenModal from '../../Components/FullscreenModal/FullscreenModal'

type props = {
  event: calendarEvent
}

const CalendarEvent: React.FC<props> = ({ event }) => {
  const [modal, setModal] = React.useState<JSX.Element | undefined>(undefined)

  const createModalContent = () => { 
    return (
      <div>
        <h2>{ event.label }</h2>
        <i> { event.description } </i>
        <br />
        { new Date(event.time).toLocaleString() }
        <br />
        { event.location && <span>Location: {event.location}</span>}
        <br />
        Added by { event.creator!.name }
        <br />
        { event.assigned.length > 0 && <span>Assigned to: {event.assigned}</span> }
      </div>
    )
  }

  return (
    <div className='CalendarEvent' onClick={() => {setModal(createModalContent())}}>

      {modal && (
        <FullscreenModal element={modal} setModal={setModal} closeable={true} />
      )}

      <h3> { event.label } </h3> 
      <b> { new Date(event.time).toLocaleTimeString() } </b>
    </div>
  )
}

export default CalendarEvent
