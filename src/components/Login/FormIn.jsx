import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./FormIn.module.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../Context/LoginProvider";
import { Alert, Collapse, IconButton } from "@mui/material";
import { Close, Home } from "@mui/icons-material";

const FormIn = ({ gen = "login" }) => {
    const cx = classNames.bind(styles);

    const [seePass, setSeePass] = useState(false);
    const [savePass, setSavePass] = useState(false);
    const [open, setOpen] = useState(false);

    const [user, setUser] = useState({
        username: "",
        password: "",
        email: "",
        name: "",
    });
    const [mess, setMess] = useState("");

    const redirect = useNavigate();

    const context = useContext(LoginContext);

    useEffect(() => {
        context.handleCookie();
        console.log(context.active);
        if (context.active) {
            redirect("/");
        } else {
            // Retrieve saved login information from storage
            const savedUsername = localStorage.getItem("username");
            if (savedUsername) {
                setUser((prev) => ({ ...prev, username: savedUsername }));
                setSavePass(true);
            }
        }

        return () => {
            setOpen(false);
        };
    }, [gen, context.active]);

    const handleChange = (e) => {
        const value = e.target.value;
        setUser({ ...user, [e.target.name]: value });
    };
    const handleLogin = async () => {
        try {
            await axios
                .post("http://localhost:8080/api/auth/signin", {
                    username: user.username,
                    password: user.password,
                })
                .then((e) => {
                    context.setUser(e.data);
                    context.setActive(true);
                    if (e.data.role === "admin") {
                        context.setAdmin(true);
                    } else {
                        context.setAdmin(false);
                    }
                    redirect("/");
                })
                .then(() => {
                    if (savePass) {
                        context.deleteCookie();
                        document.cookie = `username=${user.username}; max-age=43200`;
                    } else {
                        context.deleteCookie();
                    }
                })
                .catch((e) => {
                    if (e.response.data === "Not found") {
                        setMess("Vui lòng điền đầy đủ thông tin!");
                    } else if (e.response.data === "Wrong") {
                        setMess("Tài khoản hoặc mật khẩu không đúng!");
                        setUser((prev) => ({ ...prev, password: "" }));
                    } else {
                        setMess("Đã xảy ra lỗi đăng nhập!");
                    }
                    setOpen(true);
                });
        } catch (e) {
            setMess("Đã xảy ra lỗi đăng nhập!");
            setOpen(true);
        }
    };

    const handleSignup = async () => {
        try {
            await axios
                .post("http://localhost:8080/api/auth/signup", {
                    name: user.name,
                    username: user.username,
                    password: user.password,
                    email: user.email,
                })
                .then((e) => {
                    setMess("Đăng kí thành công!");
                    setOpen(true);
                })
                .catch((e) => {
                    if (e.response.data === "Not blank") {
                        setMess("Vui lòng điền đầy đủ thông tin!");
                    } else if (e.response.data === "Username more than 5 characters and less 20 characters") {
                        setMess("Tên tài khoản lớn hơn 5 kí tự và nhỏ hơn 20 kí tự");
                    } else if (e.response.data === "Email not format") {
                        setMess("Email không đúng định dạng");
                        setUser((prev) => ({ ...prev, email: "" }));
                    } else if (e.response.data === "Username exist") {
                        setMess("Tên tài khoản đã tồn tại!");
                        setUser((prev) => ({ ...prev, username: "" }));
                    } else if (e.response.data === "Email exist") {
                        setMess("Email đã tồn tại!");
                        setUser((prev) => ({ ...prev, email: "" }));
                    }
                    setOpen(true);
                });
        } catch (e) {
            setMess("Đã xảy ra lỗi hiện tại không thể đăng kí!");
            setOpen(true);
        }
    };
    return (
        <>
            <Link to="/">
                <p className="absolute bg-[#3a2b2b] text-white text-[16px] px-[8px] py-[4px] rounded-[4px] cursor-pointer">
                    Trang chủ <Home />
                </p>
            </Link>
            <div className={cx("container")}>

                <div className={cx(`${gen === "signup" ? "loginSign" : "login"}`)}>
                    <div className={cx("login-box")}>
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
                                        mb: "2px",
                                        backgroundColor: "#312727",
                                        width: "100%",
                                        margin: "0 auto",
                                        color: "#fff",
                                    }}>
                                    {mess}
                                </Alert>
                            </Collapse>
                        )}
                        <h2 className="text-center text-[32px] font-bold uppercase">
                            {gen === "login" ? "Đăng nhập" : "Đăng Ký"}
                        </h2>
                        {gen === "signup" && (
                            <>
                                <div className={cx("input-box")}>
                                    <i class="bx bxs-user"></i>
                                    <input type="text" required name="name" value={user.name} onChange={handleChange} />
                                    <label>Họ và Tên</label>
                                </div>
                            </>
                        )}
                        <div className={cx("input-box")}>
                            <i class="bx bxs-user-account"></i>
                            <input type="text" required name="username" value={user.username} onChange={handleChange} />
                            <label>Tên tài khoản</label>
                        </div>
                        <div className={cx("input-box")}>
                            <div className="cursor-pointer">
                                {seePass ? (
                                    <i class="bi bi-eye-fill" onClick={() => setSeePass(false)}></i>
                                ) : (
                                    <i class="bi bi-eye-slash-fill" onClick={() => setSeePass(true)}></i>
                                )}
                            </div>
                            <input
                                type={seePass ? "text" : "password"}
                                required
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                            />
                            <label>Mật khẩu</label>
                        </div>
                        {gen === "signup" && (
                            <div className={cx("input-box")}>
                                <i class="bx bxs-envelope"></i>
                                <input type="text" required name="email" value={user.email} onChange={handleChange} />
                                <label>Email</label>
                            </div>
                        )}
                        {gen === "login" && (
                            <>
                                <div className="flex w-[310px] mt-[-2px] mb-[26px]">
                                    <input
                                        type="checkbox"
                                        value={savePass}
                                        onChange={() => {
                                            setSavePass((prev) => !prev);
                                            console.log(savePass);
                                        }}
                                        className="mr-[6px] mt-[2px]"
                                    />{" "}
                                    Lưu mật khẩu
                                </div>
                                <div className="flex justify-between w-[310px]">
                                    <p className="cursor-pointer text-[#ccc] hover:text-[#fff]">Quên mật khẩu?</p>
                                    <Link to="/signup">
                                        <p className="cursor-pointer text-[#ccc] hover:text-[#50d0d8]">Đăng ký</p>
                                    </Link>
                                </div>
                                <div
                                    className="mt-[32px] w-[200px] py-[8px] bg-[#fff] text-[#3a2b2b] rounded-[6px] font-semibold text-center cursor-pointer"
                                    onClick={handleLogin}>
                                    Đăng nhập
                                </div>
                            </>
                        )}
                        {gen === "signup" && (
                            <>
                                <div className="flex justify-end w-[310px] mt-[10px]">
                                    <Link to="/login">
                                        <p className="cursor-pointer text-[#ccc] hover:text-[#50d0d8]">Đăng nhập</p>
                                    </Link>
                                </div>
                                <div
                                    className="mt-[20px] w-[200px] py-[8px] bg-[#fff] text-[#3a2b2b] rounded-[6px] text-center font-semibold cursor-pointer"
                                    onClick={handleSignup}>
                                    Đăng ký
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FormIn;