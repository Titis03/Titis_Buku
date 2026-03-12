import { Container, Row, Col } from "react-bootstrap"
import { testimonial } from "../data/index";
import FooterComponent from "../components/FooterComponent";

const TestimonialPage = () => {
  return (
    <div className="testimonial-page">
      <div className="testimonial">
        <Container>
          <Row >
            <Col>
              <h1 className="mb-4 mt-1 fw-bold" style={{ textAlign: "center"}}>Semua Testimonial</h1>
              <p className="mb-5">Selamat datang di ruang berbagi pengalaman para pembaca. Kami bangga telah menjadi bagian dari perjalanan literasi ribuan pelanggan di seluruh Indonesia. 
                Mulai dari pecinta novel, akademisi, hingga kolektor buku langka, mereka telah membuktikan kualitas layanan kami.
                 Telusuri testimoni di bawah ini untuk melihat bagaimana kami membantu setiap individu menemukan teman setia di rak buku mereka, karena bagi kami, setiap pelanggan adalah prioritas.</p>
            </Col>
          </Row>
          <Row className="row-cols-lg-3 row-cols-1">
            {testimonial.map((data) => {
              return (
              <Col key={data.id} className="mb-0">
                <p className="desc shadow-sm">{data.desc}</p>
                <div className="people">
                  <img src={data.image} alt="" />
                  <div>
                    <h5 className="mb-1">{data.name}</h5>
                    <p className="m-0 fw-bold">{data.skill}</p>
                  </div>
                </div>
              </Col>
              )
            })}
          </Row>
        </Container>
      </div>
      <FooterComponent />
    </div>
  )
}

export default TestimonialPage;