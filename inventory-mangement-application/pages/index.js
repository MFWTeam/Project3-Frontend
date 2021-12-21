import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Link from "next/link";
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
  // End Model User

  // Start Model Role
  const [showRole, setShowRole] = useState(false);
  const handleCloseRole = () => setShowRole(false);
  const handleShowRole = () => setShowRole(true);
  // End Model Role

  const [name, setName] = useState("");
  const [managerName, setManagerName] = useState("");

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
            <Link href="/store">
              <Button variant="primary" className={styles.btn}>
                Store
              </Button>
            </Link>

            <Link href="/user">
              <Button variant="primary" className={styles.btn}>
                User
              </Button>
            </Link>

            <Button
              variant="primary"
              className={styles.btn}
              onClick={handleShowRole}
            >
              Role
            </Button>
          </div>
        </main>
      </div>

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
