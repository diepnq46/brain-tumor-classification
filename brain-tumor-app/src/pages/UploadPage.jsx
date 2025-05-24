import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UploadPage = ({ token }) => {
    const navigate = useNavigate()
    const [patientName, setPatientName] = useState('')
    const [age, setAge] = useState('')
    const [gender, setGender] = useState('male')
    const [image, setImage] = useState(null)
    const [error, setError] = useState('')


    const handleSubmit = (e) => {
        e.preventDefault()
        if (!token) {
            navigate('/login')
            return
        }
        const formData = new FormData()
        formData.append('patient_name', patientName)
        formData.append('age', age)
        formData.append('gender', gender)
        formData.append('image', image)

        axios.post('http://127.0.0.1:8000/predictions/predict', formData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                navigate('/reports')
            })
            .catch(error => {
                console.error('Upload failed:', error)
                setError('Upload failed. Please try again.')
            })
    }

    if (!token) return null

    return (
        <div className="form-container">
            <h2>Đăng tải chẩn đoán</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Tên bệnh nhân</label>
                    <input
                        type="text"
                        className="form-control"
                        value={patientName}
                        onChange={e => setPatientName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tuổi<i></i></label>
                    <input
                        type="number"
                        className="form-control"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Giới tính</label>
                    <select
                        className="form-select"
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                    >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Ảnh cần chẩn đoán (là ảnh MRI của 1 bộ não duy nhất)</label><br></br>
                    <input
                        type="file"
                        className="form-control mt-2"
                        onChange={e => setImage(e.target.files[0])}
                        required
                    />
                    <span className="text-danger">*</span> {/* Dấu * màu đỏ */}
                    <span className="ms-1 small">Vui lòng cung cấp hình ảnh có chất lượng tốt nhất để đạt được độ chính xác cao nhất</span> {/* Chữ màu đen */}

                </div>
                <button type="submit" className="btn btn-primary">
                    Upload
                </button>
            </form>
        </div>
    )
}

export default UploadPage