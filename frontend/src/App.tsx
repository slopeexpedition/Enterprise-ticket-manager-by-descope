import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@descope/react-sdk'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ChatBot from './pages/ChatBot'
import TicketGrid from './pages/TicketGrid'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider projectId="P32VReRmL1EU9iDOMZ9tTRE878F9">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatBot /></ProtectedRoute>} />
          <Route path="/tickets" element={<ProtectedRoute><TicketGrid /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
