import PredictionCard from "./PredictionCard"

const PredictionList = ({ predictions, token, setShowEditModal, setSelectedPrediction, setPredictions }) => (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {(predictions || []).map(prediction => (
            <div key={prediction.id} className="col">
                <PredictionCard
                    prediction={prediction}
                    token={token}
                    setShowEditModal={setShowEditModal}
                    setSelectedPrediction={setSelectedPrediction}
                    setPredictions={setPredictions}
                />
            </div>
        ))}
    </div>
)

export default PredictionList