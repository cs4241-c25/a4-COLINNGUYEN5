import {Routes, Route} from 'react-router-dom';
import Login from'./Login.jsx'
import './TrackingSheet.css'
import TrackingSheet from "./TrackingSheet.jsx";

function App() {
  return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/tracking-sheet" element={<TrackingSheet />} />
        </Routes>
  )
}
export default App
