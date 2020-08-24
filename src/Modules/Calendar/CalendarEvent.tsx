import React from 'react'
import './CalendarEvent.css'
import { calendarEvent } from './Calendar'
import FullscreenModal from '../../Components/FullscreenModal/FullscreenModal'
import FirebaseRef from '../../firebase'
import Delete from '@material-ui/icons/Delete'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'

type props = {
  event: calendarEvent
  moduleRef: firebase.firestore.CollectionReference
}

const CalendarEvent: React.FC<props> = ({ event, moduleRef }) => {
  const [modal, setModal] = React.useState<JSX.Element | undefined>(undefined)
  const [loading, setLoading] = React.useState(false)

  const createModalContent = () => { 
    return (
      <div className='EventContent'>
        <h2>{ event.label }</h2>
        <i> { event.description } </i>
        <br />
        { new Date(event.time).toLocaleString() }
        <br />
        <br />
        { event.location && <span>Location: {event.location}</span>}
        <br />
        <br />
        Added by <i>{ event.creator!.name }</i>
        <br />
        { event.assigned.length > 0 && <span>Assigned to: {event.assigned.map(user => <div key={user.id}>
            {user.name}
          </div>)}</span> }
        { !loading && eventCounterInterface() }
          <br />
          <button style={{margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => {
            setModal(<div>
              <h2>Confirm deletion of <i>{event.label}</i></h2>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <button onClick={()=>{deleteEvent()}}>Confirm</button>
                <button onClick={()=>{setModal(createModalContent())}}>Cancel</button>
              </div>
            </div>)
          }}>Delete <Delete /></button>
      </div>
    )
  }

  // pass in 0 to initialise a new key/value pair with this event's time as the key
  const updateCounter = (updateAmount: number) => {
    FirebaseRef.firestore().runTransaction((transaction) => {
      setLoading(true)
      return transaction.get(moduleRef.doc(event.id)).then(doc => {
        if(doc.exists && doc.data() !== undefined) {
          let newCounter = 0
          if (updateAmount !== 0) {
            newCounter = doc.data()!.counterUpdates[event.time] + updateAmount
          }
          console.log(newCounter)
          if (newCounter <= event.counterMax! && newCounter >= 0) {
            transaction.update(moduleRef.doc(event.id), { counterUpdates: {...doc.data()!.counterUpdates, [event.time]: newCounter} })
          } else { 
            return Promise.reject("Counter moved outside of bounds (or maybe another spooky error)")
          }
        }
      }).then((newValue) => {
        setLoading(false)
        console.log('Modified counter to ', newValue)
      }).catch((error) => {console.log(error); setLoading(false)})
    })
  }

  const deleteEvent = () => {
    moduleRef.doc(event.id).delete().catch(error => {
      console.log('Error deleting doc: ' + error)
    })
  }

  const eventCounterInterface = () => {
    if (event.counterMax !== undefined && event.counterMax >= 1) {
      let current = event.counterUpdates[event.time]
      // if no key is defined for this event's time, initialise one
      if (current === undefined) {
        updateCounter(0)
      }
      if (event.counterMax > 1) {
        return (
          <>
            <br />
            <br />
            <div className='Counter'>
              { current > 0  && <div onClick={() => {updateCounter(-1);setLoading(true)}} className='CounterButton'>
              -  
              </div> }
              <div style={{gridColumn: "2"}}>{ event.counterUpdates[event.time] } / {event.counterMax}</div>
              { current < event.counterMax && <div onClick={() => {updateCounter(+1);setLoading(true)}} className='CounterButton'>
              +  
              </div> } 
            </div>
          </>
        )
      } else {
        return (
          <>
            <br />
            <br />
          <div className='CompleteEvent' onClick={() => {event.counterUpdates[event.time] >=1 ? updateCounter(-1) : updateCounter(1)}}> Status: &nbsp; 
              { event.counterUpdates[event.time] >= 1 
              ? <CheckBoxIcon /> 
              : <CheckBoxOutlineBlankIcon />
              }
            </div>
          </>
        )
      }
    }
  }

  React.useEffect(() => {
    console.log('called')
    // regenerate modal when event document changes
    modal && setModal(createModalContent())
  },[event, loading])

  return (
    <div className='CalendarEvent'>
      {modal && (
        <FullscreenModal element={modal} setModal={setModal} closeable={true} />
      )}
      <div className='CalendarEventContainer' onClick={() => {setModal(createModalContent())}}>
        <h3> { event.label } </h3> 
        <b> { new Date(event.time).toLocaleTimeString() } </b>
      </div>
    </div>
  )
}

export default CalendarEvent
