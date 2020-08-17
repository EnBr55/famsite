import React from 'react'
import './Calendar.css'
import FirebaseRef from '../../firebase'
// import Delete from '@material-ui/icons/Delete'
import TextInput from '../../Components/TextInput/TextInput'
import FullscreenModal from '../../Components/FullscreenModal/FullscreenModal'
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
  label: 'default label',
  creator: undefined,
  assigned: [],
  timeCreated: 0,
  time: 1,
  location: 'default location',
  description: 'default description',
  id: 'default id',
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

  const [newEventDate, setNewEventDate] = React.useState('')
  const [newEventTime, setNewEventTime] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)

  const reducer = (state: calendarEvent, updatedState: ({[key: string]: string | number}) | {}): calendarEvent => {
    return {
      ...state,
      ...updatedState
    }
  }

  const [state, dispatch] = React.useReducer(reducer, defaultCalendarEvent)

  const ref = FirebaseRef.firestore()
    .collection('boards')
    .doc(boardId)
    .collection('modules')
    .doc(moduleId)
    .collection('data')

  React.useEffect(() => {
    FirebaseRef.firestore()
      .collection('boards')
      .doc(boardId)
      .collection('modules')
      .doc(moduleId)
      .get()
      .then((doc) => setTitle(doc.data()!.name || 'Todo List'))
    const unsubscribe = ref.onSnapshot((snapshot) => {
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
        <input type="date" onChange={(e) => setNewEventDate(e.target.value)} />
        <br />
        <input type="time" onChange={(e) => setNewEventTime(e.target.value)} />
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
    console.log('submitting new calendar event', state)
    if (submitting) {
      AddCalendarEvent();
      setSubmitting(false)
    }
  }, [submitting])

  const AddCalendarEvent = () => {
    const newCalendarEvent = { 
      ... state,
      creator: user,
      timeCreated: new Date().getTime()
    }
    delete newCalendarEvent.id
    ref.add(newCalendarEvent)
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
      .map((event) => <div className="event">{event.label}</div>)
  }

  return (
    <div className="calendar">
      {modal && (
        <FullscreenModal element={modal} setModal={setModal} closeable={true} />
      )}

      <h1>{title}</h1>
      {listEvents()}
      <div className="add-event" onClick={() => setModal(addEventDialog())}>
        +
      </div>
      <h3>{new Date(newEventDate + ' ' + newEventTime).toString()}</h3>
    </div>
  )
}

export default Calendar
