import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Button, Collapse, Dialog, DialogActions, DialogTitle, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";

const BookDetail = () => {
    const { id } = useParams();
    let action = "Thêm";
    if (id !== "0") {
        action = "Sửa";
    }

    const [book, setBook] = useState({
        title: "",
        author: "",
        description: "",
        imgBook: "",
        releaseDate: "",
        length: "",
        price: "",
        genre: "",
    });

    const [mess, setMess] = useState("");
    const [disable, setDisable] = useState(action === "Sửa" ? true : false);
    const [open, setOpen] = useState(true);
    const [ask, setAsk] = useState(false);

    useEffect(() => {
        const getBook = async () => {
            await axios
                .get(`http://localhost:8080/api/book/${id}`)
                .then((e) => {
                    setBook(e.data);
                })
                .then((e) => { }
                );
        };
        if (id !== "0") {
            getBook();
        }
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        setBook({
            ...book,
            [e.target.name]: value,
        });
    };
    const handleAdd = async () => {
        await axios({
            method: "post",
            url: "http://localhost:8080/api/book",
            data: {
                title: book.title,
                file: book.imgBook,
                author: book.author,
                description: book.description,
                releaseDate: book.releaseDate,
                length: book.length,
                price: book.price,
                genre: book.genre,
            },
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((e) => {
                setMess(`${action} thành công!!`);
                setBook({
                    title: "",
                    author: "",
                    description: "",
                    imgBook: "",
                    releaseDate: "",
                    length: "",
                    price: "",
                    genre: "",
                });
                setAsk(false);
                setOpen(true);
                document.documentElement.scrollTop = 0;
            })
            .catch((e) => {
                if (e.response.data === "Not found") {
                    setMess("Hãy nhập hết các giá trị còn trống");
                } else if (e.response.data === "Book exist") {
                    setMess("Sách đã tồn tại");
                }
                setOpen(true);
                setAsk(false);
                document.documentElement.scrollTop = 0;
            });
    };

    const handleUpdate = async () => {
        await axios
            .put(`http://localhost:8080/api/book/${book.id}`, {
                title: book.title,
                author: book.author,
                description: book.description,
                releaseDate: book.releaseDate,
                length: book.length,
                price: book.price,
                genre: book.genre,
            })
            .then((e) => {
                axios({
                    method: "post",
                    url: `http://localhost:8080/api/book/${book.id}/bookImg`,
                    data: {
                        file: book.imgBook,
                    },
                    headers: { "Content-Type": "multipart/form-data" },
                }).then((e) => {
                    setMess("Cập nhật thành công !!");
                    setOpen(true);
                    document.documentElement.scrollTop = 0;
                });
            })
            .catch((e) => {
                if (e.response.data === "Not found") {
                    setMess("Hãy nhập hết các giá trị còn trống");
                } else if (e.response.data === "Book exist") {
                    setMess("Sách đã tồn tại");
                }
                setOpen(true);
                document.documentElement.scrollTop = 0
            });
    };
    return (
        <>
            <Header />
            <div className="pt-[20px] bg-[#78909c]">
                <span className="block text-center w-full text-[48px] font-bold font-serif mt-[0]">Sách</span>
                {mess !== "" && (
                    <Collapse in={open} className="mb-[8px]">
                        <Alert
                            severity="info"
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setOpen(false);
                                    }}>
                                    <Close fontSize="inherit" />
                                </IconButton>
                            }
                            sx={{
                                mb: "8px",
                                backgroundColor: "#312727",
                                width: "40%",
                                margin: "0 auto",
                                color: "#fff",
                            }}>
                            {mess}
                        </Alert>
                    </Collapse>
                )}
                <div className="block md:flex max-w-[1180px] w-[100%] px-[40px] bg-violet-500 py-[20px] mx-[auto]">
                    <div className="flex-1 mr-[60px]">
                        <div className="sm:flex">
                            <div className="flex-1 sm:pr-[24px] ">
                                <label for="name" className="text-white font-semibold">
                                    Tiêu đề
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="name"
                                    className="w-full px-[5px] py-[3px] outline-none mt-2"
                                    placeholder="Nhập tiêu đề"
                                    value={book.title}
                                    onChange={handleChange}
                                    disabled={disable}
                                    required
                                />
                            </div>
                            <div className="flex-1 mt-[14px] sm:mt-[0] sm:pl-[24px]">
                                <label for="author" className="text-white font-semibold">
                                    Tác giả
                                </label>
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    className="w-full px-[5px] py-[3px] outline-none mt-2"
                                    placeholder="Nhập tác giả"
                                    onChange={handleChange}
                                    value={book.author}
                                    disabled={disable}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-[16px]">
                            <label for="description" className="text-white font-semibold">
                                Mô tả về sách
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows="6"
                                cols="20"
                                placeholder="Nhập mô tả sách"
                                onChange={handleChange}
                                value={book.description}
                                disabled={disable}
                                className="w-full outline-none px-[4px] mt-2"></textarea>
                        </div>
                        <div className="block sm:flex mt-[16px]">
                            <div className="flex-1 sm:pr-[24px] ">
                                <label for="releaseDate" className="text-white font-semibold">
                                    Ngày phát hành
                                </label>
                                <input
                                    type="text"
                                    id="releaseDate"
                                    name="releaseDate"
                                    className="w-full px-[5px] py-[3px] outline-none mt-2"
                                    placeholder="Nhập ngày phát hành"
                                    onChange={handleChange}
                                    value={book.releaseDate}
                                    disabled={disable}
                                    required
                                />
                            </div>
                            <div className="flex-1 mt-[14px] sm:mt-[0] sm:pl-[24px]">
                                <label for="length" className="text-white font-semibold">
                                    Số trang
                                </label>
                                <input
                                    type="text"
                                    id="length"
                                    name="length"
                                    placeholder="Nhập số trang"
                                    onChange={handleChange}
                                    value={book.length}
                                    disabled={disable}
                                    className="w-full px-[5px] py-[3px] outline-none mt-2"
                                />
                            </div>
                        </div>

                        <div className="block sm:flex mt-[16px]">
                            <div className="flex-1 sm:pr-[24px] ">
                                <label for="releaseDate" className="text-white font-semibold">
                                    Giá Sách
                                </label>
                                <input
                                    type="text"
                                    id="price"
                                    name="price"
                                    className="w-full px-[5px] py-[3px] outline-none mt-2"
                                    placeholder="Nhập giá sách"
                                    onChange={handleChange}
                                    value={book.price}
                                    disabled={disable}
                                    required
                                />
                            </div>
                            <div className="flex-1 mt-[14px] sm:mt-[0] sm:pl-[24px]">
                                <label for="genre" className="text-white font-semibold">
                                    Thể loại
                                </label>
                                <select
                                    type="text"
                                    id="genre"
                                    name="genre"
                                    value={book.genre}
                                    onChange={handleChange}
                                    disabled={disable}
                                    className="w-full px-[5px] py-[3px] outline-none mt-2"
                                >
                                    <option disabled={disable} ><b>Tiểu Thuyết</b></option>
                                    <option disabled={disable} ><b>Commic</b></option>
                                    <option disabled={disable}><b>Trinh thám</b></option>
                                    <option disabled={disable}><b>Ngôn tình</b></option>
                                    <option disabled={disable}><b>Lịch sử</b></option>

                                </select>
                            </div>
                        </div>


                    </div>
                    <div className="flex-1 mt-[30px] mb-[20px] md:mb-[0px] md:mt-[0px] ">
                        <input
                            type="file"
                            onChange={(e) => setBook((prev) => ({ ...prev, imgBook: e.target.files[0] }))}
                            multiple
                            disabled={disable}
                            className="cursor-pointer text-white mb-[10px]"
                        />
                        <br />
                        {book.imgBook && (
                            <div>
                                <img
                                    src={book.imgBook === Object(book.imgBook)
                                        ? URL.createObjectURL(book.imgBook)
                                        : book.imgBook}
                                    alt="IMG preview"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end mt-[50px] py-[20px] px-[86px] w-full bg-[#3a2929] text-white">
                    {action === "Thêm" ? (
                        <>
                            <input
                                type="submit"
                                value={action}
                                className="cursor-pointer uppercase text-[20px] font-semibold px-[18px] py-[4px] bg-[#3a57b2] rounded-[8px] hover:bg-[#203988]"
                                onClick={() => setAsk(true)}
                            />
                            <Dialog
                                open={ask}
                                onClose={() => setAsk(false)}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description">
                                <DialogTitle id="alert-dialog-title">{"Bạn có muốn thêm sách?"}</DialogTitle>
                                <DialogActions>
                                    <Button onClick={() => setAsk(false)}>Không</Button>
                                    <Button onClick={handleAdd} autoFocus>
                                        Đồng ý
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </>
                    ) : (
                        <>
                            {disable ? (
                                <input
                                    type="submit"
                                    value="Sửa"
                                    className="cursor-pointer uppercase text-[20px] font-semibold px-[18px] py-[4px] bg-[#3a57b2] rounded-[8px] hover:bg-[#203988]"
                                    onClick={() => setDisable((prev) => !prev)}
                                />
                            ) : (
                                <input
                                    type="submit"
                                    value="Cập nhập"
                                    className="cursor-pointer uppercase text-[20px] font-semibold px-[18px] py-[4px] bg-[#3a57b2] rounded-[8px] hover:bg-[#203988]"
                                    onClick={handleUpdate}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default BookDetail;