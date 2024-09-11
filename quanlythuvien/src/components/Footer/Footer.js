import React from 'react';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PhoneIcon from '@mui/icons-material/Phone';
import { MDBFooter, MDBContainer, MDBRow, } from 'mdb-react-ui-kit';

const Footer = () => {
  return (
    <MDBFooter className='text-white text-center' style={{ backgroundColor: '#1E90FF'}}>
      <MDBContainer className='p-3'>
        <MDBRow>
            <h5 className='text-uppercase text-white'>CHUNG CƯ GOLDEN SEA</h5>
            <p><FmdGoodIcon/>  Địa chỉ: 172 Hoàng Hoa Thám, Phường 2, Thành phố Vũng Tàu</p>
            <p><PhoneIcon/>  Số điện thoại: 0933 615 915</p>
        </MDBRow>
      </MDBContainer>
      <div className='text-center p-3 bg-primary' >
      
        <a className='text-white' href='#'>
        © 2020 Copyright CHUNG CƯ GOLDEN SEA
        </a>
      </div>
    </MDBFooter>
  );
}

export default Footer;