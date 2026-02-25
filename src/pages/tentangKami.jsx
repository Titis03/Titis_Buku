import {Container, Row, Col} from "react-bootstrap";

const TentangKami = () => {
  return (
    <div className="tentangkami-page">
      <div className="tentangkami min-vr-100">
        <Container>
          <Row>
          <Col>
            <h1 className="fw-bold text-center mb-2 animate__animated animate__fadeInUp animate__delay-1s">Tentang Kami</h1>
            <p className="text-center animate__animated animate__fadeInUp animate__delay-1s">TsaBook.id adalah destinasi literasi digital terlengkap yang menghadirkan ribuan koleksi buku original untuk menemani perjalanan intelektual Anda.</p>
          </Col>
          </Row>
          <Row className="pt-5">
            <Col>
            <p>Di TsaBook, kami percaya bahwa setiap buku memiliki cerita yang layak ditemukan. Kami hadir untuk memudahkan para pecinta buku di seluruh Indonesia mendapatkan akses ke karya-karya terbaik, mulai dari fiksi lokal hingga literatur internasional, dengan harga yang tetap bersahabat di kantong.</p>
            </Col>
          </Row>
          <Row className="py-3">
            <Col>
            <h4 className="fw-bold">1. Cerita Kami</h4>
            <p>TsaBook didirikan dengan satu misi sederhana: Mendekatkan buku berkualitas ke tangan pembaca. Kami memahami bahwa di tengah hiruk-pikuk dunia digital, aroma kertas dan sensasi membalik halaman adalah kemewahan yang tak tergantikan. Kami memulai perjalanan ini dengan kurasi koleksi yang jujur, mulai dari literatur klasik, pengembangan diri, hingga buku anak yang memicu imajinasi.</p>
            </Col>
          </Row>
          <Row className="py-3">
            <Col>
            <h4 className="fw-bold">2. Visi Misi Kami</h4>
            <p>Kami bermimpi menjadi mercusuar literasi yang inklusif. Dengan menyediakan akses mudah terhadap buku-buku bermutu, TsaBook berkomitmen untuk ikut serta dalam mencerdaskan kehidupan bangsa, satu buku dalam satu waktu.</p>
            </Col>
          </Row>
          <Row className="py-3">
            <Col>
            <h4 className="fw-bold">3. Mengapa Memilih TsaBook?</h4>
            <p>Kami percaya bahwa sebuah toko buku harus menjadi lebih dari sekadar tempat transaksi, melainkan sebuah kurasi yang bermakna. Setiap judul yang terpajang di rak kami telah melalui proses seleksi ketat untuk memastikan Anda mendapatkan referensi terbaik di bidangnya. Di sini, Anda akan dilayani oleh tim yang terdiri dari sesama pencinta buku yang siap membantu menemukan "jodoh" bacaan berikutnya dengan sepenuh hati. Lebih dari itu, kami aktif membangun komunitas literasi melalui diskusi dan rekomendasi rutin guna menghidupkan semangat membaca bagi setiap pelanggan setia kami.</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default TentangKami;