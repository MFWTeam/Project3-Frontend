import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import styles from "../styles/store.module.css";
import axios from "axios";
import {
  Button,
  Modal,
  Form,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { VscTrash } from "react-icons/vsc";
import { FaRegEdit } from "react-icons/fa";

export default function store() {
  // Stores data
  const [stores, setStores] = useState([]);
  const [isStoreChanged, setIsStoreChanged] = useState(false);

  // Start Model Store
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // End Model Store

  // Start Store Data
  const [name, setName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [updateId, setId] = useState("");
  // End Store Data

  // Start User Data
  const [users, setUser] = useState([]);
  const [isUserChanged, setIsUserChanged] = useState(false);
  // End User Data

  useEffect(async () => {
    const resUsers = await fetch("http://localhost:5000/users/show");
    const users = await resUsers.json();
    setUser(users);
  }, [isUserChanged]);

  useEffect(async () => {
    const resStores = await fetch("http://localhost:5000/stores/show");
    const stores = await resStores.json();
    setStores(stores);
  }, [isStoreChanged]);

  function addStore() {
    if (updateId) {
      axios
        .put("http://localhost:5000/stores/update/" + updateId, {
          name: name,
          managerName: managerName,
        })
        .then((data) => {
          if (data) {
            setIsStoreChanged(true);
            setName("");
            setManagerName("default");
            setId("");
          }
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .post("http://localhost:5000/stores/save", {
          name: name,
          managerName: managerName,
        })
        .then((data) => {
          if (data) {
            setIsStoreChanged(true);
            setName("");
            setManagerName("default");
            setId("");
          }
        })
        .catch((error) => console.log(error));
    }
  }

  function updateStore(id) {
    console.log(id);
    fetch("http://localhost:5000/stores/show/" + id)
      .then((response) => response.json())
      .then((data) => {
        setName(data[0].name);
        setManagerName(data[0].managerName);
        setId(data[0]._id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteStore(id) {
    console.log(id);
    axios
      .put("http://localhost:5000/stores/delete/" + id, {
        isDeleted: true,
      })
      .then((data) => {
        if (data) {
          setIsStoreChanged(true);
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
                    Store Name<span>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    placeholder="Enter store name"
                    autoComplete="off"
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
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
              </Col>
              <Col>
                <Button
                  variant="primary"
                  className={styles.btnAdd}
                  onClick={() => {
                    addStore();
                  }}
                >
                  Add Store
                </Button>
              </Col>
            </Row>
            <hr></hr>
            <Row>
              <Col>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Store Name</th>
                      <th>Manager Name</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stores &&
                      stores.map((store) => {
                        return (
                          <tr>
                            <td>{store.name}</td>
                            <td>{store.managerName}</td>
                            <td>
                              <Button
                                className={styles.btnEdit}
                                onClick={() => {
                                  updateStore(store._id);
                                }}
                              >
                                <FaRegEdit className={styles.FaRegEdit} />
                              </Button>
                            </td>
                            <td>
                              <Button
                                className={styles.btnEdit}
                                onClick={() => {
                                  deleteStore(store._id);
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
}
