import { Routes, Route } from 'react-router'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { TodoPage } from './pages/TodoPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css'

function App() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/todo" element={<ProtectedRoute><TodoPage /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
