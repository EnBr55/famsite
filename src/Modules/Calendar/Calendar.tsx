import React from 'react'
import './Calendar.css'
import FirebaseRef from '../../firebase'
// import Delete from '@material-ui/icons/Delete'
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
}


type props = {
  boardId: string
  moduleId: string
}

const defaultCalendarEvent = {
  label: '',
  creator: undefined,
  assigned: [],
  timeCreated: 0,
  time: 1,
  location: '',
  description: '',
  id: '',
}

const dayLength = 1000*60*60*24

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
  const [title, setTitle] = React.useState('')
  const [modal, setModal] = React.useState<JSX.Element | undefined>(undefined)

  const [startTime, setStartTime] = React.useState(getClosestMonday().getTime())
  let getEndTime = (start: number) => start + dayLength * 6 - 1



  let ref = FirebaseRef.firestore()
    .collection('boards')
    .doc(boardId)
    .collection('modules')
    .doc(moduleId)
    .collection('data')

  let queryRef = ref
    .where("time", ">", startTime)
    .where("time", "<", getEndTime(startTime))
    .orderBy("time")

  React.useEffect(() => {
    FirebaseRef.firestore()
      .collection('boards')
      .doc(boardId)
      .collection('modules')
      .doc(moduleId)
      .get()
      .then((doc) => setTitle(doc.data()!.name || 'Todo List'))
    const unsubscribe = queryRef.onSnapshot((snapshot) => {
      const newEvents: calendarEvent[] = []
      snapshot.forEach((doc) => {
        newEvents.push({
          ...defaultCalendarEvent,
          ...doc.data(),
          id: doc.id,
        })
      })
      setEvents(newEvents)
    })
    return unsubscribe
  }, [boardId, moduleId])


  const deleteCalendarEvent = () => {}

  return (
    <div className="calendar">
      {modal && (
        <FullscreenModal element={modal} setModal={setModal} closeable={true} />
      )}

        <div onClick={() => {setStartTime(startTime + dayLength * 7)}}>
          -->
        </div>
        <div onClick={() => {setStartTime(startTime - dayLength * 7)}}>
          {'<--'}
        </div>

      <h1>{title}</h1>
      <CalendarDisplay events={events} startTime={startTime}/>
      <div className="add-event" onClick={() => setModal(<AddEvent boardId={boardId} moduleId={moduleId} setModal={setModal} user={user}/>)}>
        +
      </div>
    </div>
  )
}

export default Calendar
