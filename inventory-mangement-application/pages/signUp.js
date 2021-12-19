import React, { useState } from "react";
import Router from "next/router";
import styles from "../styles/signUp.module.css";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

export default function signup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  function saveUser() {
    axios
      .post("http://localhost:5000/users/save", {
        name: name,
        email: email,
        password: password,
        phone: phone,
        address: address,
      })
      .then((data) => {
        if (data) {
          Router.push("/signIn");
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div>
      <Container className={styles.container}>
        <Row>
          <Col></Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title className={styles.title}>Sign Up</Card.Title>
                <hr />
                <Card.Text>
                  <Form className={styles.form}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Name<span>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter name"
                        autoComplete="off"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Email address<span>*</span>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>
                        Password<span>*</span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter phone"
                        autoComplete="off"
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter address"
                        autoComplete="off"
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Form.Group>

                    <div className={styles.btn}>
                      <Button variant="primary" onClick={() => saveUser()}>
                        Sign Up
                      </Button>
                    </div>
                  </Form>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
}
