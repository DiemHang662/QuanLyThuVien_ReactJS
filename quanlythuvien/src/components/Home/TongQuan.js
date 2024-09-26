import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2'; // Changed from Line to Pie
import { useNavigate } from 'react-router-dom';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import GroupIcon from '@mui/icons-material/Group';
import BookIcon from '@mui/icons-material/Book';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { authApi, endpoints } from '../../configs/API';
import './TongQuan.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Updated imports
import Footer from '../../components/Footer/Footer';
import MainLayout from '../Navbar/MainLayout';

// Registering the necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const TongQuan = () => {
    const api = authApi();
    const navigate = useNavigate();
    const [userCount, setUserCount] = useState(0);
    const [bookCount, setBookCount] = useState(0);
    const [interCount, setInterCount] = useState(0);
    const [borrowReturnCount, setBorrowReturnCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const userResponse = await api.get(endpoints.userCount);
                setUserCount(userResponse.data.user_count);

                const bookResponse = await api.get(endpoints.bookCount);
                setBookCount(bookResponse.data.book_count);

                const interResponse = await api.get(endpoints.interCount);
                setInterCount(interResponse.data.combined_total);

                const borrowReturnResponse = await api.get(endpoints.borrowReturnCount);
                setBorrowReturnCount(borrowReturnResponse.data.total_borrow_count);

            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        };

        fetchCounts();
    }, []);

    // Define colors to match the info boxes
    const colors = ['#4CAF50', '#2196F3', '#FFC107', '#F44336'];

    const chartData = {
        labels: ['Người dùng', 'Sách', 'Mượn trả', 'Lượt tương tác'],
        datasets: [
            {
                label: 'Thống kê',
                data: [userCount, bookCount, borrowReturnCount, interCount],
                backgroundColor: colors,
                hoverOffset: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Tổng quan về thư viện',
            },
        },
    };

    return (
        <div className="body-home">
            <MainLayout>
                <div className="tong-quan-content">
                    <Row className="card-container">
                        <h1 className="h1">TỔNG QUAN THƯ VIỆN</h1>
                        <Col md={3}>
                            <div className="info-box user">
                                <div className="info-header">
                                    <div className="title-content">
                                        <strong>{userCount}</strong>
                                        <div>Người dùng</div>
                                    </div>
                                    <GroupIcon className="icon-title" />
                                </div>
                                <div className="more-info" onClick={() => navigate('/nguoidung')}>
                                    Chi tiết <ArrowCircleRightIcon />
                                </div>
                            </div>
                        </Col>

                        <Col md={3}>
                            <div className="info-box book">
                                <div className="info-header">
                                    <div className="title-content">
                                        <strong>{bookCount}</strong>
                                        <div>Cuốn sách</div>
                                    </div>
                                    <BookIcon className="icon-title" />
                                </div>
                                <div className="more-info" onClick={() => navigate('/dssach')}>
                                    Chi tiết <ArrowCircleRightIcon />
                                </div>
                            </div>
                        </Col>

                        <Col md={3}>
                            <div className="info-box inter">
                                <div className="info-header">
                                    <div className="title-content">
                                        <strong>{borrowReturnCount}</strong>
                                        <div>Mượn trả</div>
                                    </div>
                                    <HistoryEduIcon className="icon-title" />
                                </div>
                                <div className="more-info" onClick={() => navigate('/muontra')}>
                                    Chi tiết <ArrowCircleRightIcon />
                                </div>
                            </div>
                        </Col>

                        <Col md={3}>
                            <div className="info-box interaction">
                                <div className="info-header">
                                    <div className="title-content">
                                        <strong>{interCount}</strong>
                                        <div>Lượt tương tác</div>
                                    </div>
                                    <VolunteerActivismIcon className="icon-title" />
                                </div>
                                <div className="more-info" onClick={() => navigate('/tuongtac')}>
                                    Chi tiết <ArrowCircleRightIcon />
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <div className="chart">
                        <Pie data={chartData} options={chartOptions} /> 
                    </div>

                    <Footer />
                </div>
            </MainLayout>
        </div>
    );
};

export default TongQuan;
