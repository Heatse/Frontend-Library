import { AccountCircle, Star } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    InputAdornment,
    Menu,
    MenuItem,
    Rating,
    TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../Context/LoginProvider";
import { Link } from "react-router-dom";
import axios from "axios";
import { blue } from "@mui/material/colors";

const labels = {
    1: "Tệ",
    2: "Nhàm chán",
    3: "Ổn",
    4: "Hay",
    5: "Rất hay",
};

function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const ReactUser = ({ bookId }) => {
    const context = useContext(LoginContext);
    const [update, setUpdate] = useState(false);
    const [posting, setPosting] = useState(false);
    const [noticeComment, setNoticeComment] = useState("");
    const [alertNotice, setAlertNotice] = useState(false);

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(-1);
    const [message, setMessage] = useState("");
    const [comments, setComments] = useState([]);
    const [commentShow, setCommentShow] = useState([]);

    const [page, setPage] = useState(1);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const getComments = async () => {
            await axios
                .get(`http://localhost:8080/api/book/${bookId}/reacts`)
                .then((e) => {
                    setComments(e.data);
                })
                .then(() => {
                    setCommentShow(
                        comments.filter((comment, index) => {
                            return index < 10 * page;
                        })
                    );
                });
        };
        getComments();
        return () => {
            setUpdate(false);
            setNoticeComment("");
        };
    }, [update, page]);

    const handlePost = async () => {
        setPosting(true);
        await axios
            .post(`http://localhost:8080/api/book/${bookId}/react`, {
                voted: rating,
                message: message,
                userId: context.user.id,
            })
            .then((e) => {
                setPosting(false);
                setMessage("");
                setRating(0);
                setUpdate(true);
            })
            .catch((e) => {
                setNoticeComment("Hiện tại không thể cập nhật đánh giá của bạn. Hãy thử lại sau");
                setAlertNotice(true);
            });
    };

    const handleDeleteComment = async (commentId) => {
        handleClose();
        await axios
            .delete(`http://localhost:8080/api/book/${bookId}/react/${commentId}`, {
                params: {
                    userId: context.user.id,
                },
            })
            .then((e) => {
                setUpdate(true);
            })
            .catch((e) => {
                setNoticeComment("Không thể xóa vì bạn không phải người viết đánh giá này!");
                setAlertNotice(true);
            });
    };
    return (
        <div className="max-w-[1200px] mx-[auto] bg-white rounded-[4px] p-[16px] mt-[25px]">
            <h2 className="text-[14px] md:text-[20px] font-bold">Đánh giá sản phẩm</h2>
            <div>
                {context.active ? (
                    <div className={`relative md:ml-[24px] ${posting ? "opacity-[0.8]" : ""}`}>
                        <div className="flex mt-[26px]">
                            <Rating
                                name="hover-feedback"
                                value={rating}
                                precision={1}
                                getLabelText={getLabelText}
                                onChange={(event, newValue) => {
                                    setRating(newValue);
                                }}
                                onChangeActive={(event, newHover) => {
                                    setHover(newHover);
                                }}
                                emptyIcon={<Star style={{ opacity: 0.55, color: "gray" }} fontSize="inherit" />}
                            />
                            {rating !== null && <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : rating]}</Box>}
                        </div>
                        <div className="rounded-[8px] mt-[12px] mb-[12px]">
                            <TextField
                                id="outlined-textarea"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle className="w-[10px]" />
                                        </InputAdornment>
                                    ),
                                }}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Viết bình luận..."
                                multiline
                                size="small"
                                sx={{
                                    width: { xs: "100%", md: "80%" },
                                    color: "#fff",
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    fontSize: "10px !important",
                                }}
                            />
                        </div>
                        <div
                            className="inline-block py-[6px] px-[22px] font-semibold text-[12px] text-white md:text-[16px] bg-[#2b2fc1] rounded-[4px] cursor-pointer hover:bg-[#222583]"
                            onClick={handlePost}>
                            {posting ? "Đang Đăng..." : "Đăng"}
                        </div>
                        {posting && (
                            <CircularProgress
                                size={40}
                                sx={{
                                    color: blue[400],
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    marginTop: "-12px",
                                    marginLeft: "-12px",
                                }}
                            />
                        )}
                    </div>
                ) : (
                    <h2 className="mt-[20px] text-[12px] sm:text-[14px] md:text-[16px]">
                        Để có thể đánh giá vui lòng{" "}
                        <Link to="/login" className="text-[#00d7f2] font-semibold ml-[2px]">
                            Đăng nhập
                        </Link>
                    </h2>
                )}
                <div className="bg-[#fff] text-[12px] md:text-[14px] mt-[60px] text-[#000] rounded-[3px]">
                    {comments.length === 0 ? (
                        <p className="text-[16px] py-[10px] text-center font-bold">
                            Chưa có bài đánh giá nào về cuốn sách này!!
                        </p>
                    ) : (
                        <div className="pt-[26px]">
                            <p className="px-[6px] text-[18px] md:px-[24px] w-full border-b-2 border-b-[#ccc]">
                                <b>{comments.length} Đánh Giá</b>
                            </p>
                            {commentShow.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="flex justify-between pt-[10px] pb-[14px] px-[6px] md:px-[24px]">
                                    <div className="flex">
                                        <div className="mr-[10px] md:mr-[20px]">
                                            <Avatar
                                                sx={{
                                                    width: { xs: "20px", md: "40px" },
                                                    height: { xs: "20px", md: "40px" },
                                                    cursor: "pointer",
                                                }}>
                                                {comment.username[0].toUpperCase()}
                                            </Avatar>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[12px] md:text-[16px] mb-[4px] text-[#2b2fc1] cursor-pointer">
                                                {comment.username}
                                            </p>
                                            <div className="flex">
                                                <Rating
                                                    value={comment.voted}
                                                    readOnly
                                                    emptyIcon={
                                                        <Star
                                                            style={{ opacity: 0.6, color: "gray" }}
                                                            fontSize="inherit"
                                                        />
                                                    }
                                                />
                                                {rating !== null && (
                                                    <Box className="ml-[10px] font-semibold mt-[2px]">
                                                        {labels[comment.voted]}
                                                    </Box>
                                                )}
                                            </div>
                                            <p className="mt-[4px]">{comment.message}</p>
                                            <div className="font-semibold mt-[4px]">
                                                <span className="mr-[68px] ">{comment.time}</span>
                                                <span>{comment.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {context.active && (
                                        <div className="float-left">
                                            <Button
                                                id="basic-button"
                                                aria-controls={open ? "basic-menu" : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? "true" : undefined}
                                                sx={{ backgroundColor: "#f7f1f1" }}
                                                onClick={handleClick}>
                                                ...
                                            </Button>
                                            <Menu
                                                id="basic-menu"
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                                MenuListProps={{
                                                    "aria-labelledby": "basic-button",
                                                }}>
                                                <MenuItem
                                                    onClick={handleClose}
                                                    sx={{ fontSize: { xs: "12px", md: "14px" } }}>
                                                    Sửa
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    sx={{ fontSize: { xs: "12px", md: "14px" } }}>
                                                    Xóa
                                                </MenuItem>
                                            </Menu>

                                            <Dialog
                                                open={alertNotice}
                                                onClose={() => setAlertNotice(false)}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description">
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-description">
                                                        {noticeComment}
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={() => setAlertNotice(false)} autoFocus>
                                                        Ok
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {commentShow.length < comments.length && (
                                <div
                                    className="bg-[#2b2fc1] rounded-[4px] py-[3px] hover:bg-[#1848d8]"
                                    onClick={() => setPage((prev) => prev + 1)}>
                                    Xem thêm
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReactUser