import React, { useContext } from 'react'
import OrderBook from './OrderBook'
import { LoginContext } from "../Context/LoginProvider";

const Order = () => {
    const context = useContext(LoginContext);
    const id = context.user.id;


    return (
        <div>
            <OrderBook userId={id}></OrderBook>
        </div>
    )
}

export default Order
