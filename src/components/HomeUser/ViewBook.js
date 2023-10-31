import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Tabs } from 'antd';
import { Button, ButtonGroup, Slide, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { LoginContext } from "../Context/LoginProvider";
import Header from "../Header/Header";
import ReactUser from "./ReactUser";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flag } from "@mui/icons-material";


const { TabPane } = Tabs;

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ViewBook = () => {
    const { id } = useParams();
    const context = useContext(LoginContext);
    const [book, setBook] = useState();
    const [sold, setSold] = useState(1);
    const [messSold, setMessSold] = useState("");
    const [openSoldDialog, setOpenSoldDialog] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);




    useEffect(() => {
        const getBook = async () => {
            await axios.get(`http://localhost:8080/api/book/${id}`).then((e) => {
                setBook(e.data);
            });
        };
        getBook();
    }, [id]);

    const handleSold = async () => {
        if (context.active) {
            await axios
                .post(`http://localhost:8080/api/book/sold/${id}`, {
                    sold: 1,
                })
                .then(() => {
                    setMessSold("Cảm ơn bạn đã mua hàng!");
                    setOpenSoldDialog(true);
                })
                .catch(() => {
                    setMessSold("Mua hàng không thành công hãy thử lại sau!");
                    setOpenSoldDialog(true);
                });
        } else {
            setMessSold("Vui lòng đăng nhập để mua hàng");
            setOpenSoldDialog(true);
        }
    };

    const soldBonus = () => {
        if (sold < 2) {
            setSold(1);
        } else {
            setSold(sold - 1);
        }
    };

    const handleOrderBook = async () => {
        setOpenConfirmation(true);
    };

    const confirmOrder = async () => {
        await axios
            .post(`http://localhost:8080/api/order/book/${id}`, {
                userId: context.user.id,
                bookImg: book.imgBook,
                booktitle: book.title,
                total: book.price,
            })
            .then(() => {
                setMessSold("Cảm ơn bạn đã mua hàng!");
                setOpenSoldDialog(false);
                toast.success("Đặt mua thành công!", {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            })
            .catch(() => {
                setMessSold("Mua hàng không thành công hãy thử lại sau!");
                setOpenSoldDialog(true);
            });

        setOpenConfirmation(false);
    };

    const cancelOrder = () => {
        setOpenConfirmation(false);
    };

    return (
        <>
            {book && (
                <>
                    <Header />
                    <div className="bg-[#78909c]  p-[36px] text-black">
                        <div className="max-w-[1200px] mx-[auto] mt-[-20px] mb-[8px] text-[#240404]">
                            Sách Tiếng Việt {">"} {book.genre}
                        </div>
                        <div className="lg:flex max-w-[1200px] mx-[auto] bg-white rounded-[4px] p-[16px] pt-[25px]">
                            <div className="ml-[60px] lg:w-[30%]">
                                <img src={book.imgBook} alt="bìa sách" />
                            </div>
                            <div className="text-black p-[36px] pt-[0] lg:w-[70%]">
                                <span className="text-[26px] font-semibold text-red-500">{book.title}</span>
                                <div className="lg:flex mt-[20px]">
                                    <div className="lg:w-[60%]">Nhà cung cấp: <b>Nhà xuất bản</b></div>
                                    <div className="lg:w-[40%]">Tác giả: <b>{book.author}</b></div>
                                </div>

                                <div className="lg:flex my-[8px]">
                                    <div className="lg:w-[60%]">Hình thức: <b>bìa cứng</b></div>
                                    <div className="lg:w-[40%]">Số Trang: <b>{book.length}</b></div>
                                </div>

                                <div className="lg:flex my-[20px] text-9xl md:text-[30px] text-red-600 font-sans">
                                    <div className="lg:w-[80%] text-[26px] font-semibold"> {book.price}</div>
                                </div>

                                <div className="w-full mt-[12px]">
                                    <h4 className="inline-block">Chính sách đổi trả:</h4>
                                    <p className="ml-[2px] inline-block"><b>Đổi trả sản phẩm trong vòng 30 ngày</b></p>
                                </div>
                                <div className="mt-[15px]">
                                    <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                        <Button onClick={soldBonus}>-</Button>
                                        <input
                                            type="text"
                                            value={sold}
                                            className="w-[60px] text-[#000] text-center outline-none font-semibold"
                                        />
                                        <Button onClick={() => setSold((prev) => prev + 1)}>+</Button>
                                    </ButtonGroup>
                                </div>
                                <div className="mt-[120px]">
                                    <Link to={`/ordered`}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<ShoppingCartIcon />}
                                            sx={{
                                                color: "#db6262",
                                                borderColor: "#db6262",
                                                marginRight: { lg: "20px" },
                                                "&:hover": { color: "violet" },
                                            }}>
                                            Thêm vào giỏ hàng
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            fontSize: { xs: "10px", lg: "16px" },
                                            marginTop: { xs: "16px", sm: "0px" },
                                            width: { xs: "90%", sm: "auto" },
                                        }}
                                        onClick={handleOrderBook}>
                                        Đặt Mua

                                        <Dialog open={openConfirmation} onClose={cancelOrder}>
                                            <DialogTitle>Bạn có chắc chắn muốn đặt mua sản phẩm này?</DialogTitle>
                                            <DialogActions>
                                                <Button onClick={cancelOrder}>Không</Button>
                                                <Button onClick={confirmOrder}>Có</Button>
                                            </DialogActions>
                                        </Dialog>
                                    </Button>

                                </div>
                            </div>
                        </div>
                        <div className="max-w-[1200px] mx-[auto] bg-white rounded-[4px] p-[16px] mt-[20px]">
                            <div className='mt-3 ml-3 mr-3 bs'>
                                <div className='gl' >
                                    <Tabs Tabs defaultActiveKey='1'>
                                        <TabPane tab={<div className="rounded-full bg-blue-500 px-4 py-2 text-white">Mô tả</div>} key="1">
                                            <p className="text-[16px] md:text-[18px] font-bold text-red-500">Thông tin sản phẩm</p>

                                            <table className="pb-[20px] border-b-2 border-[#777] text-[12px] md:text-[14px] w-full mt-[26px]">
                                                <colgroup className="w-[50%] md:w-[25%]"></colgroup>
                                                <tbody>
                                                    <tr>
                                                        <th className="text-start font-medium text-black">Tác giả</th>
                                                        <td><b>{book.author}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-start font-medium text-black">Thời gian phát hành</th>
                                                        <td><b>{book.releaseDate}</b></td>
                                                    </tr>

                                                    <tr>
                                                        <th className="text-start font-medium text-black">Số trang</th>
                                                        <td><b>{book.length}</b></td>
                                                    </tr>
                                                    <tr>
                                                        <th className="text-start font-medium text-black">Hình thức</th>
                                                        <td><b>Bìa Cứng</b></td>
                                                    </tr>
                                                    <tr className="h-[14px]">
                                                        <th></th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className="my-[10px] text-[12px] md:text-[15px] ">
                                                <h3 className="text-[14px] md:text-[16px] font-bold mt-[16px] mb-[12px] text-red-500">
                                                    Mô tả về sách
                                                </h3>
                                                <p>{book.description}</p>
                                            </div>

                                        </TabPane>
                                        <TabPane tab={<div className="rounded-full bg-blue-500 px-4 py-2 text-white">Đánh giá</div>} key="2">
                                            <ReactUser bookId={id} />
                                        </TabPane>

                                    </Tabs>
                                </div>

                            </div>
                        </div>
                    </div>
                </>
            )
            }
        </>
    );
};

export default ViewBook;