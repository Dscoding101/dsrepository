import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import "../styles/mix.css"

const SignupSuccessful = () => {
  return (
    <div className='success'>
      <Container>
        <Row className="justify-content-md-center">
          <Col md="8" lg="8">
            <Alert variant="success" className="text-center p-5">
              <FaCheckCircle size={60} className="mb-3" />
              <h2>Signup Successful!</h2>
              <br/>
              <p className='fs-5'>Congratulations !!<br />Your account has been created successfully.</p>
              <br /><br/>
              <div className="d-flex justify-content-center">
                <p className='fs-5'>Continue to Login?</p>
                <Link to="/login" className="ml-2  fs-5">
                  Login
                </Link>
              </div>
            </Alert>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignupSuccessful;
