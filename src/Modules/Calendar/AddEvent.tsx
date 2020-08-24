import React from 'react'
import './AddEvent.css'

import FirebaseRef from '../../firebase'

import TextInput from '../../Components/TextInput/TextInput'
import FullscreenModal from '../../Components/FullscreenModal/FullscreenModal'
import CalendarDisplay from './CalendarDisplay'
import { UserContext } from '../../Contexts/UserContext'
import { User } from '../../Models/Users'
import { calendarEvent, defaultCalendarEvent } from './Calendar'
import UserSearch from '../../Components/UserSearch/UserSearch'

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
  const [advancedMode, setAdvancedMode] = React.useState(false)

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

  const assignedIncludes = (userToCheck: User) => {
    for (let u of state.assigned) {
      if (u.id === userToCheck.id) {
        return true
      }
    }
    return false
  }

  return (
    <div className='AddEvent'>
      <div className="add-event-dialog">
        <h2>New Event</h2>
        <TextInput
          placeholder={'Event Label - Required'}
          onChange={(newValue: string) => {dispatch({label: newValue})}}
          maxHeight={'1.5em'}
        />
        <br />
        <TextInput
          placeholder={'Location (Optional)'}
          onChange={(newValue: string) => {dispatch({location: newValue})}}
          maxHeight={'1.5em'}
        />
        <br />
        <TextInput
          placeholder={'Description (Optional)'}
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
        <button onClick={() => {setAdvancedMode(!advancedMode)}}>Advanced</button>
        <br />
        <div className='Advanced' style={{maxHeight: advancedMode ? '80vh' : '0px'}}>
          <br />
          <br />
          Event Completion Requirements:
          <br />
          <input type="number" placeholder="0" min={0} onChange={(e) => {dispatch({counterMax: e.target.value})}} />
          <br />
          <i style={{fontSize: 'smaller'}}>A value of 1 will generate a checkbox; greater than 1 will generate a counter; 0 for nothing</i>
          <br />
          <br />
          Repeat Interval(days):
          <br />
          <input type="number" placeholder="0" min={0} onChange={(e) => {dispatch({repeatInterval: e.target.value})}} />
          <br />
          <i style={{fontSize: 'smaller'}}>Repeat every *this many* days. 0 for no repeating (default)</i>
          <br />
          <br />
          Assign Users:
          <UserSearch callback={(users) => setSearchResults(users)}/>
          <br />
          { searchResults &&
          searchResults.map(result => <div key={result.id} className='SearchResults'>
            <img src={result.picURL} />
            <span>{result.name}</span>
            { 
              assignedIncludes(result)
                ? <i>assigned</i>
                : <button onClick={() => dispatch({assigned: [...state.assigned, result]})}>Assign</button>
            }
                
          </div>)}
          <br />
        </div>
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
