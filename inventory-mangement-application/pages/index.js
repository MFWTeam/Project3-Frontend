import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Layout from "../components/Layout";
import axios from "axios";
import styles from "../styles/Home.module.css";

export default function Home() {
  // Stores data
  const [stores, setStores] = useState([]);
  const [isStoreChanged, setIsStoreChanged] = useState(false);
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

  // Start Model Role
  const [showRole, setShowRole] = useState(false);
  const handleCloseRole = () => setShowRole(false);
  const handleShowRole = () => setShowRole(true);
  // End Model Role

  const [name, setName] = useState("");
  const [managerName, setManagerName] = useState("");

  // Start User Data
  const [users, setUser] = useState([]);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [isUserChanged, setIsUserChanged] = useState(false);
  // End User Data

  // Start Role Data
  const [addRole, setAddRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [isRoleChanged, setIsRoleChanged] = useState(false);
  // End Role Data

  function saveRole() {
    axios
      .post("http://localhost:5000/roles/save", {
        name: addRole,
      })
      .then((data) => {
        if (data) {
          setIsRoleChanged(true);
        }
      })
      .catch((error) => console.log(error));
  }

  useEffect(async () => {
    const resRole = await fetch("http://localhost:5000/roles/show");
    const roles = await resRole.json();
    setRoles(roles);
  }, [isRoleChanged]);

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
          setIsUserChanged(true);
        }
      })
      .catch((error) => console.log(error));
  }

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
    axios
      .post("http://localhost:5000/stores/save", {
        name: name,
        managerName: managerName,
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
          <div className={styles.grid}>
            <Button
              variant="primary"
              className={styles.btn}
              onClick={handleShow}
            >
              Store
            </Button>
            <Button
              variant="primary"
              className={styles.btn}
              onClick={handleShowUser}
            >
              User
            </Button>
            <Button
              variant="primary"
              className={styles.btn}
              onClick={handleShowRole}
            >
              Role
            </Button>
          </div>
          {/* <div className={styles.grid}>
            {stores &&
              stores.map((store) => {
                return (
                  <a href="" className={styles.card}>
                    <h2>{store.name}</h2>
                    <h3>{store.managerName}</h3>
                  </a>
                );
              })}
          </div> */}
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
          <Button
            variant="secondary"
            onClick={handleClose}
            className={styles.btnClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            className={styles.btnAdd}
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
            className={styles.btnClose}
            onClick={() => {
              handleCloseUser();
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            className={styles.btnAdd}
            onClick={() => {
              saveUser();
              handleCloseUser();
            }}
          >
            Add User
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRole} onHide={handleCloseRole}>
        <Modal.Header closeButton>
          <Modal.Title>Add Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className={styles.form}>
            <Form.Group className="mb-3">
              <Form.Label>
                Role Name<span>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                autoComplete="off"
                onChange={(e) => setAddRole(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className={styles.btnClose}
            onClick={() => {
              handleCloseRole();
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            className={styles.btnAdd}
            onClick={() => {
              saveRole();
              handleCloseRole();
            }}
          >
            Add Role
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

// export async function getServerSideProps() {

//   return {
//     props: { users, roles },
//   };
// }
