import React from 'react';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PhoneIcon from '@mui/icons-material/Phone';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import { MDBFooter, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import './Footer.css'; // Ensure you create this CSS file for custom styles

const Footer = () => {
  return (
    <MDBFooter className='text-white text-center bg-dark'>
      <MDBContainer className='p-3'>
        <MDBRow>
          <MDBCol md='4' className='mb-3'>
            <h5 className='text-uppercase mb-4 font-weight-bold'>THƯ VIỆN VNLIBRARY</h5>
            <img
              src='https://a.travel-assets.com/findyours-php/viewfinder/images/res40/482000/482656-Canberra.jpg' // Replace with your image URL
              alt='Library'
              className='img-fluid mb-2'
              style={{ width: '100%' }}
            />
            <p><FmdGoodIcon /> <strong>Địa chỉ:</strong> 172 Khánh Hội, Phường 13, Quận 4, TPHCM</p>
            <p><PhoneIcon /> <strong>Điện thoại</strong>: 0933 615 915</p>
          </MDBCol>
          <MDBCol md='2' className='mb-4'>
            <h5 className='text-uppercase mb-4 font-weight-bold'>Liên Kết</h5>
            <ul className='list-unstyled'>
              <li><a href='#' className='text-white mb-2'>Trang chủ</a></li>
              <li><a href='#' className='text-white mb-2'>Giới thiệu</a></li>
              <li><a href='#' className='text-white mb-2'>Dịch vụ</a></li>
              <li><a href='#' className='text-white mb-2'>Liên hệ</a></li>
            </ul>
          </MDBCol>
          <MDBCol md='2' className='mb-4'>
            <h5 className='text-uppercase mb-4 font-weight-bold'>Liên hệ</h5>
            <ul className='list-unstyled'>
              <li><a href='#' className='text-white mb-3'><FacebookIcon/> Facebook</a></li>
              <li><a href='#' className='text-white mb-3'><TwitterIcon/> Twitter</a></li>
              <li><a href='#' className='text-white mb-3'><GoogleIcon/> Google</a></li>
            </ul>
          </MDBCol>
          <MDBCol md='4' className='mb-4'>
            <h5 className='text-uppercase mb-4 font-weight-bold'>Bản đồ</h5>
            <div className='map-container'>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.786166357748!2d106.68090361469146!3d10.771826192330583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528c5c3bafc73%3A0x2f0c8dba97b78214!2s172%20Ho%C3%A0ng%20Hoa%20Th%C3%A1m%2C%20Ph%C6%B0%E1%BB%9Dng%202%2C%20Th%C3%A0nh%20ph%E1%BB%91%20V%C5%A9ng%20T%C3%A0u!5e0!3m2!1sen!2s!4v1699342698180!5m2!1sen!2s"
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div className='text-center p-3' style={{ backgroundColor: 'black' }}>
        <a className='text-white' href='#'>
          © 2024 Copyright VNLIBRARY
        </a>
      </div>
    </MDBFooter>
  );
};

export default Footer;
