import React from "react";

import "./Book.css";


const Book = ({ data, width = "192px", height = "370px" }) => {
    return (
        <div class="book font-mono">
            <div class="inline-block cursor-pointer book-card">
                <div class="relative">
                    <div class="tab">
                        <img
                            src={data.imgBook}
                            alt=""
                            class="rounded-image"
                        />
                    </div>
                </div>
                <div class="block text-start text-sm px-2 truncate">
                    <span class="truncate">{data.title}</span>
                    <h4 class="text-sm">{data.author}</h4>
                    <h4>Thể loại: {data.genre}</h4>
                    <h1 class="text-xl md:text-[25px] font-extrabold text-orange-400">{data.price}</h1>
                    <p>Đã bán: {data.sold}</p>
                </div>
            </div>
        </div>
    );
};

export default Book;