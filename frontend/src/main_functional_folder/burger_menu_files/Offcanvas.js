import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import "./burger_menu_styles/offcanvas.css"
import {ListGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import Telegram from "../../front_additions/social/telegram.png"
import Facebook from "../../front_additions/social/facebook.png"
import Twitter from "../../front_additions/social/twitter.png"
import Instagram from "../../front_additions/social/instagram.png"
import axios from "axios";
import getUserToken from "../AdditionalFunctionality/RefreshTokenAuthentication";


function OffCanvas() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCheck = async () => {

    try {
        let token = await getUserToken();
        const response = await axios.post('http://127.0.0.1:8000/api/premium/create-portal-session/', null, {
           headers: {
                    Authorization: `Bearer ${token}`,
                },
        });

        const { redirect_url } = response.data
        window.location.href = redirect_url;
    }
    catch (error) {
        alert('You don\'t have a Premium status. You can buy it in the price section')
        window.location.href = '/premium'
    }
  };

  return (
    <>
      <Button variant="custom" onClick={handleShow} className="custom-offcanvas-button">
        &#9776; Menu
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton className="menu-head-container">
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="menu-body-container">
          <ListGroup className="list-group">
              <Link to="http://localhost:3000/user/" className="link-list">
                Profile
              </Link>
              <div className="line-link"></div>
              <Link to="http://localhost:3000/user/projects/" className="link-list">
                My Projects
              </Link>
              <div className="line-link"></div>
              <Link to="#" className="link-list" onClick={handleCheck}>
                Premium
              </Link>
              <div className="line-link"></div>
              <Link to="http://localhost:3000/user/terms/" className="link-list">
                Terms and Conditions
              </Link>
              <div className="line-link"></div>
              <Link to="http://localhost:3000/user/faq/" className="link-list">
                F.A.Q.
              </Link>
              <div className="line-link"></div>
              <Link to="http://localhost:3000/user/support/" className="link-list">
                Support
              </Link>
          </ListGroup>
          <div className="social-media-menu">
              <img src={Telegram} alt="social-menu" className="social-logo"/>
              <img src={Facebook} alt="social-menu" className="social-logo"/>
              <img src={Twitter} alt="social-menu" className="social-logo"/>
              <Link to="https://www.instagram.com/____spectator?igsh=dXN0dGwzOGF0MTcy">
                <img src={Instagram} alt="social-menu" className="social-logo"/>
              </Link>
              <p>all rights copyright reserved &copy; 2023 <br/>OpenVisualization.com</p>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default OffCanvas;