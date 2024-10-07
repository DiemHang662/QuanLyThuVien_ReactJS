import React, { useState, useEffect } from 'react';
import { Row, Col, Table } from 'react-bootstrap'; // Import Table from react-bootstrap
import { Pie } from 'react-chartjs-2'; 
import { useNavigate } from 'react-router-dom';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import GroupIcon from '@mui/icons-material/Group';
import BookIcon from '@mui/icons-material/Book';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { authApi, endpoints } from '../../configs/API';
import './TongQuan.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; 
import Footer from '../../components/Footer/Footer';
import MainLayout from '../Navbar/MainLayout';

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
                setBookCount(bookResponse.data.total_books);

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

    const colors = ['rgb(245, 18, 67)','rgb(255, 205, 86)', 'rgb(25, 118, 210)', 'rgb(75, 192, 192)'];

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

    // Calculate percentages
    const total = userCount + bookCount + borrowReturnCount + interCount;
    const percentages = [
        ((userCount / total) * 100).toFixed(2) || 0,
        ((bookCount / total) * 100).toFixed(2) || 0,
        ((borrowReturnCount / total) * 100).toFixed(2) || 0,
        ((interCount / total) * 100).toFixed(2) || 0,
    ];

    return (
        <>
            <MainLayout />
            <div className="body-home">
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

                    <Row>
                        <Col md={6}>
                            <div className="chart">
                                <Pie data={chartData} options={chartOptions} />
                            </div>
                        </Col>
                        <Col md={6} className="nhanxet">
                            <h3 className="title-nhanxet">Thông tin nhận xét</h3>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Danh mục</th>
                                        <th>Số lượng</th>
                                        <th>Tỷ lệ (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Người dùng</td>
                                        <td>{userCount}</td>
                                        <td>{percentages[0]}%</td>
                                    </tr>
                                    <tr>
                                        <td>Sách</td>
                                        <td>{bookCount}</td>
                                        <td>{percentages[1]}%</td>
                                    </tr>
                                    <tr>
                                        <td>Mượn trả</td>
                                        <td>{borrowReturnCount}</td>
                                        <td>{percentages[2]}%</td>
                                    </tr>
                                    <tr>
                                        <td>Lượt tương tác</td>
                                        <td>{interCount}</td>
                                        <td>{percentages[3]}%</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                    <Footer />
                </div>
            </div>
        </>
    );
};

export default TongQuan;
