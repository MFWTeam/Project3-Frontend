import { useState, useEffect } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";

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
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
            </Nav>
            <Button
              variant="outline-success"
              style={{ display: isLoggedIn }}
              href="/signIn"
            >
              Sign In
            </Button>
            <Button
              variant="outline-success"
              style={{ display: isLoggedOut }}
              href="/signIn"
              onClick={() => {
                localStorage.removeItem("token");
              }}
            >
              Sign Out
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
