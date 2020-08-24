import React from 'react'
import './CalendarEvent.css'
import { calendarEvent } from './Calendar'
import FullscreenModal from '../../Components/FullscreenModal/FullscreenModal'
import FirebaseRef from '../../firebase'

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
        <br />
        <br />
        <div className='CounterInterface'>
          { !loading && eventCounterInterface() }
        </div>
      </div>
    )
  }

  const updateCounter = (updateAmount: number) => {
    FirebaseRef.firestore().runTransaction((transaction) => {
      setLoading(true)
      return transaction.get(moduleRef.doc(event.id)).then(doc => {
        if(doc.exists && doc.data() !== undefined) {
          let newCounter = doc.data()!.counterUpdates[event.time] + updateAmount
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

  const eventCounterInterface = () => {
    if (event.counterMax !== undefined && event.counterMax >= 0) {
      if (event.counterMax > 1) {
        return (
          <div className='Counter'>
            <div onClick={() => {updateCounter(1);setLoading(true)}} className='CounterButton'>
            -  
            </div>
            { event.counterMax - event.counterUpdates[event.time] }
            <div onClick={() => {updateCounter(-1);setLoading(true)}} className='CounterButton'>
            +  
            </div>
          </div>
        )
      } else {
        return (
          <div className='CompleteEvent'>
            { event.counterUpdates[event.time] >= 1 ? 'Completed (include box to uncomplete here)' : 'Uncompleted (checkbox button here)' }
          </div>
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
