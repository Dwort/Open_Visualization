import React, {useState} from "react";
import {Col, Button, Row, Container, Card, Form} from "react-bootstrap";
import { Link } from 'react-router-dom';
import HeadLogo from "../../front_additions/bar-chart.png";
import axios from "axios";


export default function Registration() {

  const [validated, setValidated] = useState(false);
  const [registrationError, setRegistrationError] = useState(null)
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
        const response = await axios.post("http://127.0.0.1:8000/api/user/register/", {
          email: form.elements.formBasicEmail.value,
          first_name: form.elements.formFirstName.value,
          last_name: form.elements.formLastName.value,
          password: form.elements.formBasicPassword.value,
        });

        const access_token = response.data.access_token;

        document.cookie = `access_token=${access_token};max-age=86400`;

        window.location.href = '/user';

      } catch (error) {

        setRegistrationError("User with this email already exists. Please sign in.");
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

                      <Form.Group className="mb-3" controlId="formFirstName">
                        <Form.Label>
                          First name
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="First name"
                        />
                        <Form.Control.Feedback type="invalid">
                           Enter your First name!
                        </Form.Control.Feedback>
                        <Form.Control.Feedback>
                          Correct
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formLastName">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Last name"
                        />
                        <Form.Control.Feedback type="invalid">
                           Enter your Last name!
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

                      <Form.Group className="mb-3">
                        <Form.Check
                          required
                          label="Agree to terms and conditions"
                          feedback="You must agree before submitting."
                          feedbackType="invalid"
                        />
                      </Form.Group>

                      <div className="d-grid">
                        <Button variant="primary" type="submit">
                          Create Account
                        </Button>
                      </div>
                    </Form>
                     {registrationError && (
                      <div className="mt-3 text-danger text-center">
                        {registrationError}
                      </div>
                    )}
                    <div className="mt-3">
                      <p className="mb-0  text-center">
                      Already have an account? {" "}
                        <a href="/login" className="text-primary fw-bold">
                          Log In
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