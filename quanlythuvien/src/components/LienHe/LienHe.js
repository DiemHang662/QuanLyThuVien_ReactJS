import React from 'react';
import MainLayout from '../../components/Navbar/MainLayout';
import Footer from '../../components/Footer/Footer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import CallIcon from '@mui/icons-material/Call';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import './LienHe.css';

const LienHe = () => {
  return (
    <>
      <MainLayout />
      <div className="lienhe-container">
        <div className="left-section">
          <div className="map-container1">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.842113943832!2d105.84181131537366!3d21.028531185988954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454b991d80fd5%3A0x52c2b7494e204b79!2zVGjDoG5oIHBo&#x1EB5; SFV BJW50ZWNobmljIFVuaXZlcnNpdHk!5e0!3m2!1sen!2s!4v1666498061137!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="contact-info">
            <div className="contact-item">
              <PlaceIcon />
              <p>  172 Khánh Hội, Phường 13, Quận 4, Thành phố Hồ Chí Minh</p>
            </div>
            <div className="contact-item">
              <CallIcon />
             <p>0933 615 915</p>
            </div>
            <div className="contact-item">
              <ContactMailIcon />
           <p> vnlibrary172@trithuc.edu.vn</p>
            </div>
            <div className="contact-item">
              <AccessTimeIcon />
              <p>Thứ Hai - Thứ Sáu: 8:00 AM - 17:00 PM</p>
            </div>
          </div>
        </div>
        <div className="right-section">
          <div className="form-container">
            <h2 className="title-lh">LIÊN HỆ VỚI CHÚNG TÔI</h2>
            <p>
              Chúng tôi mong muốn lắng nghe ý kiến của quý khách. Vui lòng gửi mọi yêu cầu, thắc mắc
              theo thông tin bên dưới, chúng tôi sẽ liên lạc với bạn sớm nhất có thể.
            </p>
            <form>
              <input type="text" placeholder="Họ và tên" />
              <input type="email" placeholder="Email" />
              <input type="text" placeholder="Tiêu đề" />
              <textarea placeholder="Nội dung"></textarea>
              <button type="submit" className="submit-button">
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LienHe;