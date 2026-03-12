import { Container, Row, Col } from "react-bootstrap";
import FooterComponent from "../components/FooterComponent";

const Pembayaran = () => {
    return (
        <div className="pembayaran-page">
            <div className="pembayaran min-vr-100">
                <Container>
                    <Row>
                        <Col>
                            <h1 className="fw-bold text-center mb-2 animate__animated animate__fadeInUp animate__delay-1s">Informasi Pembayaran</h1>
                            <p className="text-center animate__animated animate__fadeInUp animate__delay-1s">Di halaman bantuan ini, Kamu bisa menemukan semua informasi yang Kamu cari, kami akan dengan senang hati membantu.</p>
                        </Col>
                    </Row>
                    <Row className="pt-5">
                        <Col>
                            <p>Pembayaran & Pengembalian Dana</p>
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <Col>
                            <h4 className="fw-bold">Apa saja metode pembayaran yang tersedia?</h4>
                            <p>Transaksi di TsaBook dapat dibayar dengan Virtual Account, Credit Card/Debit Card, dan QRIS</p>
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <Col>
                            <h4 className="fw-bold">Batas Waktu Pembayaran</h4>
                            <p>Batas waktu pembayaran tergantung metode pembayaran yang kamu pilih.
                                Virtual Account: 1 jam sejak pembelian
                                QRIS: 30 menit sejak pembelian
                                Credit/Debit card: Hingga waktu OTP (one time password) habis.
                            </p>
                        </Col>
                    </Row>
                    <Row className="py-3">
                        <Col>
                            <h4 className="fw-bold">Saya menerima email tentang pengembalian dana, apa yang harus saya lakukan?</h4>
                            <p>Silakan balas e-mail tersebut dengan mengisi  formulir yang sudah disediakan. 
                               Lengkapi informasi mulai dari bank penerima dana, nomor rekening, dan info cabang bank.</p>
                        </Col>
                    </Row>
                </Container>
            </div>
            <FooterComponent />
        </div>
    );
};

export default Pembayaran;