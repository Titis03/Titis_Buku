import {Container,Row,Col} from "react-bootstrap";
import {Link} from "react-router-dom";

const FooterComponent = () => {
  return (
    <div  className="footer py-5">
      <Container>
        <Row className="d-flex justify-content-between">
          <Col lg="5">
            <h3 className="fw-bold">TSABITHA_RESTI</h3>
            <p className="desc">Jendela dunia ada di genggaman Anda. TsaBook menghadirkan koleksi buku terlengkap dari berbagai genre untuk menginspirasi setiap langkah perjalanan intelektual Anda. Temukan sahabat setia dalam lembaran kertas berkualitas hanya di sini.</p>
            <div className="no mb-1 mt-4">
              <Link className="text-decoration-none d-flex align-items-center">
               <i className="fa-brands fa-whatsapp me-2"></i>
               <p className="m-0">+62 821-4232-4394</p>
              </Link>
            </div>
            <div className="mail">
              <Link className="text-decoration-none">
               <i className="fa-regular fa-envelope"></i>
               <p className="m-0">titistsabitha28@gmail.com</p>
              </Link>
            </div>
          </Col>
          <Col className="d-flex flex-column col-lg-2 col mt-lg-0 mt-5">
          <h5 className="fw-bold">Menu</h5>
          <Link to="/homePage">Home</Link>
          <li><a href="#produk">Produk</a></li>
          <li><a href="#testimoni">Testimoni</a></li>
          <Link to="tentangKami">Tentang Kami</Link>
          <Link to="/alamat">Alamat</Link>
          </Col>
          <Col lg="4" className="mt-lg-0 mt-5">
          <h5 className="fw-bold mb-3">Subscribe untuk info menarik</h5>
          <div className="subscribe">
            <input type="text" placeholder="Subscribe..."/>
            <button className="btn btn-danger rounded-end rounded-0">Subscribe</button>
          </div>
          <div className="social mt-3">
            <i className="fa-brands fa-facebook me-3"></i>
            <i className="fa-brands fa-twitter me-3"></i>
            <i className="fa-brands fa-linkedin me-3"></i>
            <i className="fa-brands fa-youtube me-3"></i>
          </div>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <hr/>
            <p className="text-center px-md-0 px-3">&copy; Copyright {new Date().getFullYear()} by <span className="fw-bold">Titis Tsabitha</span>,
            All Right Reserved </p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default FooterComponent