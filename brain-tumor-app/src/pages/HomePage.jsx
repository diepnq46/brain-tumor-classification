import './HomePage.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PredictionList from '../components/PredictionList'
import EditModal from '../components/EditModal'
import brainTumorDiagnosis from '../assets/brain-tumor-diagnosis.png'

const HomePage = ({ token }) => {
    const navigate = useNavigate()
    const [predictions, setPredictions] = useState([])
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedPrediction, setSelectedPrediction] = useState(null)

    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [token, navigate])

    if (!token) return null

    return (
        <div className="home-page">
            <div className="header-image">
                <img src={brainTumorDiagnosis} />
            </div>
            <div className="introduction">
                <h3>U Não Là Gì?</h3>
                <p><b>U não</b> là bệnh liên quan đến ung thư gây tử vong cao nhất ở các bệnh nhân dưới 14 tuổi và là nguyên nhân tử vong thứ 2 ở bệnh nhân dưới 20 tuổi.</p>
                <p>
                    Có khoảng 120 loại u não khác nhau, hầu hết là các khối u trong mô não, ngoài ra là u ở màng não, tuyến yên, dây thần kinh sọ não... Bất cứ dạng u não nào cũng có thể gây nguy hiểm cho người bệnh. Các khối u ở mô não hoặc u não lành tính thường tiến triển chậm, các triệu chứng của u não trong trường hợp này cũng sẽ xuất hiện chậm và diễn biến âm ỉ hơn. Ngược lại, nếu u não phát triển nhanh, người bệnh sẽ thấy các triệu chứng rõ rệt hơn cả về tần suất và mức độ.
                </p>
                <p>
                    Nguyên nhân chính xác của u não vẫn chưa được làm rõ hoàn toàn, nhưng một số yếu tố nguy cơ đã được xác định, bao gồm tiếp xúc với bức xạ (như tia X hoặc liệu pháp xạ trị trước đó), tiền sử gia đình có bệnh lý ung thư, và một số đột biến gen hiếm gặp. Ngoài ra, tuổi tác, giới tính, và thói quen sống cũng có thể đóng vai trò trong việc tăng nguy cơ mắc bệnh.
                </p>
                <p>
                    Triệu chứng của u não rất đa dạng và phụ thuộc vào vị trí cũng như kích thước của khối u. Một số dấu hiệu phổ biến bao gồm đau đầu dai dẳng (thường nặng hơn vào buổi sáng), co giật bất thường, thay đổi tâm lý hoặc hành vi (như mất trí nhớ, dễ cáu gắt), suy giảm thị lực hoặc thính lực, yếu cơ, và khó khăn trong việc nói hoặc di chuyển. Nếu không được phát hiện sớm, các triệu chứng này có thể trở nặng, dẫn đến nguy cơ tử vong.
                </p>
                <p>
                    Việc chẩn đoán u não thường bao gồm chụp MRI, CT scan, và đôi khi sinh thiết để xác định bản chất của khối u. Sau khi chẩn đoán, các phương pháp điều trị phổ biến bao gồm phẫu thuật để loại bỏ khối u (nếu có thể), xạ trị để tiêu diệt tế bào ung thư, và hóa trị để kiểm soát sự phát triển của khối u. Tuy nhiên, hiệu quả của điều trị phụ thuộc rất lớn vào giai đoạn phát hiện và tình trạng sức khỏe tổng thể của bệnh nhân.
                </p>
                <h3>Vai trò của công nghệ trong hỗ trợ chẩn đoán</h3>
                <p>
                    Trong thời đại công nghệ hiện nay, các hệ thống hỗ trợ trí tuệ nhân tạo (AI) đang đóng vai trò quan trọng trong việc phát hiện và chẩn đoán u não. Bằng cách phân tích hình ảnh y tế như MRI hoặc CT, các công cụ này có thể hỗ trợ bác sĩ xác định vị trí, kích thước và đặc điểm của khối u với độ chính xác cao, từ đó giúp đưa ra phác đồ điều trị phù hợp. Hệ thống của chúng tôi được thiết kế để cung cấp thông tin chẩn đoán đáng tin cậy, hỗ trợ các quyết định lâm sàng và nâng cao hiệu quả điều trị cho bệnh nhân.
                </p>
                <p>
                    <i>Việc nâng cao nhận thức về u não và ứng dụng công nghệ tiên tiến là chìa khóa để giảm thiểu tác động của căn bệnh này. Hãy cùng chúng tôi khám phá các giải pháp tiên tiến để bảo vệ sức khỏe cộng đồng!</i>
                </p>
            </div>
            <PredictionList
                predictions={predictions}
                token={token}
                setShowEditModal={setShowEditModal}
                setSelectedPrediction={setSelectedPrediction}
                setPredictions={setPredictions}
            />
            {showEditModal && selectedPrediction && (
                <EditModal
                    token={token}
                    prediction={selectedPrediction}
                    setShowEditModal={setShowEditModal}
                    setPredictions={setPredictions}
                />
            )}
        </div>
    )
}

export default HomePage