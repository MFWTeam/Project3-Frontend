import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Link from "next/link";
import Layout from "../components/Layout";
import axios from "axios";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    if (token === null) {
      router.push("/signIn");
    }
  }, []);

  // Start Model Role
  const [showRole, setShowRole] = useState(false);
  const handleCloseRole = () => setShowRole(false);
  const handleShowRole = () => setShowRole(true);
  // End Model Role

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

  return (
    <Layout>
      <div className={styles.body}>
        <div className={styles.container}>
          <Link href="/store">
            <div className={styles.card}>
              <div className={styles.box}>
                <div className={styles.content}>
                  <h3>Store</h3>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/user">
            <div className={styles.card}>
              <div className={styles.box}>
                <div className={styles.content}>
                  <h3>User</h3>
                </div>
              </div>
            </div>
          </Link>

          <div className={styles.card} onClick={handleShowRole}>
            <div className={styles.box}>
              <div className={styles.content}>
                <h3>Role</h3>
              </div>
            </div>
          </div>
        </div>
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
