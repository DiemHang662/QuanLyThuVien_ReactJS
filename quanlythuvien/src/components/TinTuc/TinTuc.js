import React from 'react';
import MainLayout from '../../components/Navbar/MainLayout';
import Footer from '../../components/Footer/Footer';
import './TinTuc.css';

const TinTuc = () => {
  const articles = [
    {
      title: 'Phê duyệt Kế hoạch lựa chọn nhà thầu Dự toán mua sắm',
      description: 'Ngày 24/9/2024, Nhà xuất bản Giáo dục Việt Nam đã ban hành Quyết định Số 697/QĐ-NXBGDVN ngày 24/9/2024 về việc phê duyệt kế hoạch lựa chọn nhà thầu Dự toán mua sắm...',
      image: 'https://cdn.luatvietnam.vn/uploaded/Images/Original/2020/04/22/mau-thong-bao_2204184241.png',
      date: 'Ngày 24/09/2024',
      url: 'https://www.nxbgd.vn/bai-viet/phe-duyet-ke-hoach-lua-chon-nha-thau-du-toan-mua-sam-dich-vu-in-bo-sung-sgd-phuc-vu-nam-hoc-2024-2025-cho-cac-dia-phuong-bi-anh-huong-cua-bao-lu'
    },
    {
      title: 'Khắc phục ảnh hưởng sau bão Yagi',
      description: 'Cơn bão Yagi vừa đi qua các tỉnh đồng bằng Bắc bộ khiến hệ thống giao thông bị ảnh hưởng...',
      image: 'https://cdnphoto.dantri.com.vn/G7kKpty-60EKX99b8yXOzc3fYN4=/thumb_w/1020/2024/09/04/screen-shot-2024-09-04-at-064537-1725407176445.png',
      date: 'Ngày 08/09/2024',
      url: 'https://vneconomy.vn/khac-phuc-anh-huong-sau-bao-yagi-dam-bao-giao-thong-thong-suot.htm'
    },
    {
      title: 'Quyết nghị nhiều chính sách hỗ trợ người dân sau bão Yagi',
      description: 'Sáng 4/10, dưới sự điều hành của Chủ tịch HĐND thành phố Nguyễn Ngọc Tuấn...',
      image: 'https://baodaklak.vn/file//fb9e3a03798789de0179a1704dea238e/092024/hang_cuu_tro_sau_bao_20240911182642.jpg',
      date: 'Ngày 04/10/2024',
      url: 'https://baomoi.com/quyet-nghi-nhieu-chinh-sach-ho-tro-nguoi-dan-sau-bao-yagi-c50358580.epi'
    },
    {
      title: 'Giáo khoa mới, áp lực cũ',
      description: 'Ngày 1/6, trong buổi gặp mặt giữa lãnh đạo UBND TP HCM với các thiếu nhi tiêu biểu...',
      image: 'https://vcdn1-vnexpress.vnecdn.net/2024/06/03/Thc-1717380130-7965-1717380241.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=kEB8OmKoBZQjn9cBxuaptA',
      date: 'Ngày 03/06/2024',
      url: 'https://vnexpress.net/giao-khoa-moi-ap-luc-cu-4753314.html'
    },
    {
      title: 'Phát triển văn hóa đọc thúc đẩy học tập suốt đời',
      description: 'Sáng 4/10, Sở Giáo dục và Đào tạo Hải Dương khai mạc Tuần lễ hưởng ứng học tập suốt đời năm 2024 với chủ đề “Phát triển văn hóa đọc thúc đẩy học tập suốt đời”.',
      image: 'https://bhd.1cdn.vn/2024/10/04/img_7722(1).jpg',
      date: 'Ngày 04/10/2024',
      url: 'https://baohaiduong.vn/phat-trien-van-hoa-doc-thuc-day-hoc-tap-suot-doi-394829.html'
    },
    {
      title: 'Thư viện tích hợp không gian teamwork "đỉnh nóc"',
      description: 'HHT - Không chỉ là nơi học tập, thư viện của 3 trường Đại học này còn cực kỳ siêu xịn với thiết kế hiện đại, không gian thoáng đãng, đảm bảo các bạn sinh viên sẽ có những phút giây “thả hồn” vào sách vở một cách đầy cảm hứng.',
      image: 'https://image.tienphong.vn/w1966/Uploaded/2024/qqc-lce22/2024_10_02/hutech1-7720.jpg',
      date: 'Ngày 04/10/2024',
      url: 'https://hoahoctro.tienphong.vn/thu-vien-tich-hop-khong-gian-teamwork-dinh-noc-tai-3-truong-dh-o-tphcm-post1678576.tpo'
    },
    {
      title: 'Những cuốn “sách sống”',
      description: 'Qua thời gian và với sự phát triển của khoa học công nghệ, cách thức tiếp thu kiến thức từ sách dần thay đổi và đa dạng hơn, từ sách in truyền thống đến sách điện tử, sách nói',
      image: 'https://cdn.baogialai.com.vn/images/18a0651672861ca66357657ae76bf4362fdc649dba7fbb25f7da78e0343fd71db5952dbf581c2ae956b77fb879ab856037d2c1fc02c3fdca352a8be474a4e118b19965afc3b88290d7ccc106ddf0d30b/nhung-cuon-sach-song-bg-9581-7233.jpg',
      date: 'Ngày 03/10/2024',
      url: 'https://baogialai.com.vn/nhung-cuon-sach-song-post295452.html'
    },
    {
      title: 'Ước dành 24 giờ mỗi ngày để đọc sách',
      description: 'Hina tâm sự với mẹ "Nếu có một điều ước thì con ước con không cần ngủ nhưng vẫn khỏe mạnh để dành hết thời gian 24h đọc thật nhiều sách. Ngủ thật lãng phí thời gian mẹ nhỉ"',
      image: 'https://phunuvietnam.mediacdn.vn/thumb_w/700/179072216278405120/2023/7/20/36013177534032867999221237340835515403264814n-168956570796516147198-1689822873695-1689822873805683589567-0-0-1125-1800-crop-1689822896058445999632.jpg',
      date: 'Ngày 20/07/2023',
      url: 'https://phunuvietnam.vn/em-be-6-tuoi-uoc-danh-24-gio-moi-ngay-de-doc-sach-vi-ngu-that-lang-phi-thoi-gian-20230720101516726.htm'
    },

  ];

  return (
    <>
      <MainLayout />
      <div className="container">

        {/* Hero Section */}
        <section className="hero">
          <img src="https://www.nhavanhoasinhvien.vn/wp-content/uploads/2022/08/COVER-CUOC-THI-SACH-TOI-YEU.png" alt="Cuộc thi" />
          <div className="hero-text">
            <h2>Cuộc thi giới thiệu về sách cho sinh viên “Sách tôi yêu”</h2>
            <p>Từ ngày 15/8/2022 đến 31/9/2022, Nhà Văn hóa Sinh viên sẽ tổ chức Cuộc thi giới thiệu về sách với chủ đề “Sách tôi yêu” hướng đến đối tượng đoàn viên, thanh niên, học sinh và sinh viên trên địa bàn thành phố Hồ Chí Minh (từ 16 đến 35 tuổi).</p>
          </div>
        </section>

        <div className="tintuc-thongbao">
          <p>TIN TỨC - THÔNG BÁO</p>
        </div>

        <section className="featured-articles">
          <div className="main-feature">
            <a href={articles[0].url} target="_blank" rel="noopener noreferrer">
              <img src={articles[0].image} alt={articles[0].title} />
              <h2 className="title-h2">{articles[0].title}</h2>
              <p>{articles[0].description}</p>
              <div className="article-meta">
                <span>{articles[0].date}</span>
              </div>
            </a>
          </div>

          <div className="side-features">
            {articles.slice(1, 3).map((article, index) => (
              <div className="side-feature" key={index}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <img src={article.image} alt={article.title} />
                  <h3 className="title-h3">{article.title}</h3>
                  <p>{article.description}</p>
                  <div className="article-meta">
                    <span>{article.date}</span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="additional-articles">
          <div className="main-articles">
            {articles.slice(3).map((article, index) => (
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <div className="article-small" key={index}>
                  <img src={article.image} alt={article.title} />
                  <h4 className="title-h4">{article.title}</h4>
                  <div className="article-meta">
                    <span>{article.date}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <aside className="sidebar">
            <div className="donvi">
              <p>CÁC ĐƠN VỊ HỢP TÁC</p>
            </div>
            <div className="sidebar-section">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTg9pJ79q-0w71LH6TSCZVu8eyZaF07SAKEJoqyHbsq8pwIXMA8mRrDWAnNWO_9-e1Oec&usqp=CAU" />
            </div>
            <div className="sidebar-section">
              <img src="https://research.vnuhcm.edu.vn/wp-content/uploads/2023/06/77e6cfea347fad581131293bf2b57385.jpg" />
            </div>
            <div className="sidebar-section">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThsyqR6eep4z1QXHx0-wiysNgm15_IiDxjlg&s" />
            </div>
          </aside>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default TinTuc;
