import { Container, Row, Col } from "react-bootstrap";
import FooterComponent from "../components/FooterComponent";

const Pengiriman = () => {
    return (
        <div className="pengiriman-page">
            <div className="pengiriman min-vr-100">
                <Container>
                    <Row>
                        <Col>
                            <h1 className="fw-bold text-center mb-2 animate__animated animate__fadeInUp animate__delay-1s">Informasi Pengiriman</h1>
                            <p className="text-center animate__animated animate__fadeInUp animate__delay-1s">Di halaman bantuan ini, Kamu bisa menemukan semua informasi yang Kamu cari, kami akan dengan senang hati membantu.</p>
                        </Col>
                    </Row>
                    <Row className="pt-5">
                        <Col>
                            <p>Pengiriman</p>
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <Col>
                            <h4 className="fw-bold">Berapa biaya pengiriman yang dikenakan untuk setiap order?</h4>
                            <p>Biaya pengiriman berbeda-beda, tergantung lokasi toko yang dipilih dan alamat kamu. 
                               Silakan cek ongkir di halaman pemesanan.</p>
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <Col>
                            <h4 className="fw-bold">Kenapa pesanan saya belum tiba di tujuan?</h4>
                            <p>Durasi pengiriman tergantung jarak lokasi kamu dan layanan pengiriman yang digunakan.
                               Silakan cek secara berkala, ya.</p>
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <Col>
                            <h4 className="fw-bold">Jika produk yang diterima tidak sesuai, bagaimana?</h4>
                            <p>Silakan kirim email ke customercare@tsabook.id, jelaskan kronologi dan sertakan video
                               unboxing dari paket yang diterima, lalu tunggu balasan dari tim Customer Service. Batas
                               maksimal komplain adalah 14 hari sejak pesanan diterima.</p>
                        </Col>
                    </Row>
                </Container>
            </div>
            <FooterComponent />
        </div>
    );
};

export default Pengiriman;