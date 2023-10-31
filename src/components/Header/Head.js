import React from "react"

const Head = () => {
    return (
        <>
            <section className='head'>
                <div className='container d_flex'>
                    <div className='left row'>
                        <div>
                            <div>
                                <i className='fa fa-phone'></i>
                                <label> +(84)965 938 251</label>
                            </div>
                            <div>
                                <i className='fa fa-envelope'></i>
                                <label> transon13122002@gmail.com</label>
                            </div>
                        </div>
                    </div>
                    <div className='right row RText'>
                        <div >
                            <i className='fa fa-facebook-official'></i>
                            <label> Trần Sơn</label>
                            <i class="fa fa-instagram"></i>
                            <label> heatse_02</label>
                            <i class="fa fa-globe" aria-hidden="true"></i>
                            <label>VN</label>
                            <i class="fa fa-money" aria-hidden="true"></i>
                            <label>VND</label>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Head