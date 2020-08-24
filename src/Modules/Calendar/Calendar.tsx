import React from 'react'
import './Calendar.css'
import FirebaseRef from '../../firebase'
//import Delete from '@material-ui/icons/Delete'
//
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FullscreenModal from '../../Components/FullscreenModal/FullscreenModal'
import CalendarDisplay from './CalendarDisplay'
import { UserContext } from '../../Contexts/UserContext'
import { User } from '../../Models/Users'
import AddEvent from './AddEvent'

export type calendarEvent = {
  creator?: User
  label: string
  location: string
  description: string
  timeCreated: number
  time: number
  assigned: User[]
  id: string
  counterMax: number
  counterUpdates: {[key: string]: number}
  repeatInterval: number
}


type props = {
  boardId: string
  moduleId: string
}

export const defaultCalendarEvent = {
  label: '',
  creator: undefined,
  assigned: [],
  timeCreated: 0,
  time: 1,
  location: '',
  description: '',
  id: '',
  counterMax: 0,
  counterUpdates: {},
  repeatInterval: 0
}

const dayLength = 1000*60*60*24
const numDays = 7

const getClosestMonday = (): Date => {
  const currentDay = new Date
  // we want the start of the day
  currentDay.setHours(0, 0, 0, 0)
  // if Sunday, we take the next day
  if (currentDay.getDay() == 0) {
    return new Date(currentDay.getTime() - dayLength*6)
  } else {
    return new Date(currentDay.getTime() - ((currentDay.getDay() - 1) * dayLength))
  }
}

const Calendar: React.FC<props> = ({ boardId, moduleId }) => {
  const user = React.useContext(UserContext)

  const [events, setEvents] = React.useState<calendarEvent[]>([])
  const [repeatingEvents, setRepeatingEvents] = React.useState<calendarEvent[]>([])
  const [title, setTitle] = React.useState('')
  const [modal, setModal] = React.useState<JSX.Element | undefined>(undefined)

  const [startTime, setStartTime] = React.useState(getClosestMonday().getTime())
  let getEndTime = (start: number) => start + dayLength * 7 - 1



  let ref = FirebaseRef.firestore()
    .collection('boards')
    .doc(boardId)
    .collection('modules')
    .doc(moduleId)
    .collection('data')

  React.useEffect(() => {
    let queryRef = ref
      .where('time', '>=', startTime)
      .where('time', '<', getEndTime(startTime))
      .orderBy('time')

    FirebaseRef.firestore()
      .collection('boards')
      .doc(boardId)
      .collection('modules')
      .doc(moduleId)
      .get()
      .then((doc) => setTitle(doc.data()!.name || 'Calendar'))
    const unsubscribe = queryRef.onSnapshot((snapshot) => {
      const newEvents: calendarEvent[] = []
      snapshot.forEach((doc) => {
        if (doc.data().repeatInterval === 0) {
          newEvents.push({
            ...defaultCalendarEvent,
            ...doc.data(),
            id: doc.id,
          })
        }
      })
      setEvents(newEvents)
    })
    return unsubscribe
  }, [boardId, moduleId, startTime])

  React.useEffect(() => {
    let queryRef = ref
      .where('repeatInterval', '>', 0)

    FirebaseRef.firestore()
      .collection('boards')
      .doc(boardId)
      .collection('modules')
      .doc(moduleId)
      .get()
      .then((doc) => setTitle(doc.data()!.name || 'Calendar'))
    const unsubscribe = queryRef.onSnapshot((snapshot) => {
      const newEvents: calendarEvent[] = []
      snapshot.forEach((doc) => {
        newEvents.push({
          ...defaultCalendarEvent,
          ...doc.data(),
          id: doc.id,
        })
      })
      setRepeatingEvents(newEvents)
    })
    return unsubscribe
  }, [boardId, moduleId])

  const getAllEventsInPeriod = () => {
    const combinedEvents = Array.from(events)
    for (let event of repeatingEvents) {

      let dayStart = new Date(event.time).setHours(0, 0, 0, 0)
      let diff = event.time - dayStart

      for (let i = 0; i < numDays; i++) {
        if ((startTime + i*dayLength - dayStart) % (event.repeatInterval*dayLength) === 0) {
          combinedEvents.push({
            ...event,
            time: startTime + i*dayLength + diff
          })
        }
      }
    }
    return combinedEvents
  }

  return (
    <div className="Calendar">
      {modal && (
        <FullscreenModal element={modal} setModal={setModal} closeable={true} />
      )}
        { /* <h1>{title}</h1> */ }
      <div className='TimeArrows'>
        <div className='Arrow' onClick={() => {setStartTime(startTime - dayLength * 7)}}>
          <ArrowBackIcon/>
        </div>
        <h2>Week starting at {new Date(startTime).toDateString()} </h2>
        <div className='Arrow' onClick={() => {setStartTime(startTime + dayLength * 7)}}>
          <ArrowForwardIcon/>
        </div>
      </div>
      <CalendarDisplay events={getAllEventsInPeriod()} startTime={startTime} endTime={getEndTime(startTime)} numDays={numDays} moduleRef={ref} />
      <div className="add-event" onClick={() => setModal(<AddEvent boardId={boardId} moduleId={moduleId} setModal={setModal} user={user}/>)}>
        +
      </div>
    </div>
  )
}

export default Calendar
