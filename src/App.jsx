import { Routes, Route } from 'react-router'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { TodoPage } from './pages/TodoPage';
import './App.css'

function App() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/todo" element={<TodoPage />} />
    </Routes>
  )
}

export default App
