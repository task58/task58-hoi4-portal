import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MarkdownRenderer } from './components/MarkdownRenderer'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<MarkdownRenderer />} />
      </Routes>
    </Router>
  )
}

export default App
