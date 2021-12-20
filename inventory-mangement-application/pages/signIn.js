import styles from "../styles/signIn.module.css";
import React, { useState } from "react";
import Router from "next/router";
import Image from "next/image";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card, Link } from "react-bootstrap";

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
    <>
      <img
        className={styles.wave}
        src="https://raw.githubusercontent.com/sefyudem/Responsive-Login-Form/master/img/wave.png"
      />
      <div className={styles.container}>
        <div className={styles.img}>
          <img src="https://raw.githubusercontent.com/sefyudem/Responsive-Login-Form/82b8d8efd3b0ac6382b9d0d71a99c6cf9dcefa23/img/bg.svg" />
        </div>
        <div className={styles.loginContent}>
          <Card>
            <Card.Body>
              <Image src="/img/avatar.png" width="100px" height="100px" />
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

                  <div>
                    <input
                      className={styles.btn}
                      variant="primary"
                      value="Get Started"
                      onClick={() => signIn()}
                    ></input>
                  </div>
                </Form>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}
