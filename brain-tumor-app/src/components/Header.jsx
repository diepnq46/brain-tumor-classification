import { Link, useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'


const Header = ({ token, setToken, user, navigate }) => {
    const location = useLocation()


    const handleLogout = () => {
        setToken('')
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold" to="/">BrainTumorApp</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                                to="/"
                            >
                                Trang chủ
                            </Link>
                        </li>
                        {token && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}
                                        to="/upload"
                                    >
                                        Chẩn đoán
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`}
                                        to="/reports"
                                    >
                                        Báo cáo chẩn đoán
                                    </Link>
                                </li>

                            </>
                        )}
                    </ul>
                    <div className="d-flex align-items-center">
                        {token ? (
                            <>
                                <span className="text-white me-3">Xin chào, {user?.username}</span>
                                <button className="btn btn-outline-light" onClick={handleLogout}>
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link className="btn btn-outline-light me-2" to="/login">
                                    Đăng nhập
                                </Link>
                                <Link className="btn btn-outline-light" to="/register">
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header