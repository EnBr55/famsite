import React from 'react'
import './FullscreenModal.css'
import CloseIcon from '@material-ui/icons/Close'

type props = {
  element: JSX.Element
  setModal(element: JSX.Element | undefined): void
  closeable: boolean
}

const FullscreenModal: React.FC<props> = ({element, setModal, closeable}) => {
  return (
    <div className="fullscreen-modal" onClick={() => {closeable && setModal(undefined)}}>
      <div className="fullscreen-modal-content" onClick={e => e.stopPropagation()}>
        {closeable && <CloseIcon className="cross" onClick={() => setModal(undefined)}/>}
        {element}
      </div>
    </div>
  )
}

export default FullscreenModal
