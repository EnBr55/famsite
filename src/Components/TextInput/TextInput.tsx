import React from 'react'
import './TextInput.css'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

type props = {
  placeholder: string
  onChange?(newValue: string): void
  callback?(userInput: string): void
  submitText?: string | JSX.Element
  imageUploadCallback?(image: File): void
}

const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  e.target.style.height = 'inherit'
  e.target.style.height = `${e.target.scrollHeight / 1.3}px`
}

const TextInput: React.FC<props> = ({placeholder, callback, onChange, submitText, imageUploadCallback}) => {
  const [text, setText] = React.useState('')
  const [expanded, setExpanded] = React.useState(false)
  const [file, setFile] = React.useState<File>()
  return (
    <div className="text-input">
      {(imageUploadCallback && !expanded) &&
        <div>
          <input
            className="image-input"
            type="file"
            id="file"
            style={{content: 'yeet'}}
            accept="image/*"
            onChange={(e) =>
              e.target.files !== null && setFile(e.target.files[0])
            }
          />
          <label className="image-upload" htmlFor="file"><AddAPhotoIcon/></label>
        </div>
      }
      {file && 
        <img 
          src={URL.createObjectURL(file)} width='50px' height='50px'
          onClick={() => setFile(undefined)}
        />
      }
      <textarea 
        className="text-input-field"
        style={{width: expanded ? '100%' : '50%'}}
        placeholder={placeholder}
        onFocus={() => setExpanded(true)}
        onBlur={() => setExpanded(false)}
        onChange={e => {
          setText(e.target.value)
          onChange && onChange(e.target.value)
          handleResize(e)
        }}
        value={text}
        onKeyDown={e => {
          if (e.key === "Enter" && callback) {
            callback(text)
            setText('')
          }
        }}
      ></textarea>
      { submitText && <button className="text-input-button"
        onClick={() => {
          callback && callback(text)
          setText('')
        }}
      >{submitText}</button>}
    </div>
  )
}
    
export default TextInput