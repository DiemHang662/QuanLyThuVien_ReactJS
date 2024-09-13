import React from 'react';
import { Carousel } from 'react-bootstrap';
import Footer from '../../components/Footer/Footer';
import "./Home.css";
import MainLayout from '../Navbar/MainLayout';

const Home = () => {
  const images = [
    'https://vbs.edu.vn/wp-content/uploads/2023/05/Brown-and-Blue-Photo-Library-Birthday-Virtual-Background.png',
    'https://file.hstatic.net/200000090679/file/z5679281412660_7636cf5aa93594064a10a52aa07b23cf.jpg',
    'https://tiki.vn/blog/wp-content/uploads/2023/08/thumb-12.jpg',
  ];

  return (
    <div className="container">
      <MainLayout />
      <div className="content-wrapper">
        <Carousel className="carousel">
          {images.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block img-carousel"
                src={image}
                alt={`slide-${index}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        <h1 className="h1">GIỚI THIỆU</h1>

        <div className="intro">
          <p className="textIntro">
            GOLDEN SEA xin gửi đến quý khách hàng lời chúc tốt đẹp nhất & lời cảm ơn quý khách đã quan tâm đến chung cư chúng tôi
          </p>
          <img
            src="https://xaydungnhatrongoi.vn/wp-content/uploads/2023/09/1-9.jpg"
            alt="intro"
            className="imageIntro"
          />
        </div>

        <h2 className="h2">VỊ TRÍ</h2>

        <div className="intro">
          <img
            src="https://thuanhunggroup.com/wp-content/uploads/2022/08/Saigon-Peninsula-Qua%CC%A3%CC%82n-7-Viva-Land.jpeg"
            alt="location"
            className="imageIntro"
          />
          <p className="textIntro">
            Đường Đào Trí, Phú Thuận, Q7, TP.HCM. Nằm kế cạnh khu đô thị Peninsula được đầu tư 6 tỷ USD
          </p>
        </div>

        <h3 className="h3">HÌNH ẢNH THỰC TẾ</h3>

        <div className="content">
          <div className="list1">
            <p className="text1">Phòng khách</p>
            <div className="imageContainer">
              <img
                src="https://decoxdesign.com/upload/images/thiet-ke-pk-chung-cu-nho-07-decox-design.jpg"
                alt="living room"
                className="image"
              />
            </div>
          </div>
          <div className="list1">
            <p className="text1">Phòng ngủ</p>
            <div className="imageContainer">
              <img
                src="https://cdn.pixabay.com/photo/2016/03/15/20/39/bedroom-1263385__340.jpg"
                alt="bedroom"
                className="image"
              />
            </div>
          </div>
          <div className="list1">
            <p className="text1">Nhà bếp</p>
            <div className="imageContainer">
              <img
                src="https://www.homify.com/ideabooks/8350808/beautiful-modern-kitchen-design-ideas-for-small-spaces"
                alt="kitchen"
                className="image"
              />
            </div>
          </div>
          <div className="list1">
            <p className="text1">Phòng tắm</p>
            <div className="imageContainer">
              <img
                src="https://cdn.pixabay.com/photo/2015/07/07/16/07/bathroom-835104__340.jpg"
                alt="bathroom"
                className="image"
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
