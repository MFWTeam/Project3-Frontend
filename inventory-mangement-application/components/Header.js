import { useState, useEffect } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import styles from "../styles/Header.module.css";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState("none");
  const [isLoggedOut, setIsLoggedOut] = useState("none");
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (token !== null) {
      setIsLoggedIn("none");
      setIsLoggedOut("block");
    } else {
      setIsLoggedIn("block");
      setIsLoggedOut("none");
    }
  }, [token]);

  return (
    <>
      <Navbar bg="light" expand="lg" className={styles.background}>
        <Container>
          <Navbar.Brand href="#home">MFWProject</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
            </Nav>
            <Button
              variant="outline-success"
              style={{ display: isLoggedIn }}
              href="/signIn"
              className={styles.btn}
            >
              Sign In
            </Button>
            <Button
              variant="outline-success"
              style={{ display: isLoggedOut }}
              href="/signIn"
              className={styles.btn}
              onClick={() => {
                localStorage.removeItem("token");
              }}
            >
              Sign Out
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
