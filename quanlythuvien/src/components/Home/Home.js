import React, { useState } from 'react';
import { Carousel, Container } from 'react-bootstrap';
import Navbar from '../../components/Navbar/Navbar'; 
import Footer from '../../components/Footer/Footer'; 
import "./Home.css";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const images = [
    'https://xaydungnhatrongoi.vn/wp-content/uploads/2023/09/1-9.jpg',
    'https://sbshouse.vn/wp-content/uploads/2023/10/phong-khach-chung-cu-hien-dai.jpg',
    'https://toquoc.mediacdn.vn/280518851207290880/2022/10/10/image001-16653869111531095951154.jpg',
  ];

  return (
    <>
      < div className="container-home">
        <Carousel>
          {images.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block img-carousel"
                src={image}
                alt={`slide-${index}`}
              />
              <Carousel.Caption>
  
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div>
          <h1 className="h1">GIỚI THIỆU</h1>

          <div className="intro">
            <p className="textIntro">GOLDEN SEA xin gửi đến quý khách hàng lời chúc tốt đẹp nhất & lời cảm ơn quý khách đã quan tâm đến chung cư chúng tôi</p>
            <img src="https://xaydungnhatrongoi.vn/wp-content/uploads/2023/09/1-9.jpg" alt="intro" className="imageIntro" />
          </div>

          <h2 className="h2">VỊ TRÍ</h2>

          <div className="intro">
            <img src="https://thuanhunggroup.com/wp-content/uploads/2022/08/Saigon-Peninsula-Qua%CC%A3%CC%82n-7-Viva-Land.jpeg" alt="location" className="imageIntro" />
            <p className="textIntro">Đường Đào Trí, Phú Thuận, Q7, TP.HCM. Nằm kế cạnh khu đô thị Peninsula được đầu tư 6 tỷ USD</p>
          </div>
        </div>

        <h3 className="h3">HÌNH ẢNH THỰC TẾ</h3>

        <div className="content">
          <div className="list1">
            <p className="text1">Phòng khách</p>
            <div className="imageContainer">
              <img src="https://decoxdesign.com/upload/images/thiet-ke-pk-chung-cu-nho-07-decox-design.jpg" alt="living room" className="image" />
            </div>
          </div>

          <div className="list1">
            <p className="text1">Phòng bếp</p>
            <div className="imageContainer">
              <img src="https://thhome.vn/wp-content/uploads/2021/06/noi-that-phong-an-phong-cach-scandinavian-2.jpg" alt="kitchen" className="image" />
            </div>
          </div>

          <div className="list1">
            <p className="text1">Phòng ngủ</p>
            <div className="imageContainer">
              <img src="https://noithattugia.com/wp-content/uploads/Phong-ngu-the-hien-ca-tinh-rieng-va-theo-so-thich-cua-chu-nhan-can-phong-noi-that-tu-gia.jpg" alt="bedroom" className="image" />
            </div>
          </div>

          <div className="list1">
            <p className="text1">Phòng tập gym</p>
            <div className="imageContainer">
              <img src="https://phumyhung.vn/wp-content/uploads/2020/11/Hung-Phuc-Premier-36-Copy.jpg" alt="gym" className="image" />
            </div>
          </div>

          <div className="list1">
            <p className="text1">Cửa hàng tiện lợi</p>
            <div className="imageContainer">
              <img src="https://cdn-www.vinid.net/2020/08/b65142c1-circlek-e1598600869576.jpg" alt="convenience store" className="image" />
            </div>
          </div>

          <div className="list1">
            <p className="text1">Sân vui chơi</p>
            <div className="imageContainer">
              <img src="https://mangtruot.com/wp-content/uploads/2020/12/tu-van-lap-dat-khu-vui-choi-ngoai-troi-cho-tre-em-tai-khu-chung-cu-5.jpg" alt="playground" className="image" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;