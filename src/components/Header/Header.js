import React from "react"
import "./Header.css"
import "../GridSystem/Grid.css"
import Head from "./Head"
import Search from "./Search"

const Header = ({ CartItem }) => {
    return (
        <>
            <Head />
            <Search />

        </>
    )
}

export default Header