import styles from "../styles/signIn.module.css";
import React, { useState } from "react";
import Router from "next/router";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

export default function signIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function signIn() {
    axios
      .post("http://localhost:5000/users/signIn", {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.data.message !== "data is incorrect") {
          localStorage.setItem("token", JSON.stringify(response.data.token));
          Router.push("/");
        } else {
          console.log(response);
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
                <Card.Title className={styles.title}>Sign In</Card.Title>
                <hr />
                <Card.Text>
                  <Form className={styles.form}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
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

                    <div className={styles.btn}>
                      <Button variant="primary" onClick={() => signIn()}>
                        Get Started
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
