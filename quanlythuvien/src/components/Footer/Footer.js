import React from 'react';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PhoneIcon from '@mui/icons-material/Phone';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import { MDBFooter, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import './Footer.css';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <MDBFooter className="text-white text-center bg-dark">
      <MDBContainer className="p-4">
        <MDBRow>
          <MDBCol md="4" className="mb-1">
            <h5 className="text-footer">VỀ CHÚNG TÔI</h5>
            <div className="border-footer"></div>
            <p className="about-us">
              “Tôi muốn bạn thấy lòng dũng cảm thực sự là gì, thay vì nghĩ rằng lòng dũng cảm là một người đàn ông có súng trên tay. Đó là khi bạn dám bắt đầu dù biết sẽ thất bại, dù thế nào đi nữa bạn cũng nhìn thấu được điều đó. Bạn có thể ít khi thắng, nhưng chiến thắng rồi sẽ đến với bạn.”
            </p>
            <div className="social-icons">
              <a href="#" className="btn btn-outline-light btn-floating m-1">
                <FacebookIcon />
              </a>
              <a href="#" className="btn btn-outline-light btn-floating m-1">
                <TwitterIcon />
              </a>
              <a href="#" className="btn btn-outline-light btn-floating m-1">
                <GoogleIcon />
              </a>
            </div>
          </MDBCol>
          <MDBCol md="2" className="mb-1">
            <h5 className="text-footer">TÍNH NĂNG</h5>
            <div className="border-footer"></div>
            <div className="tweet-container">
              <p className="tinhnang" onClick={() => navigate('/')}>Trang chủ</p>
              <p className="tinhnang" onClick={() => navigate('/')}>Tổng quan</p>
              <p className="tinhnang" onClick={() => navigate('/tintuc')} >Tin tức</p>
              <p className="tinhnang" onClick={() => navigate('/lienhe')} >Liên hệ</p>
            </div>
          </MDBCol>
          <MDBCol md="2" className="mb-3">
            <h5 className="text-footer">THƯ VIỆN ẢNH</h5>
            <div className="border-footer"></div>
            <div className="course-container">
              <div className="row">
                <div className="col-4 mb-2">
                  <img src="https://tieuhoctranquoctoan.edu.vn/uploads/news/2023_03/sbia.jpg" />
                </div>
                <div className="col-4 mb-2">
                  <img src="https://thanhdo.edu.vn/wp-content/uploads/2022/09/thu20vien20tdd.jpg" />
                </div>
                <div className="col-4 mb-2">
                  <img src="https://hoinhabaobacgiang.vn/Includes/NewsImg/3_2024/30193_3.jpg" />
                </div>
              </div>
              <div className="row">
                <div className="col-4 mb-2">
                  <img src="https://newshop.vn/public/uploads/content/thu-hut-hs-doc-sach-tai-truong-min.png" />
                </div>
                <div className="col-4 mb-2">
                  <img src="https://xdcs.cdnchinhphu.vn/446259493575335936/2022/12/4/thu-vien-truong-hoc-drxb-16701383518661110978060.jpg" />
                </div>
                <div className="col-4 mb-2">
                  <img src="https://www.nxbgd.vn/Attachments/images/Bia%20sach%20thamkhao.jpg" />
                </div>
              </div>
            </div>
          </MDBCol>
          <MDBCol md='4' className='mb-1'>
            <h5 className="text-footer">BẢN ĐỒ</h5>
            <div className="border-footer"></div>
            <div className='map-container'>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.842113943832!2d105.84181131537366!3d21.028531185988954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454b991d80fd5%3A0x52c2b7494e204b79!2zVGjDoG5oIHBo&#x1EB5; SFV BJW50ZWNobmljIFVuaXZlcnNpdHk!5e0!3m2!1sen!2s!4v1666498061137!5m2!1sen!2s"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </div>
            <p className="about-us"><strong>Địa chỉ:</strong> 172 Khánh Hội, Phường 13, Q4, TPHCM</p>
            <p className="about-us"><strong>Email:</strong> vnlibrary172@trithuc.edu.vn</p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div className="text-center p-2 copyright">
        <a className="text-white" href="#">
          © 2024 Copyright VNLIBRARY
        </a>
      </div>
    </MDBFooter>
  );
};

export default Footer;