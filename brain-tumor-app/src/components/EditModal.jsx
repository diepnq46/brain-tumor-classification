import axios from 'axios'
import { useState } from 'react'

const EditModal = ({ token, prediction, setShowEditModal, setPredictions }) => {
    const [patientName, setPatientName] = useState(prediction.patient_name)
    const [age, setAge] = useState(prediction.age)
    const [gender, setGender] = useState(prediction.gender)
    const [predictionResult, setPredictionResult] = useState(prediction.prediction_result)

    const handleSubmit = (e) => {
        e.preventDefault()
        const updatedData = { patient_name: patientName, age: parseInt(age), gender, prediction_result: predictionResult }
        axios.put(`/predictions/${prediction.id}`, updatedData, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setPredictions(prev => prev.map(p => p.id === prediction.id ? response.data : p))
                setShowEditModal(false)
            })
            .catch(error => console.error('Update failed:', error))
    }

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Prediction</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowEditModal(false)}
                            aria-label="Close"
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Patient Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={patientName}
                                    onChange={e => setPatientName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Age</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={age}
                                    onChange={e => setAge(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Gender</label>
                                <select
                                    className="form-select"
                                    value={gender}
                                    onChange={e => setGender(e.target.value)}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Prediction Result</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={predictionResult}
                                    onChange={e => setPredictionResult(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditModal