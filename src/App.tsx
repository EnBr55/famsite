import React from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar'
import Sidebar from './Components/Sidebar/Sidebar'

const App: React.FC = () => {
  const [sidebar, setSidebar] = React.useState(false)
  const toggleSidebar = (): void => setSidebar(!sidebar)
  return (
    <div className="App">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar open={sidebar} />
      AAAAAAAAAAAAAAAAAAA
      AAAAAAAAAAAAAAAAAAA
      AAAAAAAAAAAAAAAAAAA
      AAAAAAAAAAAAAAAAAAA
    </div>
  )
}

export default App;
