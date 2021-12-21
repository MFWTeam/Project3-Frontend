import Layout from "../components/Layout";
import { Table, Container, Row, Col, Button, Form } from "react-bootstrap";
import styles from "../styles/user.module.css";
import { useEffect, isUserChanged, useState } from "react";
import { VscTrash } from "react-icons/vsc";
import { FaRegEdit } from "react-icons/fa";
import axios from "axios";

const countriesTable = () => {
  // Start User Data
  const [users, setUser] = useState([]);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");

  const [updateId, setId] = useState("");
  const [isUserChanged, setIsUserChanged] = useState(false);
  // End User Data

  useEffect(async () => {
    const resUsers = await fetch("http://localhost:5000/users/show");
    const users = await resUsers.json();
    setUser(users);
  }, [isUserChanged]);

  function saveUser() {
    if (updateId) {
      axios
        .put("http://localhost:5000/users/update/" + updateId, {
          name: userName,
          email: email,
          password: password,
          phone: phone,
          address: address,
          role: "Normal",
        })
        .then((data) => {
          if (data) {
            setIsUserChanged(true);
            setUserName("");
            setEmail("");
            setPassword("");
            setPhone("");
            setAddress("");
            setId("");
          }
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .post("http://localhost:5000/users/save", {
          name: userName,
          email: email,
          password: password,
          phone: phone,
          address: address,
          role: "Normal",
        })
        .then((data) => {
          if (data) {
            setIsUserChanged(true);
          }
        })
        .catch((error) => console.log(error));
    }
  }

  function updateUser(id) {
    fetch("http://localhost:5000/users/show/" + id)
      .then((response) => response.json())
      .then((data) => {
        setUserName(data[0].name);
        setEmail(data[0].email);
        setPassword(data[0].password);
        setPhone(data[0].phone);
        setAddress(data[0].address);
        setId(data[0]._id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteUser(id) {
    axios
      .put("http://localhost:5000/users/delete/" + id, {
        isDeleted: true,
      })
      .then((data) => {
        if (data) {
          setIsUserChanged(true);
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <Container>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Name<span>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={userName}
                    placeholder="Enter name"
                    autoComplete="off"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Email<span>*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Password<span>*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    password={password}
                    autoComplete="off"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter address"
                    value={address}
                    autoComplete="off"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    placeholder="Enter phone"
                    value={phone}
                    autoComplete="off"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Button
                  variant="primary"
                  className={styles.btnAdd}
                  onClick={() => {
                    saveUser();
                  }}
                >
                  Add User
                </Button>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users &&
                      users.map((user) => {
                        return (
                          <tr>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.address}</td>
                            <td>
                              <Button
                                className={styles.btnEdit}
                                onClick={() => {
                                  updateUser(user._id);
                                }}
                              >
                                <FaRegEdit className={styles.FaRegEdit} />
                              </Button>
                            </td>
                            <td>
                              <Button
                                className={styles.btnEdit}
                                onClick={() => {
                                  deleteUser(user._id);
                                }}
                              >
                                <VscTrash className={styles.VscTrash} />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </Layout>
  );
};

export default countriesTable;
