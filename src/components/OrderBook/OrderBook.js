import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header/Header";
import './Order.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

const OrderBook = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [update, setUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const getOrders = async () => {
            await axios.get(`http://localhost:8080/api/order/${userId}`).then((e) => {
                setOrders(e.data);
            });
        };
        getOrders();
        return () => {
            setUpdate(false);
        };
    }, [update, userId]);


    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8080/api/order/${id}`);
        setOpen(false);
        setUpdate(true);
        toast.success("Hủy đặt mua thành công!", {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    };


    return (

        <>
            <Header />
            <div className="bg-[#78909c] p-[36px]">
                <div className="mt-[5px] flex justify-center text-[25px]">
                    <p >Giỏ Hàng</p>
                </div>
                <div className="content-container">
                    <div className="flex justify-end mr-[15px] mt-[20px]">
                        <p className="mt-[20px] mb-[-100px]">{orders.length} sản phẩm trong giỏ</p>
                    </div>
                    <div className="py-[10%] ml-[10px] mr-[10px]">
                        <table className="ordered-table table-bordered">
                            <thead>
                                <tr className="text-center">
                                    <th>Tiêu đề</th>
                                    <th>Giá</th>
                                    <th>Giờ</th>
                                    <th>Ngày</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-[8px] md:text-[12px] lg:text-[14px] text-center">
                                {orders.length !== 0 &&
                                    orders.map((order) => (
                                        <tr>
                                            <th className="w-[12.5%] my-[8px] border-b-8 border-l-2 border-[#ccbbbb42]">
                                                {order.booktitle}
                                            </th>
                                            <th className="w-[10%] my-[8px] border-b-8 border-[#ccbbbb42]">
                                                {order.total}
                                            </th>
                                            <th className="w-[8%] my-[8px] border-b-8 border-[#ccbbbb42]">
                                                {order.time}
                                            </th>
                                            <th className="w-[15%] my-[8px] border-b-8 border-[#ccbbbb42]">
                                                {order.date}
                                            </th>
                                            <th className="w-[14.5%] my-[8px] border-b-8 border-r-2 border-[#ccbbbb42]">
                                                <div>
                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            fontSize: { xs: "10px", lg: "16px" },
                                                            marginTop: { xs: "16px", sm: "0px" },
                                                            width: { xs: "90%", sm: "auto" },
                                                        }}
                                                        onClick={() => setOpen(true)}>
                                                        Hủy

                                                        <Dialog
                                                            open={open}
                                                            onClose={() => setOpen(false)}
                                                        >
                                                            <DialogTitle >{"Bạn có muốn hủy đặt mua?"}</DialogTitle>
                                                            <DialogActions>
                                                                <Button onClick={() => setOpen(false)}>Không</Button>
                                                                <Button onClick={() => handleDelete(order.id)}>
                                                                    Đồng ý
                                                                </Button>
                                                            </DialogActions>
                                                        </Dialog>
                                                    </Button>
                                                </div>
                                            </th>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div >
        </>
    );
};

export default OrderBook;
