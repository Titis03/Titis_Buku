import {Container, Row, Col} from "react-bootstrap";

const Alamat = () => {
  return (
    <div className="alamat-page">
      <div className="alamat min-vr-100">
        <Container>
          <Row>
          <Col>
            <h1 className="fw-bold text-center mb-2 animate__animated animate__fadeInUp animate__delay-1s">Alamat</h1>
            <p className="text-center animate__animated animate__fadeInUp animate__delay-1s">JL. Niken Gandini, Setono, Jenangan, Ponorogo.</p>
          </Col>
          </Row>
        </Container>
      </div>    
    </div>
  );
};

export default Alamat;