import React, {useState} from "react";
import {Col, Button, Row, Container, Card, Form} from "react-bootstrap";
import axios from "axios";
import {Link} from "react-router-dom";
import Cookies from "js-cookie";


export default function Login() {

  const [validated, setValidated] = useState(false);
  const [loginError, setLoginError] = useState(null)
  const HeadLogo = 'https://open-visualization-s3-storage.s3.us-east-2.amazonaws.com/ProjectFiles/company-logo.png';

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    if (form.checkValidity()) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/user/login/", {
          email: form.elements.formBasicEmail.value,
          password: form.elements.formBasicPassword.value,
        });

        let access_token = response.data.access;
        let refresh_token = response.data.refresh;

        Cookies.set('access_token', access_token, { expires: 5 / (24 * 60) });
        Cookies.set('refresh_token', refresh_token, { expires: 1 });

        window.location.href = '/user';

      } catch (error) {

        setLoginError("Incorrect email or password! Try again");
        console.error(error);
      }
    }
  };

  return (
    <div>
      <Link
        to="/"
        className="position-absolute top-0 start-0 ms-5 mt-5 text-decoration-none"
        >
        <Button
          variant="secondary"
          className="d-flex align-items-center justify-content-center p-3"
          style={{ width: '100px', height: '50px'}}
          >
          &lt; Back
        </Button>
      </Link>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
          <div className="border border-2 border-primary"></div>
            <Card className="shadow px-4">
              <Card.Body>
                <div className="mb-0 mt-md-0">
                  <div className="fw-bold mb-1 text-center text-uppercase">
                    <img src={HeadLogo} alt="main-logo" className="logo" style={{ width: '50px', height: 'auto' }}/>
                    <h3>Open Visualization</h3>
                  </div>
                  <div className="mb-3">
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>

                      <Form.Group className="mb-2" controlId="formBasicEmail">
                        <Form.Label>
                          Email
                        </Form.Label>
                        <Form.Control
                            required
                            type="email"
                            placeholder="Enter email"
                        />
                        <Form.Control.Feedback type="invalid">
                           Enter email correct with @ and domain!
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>
                          Correct
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Password"
                        />
                        <Form.Control.Feedback type="invalid">
                           Enter password!
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>
                          Correct
                        </Form.Control.Feedback>
                      </Form.Group>

                      <div className="d-grid">
                        <Button variant="primary" type="submit">
                          Log In
                        </Button>
                      </div>
                    </Form>
                     {loginError && (
                      <div className="mt-3 text-danger text-center">
                        {loginError}
                      </div>
                    )}
                    <div className="mt-3">
                      <p className="mb-0  text-center">
                        Don't have an account? {" "}
                        <a href="/registration" className="text-primary fw-bold">
                          Sign Up
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}