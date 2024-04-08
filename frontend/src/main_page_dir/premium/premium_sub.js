import React from 'react';
import axios from "axios";
import Header from "../Header";
import "../main_page_dir_styles/premium_sub_style.css"
import Cookies from "js-cookie";


function PremiumSub() {

    const handleGetButton = (buyAPI) => {
        const token = Cookies.get("access_token")
        if (token && buyAPI){
             buySubmit(buyAPI, token);
        }
        else {
             alert('YOU NEED A REGISTER OR LOG IN FOR BUYING PREMIUM STATUS!!!')
        }
    }

    const buySubmit = async (selectedSub, token) => {
        try {

            const response = await axios.post("http://127.0.0.1:8000/api/premium/buy/", {
                'price': selectedSub
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = response.data

            if (result.redirect_url) {
                window.location.href = result.redirect_url

            } else {
                alert(result.message);
            }

          // const { redirect_url } = response.data;
          // window.location.href = redirect_url;
          // console.log(redirect_url)

        } catch (error) {
          console.error('Error submitting request:', error);
        }
    };

    return (
        <div className="premium-main-container">
            <Header />

            <div className="premium-container">
                <section className="premium-block">
                    <p className="white-text">...</p>
                    <div className="premium-top">
                        <h3>No<br/>Subscription</h3>
                    </div>
                    <div className="premium-bonus">
                        <p>- 10 counts of usage per month.</p>
                        <p>- 2 datasets are available for uploads.</p>
                        <p>- Tech support in order of priority.</p>
                        <p>- Limited use of prediction.</p>
                        <p>- Limited topics to work on.</p>
                    </div>
                </section>

                <section className="premium-block">
                    <p className="lavanda-text">FIRST CHOICE</p>
                    <div className="premium-top">
                        <h3>Junior</h3>
                        <h4>$ 0.99</h4>
                    </div>
                    <div className="premium-bonus">
                        <p>- 50 counts of usage per month.</p>
                        <p>- 20 datasets are available for uploads.</p>
                        <p>- Priority tech support at any time.</p>
                        <p>- More access to use prediction.</p>
                    </div>
                    <p className="premium-remark">* You can unsubscribe in your personal cabinet.</p>
                    <button
                        className="button-buy" onClick={() => handleGetButton('price_1OdWRrAqT4llOodThgl7WlMv')}
                        >
                        Buy now
                    </button>
                </section>

                <section className="premium-block">
                    <p className="blue-text">MOST POPULAR</p>
                    <div className="premium-top">
                        <h3>Middle</h3>
                        <h4>$ 2.99</h4>
                    </div>
                    <div className="premium-bonus">
                        <p>- 100 counts of usage per month.</p>
                        <p>- 50 datasets are available for uploads.</p>
                        <p>- Faster tech support at any time.</p>
                        <p>- More topics to work on.</p>
                    </div>
                    <p className="premium-remark">* You can unsubscribe in your personal cabinet.</p>
                    <button
                        className="button-buy" onClick={() => handleGetButton('price_1OebaaAqT4llOodTBN9YpjjU')}
                        >
                        Buy now
                    </button>
                </section>

                <section className="premium-block">
                    <p className="green-text">BEST VALUE</p>
                    <div className="premium-top">
                        <h3>Senior</h3>
                        <h4>$ 3.99</h4>
                    </div>
                    <div className="premium-bonus">
                        <p>- Unlimited counts of usage.</p>
                        <p>- Unlimited uploads of datasets.</p>
                        <p>- Personal tech support at any time.</p>
                        <p>- Early access to new features.</p>
                        <p>&nbsp;&nbsp;&nbsp;And more...</p>
                    </div>
                    <p className="premium-remark">* You can unsubscribe in your personal cabinet.</p>
                    <button
                        className="button-buy" onClick={() => handleGetButton('price_1OebmLAqT4llOodTI8O8z360')}
                        >
                        Buy now
                    </button>
                </section>
            </div>
        </div>
    );
}

export default PremiumSub;