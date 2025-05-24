import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const RegisterPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [password_confirm, setPasswordConfirm] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        // Kiểm tra xem password và password_confirm có khớp nhau không
        if (password !== password_confirm) {
            setError('Mật khẩu không khớp!')
            return
        }
        // Nếu khớp, gửi request
        axios.post('http://localhost:8000/auth/register', { username, password, password_confirm })
            .then(response => {
                navigate('/login')
            })
            .catch(error => {
                console.error('Đăng ký thất bại:', error.response?.data || error)
                setError('Đăng ký thất bại. Vui lòng thử lại.')
            })
    }

    return (
        <div className="form-container">
            <h2>Đăng ký</h2>
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
                <div className="mb-3">
                    <label className="form-label">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password_confirm}
                        onChange={e => setPasswordConfirm(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Đăng ký tài khoản
                </button>
            </form>
            <p className="mt-3">
                Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link>
            </p>
        </div>
    )
}

export default RegisterPage