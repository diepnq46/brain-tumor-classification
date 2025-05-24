import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const PredictionCard = ({ prediction, token, setShowEditModal, setSelectedPrediction, setPredictions }) => {
    const navigate = useNavigate()

    const handleDelete = () => {
        axios.delete(`/predictions/${prediction.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                setPredictions(prev => prev.filter(p => p.id !== prediction.id))
            })
            .catch(error => console.error('Delete failed:', error))
    }

    return (
        <div className="prediction-card">
            <h2>{prediction.patient_name}</h2>
            <p>Age: {prediction.age}</p>
            <p>Gender: {prediction.gender}</p>
            <p>Result: {prediction.prediction_result}</p>
            <div className="actions">
                <button className="edit-btn" onClick={() => { setSelectedPrediction(prediction); setShowEditModal(true); }}>Edit</button>
                <button className="delete-btn" onClick={handleDelete}>Delete</button>
                <button className="view-btn" onClick={() => navigate(`/predictions/${prediction.id}`)}>View Details</button>
            </div>
        </div>
    )
}

export default PredictionCard