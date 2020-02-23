import React from 'react'
import './TextInput.css'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import CancelIcon from '@material-ui/icons/Cancel';

type props = {
  placeholder?: string
  initialValue?: string
  onChange?(newValue: string): void
  callback?(userInput: string, image?: File): void
  submitText?: string | JSX.Element
  imageUploadCallback?(image: File): void
  shrink?: boolean
}

const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  e.target.style.height = 'inherit'
  e.target.style.height = `${e.target.scrollHeight / 1.3}px`
}


const TextInput: React.FC<props> = ({placeholder, initialValue, callback, onChange, submitText, imageUploadCallback, shrink}) => {
  const [text, setText] = React.useState(initialValue || '')
  const [expanded, setExpanded] = React.useState(false)
  const [file, setFile] = React.useState<File>()
  return (
    <div className="text-input">
      {(imageUploadCallback && !expanded) &&
        <div>
          <input
            className="image-input"
            type="file"
            id="chat-upload-image"
            style={{content: 'content'}}
            accept="image/*"
            onChange={(e) => {
              if (e.target.files !== null) {
                setFile(e.target.files[0])
                imageUploadCallback(e.target.files[0])
              } 
            }
            }
          />
          <label className="image-upload" htmlFor="chat-upload-image"><AddAPhotoIcon/></label>
        </div>
      }
      {file && 
        <div className="uploaded" onClick={() => setFile(undefined)}>
          <img src={URL.createObjectURL(file)} width='50px' height='50px' alt='upload'/>
          <div className="cancel-upload">
            <CancelIcon style={{backgroundColor: 'white', borderRadius: '100%'}}/>
          </div>
        </div>
      }
      <textarea 
        className="text-input-field"
        style={{width: (expanded || !shrink) ? '100%' : '50%'}}
        placeholder={placeholder}
        onFocus={() => setExpanded(true)}
        onBlur={() => setExpanded(false)}
        onChange={e => {
          setText(e.target.value)
          onChange && onChange(e.target.value)
          handleResize(e)
        }}
        value={text === '\n' ? '' : text}
        onKeyDown={e => {
          if (e.key === "Enter" && callback) {
            if (callback) {
              callback(text, file && file)
              setFile(undefined)
            }
            setText('');
          }
        }}
      ></textarea>
      { submitText && <button className="text-input-button"
        onClick={() => {
          callback && callback(text, file && file);
          setText('')
          setFile(undefined)
        }}
      >{submitText}</button>}
    </div>
  )
}
    
export default TextInput