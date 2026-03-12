import {Container, Row, Col} from "react-bootstrap";
import FooterComponent from "../components/FooterComponent";

const Belanja = () => {
  return (
    <div className="belanja-page">
      <div className="belanja min-vr-100">
        <Container>
          <Row>
          <Col>
            <h1 className="fw-bold text-center mb-2 animate__animated animate__fadeInUp animate__delay-1s">Informasi Berbelanja</h1>
            <p className="text-center animate__animated animate__fadeInUp animate__delay-1s">Di halaman bantuan ini, Kamu bisa menemukan semua informasi yang Kamu cari, kami akan dengan senang hati membantu.</p>
          </Col>
          </Row>
          <Row className="pt-5">
            <Col>
            <p>Berbelanja</p>
            </Col>
          </Row>
          <Row className="py-3">
            <Col>
            <h4 className="fw-bold">Apakah saya harus buat akun jika ingin belanja di TsaBook.id?</h4>
            <p>Iya. Transaksi di TsaBook.id wajib buat akun, ya.</p>
            </Col>
          </Row>
          <Row className="py-3">
            <Col>
            <h4 className="fw-bold">Apa perbedaan hard cover, soft cover, dan print on demand?</h4>
            <p>Hard cover adalah tipe sampul buku yang tebal, keras, dan kaku. Biasanya terbuat dari karton tebal
               dan membuat buku lebih tahan lama.
               Soft cover adalah tipe sampul buku yang lebih tipis dan fleksibel.
               Print on demand adalah layanan cetak buku sesuai permintaan. Buku-buku hanya akan diproses sesuai
               dengan permintaan pelanggan.
            </p>
            </Col>
          </Row>
          <Row className="py-3">
            <Col>
            <h4 className="fw-bold">Apa itu produk pre-order?</h4>
            <p>Produk yang bisa dipesan sebelum tanggal perilisan resmi, memungkinkan kamu segera mendapatkan produk
               sebelum kehabisan.</p>
            </Col>
          </Row>
        </Container>
      </div>
            <FooterComponent />
    </div>
  );
};

export default Belanja;