import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { Modal, Button } from 'react-bootstrap'
import './PredictionsPage.css' // Có thể giữ lại nếu cần CSS tùy chỉnh khác

const PredictionsPage = ({ token }) => {
    const navigate = useNavigate()
    const [predictions, setPredictions] = useState([])
    const [showResultModal, setShowResultModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedPrediction, setSelectedPrediction] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [editForm, setEditForm] = useState({ patient_name: '', age: '', gender: '', prediction_result: '' })

    // Mapping giá trị tiếng Anh sang tiếng Việt (chỉ để hiển thị)
    const genderMap = {
        male: "Nam",
        female: "Nữ",
        other: "Khác"
    };

    const predictionResultMap = {
        Glioma: "U thần kinh đệm",
        Meningioma: "U màng não",
        Pituitary: "U tuyến yên",
        "No Tumor": "Không có u"
    };

    useEffect(() => {
        if (!token) {
            navigate('/login')
        } else {
            try {
                const decoded = jwtDecode(token)
                setIsAdmin(decoded.role === 'admin')
            } catch (error) {
                console.error('Decode token failed:', error)
                navigate('/login')
            }

            axios.get('http://localhost:8000/predictions', {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            })
                .then(response => {
                    if (Array.isArray(response.data)) {
                        setPredictions(response.data)
                    } else {
                        console.error('API returned non-array data:', response.data)
                        setPredictions([])
                    }
                })
                .catch(error => {
                    console.error('Fetch predictions failed:', error.response || error)
                    if (error.response && error.response.status === 401) {
                        navigate('/login')
                    }
                    setPredictions([])
                })
        }
    }, [token, navigate])


    const handleShowResults = (id) => {
        axios.get(`http://localhost:8000/predictions/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
            .then(response => {
                if (response.data && Object.keys(response.data).length > 0) {
                    setSelectedPrediction(response.data)
                    setShowResultModal(true)
                } else {
                    console.error('Invalid response data:', response.data)
                    alert('Dữ liệu không hợp lệ!')
                }
            })
            .catch(error => {
                console.error('Fetch prediction details failed:', error.response || error)
                alert('Không thể lấy kết quả!')
            })
    }

    const handleUpdateData = (prediction) => {
        setSelectedPrediction(prediction)
        setEditForm({
            patient_name: prediction.patient_name,
            age: prediction.age,
            gender: prediction.gender || '',
            prediction_result: prediction.prediction_result || ''
        })
        setShowEditModal(true)
    }

    const handleSaveUpdate = () => {
        const updatedData = {
            patient_name: editForm.patient_name,
            age: parseInt(editForm.age),
            gender: editForm.gender,
        }
        if (isAdmin) {
            updatedData.prediction_result = editForm.prediction_result
        }

        axios.put(`http://localhost:8000/predictions/${selectedPrediction.id}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        })
            .then(response => {
                setPredictions(predictions.map(p =>
                    p.id === selectedPrediction.id ? { ...p, ...updatedData } : p
                ))
                setShowEditModal(false)
                alert('Cập nhật thành công!')
            })
            .catch(error => {
                console.error('Update failed:', error.response || error)
                alert('Cập nhật thất bại!')
            })
    }

    const handleDeleteData = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
            axios.delete(`http://localhost:8000/predictions/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            })
                .then(() => {
                    setPredictions(predictions.filter(p => p.id !== id))
                    alert('Đã xóa bản ghi thành công!')
                })
                .catch(error => {
                    console.error('Delete failed:', error.response || error)
                    alert('Xóa bản ghi thất bại!')
                })
        }
    }

    if (!token) return null

    return (
        <div className="predictions-page">
            <h1 className="mb-4">Chẩn đoán</h1>
            <table className="predictions-table">
                <thead>
                    <tr>
                        <th>ID bệnh nhân</th>
                        <th>Tên bệnh nhân</th>
                        <th>Tuổi</th>
                        <th>Ngày đăng tải</th>
                        <th>Hoạt động</th>
                    </tr>
                </thead>
                <tbody>
                    {(predictions || []).map((prediction) => (
                        <tr key={prediction.id}>
                            <td>{prediction.id}</td>
                            <td>{prediction.patient_name}</td>
                            <td>{prediction.age}</td>
                            <td>{prediction.created_at || 'N/A'}</td>
                            <td>
                                <button
                                    className="action-btn"
                                    onClick={() => {
                                        handleShowResults(prediction.id)
                                    }}
                                >
                                    Xem kết quả
                                </button>
                                <button className="action-btn" onClick={() => handleUpdateData(prediction)}>
                                    Cập nhật
                                </button>
                                <button className="action-btn" onClick={() => handleDeleteData(prediction.id)}>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Show Results */}
            <Modal show={showResultModal} onHide={() => setShowResultModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Kết quả chẩn đoán</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPrediction?.image_path && (
                        <div className="mb-3">
                            <img
                                src={"http://127.0.0.1:8000/static/" + selectedPrediction.image_path}
                                alt="Uploaded Brain Scan"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </div>
                    )}
                    <p><strong>ID Bệnh nhân:</strong> {selectedPrediction?.id}</p>
                    <p><strong>Tên bệnh nhân:</strong> {selectedPrediction?.patient_name}</p>
                    <p><strong>Tuổi:</strong> {selectedPrediction?.age}</p>
                    <p><strong>Giới tính:</strong> {genderMap[selectedPrediction?.gender] || 'N/A'}</p>
                    <p><strong>Ngày đăng tải:</strong> {selectedPrediction?.created_at || 'N/A'}</p>
                    <p><strong>Kết quả chẩn đoán:</strong> {predictionResultMap[selectedPrediction?.prediction_result] || 'Chưa có kết quả'}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowResultModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Edit */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa thông tin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Tên bệnh nhân:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={editForm.patient_name}
                            onChange={(e) => setEditForm({ ...editForm, patient_name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Tuổi:</label>
                        <input
                            type="number"
                            className="form-control"
                            value={editForm.age}
                            onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Giới tính:</label>
                        <select
                            className="form-control"
                            value={editForm.gender}
                            onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                        </select>
                    </div>
                    {isAdmin && (
                        <div className="form-group">
                            <label>Kết quả chẩn đoán:</label>
                            <select
                                className="form-control"
                                value={editForm.prediction_result}
                                onChange={(e) => setEditForm({ ...editForm, prediction_result: e.target.value })}
                            >
                                <option value="">Chọn kết quả</option>
                                <option value="Glioma">U thần kinh đệm</option>
                                <option value="Meningioma">U màng não</option>
                                <option value="Pituitary">U tuyến yên</option>
                                <option value="No Tumor">Không có u</option>
                            </select>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSaveUpdate}>
                        Lưu
                    </Button>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PredictionsPage