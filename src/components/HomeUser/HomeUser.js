import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./HomeUser.css"
import Book from "../../Book/Books";

const HomeUser = () => {
    const [books, setBooks] = useState([]);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            await axios.get("http://localhost:8080/api/books").then((e) => {
                setBooks(e.data);
            });
        };
        fetchBook();
        return () => {
            setUpdate(false);
        };
    }, [update]);

    return (
        <div>
            <div className="bg-[#78909c] p-[36px]">
                <div className="content-container">
                    <div className="section-title">Danh Sách Truyện Sách</div>
                    <div className="book-grid">
                        {books.length !== 0 &&
                            books.map((book) => (
                                <div key={book.id} className="book-wrapper">
                                    <Link to={`/book/${book.id}`} className="book-link">
                                        <Book data={book} />
                                    </Link>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default HomeUser;