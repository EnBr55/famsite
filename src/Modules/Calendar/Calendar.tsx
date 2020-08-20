import React from 'react'
import './Calendar.css'
import FirebaseRef from '../../firebase'
// import Delete from '@material-ui/icons/Delete'
import TextInput from '../../Components/TextInput/TextInput'
import FullscreenModal from '../../Components/FullscreenModal/FullscreenModal'
import CalendarDisplay from './CalendarDisplay'
import { UserContext } from '../../Contexts/UserContext'
import { User } from '../../Models/Users'

type calendarEvent = {
  creator?: User
  label: string
  location: string
  description: string
  timeCreated: number
  time: number
  assigned: User[]
  id: string
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

type props = {
  boardId: string
  moduleId: string
}

const Calendar: React.FC<props> = ({ boardId, moduleId }) => {
  const user = React.useContext(UserContext)

  const [events, setEvents] = React.useState<calendarEvent[]>([])
  const [title, setTitle] = React.useState('')
  const [modal, setModal] = React.useState<JSX.Element | undefined>(undefined)

  const [submitting, setSubmitting] = React.useState(false)


  // 2pm to 7pm
  const startTime = 1597723199999
  const endTime = startTime + 1000*60*60*5

  const reducer = (state: calendarEvent & {localTime: string, date: string} , updatedState: ({[key: string]: string | number}) | {}): (calendarEvent & {localTime: string, date: string}) => {
    return {
      ...state,
      ...updatedState
    }
  }

  const [state, dispatch] = React.useReducer(reducer, {...defaultCalendarEvent, localTime: '', date: ''})

  let ref = FirebaseRef.firestore()
    .collection('boards')
    .doc(boardId)
    .collection('modules')
    .doc(moduleId)
    .collection('data')

  let queryRef = ref
    .where("time", ">", startTime)
    .where("time", "<", endTime)
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

  const addEventDialog = () => {
    return (
      <div className="add-event-dialog">
        <h2>New Event</h2>
        <TextInput
          placeholder={'Event Label'}
          onChange={(newValue: string) => {dispatch({label: newValue})}}
          maxHeight={'1.5em'}
        />
        <br />
        <TextInput
          placeholder={'Location'}
          onChange={(newValue: string) => {dispatch({location: newValue})}}
          maxHeight={'1.5em'}
        />
        <br />
        <TextInput
          placeholder={'Description'}
          onChange={(newValue: string) => {dispatch({description: newValue})}}
          maxHeight={'1.5em'}
        />
        <br />
        <input type="date" onChange={(e) => {dispatch({date: e.target.value})}} />
        <br />
        <input type="time" onChange={(e) => {dispatch({localTime: e.target.value})}} />
        <br />
        <button
        onClick={() => {
            setSubmitting(true)
          }
        }
        >
          Add Event
        </button>
      </div>
    )
  }

  // useEffect on submitting state change to ensure batched state updates are performed before state is read
  React.useEffect(() => {
    console.log('attempting to submit new calendar event', state)
    if (submitting) {
      AddCalendarEvent();
      setSubmitting(false)
    }
  }, [submitting])

  const AddCalendarEvent = () => {
    const newCalendarEvent = { 
      ... state,
      creator: user,
      timeCreated: new Date().getTime(),
      time: new Date(state.date + ' ' + state.localTime).getTime()
    }
    delete newCalendarEvent.id
    if (newCalendarEvent.label && String(newCalendarEvent.time) !== "Invalid Date" && String(newCalendarEvent.time) !== "NaN") {
      ref.add(newCalendarEvent)
      setModal(undefined)
    } else {
      setModal(<div>
        <h2>Invalid arguments given for calendar event</h2>
        <p style={{"cursor": "pointer", border: "1px solid black"}} onClick={() => setModal(addEventDialog())}> BACK </p>
        </div>)
    }
  }

  const deleteCalendarEvent = () => {}

  const sortByDate = (a: calendarEvent, b: calendarEvent) => {
    return a.timeCreated > b.timeCreated
      ? 1
      : b.timeCreated > a.timeCreated
      ? -1
      : 0
  }

  const listEvents = () => {
    return events
      .sort(sortByDate)
      .map((event) => <div className="event" key={event.id}>{event.label}</div>)
  }

  const getClosestMonday = (): Date => {
    const currentDay = new Date
    const dayLength = 1000*60*60*24
    // we want the start of the day
    currentDay.setHours(0, 0, 0, 0)
    // if Sunday, we take the next day
    if (currentDay.getDay() == 0) {
      return new Date(currentDay.getTime() + dayLength)
    } else {
      return new Date(currentDay.getTime() - ((currentDay.getDay() - 1) * dayLength))
    }
  }

  console.log(getClosestMonday())

  return (
    <div className="calendar">
      {modal && (
        <FullscreenModal element={modal} setModal={setModal} closeable={true} />
      )}

      <h1>{title}</h1>
      {listEvents()}
      <CalendarDisplay />
      <div className="add-event" onClick={() => setModal(addEventDialog())}>
        +
      </div>
    </div>
  )
}

export default Calendar
