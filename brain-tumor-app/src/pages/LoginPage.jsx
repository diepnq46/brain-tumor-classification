import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const LoginPage = ({ setToken }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        // Sử dụng FormData để gửi dữ liệu
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)

        axios.post('http://localhost:8000/auth/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                if (response.data.access_token) {
                    setToken(response.data.access_token)
                    navigate('/')
                } else {
                    setError('Login failed: No token received')
                }
            })
            .catch(error => {
                console.error('Login failed:', error)
                setError('Invalid username or password')
            })
    }

    return (
        <div className="form-container">
            <h2>Đăng nhập</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Tên tài khoản</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Đăng nhập
                </button>
            </form>
            <p className="mt-3">
                Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
            </p>
        </div>
    )
}

export default LoginPage