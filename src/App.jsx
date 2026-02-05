import { Routes, Route } from 'react-router'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { TodoPage } from './pages/TodoPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastProvider } from './components/Toast';
import './App.css'

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/todo" element={<ProtectedRoute><TodoPage /></ProtectedRoute>} />
      </Routes>
    </ToastProvider>
  )
}

export default App
