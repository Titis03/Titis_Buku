import {Container, Row, Col} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Alamat = () => {
  const navigate = useNavigate ();

  return (
    <div className="alamat-page">
      <div className="alamat min-vr-100">
        <Container>
          <Row>
          <Col>

          <button
           onClick={() => navigate(-1)} className="btn-back" >
            Kembali
          </button>

            <h1 className="fw-bold text-center mb-2 animate__animated animate__fadeInUp animate__delay-1s">Alamat</h1>
            <p className="text-center animate__animated animate__fadeInUp animate__delay-1s">JL. Niken Salindri, Setono, Jenangan, Ponorogo.</p>
          </Col>
          </Row>
        </Container>
      </div>    
    </div>
  );
};

export default Alamat;