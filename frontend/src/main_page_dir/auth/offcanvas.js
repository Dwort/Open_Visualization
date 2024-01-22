import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import "./auth_style/offcanvas.css"
import {ListGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import Telegram from "../../front_additions/social/telegram.png"
import Facebook from "../../front_additions/social/facebook.png"
import Twitter from "../../front_additions/social/twitter.png"
import Instagram from "../../front_additions/social/instagram.png"


function OffCanvas() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
                <h5>Profile</h5>
              </Link>
              <div className="line-link"></div>
              <Link to="http://localhost:3000/user/projects/" className="link-list">
                <h5>My Projects</h5>
              </Link>
              <div className="line-link"></div>
              <Link to="http://localhost:3000/user/premium/" className="link-list">
                <h5>Premium</h5>
              </Link>
              <div className="line-link"></div>
              <Link to="http://localhost:3000/user/terms/" className="link-list">
                <h5>Terms and Conditions</h5>
              </Link>
              <div className="line-link"></div>
              <Link to="http://localhost:3000/user/faq/" className="link-list">
                <h5>F.A.Q.</h5>
              </Link>
              <div className="line-link"></div>
              <Link to="http://localhost:3000/user/support/" className="link-list">
                <h5>Support</h5>
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