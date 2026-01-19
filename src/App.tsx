import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { Header } from './components/Header'
import { MarkdownRenderer } from './components/MarkdownRenderer'
import { BASE_PATH } from './utils/paths'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <Router basename={BASE_PATH}>
        <Header />
        <Routes>
          <Route path="*" element={<MarkdownRenderer />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
