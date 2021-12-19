import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Layout from "../components/Layout";
import axios from "axios";
import styles from "../styles/Home.module.css";

export default function Home({ users, roles }) {
  // Stores data
  const [stores, setStores] = useState([]);
  // Start Model Store
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // End Model Store

  // Start Model User
  const [showUser, setShowUser] = useState(false);
  const handleCloseUser = () => setShowUser(false);
  const handleShowUser = () => setShowUser(true);
  // End Model Store

  const [name, setName] = useState("");
  const [managerName, setManagerName] = useState("");

  // Start User Data
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  // End User Data

  function saveUser() {
    axios
      .post("http://localhost:5000/users/save", {
        name: userName,
        email: email,
        password: password,
        phone: phone,
        address: address,
        role: role,
      })
      .then((data) => {
        if (data) {
          Router.push("/signIn");
        }
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    fetch("http://localhost:5000/stores/show")
      .then((response) => response.json())
      .then((data) => setStores(data))
      .catch((error) => console.log(error));
  }, [stores]);

  function addStore() {
    axios
      .post("http://localhost:5000/stores/save", {
        name: name,
        managerName: managerName,
      })
      .then((data) => {
        if (data) {
          Router.push("/");
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.grid}>
            <Button
              variant="primary"
              className={styles.btn}
              onClick={handleShow}
            >
              Add Store
            </Button>
            <Button variant="primary" className={styles.btn}>
              Add Item
            </Button>
            <Button
              variant="primary"
              className={styles.btn}
              onClick={handleShowUser}
            >
              Add User
            </Button>
          </div>
          <div className={styles.grid}>
            {stores &&
              stores.map((store) => {
                return (
                  <a href="" className={styles.card}>
                    <h2>{store.name}</h2>
                    <p>{store.managerName}</p>
                  </a>
                );
              })}
          </div>
        </main>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Store</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className={styles.form}>
            <Form.Group className="mb-3">
              <Form.Label>
                Store Name<span>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter store name"
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Manager Name<span>*</span>
              </Form.Label>
              <Form.Select onChange={(e) => setManagerName(e.target.value)}>
                <option value="default">Choose a Manager</option>
                {users &&
                  users.map((user) => {
                    return <option value={user.name}>{user.name}</option>;
                  })}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              addStore();
              handleClose();
            }}
          >
            Add Store
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUser} onHide={handleCloseUser}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className={styles.form}>
            <Form.Group className="mb-3">
              <Form.Label>
                Name<span>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                autoComplete="off"
                onChange={(e) => setUserName(e.target.value)}
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

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select onChange={(e) => setRole(e.target.value)}>
                <option value="default">Choose a Role</option>
                {roles &&
                  roles.map((role) => {
                    return <option value={role.name}>{role.name}</option>;
                  })}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleCloseUser();
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              saveUser();
              handleCloseUser();
            }}
          >
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export async function getStaticProps() {
  const resUsers = await fetch("http://localhost:5000/users/show");
  const users = await resUsers.json();

  const resRole = await fetch("http://localhost:5000/roles/show");
  const roles = await resRole.json();

  return {
    props: { users, roles },
  };
}
