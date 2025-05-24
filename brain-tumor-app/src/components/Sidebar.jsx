import { Link, useLocation } from 'react-router-dom'

const Sidebar = ({ token }) => {
    const location = useLocation()

    return (
        <div className="d-none d-md-block col-md-3 col-lg-2 bg-light shadow-sm position-sticky" style={{ height: '100vh', top: 0 }}>
            <ul className="nav flex-column mt-4">
                <li className="nav-item">
                    <Link
                        className={`nav-link ${location.pathname === '/' ? 'active text-primary' : ''}`}
                        to="/"
                    >
                        Trang chủ
                    </Link>
                </li>
                {token && (
                    <>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/upload' ? 'active text-primary' : ''}`}
                                to="/upload"
                            >
                                Chẩn đoán
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/reports' ? 'active text-primary' : ''}`}
                                to="/reports"
                            >
                                Báo cáo chẩn đoán
                            </Link>
                        </li>


                    </>
                )}
            </ul>
        </div>
    )
}

export default Sidebar