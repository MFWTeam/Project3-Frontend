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
import { RiSlideshowLine } from "react-icons/ri";
import SweetAlert from "react-bootstrap-sweetalert";

export default function store() {
  // Stores data
  const [stores, setStores] = useState([]);
  const [isStoreChanged, setIsStoreChanged] = useState(false);

  // Default Store Name
  const [defaultStoreName, setDefaultStoreName] = useState("");
  // End Store Name

  // Start Model Store
  const [show, setShow] = useState(false);
  // End Model Store

  // Deleted Id
  const [deletedId, setDeletedId] = useState("");
  const [deletedStoreId, setDeletedStoreId] = useState("");

  // Start Product Data
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productBarcode, setProductBarcode] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);
  // End Product Data

  // Start Store Data
  const [name, setName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [updateId, setId] = useState("");
  // End Store Data

  // Start Alert
  const [display, setDisplay] = useState(false);
  const [displayStoreDelete, setDisplayStoreDelete] = useState(false);
  // End Alert

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

  function getProducts(name) {
    fetch("http://localhost:5000/products/show/byName/" + name)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }

  function addStore() {
    if (updateId) {
      axios
        .put("http://localhost:5000/stores/update/" + updateId, {
          name: name,
          managerName: managerName,
        })
        .then((data) => {
          if (data) {
            setIsStoreChanged(!isStoreChanged);
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
            setIsStoreChanged(!isStoreChanged);
            setName("");
            setManagerName("default");
            setId("");
          }
        })
        .catch((error) => console.log(error));
    }
  }

  function updateStore(id) {
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

  function updateProduct(id) {
    fetch("http://localhost:5000/products/show/" + id)
      .then((response) => response.json())
      .then((data) => {
        setProductName(data[0].name);
        setProductBarcode(data[0].barcode);
        setProductPrice(data[0].price);
        setProductQuantity(data[0].quantity);
        setId(data[0]._id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteStore(id) {
    axios
      .put("http://localhost:5000/stores/delete/" + id, {
        isDeleted: true,
      })
      .then((data) => {
        if (data) {
          setDisplayStoreDelete(false);
          setIsStoreChanged(true);
        }
      })
      .catch((error) => console.log(error));
  }

  function addProduct() {
    if (updateId) {
      axios
        .put("http://localhost:5000/products/update/" + updateId, {
          name: productName,
          barcode: productBarcode,
          price: productPrice,
          quantity: productQuantity,
          storeName: defaultStoreName,
        })
        .then((data) => {
          if (data) {
            setProductName("");
            setProductBarcode("");
            setProductPrice("");
            setProductQuantity("");
            getProducts(defaultStoreName);
          }
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .post("http://localhost:5000/products/save", {
          name: productName,
          barcode: productBarcode,
          price: productPrice,
          quantity: productQuantity,
          storeName: defaultStoreName,
        })
        .then((data) => {
          if (data) {
            setProductName("");
            setProductBarcode("");
            setProductPrice(0);
            setProductQuantity(0);
            getProducts(defaultStoreName);
          }
        })
        .catch((error) => console.log(error));
    }
  }

  function deleteProduct(id) {
    axios
      .put("http://localhost:5000/products/delete/" + id, {
        isDeleted: true,
      })
      .then((data) => {
        if (data) {
          setDisplay(false);
          getProducts(defaultStoreName);
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
                  <Form.Select
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                  >
                    <option value="default">Choose a Manager</option>
                    {users &&
                      users.map((user, i) => {
                        return (
                          <option key={i} value={user.name}>
                            {user.name}
                          </option>
                        );
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
                <Table striped bordered hover className={styles.table}>
                  <thead>
                    <tr>
                      <th>Store Name</th>
                      <th>Manager Name</th>
                      <th>Edit</th>
                      <th>Delete</th>
                      <th>Show Store</th>
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
                                  setDisplayStoreDelete(true);
                                  setDeletedStoreId(store._id);
                                }}
                              >
                                <VscTrash className={styles.VscTrash} />
                              </Button>
                            </td>
                            <td>
                              <Button
                                className={styles.btnEdit}
                                onClick={() => {
                                  setDefaultStoreName(store.name);
                                  getProducts(store.name);
                                  setShow(true);
                                }}
                              >
                                <RiSlideshowLine
                                  className={styles.RiSlideshowLine}
                                />
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
      <Modal
        size="lg"
        show={show}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Show Products of {defaultStoreName} Store
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Name<span>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter store name"
                    autoComplete="off"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Barcode<span>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product barcode"
                    autoComplete="off"
                    value={productBarcode}
                    onChange={(e) => setProductBarcode(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Price<span>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product price"
                    autoComplete="off"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Quantity<span>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter store quantity"
                    autoComplete="off"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Store Name<span>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={defaultStoreName}
                    placeholder="Enter store quantity"
                    disabled
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Button
                  className={styles.btnSave}
                  onClick={() => {
                    addProduct();
                  }}
                >
                  Save
                </Button>
              </Col>
            </Row>
            <hr></hr>
            <Row>
              <Col>
                <Table striped bordered hover className={styles.table}>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Barcode</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products &&
                      products.map((product) => {
                        return (
                          <tr>
                            <td>{product.name}</td>
                            <td>{product.barcode}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>
                              <Button
                                className={styles.btnEdit}
                                onClick={() => {
                                  updateStore(store._id);
                                }}
                              >
                                <FaRegEdit
                                  className={styles.FaRegEdit}
                                  onClick={() => updateProduct(product._id)}
                                />
                              </Button>
                            </td>
                            <td>
                              <Button
                                className={styles.btnEdit}
                                onClick={() => {
                                  setDeletedId(product._id);
                                  setDisplay(true);
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
        </Modal.Body>
      </Modal>
      <SweetAlert
        warning
        show={display}
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title="Are you sure?"
        onConfirm={() => deleteProduct(deletedId)}
        onCancel={() => setDisplay(false)}
        focusCancelBtn
      >
        You will not be able to recover this product!
      </SweetAlert>
      <SweetAlert
        warning
        show={displayStoreDelete}
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title="Are you sure?"
        onConfirm={() => deleteStore(deletedStoreId)}
        onCancel={() => setDisplayStoreDelete(false)}
        focusCancelBtn
      >
        You will not be able to recover this store!
      </SweetAlert>
    </Layout>
  );
}
