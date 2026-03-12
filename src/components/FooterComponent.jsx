import {Container,Row,Col} from "react-bootstrap";
import {Link} from "react-router-dom";

const FooterComponent = () => {
  return (
    <div  className="footer">
      <Container fluid>
        <Row className="d-flex justify-content-between">
          <Col lg="5" className="footer-info">
            <h3>TSABITHA_RESTI</h3>
            <p className="desc">Jendela dunia ada di genggaman Anda. TsaBook menghadirkan koleksi buku terlengkap dari berbagai genre untuk menginspirasi setiap langkah perjalanan intelektual Anda. Temukan sahabat setia dalam lembaran kertas berkualitas hanya di sini.</p>
            <div className="contact-item mt-4">
              <h3>CONTACT US</h3>
               <Link to="#" className="footer-link">
               <i className="fa-brands fa-whatsapp me-2"></i>
               <span>+62 821-4232-4394</span>
              </Link>
            </div>
            <div className="contact-item">
              <Link to="#" className="footer-link">
               <i className="fa-regular fa-envelope me-2"></i>
               <span>titistsabitha28@gmail.com</span>
              </Link>
            </div>
          </Col>

          <Col lg="2" className="footer-menu col mt-lg-0 mt-5">
          <h5>Menu</h5>
          <Link to="/homePage">Home</Link>
          <Link to="/produk">Produk</Link>
          <Link to="/TestimonialPage">Testimonial</Link>
          <Link to="/tentangKami">Tentang</Link>
          <Link to="/alamat">Alamat</Link>
          </Col>

          <Col lg="2" className="footer-informasi col mt-lg-0 mt-5"></Col>
          <h5>Informasi Berbelanja</h5>
          <Link to="/berbelanja">Berbelanja</Link>
          <Link to="/pembayaran">Pembayaran</Link>
          <Link to="/pengiriman">Pengiriman</Link>

          <Col lg="4" className="footer-subscribe mt-lg-0 mt-5">
          <h5>Subscribe untuk info menarik</h5>
          <div className="subscribe-box">
            <input type="text" placeholder="Email Anda..."/>
            <button className="btn btn-subscribe">Subscribe</button>
          </div>
          <div className="social-icons mt-3">
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-twitter"></i>
            <i className="fa-brands fa-linkedin"></i>
            <i className="fa-brands fa-youtube"></i>
          </div>
          </Col>
        </Row>
        <Row className="footer-bottom">
          <Col>
            <hr/>
            <p>&copy; Copyright {new Date().getFullYear()} by <span>Titis Tsabitha</span>,
            All Right Reserved </p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default FooterComponent;