import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import MainLayout from '../../components/Navbar/MainLayout';
import Footer from '../../components/Footer/Footer';
import { authApi, endpoints } from '../../configs/API';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';
import './MuonTraChart.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

const MuonTraChart = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState('mostBorrowed');
    const [error, setError] = useState(null);
    const [pieChartData, setPieChartData] = useState({
        mostReturnedBooks: { labels: [], datasets: [] },
        mostBorrowedBooks: { labels: [], datasets: [] },
        mostLateBooks: { labels: [], datasets: [] },
    });
    const [pieLoading, setPieLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
            setLoading(true);
            setError(null);
            try {
                let response;

                if (chartType === 'mostBorrowed') {
                    response = await authApi().get(endpoints.mostBorrowed);
                } else if (chartType === 'mostInteracted') {
                    const [likedResponse, commentedResponse] = await Promise.all([
                        authApi().get(endpoints.mostLiked),
                        authApi().get(endpoints.mostCommented),
                    ]);

                    const likedData = likedResponse?.data || [];
                    const commentedData = commentedResponse?.data || [];

                    const labels = likedData.map(item => item.tenSach);
                    const likeCounts = likedData.map(item => item.like_count);
                    const commentCounts = commentedData.map(item => item.comment_count);

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: 'Số lượt thích',
                                data: likeCounts,
                                backgroundColor: 'rgb(255, 181, 197, 0.3)',
                                borderColor: 'rgb(255, 181, 197, 1)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.3,
                            },
                            {
                                label: 'Số bình luận',
                                data: commentCounts,
                                backgroundColor: 'rgb(176, 226, 255, 0.3)',
                                borderColor: 'rgb(176, 226, 255, 1)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.3,
                            },
                        ],
                    });
                    return;
                } else if (chartType === 'comparison') {
                    response = await authApi().get(endpoints.borrowReturnLateStatistics);
                    const data = response?.data || {};

                    // Extracting statistics for the last 12 months
                    const labels = data.monthly_statistics?.map(stat => `${stat.month}/${stat.year}`) || [];
                    const borrowedCounts = data.monthly_statistics?.map(stat => stat.borrowed) || [];
                    const returnedCounts = data.monthly_statistics?.map(stat => stat.returned) || [];
                    const lateCounts = data.monthly_statistics?.map(stat => stat.late) || [];

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: 'Số lần mượn',
                                data: borrowedCounts,
                                backgroundColor: 'rgba(75,192,192,0.6)',
                                borderColor: 'rgba(75,192,192,1)',
                                borderWidth: 1,
                            },
                            {
                                label: 'Số lần trả',
                                data: returnedCounts,
                                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                                borderColor: 'rgba(255, 206, 86, 1)',
                                borderWidth: 1,
                            },
                            {
                                label: 'Số lần trễ',
                                data: lateCounts,
                                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1,
                            },
                        ],
                    });
                    return;
                }

                const data = response?.data || [];
                const labels = data.map(item => item.tenSach);
                const counts = data.map(item => item.total_borrow_count);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Số lần mượn trả',
                            data: counts,
                            backgroundColor: 'rgba(75,192,192,0.3)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.3,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching data:', error.response?.data || error.message);
                setError('Failed to load chart data.');
            } finally {
                setLoading(false);
            }
        };

        const fetchPieChartData = async () => {
            setPieLoading(true);
            try {
                // Only fetch data if the chartType is 'mostStatus'
                if (chartType === 'mostStatus') {
                    const [mostReturnedResponse, mostBorrowedResponse, mostLateResponse] = await Promise.all([
                        authApi().get(endpoints.mostReturnedBooks),
                        authApi().get(endpoints.mostBorrowedBooks),
                        authApi().get(endpoints.mostLateBooks),
                    ]);

                    const returnedData = mostReturnedResponse?.data || [];
                    const borrowedData = mostBorrowedResponse?.data || [];
                    const lateData = mostLateResponse?.data || [];

                    const returnedLabels = returnedData.map(item => item.tenSach);
                    const returnedCounts = returnedData.map(item => item.return_count);

                    const borrowedLabels = borrowedData.map(item => item.tenSach);
                    const borrowedCounts = borrowedData.map(item => item.borrow_count);

                    const lateLabels = lateData.map(item => item.tenSach);
                    const lateCounts = lateData.map(item => item.late_count);

                    const pieColors = ['#FF6384', '#36A2EB', '#FFD700', 'rgb(75, 192, 192, 0.9)', 'rgb(153, 102, 255, 0.8)'];

                    setPieChartData({
                        mostReturnedBooks: {
                            labels: returnedLabels,
                            datasets: [{
                                data: returnedCounts,
                                backgroundColor: pieColors,
                            }],
                        },
                        mostBorrowedBooks: {
                            labels: borrowedLabels,
                            datasets: [{
                                data: borrowedCounts,
                                backgroundColor: pieColors,
                            }],
                        },
                        mostLateBooks: {
                            labels: lateLabels,
                            datasets: [{
                                data: lateCounts,
                                backgroundColor: pieColors,
                            }],
                        },
                    });
                }
            } catch (error) {
                console.error('Error fetching pie chart data:', error.response?.data || error.message);
                setError('Failed to load pie chart data.');
            } finally {
                setPieLoading(false);
            }
        };

        fetchChartData();
        fetchPieChartData();
    }, [chartType]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Biểu đồ quản lý hoạt động về sách của thư viện',
            },
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Biểu đồ quản lý tình trạng sách',
            },
        },
        cutout: '0%',
    };

    return (
        <>
            <MainLayout />
            <div className="chart-container">
                <h1>BÁO CÁO THỐNG KÊ CỦA THƯ VIỆN</h1>

                <h6>Chọn loại thống kê: </h6>
                <div className="select-container">
                    <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                        <option value="mostBorrowed">Thống kê số lần mượn sách</option>
                        <option value="mostInteracted">Thống kê số lượt tương tác</option>
                        <option value="comparison">So sánh mượn/trả/trễ các tháng</option>
                        <option value="mostStatus">Thống kê từng tình trạng sách</option>
                    </select>
                </div>

                {chartType !== 'mostStatus' && (
                    <div className="chart">
                        <Line options={options} data={chartData} />
                    </div>
                )}

                {chartType === 'mostStatus' && (
                    <div className="pie-charts">
                        {pieLoading ? (
                            <div className="loading">Loading pie chart...</div>
                        ) : (
                            <>
                                <div class="pie-chart">
                                    <h2>Biểu đồ số lượng sách được trả</h2>
                                    <Pie options={pieOptions} data={pieChartData.mostReturnedBooks} />
                                </div>
                                <div class="pie-chart">
                                    <h2>Biểu đồ số lượng sách được mượn</h2>
                                    <Pie options={pieOptions} data={pieChartData.mostBorrowedBooks} />
                                </div>
                                <div class="pie-chart">
                                    <h2>Biểu đồ số lượng sách bị trễ</h2>
                                    <Pie options={pieOptions} data={pieChartData.mostLateBooks} />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default MuonTraChart;
