import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import styles from "../styles/store.module.css";
import Image from "next/image";
import axios from "axios";
import {
  Button,
  Modal,
  Form,
  Table,
  Container,
  Row,
  Col,
  Tabs,
  Tab,
} from "react-bootstrap";
import { VscTrash } from "react-icons/vsc";
import { FaRegEdit } from "react-icons/fa";
import { RiSlideshowLine } from "react-icons/ri";
import { useRouter } from "next/router";
import SweetAlert from "react-bootstrap-sweetalert";

export default function store() {
  const router = useRouter();
  useEffect(async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    if (token === null) {
      router.push("/signIn");
    }
  }, []);
  // Stores data
  const [stores, setStores] = useState([]);
  const [isStoreChanged, setIsStoreChanged] = useState(false);

  // Message Display
  const [msgError, setMsgError] = useState(false);

  // showExportAndSupply
  const [showExportAndSupply, setShowExportAndSupply] = useState(false);

  // Default Store Name
  const [defaultStoreName, setDefaultStoreName] = useState("");
  const [exportProductName, setExportProductName] = useState("");
  // End Store Name

  // Start Model Store
  const [show, setShow] = useState(false);
  // End Model Store

  // Deleted Id
  const [deletedId, setDeletedId] = useState("");
  const [deletedStoreId, setDeletedStoreId] = useState("");
  const [deletedProductName, setDeletedProductName] = useState("");

  // Start Product Data
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productBarcode, setProductBarcode] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);
  // End Product Data

  // Start New Product
  const [newProducts, setNewProducts] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [updateProductId, setUpdateProductId] = useState("");
  // End New Product

  // Start Store Data
  const [name, setName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [updateId, setId] = useState("");
  // End Store Data

  // Start Alert
  const [display, setDisplay] = useState(false);
  const [displayStoreDelete, setDisplayStoreDelete] = useState(false);
  const [displayStoreUpdate, setDisplayStoreUpdate] = useState(false);
  const [errorDisplay, setErrorDisplay] = useState(false);
  // End Alert

  // Start User Data
  const [users, setUser] = useState([]);
  // End User Data

  useEffect(async () => {
    const resUsers = await fetch("http://localhost:5000/users/show");
    const users = await resUsers.json();
    setUser(users);
  }, []);

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

  function getNewProducts() {
    fetch("http://localhost:5000/products/show/byName/New")
      .then((response) => response.json())
      .then((data) => setNewProducts(data))
      .catch((err) => console.log(err));
  }

  function validationInput() {
    if (name === "" || managerName === "") {
      setMsgError(true);
    } else {
      addStore();
    }
  }

  function validationInputProduct() {
    if (
      productName === "" ||
      productBarcode === "" ||
      productPrice === "" ||
      productQuantity === ""
    ) {
      setMsgError(true);
    } else {
      addProduct();
    }
  }

  function getProductQuantity(name) {
    if (name !== "default") {
      fetch("http://localhost:5000/products/show/byName/New")
        .then((response) => response.json())
        .then((data) => {
          const found = data.find((elem) => elem.name === name);
          setQuantity(found.quantity);
        })
        .catch((err) => console.log(err));
    } else {
      setQuantity(0);
    }
  }

  function addStore() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (updateId) {
      axios
        .put(
          "http://localhost:5000/stores/update/" + updateId,
          {
            name: name,
            managerName: managerName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((data) => {
          if (data) {
            setIsStoreChanged(!isStoreChanged);
            axios
              .post("http://localhost:5000/tracking/save", {
                username: data.data.token.name,
                action: `Update Data of Store (${name})`,
              })
              .then((data) => {
                if (data) {
                  setName("");
                  setManagerName("default");
                  setId("");
                }
              })
              .catch((error) => console.log(error));
          }
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .post(
          "http://localhost:5000/stores/save",
          {
            name: name,
            managerName: managerName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((data) => {
          if (data) {
            setIsStoreChanged(!isStoreChanged);
            axios
              .post("http://localhost:5000/tracking/save", {
                username: data.data.token.name,
                action: `Add New Store with Name (${name})`,
              })
              .then((data) => {
                if (data) {
                  setName("");
                  setManagerName("default");
                  setId("");
                }
              })
              .catch((error) => console.log(error));
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

  useEffect(() => {
    if (updateId !== "") {
      checkStoreUpdate(defaultStoreName);
    }
  }, [updateId]);

  function checkStoreUpdate(name) {
    fetch("http://localhost:5000/products/show/byName/" + name)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setDisplayStoreUpdate(true);
          setId("");
        } else {
          updateStore(updateId);
          setDisplayStoreUpdate(false);
        }
      })
      .catch((err) => console.log(err));
  }

  function updateProduct(id) {
    fetch("http://localhost:5000/products/show/" + id)
      .then((response) => response.json())
      .then((data) => {
        setProductName(data[0].name);
        setProductBarcode(data[0].barcode);
        setProductPrice(data[0].price);
        setProductQuantity(data[0].quantity);
        setUpdateProductId(data[0]._id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteStore(id, name) {
    const token = JSON.parse(localStorage.getItem("token"));
    axios
      .put(
        "http://localhost:5000/stores/delete/" + id,
        {
          isDeleted: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((data) => {
        if (data) {
          setDisplayStoreDelete(false);
          setIsStoreChanged(!isStoreChanged);
          axios
            .post("http://localhost:5000/tracking/save", {
              username: data.data.token.name,
              action: `Delete Store with Name (${name})`,
            })
            .then()
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  }

  function addProduct() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (updateProductId) {
      axios
        .put(
          "http://localhost:5000/products/update/" + updateProductId,
          {
            name: productName,
            barcode: productBarcode,
            price: productPrice,
            quantity: productQuantity,
            storeName: defaultStoreName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((data) => {
          if (data) {
            getProducts(defaultStoreName);
            axios
              .post("http://localhost:5000/tracking/save", {
                username: data.data.token.name,
                action: `Update Data of Product (${productName})`,
              })
              .then((data) => {
                if (data) {
                  setProductName("");
                  setProductBarcode("");
                  setProductPrice("");
                  setProductQuantity("");
                  setUpdateProductId("");
                }
              })
              .catch((error) => console.log(error));
          }
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .post(
          "http://localhost:5000/products/save",
          {
            name: productName,
            barcode: productBarcode,
            price: productPrice,
            quantity: productQuantity,
            storeName: defaultStoreName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((data) => {
          if (data) {
            getProducts(defaultStoreName);
            axios
              .post("http://localhost:5000/tracking/save", {
                username: data.data.token.name,
                action: `Add New Product with Name (${productName})`,
              })
              .then((data) => {
                if (data) {
                  setProductName("");
                  setProductBarcode("");
                  setProductPrice(0);
                  setProductQuantity(0);
                  setUpdateProductId("");
                }
              })
              .catch((error) => console.log(error));
          }
        })
        .catch((error) => console.log(error));
    }
  }

  const [deletedProduct, setDeletedProduct] = useState("");

  async function getDeletedProductName(id) {
    const deletedData = await fetch(
      "http://localhost:5000/products/show/" + id
    );
    const found = await deletedData.json();
    setDeletedProduct(found[0].name);
  }

  function deleteProduct(id) {
    const token = JSON.parse(localStorage.getItem("token"));
    axios
      .put(
        "http://localhost:5000/products/delete/" + id,
        {
          isDeleted: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((data) => {
        if (data) {
          setDisplay(false);
          getProducts(defaultStoreName);
          axios
            .post("http://localhost:5000/tracking/save", {
              username: data.data.token.name,
              action: `Delete Product with Name (${deletedProduct})`,
            })
            .then()
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  }

  function checkStoreDelete(name) {
    fetch("http://localhost:5000/products/show/byName/" + name)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setErrorDisplay(true);
          setDisplayStoreDelete(false);
        } else {
          deleteStore(deletedStoreId, name);
          setErrorDisplay(false);
          setDisplayStoreDelete(false);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <Layout>
      <div className={styles.container}>
        <main className={styles.main}>
          <Container>
            {/* <Row>
              <Col></Col>
              <Col></Col>
              <Col></Col>
              <Col>
                <Button
                  variant="primary"
                  className={styles.btnExport}
                  onClick={() => {
                    getNewProducts();
                    setShowExportAndSupply(true);
                  }}
                >
                  <Row>
                    <Col xs={8}>Sale and supply</Col>
                    <Col xs={4}>
                      <Image
                        src="/img/purchase.png"
                        width="50px"
                        height="50px"
                      />
                    </Col>
                  </Row>
                </Button>
              </Col>
            </Row> */}
            <Row>
              <Col xs={12} md={3}>
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
              <Col xs={12} md={3}>
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
              <Col xs={12} md={3}>
                <Button
                  variant="primary"
                  className={styles.btnAdd}
                  onClick={() => {
                    validationInput();
                  }}
                >
                  <Row>
                    <Col xs={8}>Add Store</Col>
                    <Col xs={4}>
                      <Image src="/img/plus.png" width="30px" height="30px" />
                    </Col>
                  </Row>
                </Button>
              </Col>
              <Col xs={12} md={3}>
                <Button
                  variant="primary"
                  className={styles.btnAdd}
                  onClick={() => {
                    setName("");
                    setManagerName("default");
                    setId("");
                  }}
                >
                  <Row>
                    <Col xs={8}>Clear Data</Col>
                    <Col xs={4}>
                      <Image src="/img/clear.png" width="30px" height="30px" />
                    </Col>
                  </Row>
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
                                  setDefaultStoreName(store.name);
                                  setId(store._id);
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
                                  setDefaultStoreName(store.name);
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
        onHide={() => {
          setShow(false);
          setProductName("");
          setProductBarcode("");
          setProductPrice("");
          setProductQuantity("");
        }}
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
                    validationInputProduct();
                  }}
                >
                  <Row>
                    <Col xs={8}>Save</Col>
                    <Col xs={4}>
                      <Image src="/img/plus.png" width="50px" height="50px" />
                    </Col>
                  </Row>
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
                                onClick={() => updateProduct(product._id)}
                              >
                                <FaRegEdit className={styles.FaRegEdit} />
                              </Button>
                            </td>
                            <td>
                              <Button
                                className={styles.btnEdit}
                                onClick={() => {
                                  getDeletedProductName(product._id);
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
        onConfirm={() => checkStoreDelete(defaultStoreName)}
        onCancel={() => setDisplayStoreDelete(false)}
        focusCancelBtn
      >
        You will not be able to recover this store!
      </SweetAlert>
      <SweetAlert
        danger
        show={errorDisplay}
        title="You Can not delete this store !!!"
        onConfirm={() => setErrorDisplay(false)}
      ></SweetAlert>

      <SweetAlert
        danger
        show={displayStoreUpdate}
        title="You Can not update this store !!!"
        onConfirm={() => setDisplayStoreUpdate(false)}
      ></SweetAlert>

      <SweetAlert
        warning
        show={msgError}
        title="Please Enter All Data"
        onConfirm={() => setMsgError(false)}
      ></SweetAlert>

      <Modal
        size="lg"
        show={showExportAndSupply}
        onHide={() => setShowExportAndSupply(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Sale and supply products
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            defaultActiveKey="sale"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="sale" title="Sale">
              <Container>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Customer Name<span>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter customer name"
                        autoComplete="off"
                        // onChange={(e) => setProductName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Product Name<span>*</span>
                      </Form.Label>
                      <Form.Select
                        value={exportProductName}
                        onChange={(e) => {
                          setExportProductName(e.target.value);
                          getProductQuantity(e.target.value);
                        }}
                      >
                        <option value="default">Choose a Product</option>
                        {newProducts &&
                          newProducts.map((newProduct, i) => {
                            return (
                              <option key={i} value={newProduct.name}>
                                {newProduct.name}
                              </option>
                            );
                          })}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        type="text"
                        value={quantity}
                        placeholder="Enter product quantity"
                        disabled
                        autoComplete="off"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Sale Quantity<span>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter sale quantity"
                        autoComplete="off"
                        // value=""
                        // onChange={(e) => setProductName(e.target.value)}
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
                          <th>Customer Name</th>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Sale Quantity</th>
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
                                    onClick={() => updateProduct(product._id)}
                                  >
                                    <FaRegEdit className={styles.FaRegEdit} />
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
            </Tab>
            <Tab eventKey="supply" title="Supply">
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
                                    onClick={() => updateProduct(product._id)}
                                  >
                                    <FaRegEdit className={styles.FaRegEdit} />
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
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}
