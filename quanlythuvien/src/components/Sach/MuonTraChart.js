import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import MainLayout from '../../components/Navbar/MainLayout';
import Footer from '../../components/Footer/Footer';
import { authApi, endpoints } from '../../configs/API';
import { Chart as ChartJS, CategoryScale, BarElement, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';
import './MuonTraChart.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
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
    const [categoryStats, setCategoryStats] = useState([]);
    const [ageStatistics, setAgeStatistics] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [borrowedStatistics, setBorrowedStatistics] = useState([]);
    const half = Math.ceil(borrowedStatistics.length / 2);
    const firstHalf = borrowedStatistics.slice(0, half);
    const secondHalf = borrowedStatistics.slice(half);

    useEffect(() => {
        const fetchChartData = async () => {
            setLoading(true);
            setError(null);
            let response;
            try {
                if (chartType === 'mostBorrowed') {
                    response = await authApi().get(`${endpoints.mostBorrowed}?month=${selectedMonth}&year=${selectedYear}`);
                    const borrowedData = response.data || [];

                    const labels = borrowedData.map(item => item.tenSach);
                    const borrowCounts = borrowedData.map(item => item.total_borrow_count);

                    setBorrowedStatistics(response.data);

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: 'Số lượt mượn',
                                data: borrowCounts,
                                backgroundColor: 'rgba(75, 192, 192, 0.3)',
                                borderColor: 'rgba(75, 192, 192, 0.8)',
                                borderWidth: 1,
                                fill: true,
                                tension: 0.3,
                            },
                        ],
                    });
                } else if (chartType === 'mostInteracted') // Thống kê số lượt tương tác sách 
                {
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
                                backgroundColor: 'rgb(255, 181, 197, 0.4)',
                                borderColor: 'rgb(255, 181, 197, 1)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.3,
                            },
                            {
                                label: 'Số bình luận',
                                data: commentCounts,
                                backgroundColor: 'rgb(176, 226, 255, 0.4)',
                                borderColor: 'rgb(176, 226, 255, 1)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.3,
                            },
                        ],
                    });
                    return;
                } // Thống kê số người dùng thep độ tuổi
                else if (chartType === 'ageStatistics') {
                    response = await authApi().get(endpoints.thongKeTheoDoTuoi);
                    const data = response?.data || [];

                    const sortedData = data.sort((a, b) => a.age - b.age);

                    const totalUsers = sortedData.reduce((acc, item) => acc + item.count, 0);
                    const labels = sortedData.map(item => `${item.age}`) || [];
                    const counts = sortedData.map(item => item.count) || [];

                    const percentages = sortedData.map(item => ((item.count / totalUsers) * 100).toFixed(2));

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: 'Số lượng người dùng',
                                data: counts,
                                backgroundColor: 'rgba(153, 102, 255, 0.3)',
                                borderColor: 'rgba(153, 102, 255, 1)',
                                borderWidth: 1,
                                fill: true,
                                tension: 0.3,
                            },
                        ],
                    });

                    setAgeStatistics(sortedData.map((item, index) => ({
                        age: item.age,
                        count: item.count,
                        percentage: percentages[index],
                    })));
                    return;
                }
                // So sánh mượn trả trễ giữa các tháng
                else if (chartType === 'comparison') {
                    response = await authApi().get(endpoints.borrowReturnLateStatistics);
                    const data = response?.data || {};

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
                    // Thống kê số lượng sách theo danh mục
                } else if (chartType === 'categoryStatistics') {
                    response = await authApi().get(endpoints.thongKeTheoDanhMuc);
                    const data = response?.data || [];

                    if (!Array.isArray(data)) {
                        throw new Error('Dữ liệu không phải là một mảng.');
                    }

                    const labels = data.map(item => item.tenDanhMuc) || [];
                    const counts = data.map(item => item.book_count) || [];
                    const totalBooks = counts.reduce((acc, count) => acc + count, 0);

                    const percentages = counts.map(count => ((count / totalBooks) * 100).toFixed(2));

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: 'Số lượng sách',
                                data: counts,
                                backgroundColor: 'rgba(255, 206, 86, 0.3)',
                                borderColor: 'rgba(255, 206, 86, 1)',
                                borderWidth: 1,
                                fill: true,
                                tension: 0.3,
                            },
                        ],
                    });

                    setCategoryStats(data.map((item, index) => ({
                        name: item.tenDanhMuc,
                        count: item.book_count,
                        percentage: percentages[index],
                    })));
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

        const calculatePercentage = (data) => {
            const total = data.reduce((sum, count) => sum + count, 0);
            return data.map(count => (total > 0 ? ((count / total) * 100).toFixed(2) : 0));
        };

        // Thống kê các sách theo từng tình trạng
        const fetchPieChartData = async () => {
            setPieLoading(true);
            try {
                if (chartType === 'mostStatus') {
                    const [mostReturnedResponse, mostBorrowedResponse, mostLateResponse] = await Promise.all([
                        authApi().get(endpoints.mostReturnedBooks),
                        authApi().get(endpoints.mostBorrowedBooks),
                        authApi().get(endpoints.mostLateBooks),
                    ]);

                    const returnedData = mostReturnedResponse?.data || [];
                    const borrowedData = mostBorrowedResponse?.data || [];
                    const lateData = mostLateResponse?.data || [];

                    const returnedCounts = returnedData.map(item => item.return_count);
                    const borrowedCounts = borrowedData.map(item => item.borrow_count);
                    const lateCounts = lateData.map(item => item.late_count);

                    const totalReturned = returnedCounts.reduce((sum, count) => sum + count, 0);
                    const totalBorrowed = borrowedCounts.reduce((sum, count) => sum + count, 0);
                    const totalLate = lateCounts.reduce((sum, count) => sum + count, 0);

                    const returnedPercentages = calculatePercentage(returnedCounts);
                    const borrowedPercentages = calculatePercentage(borrowedCounts);
                    const latePercentages = calculatePercentage(lateCounts);

                    const pieColors = ['#FF6384', '#36A2EB', '#FFD700', 'rgb(75, 192, 192, 0.9)', 'rgb(153, 102, 255, 0.8)'];

                    setPieChartData({
                        mostReturnedBooks: {
                            labels: returnedData.map(item => item.tenSach),
                            datasets: [{
                                data: returnedCounts,
                                backgroundColor: pieColors,
                            }],
                            percentages: returnedPercentages,
                            total: totalReturned,
                        },
                        mostBorrowedBooks: {
                            labels: borrowedData.map(item => item.tenSach),
                            datasets: [{
                                data: borrowedCounts,
                                backgroundColor: pieColors,
                            }],
                            percentages: borrowedPercentages,
                            total: totalBorrowed,
                        },
                        mostLateBooks: {
                            labels: lateData.map(item => item.tenSach),
                            datasets: [{
                                data: lateCounts,
                                backgroundColor: pieColors,
                            }],
                            percentages: latePercentages,
                            total: totalLate,
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
    }, [chartType, selectedMonth, selectedYear]);

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
                text: 'Biểu đồ quản lý các hoạt động của thư viện',
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
                        <option value="mostBorrowed">Thống kê số lần mượn sách của tháng</option>
                        <option value="mostInteracted">Thống kê số lượt tương tác</option>
                        <option value="comparison">So sánh mượn/trả/trễ các tháng</option>
                        <option value="mostStatus">Thống kê từng tình trạng sách</option>
                        <option value="categoryStatistics">Thống kê theo danh mục</option>
                        <option value="ageStatistics">Thống kê số người dùng theo độ tuổi</option>
                    </select>
                </div>

                {chartType === 'mostBorrowed' && (
                    <div className="chart-controls">
                        <h6>Chọn tháng:</h6>
                        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={i + 1}>Tháng {i + 1}</option>
                            ))}
                        </select>

                        <h6>Chọn năm:</h6>
                        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                            {Array.from({ length: 5 }, (_, i) => (
                                <option key={i} value={2020 + i}>{2020 + i}</option>
                            ))}
                        </select>
                    </div>
                )}

                {chartType === 'mostBorrowed' && (
                    <div className="category-table">
                        <h2 className="category-title">SỐ LIỆU MƯỢN SÁCH ( THÁNG {selectedMonth}/{selectedYear} )</h2>
                        <div className="table-container">
                            <div className="table-column">
                                <table className="table-danhmuc">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên sách</th>
                                            <th>Số lượng mượn</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {firstHalf.map((stat, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{stat.tenSach}</td>
                                                <td>{stat.total_borrow_count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="table-column">
                                <table className="table-danhmuc">

                                    <tbody>
                                        {secondHalf.map((stat, index) => (
                                            <tr key={index + half}>
                                                <td>{index + half + 1}</td>
                                                <td>{stat.tenSach}</td>
                                                <td>{stat.total_borrow_count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {chartType !== 'mostStatus' && (
                    <div className="chart">
                        <Line options={options} data={chartData} />
                    </div>
                )}

                {chartType === 'categoryStatistics' && (
                    <div className="category-table">
                        <div className="category-table">
                            <h2 className="category-title">NHẬN XÉT</h2>
                            <table className="table-danhmuc">
                                <thead>
                                    <tr>
                                        <th>Tên danh mục</th>
                                        <th>Số lượng sách</th>
                                        <th>%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoryStats.map((stat, index) => (
                                        <tr key={index}>
                                            <td>{stat.name}</td>
                                            <td>{stat.count}</td>
                                            <td>{stat.percentage}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {chartType === 'ageStatistics' && (
                    <div className="category-table">
                        <div className="category-table">
                            <h2 className="category-title">NHẬN XÉT</h2>
                            <table className="table-danhmuc">
                                <thead>
                                    <tr>
                                        <th>Độ tuổi</th>
                                        <th>Số lượng người dùng</th>
                                        <th>Tỷ lệ (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ageStatistics.map((stat, index) => (
                                        <tr key={index}>
                                            <td>{stat.age}</td>
                                            <td>{stat.count}</td>
                                            <td>{stat.percentage}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {chartType === 'mostStatus' && (
                    <div className="pie-charts">
                        {pieLoading ? (
                            <div className="loading">Loading pie chart...</div>
                        ) : (
                            <>
                                <div className="pie-chart">
                                    <h2>Biểu đồ số lượng sách được trả</h2>
                                    <Pie options={pieOptions} data={pieChartData.mostReturnedBooks} />
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Tên sách</th>
                                                <th>Số lượng</th>
                                                <th>%</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pieChartData.mostReturnedBooks.labels.map((label, index) => (
                                                <tr key={index}>
                                                    <td>{label}</td>
                                                    <td>{pieChartData.mostReturnedBooks.datasets[0].data[index]}</td>
                                                    <td>{pieChartData.mostReturnedBooks.percentages[index]}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="pie-chart">
                                    <h2>Biểu đồ số lượng sách được mượn</h2>
                                    <Pie options={pieOptions} data={pieChartData.mostBorrowedBooks} />
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Tên sách</th>
                                                <th>Số lượng</th>
                                                <th>%</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pieChartData.mostBorrowedBooks.labels.map((label, index) => (
                                                <tr key={index}>
                                                    <td>{label}</td>
                                                    <td>{pieChartData.mostBorrowedBooks.datasets[0].data[index]}</td>
                                                    <td>{pieChartData.mostBorrowedBooks.percentages[index]}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="pie-chart">
                                    <h2>Biểu đồ số lượng sách bị trễ</h2>
                                    <Pie options={pieOptions} data={pieChartData.mostLateBooks} />
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Tên sách</th>
                                                <th>Số lượng</th>
                                                <th>%</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pieChartData.mostLateBooks.labels.map((label, index) => (
                                                <tr key={index}>
                                                    <td>{label}</td>
                                                    <td>{pieChartData.mostLateBooks.datasets[0].data[index]}</td>
                                                    <td>{pieChartData.mostLateBooks.percentages[index]}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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