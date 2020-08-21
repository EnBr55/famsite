import React from 'react'
import './AddEvent.css'

import FirebaseRef from '../../firebase'

import TextInput from '../../Components/TextInput/TextInput'
import FullscreenModal from '../../Components/FullscreenModal/FullscreenModal'
import CalendarDisplay from './CalendarDisplay'
import { UserContext } from '../../Contexts/UserContext'
import { User } from '../../Models/Users'
import { calendarEvent } from './Calendar'
import UserSearch from '../../Components/UserSearch/UserSearch'

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

type props = {
  setModal: (content: JSX.Element | undefined) => void
  user: User
  boardId: string
  moduleId: string
}

const AddEvent: React.FC<props> = ({setModal, user, boardId, moduleId}) => {
  const [searchResults, setSearchResults] = React.useState<User[]>([])
  const [submitting, setSubmitting] = React.useState(false)

  let ref = FirebaseRef.firestore()
    .collection('boards')
    .doc(boardId)
    .collection('modules')
    .doc(moduleId)
    .collection('data')

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
        <p style={{"cursor": "pointer", border: "1px solid black"}} onClick={() => setModal(<AddEvent boardId={boardId} moduleId={moduleId} setModal={setModal} user={user}/>)}> BACK </p>
        </div>)
    }
  }

  const reducer = (state: calendarEvent & {localTime: string, date: string} , updatedState: ({[key: string]: string | number}) | {}): (calendarEvent & {localTime: string, date: string}) => {
    return {
      ...state,
      ...updatedState
    }
  }

  const [state, dispatch] = React.useReducer(reducer, {...defaultCalendarEvent, localTime: '', date: ''})

  return (
    <div className='AddEvent'>
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
        Event Time:
        <br />
        <input type="date" onChange={(e) => {dispatch({date: e.target.value})}} />
        <input type="time" onChange={(e) => {dispatch({localTime: e.target.value})}} />
        <br />
        <br />
        Assign Users:
        <UserSearch callback={(users) => setSearchResults(users)}/>
        <br />
        { searchResults &&
          searchResults.map(result => <div onClick={() => dispatch({assigned: [...state.assigned, user]})}>{result.name}</div>)
        })}
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
    </div>
  )
}

export default AddEvent