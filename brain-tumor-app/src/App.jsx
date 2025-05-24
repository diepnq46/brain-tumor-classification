import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import HomePage from './pages/HomePage'
import PredictionsPage from './pages/PredictionsPage'
import UploadPage from './pages/UploadPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { jwtDecode } from 'jwt-decode'
import Footer from './components/Footer'


const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      const decoded = jwtDecode(token)
      setUser({ username: decoded.sub }) // Giả lập user
    } else {
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [token])

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header token={token} setToken={setToken} user={user} navigate={navigate} />
      <div className="container-fluid flex-grow-1">
        <div className="row">
          <Sidebar token={token} />
          <main className="col-md-9 col-lg-10 p-4">
            <Routes>
              <Route path="/" element={<HomePage token={token} />} />
              <Route path="/reports" element={<PredictionsPage token={token} />} />
              <Route path="/upload" element={<UploadPage token={token} />} />
              <Route path="/login" element={<LoginPage setToken={setToken} />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
        </div>
      </div>
      <Footer></Footer>
    </div>
  )
}

export default App