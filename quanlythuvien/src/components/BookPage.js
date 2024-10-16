import React from 'react';
import { Helmet } from 'react-helmet';

const BookPage = ({ book }) => {
    return (
        <div>
            <Helmet>
                <meta property="og:title" content={book.tenSach} />
                <meta property="og:description" content={book.message} />
                <meta property="og:image" content={book.anhSach_url} />
                <meta property="og:url" content={`http://localhost:3000/sach/${book.id}`} />
            </Helmet>
            {/* Nội dung hiển thị cuốn sách */}
        </div>
    );
};

export default BookPage;