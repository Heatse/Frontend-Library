import React, { useContext } from "react";
import { LoginContext } from "./Context/LoginProvider";
import Header from "./Header/Header";
import HomeAdmin from "./HomeAdmin/HomeAdmin";
import HomeUser from "./HomeUser/HomeUser";






const Home = () => {
    const context = useContext(LoginContext);
    return (
        <>
            <Header />
            {context.admin ? <HomeAdmin /> : <HomeUser />}
        </>
    );
};

export default Home;