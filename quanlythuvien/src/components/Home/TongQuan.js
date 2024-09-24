import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import GroupIcon from '@mui/icons-material/Group';
import BookIcon from '@mui/icons-material/Book';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { authApi, endpoints } from '../../configs/API';
import './TongQuan.css';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import Footer from '../../components/Footer/Footer';
import MainLayout from '../Navbar/MainLayout';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registering the necessary components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, ChartDataLabels);

const TongQuan = () => {
    const api = authApi();
    const navigate = useNavigate();
    const [userCount, setUserCount] = useState(0);
    const [bookCount, setBookCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const userResponse = await api.get(endpoints.userCount);
                setUserCount(userResponse.data.user_count);

                const bookResponse = await api.get(endpoints.bookCount);
                setBookCount(bookResponse.data.book_count);
            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        };

        fetchCounts();
    }, [api]);

    const chartData = {
        labels: ['Người dùng', 'Sách'],
        datasets: [
            {
                label: 'Thống kê',
                data: [userCount, bookCount],
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.2)',
                tension: 0.1,
                datalabels: {
                    color: '#000',
                    display: true,
                    formatter: (value) => value,
                },
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
            datalabels: {
                anchor: 'end',
                align: 'end',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                },
            },
            y: {
                title: {
                    display: true,
                },
                beginAtZero: true,
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
                        <div className="info-box interaction">
                            <div className="info-header">
                                <div className="title-content">
                                    <strong>{userCount}</strong>
                                    <div>Lượt tương tác</div>
                                </div>
                                <VolunteerActivismIcon className="icon-title" />
                            </div>
                            <div className="more-info" onClick={() => navigate('/tuongtac')}>
                                Chi tiết <ArrowCircleRightIcon />
                            </div>
                        </div>
                    </Col>

                    <Col md={3}>
                        <div className="info-box survey">
                            <div className="info-header">
                                <div className="title-content">
                                    <strong>{userCount}</strong>
                                    <div>Khảo sát</div>
                                </div>
                                <HistoryEduIcon className="icon-title" />
                            </div>
                            <div className="more-info" onClick={() => navigate('/khaosat')}>
                                Chi tiết <ArrowCircleRightIcon />
                            </div>
                        </div>
                    </Col>

                </Row>

                <div className="chart">
                    <Line data={chartData} options={chartOptions} />
                </div>

                <Footer />
            </div>
        </MainLayout>
        </div>
    );
};

export default TongQuan;
