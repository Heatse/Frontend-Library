import React, { useContext, useEffect } from "react"
import logo from "../../images/logo.avif"
import { Link } from "react-router-dom"
import { LoginContext } from "../Context/LoginProvider";




const Search = () => {


    const context = useContext(LoginContext);

    useEffect(() => {
        context.handleCookie();
    }, []);

    return (
        <>
            <section className='search'>
                <div className='container c_flex'>
                    <div>
                        <Link to="/home">
                            <div className="cursor-pointer flex items-center">
                                <img src={logo} alt="logo" className="w-[20px] h-[20px] md:w-[50px] md:h-[50px]" />
                                <h1 className="ml-2 text-[20px]" >WebBook.vn</h1>
                            </div>

                        </Link>
                    </div>

                    <div className='search-box f_flex'>
                        <i className='fa fa-search'></i>
                        <input type='text' placeholder='Search and hit enter...' />
                        <span>All Category</span>
                    </div>

                    <div className='icon f_flex width'>
                        {context.active ? (
                            <>
                                <p className="text-[18px] ml-[-5px] mt-[10px]">Xin chào {context.getLastName()}!</p>
                                <div class="dropdown">

                                    <div
                                        class="fa fa-user icon-circle dropdown-toggle"
                                        type="button"
                                        id="dropdownMenuButton"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >

                                    </div>
                                    <div
                                        class="dropdown-menu"
                                        aria-labelledby="dropdownMenuButton"
                                    >
                                        <a class="dropdown-item" href="/profile">
                                            Profile
                                        </a>
                                        <a class="dropdown-item" href="/home"
                                            onClick={context.handleLogout}>
                                            Đăng xuất
                                        </a>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="cursor-pointer flex items-center">
                                    <li className="nav-item">
                                        <a className="btn btn-danger mr-3 rounded-[16px] bg-red-500 " href="/login">Đăng Nhập</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="btn btn-danger rounded-[16px] bg-white text-red-500 hover:text-red-500" href="/signup">Đăng Kí</a>
                                    </li>
                                </div>
                            </>
                        )}
                        <div className='cart'>
                            <Link to='/ordered'>
                                <i className='fa fa-shopping-cart icon-circle'></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Search