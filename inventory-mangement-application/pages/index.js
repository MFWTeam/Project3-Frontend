import { useState, useEffect } from "react";
import { Button, Modal, Form, Table, Row, Col } from "react-bootstrap";
import Link from "next/link";
import Layout from "../components/Layout";
import axios from "axios";
import styles from "../styles/Home.module.css";
import { VscTrash } from "react-icons/vsc";
import { FaRegEdit } from "react-icons/fa";
import Image from "next/image";
import SweetAlert from "react-bootstrap-sweetalert";
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
  const [updateId, setId] = useState("");
  // End Role Data

  // Start Alert
  const [deletedRoleId, setDeletedRoleId] = useState("");
  const [displayRoleDelete, setDisplayRoleDelete] = useState(false);
  // End Alert

  const [msgError, setMsgError] = useState(false);

  function validationInput() {
    if (addRole === "") {
      setMsgError(true);
    } else {
      saveRole();
    }
  }

  function saveRole() {
    if (updateId) {
      axios
        .put("http://localhost:5000/roles/update/" + updateId, {
          name: addRole,
        })
        .then((data) => {
          if (data) {
            setIsRoleChanged(!isRoleChanged);
            setAddRole("");
          }
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .post("http://localhost:5000/roles/save", {
          name: addRole,
        })
        .then((data) => {
          if (data) {
            setIsRoleChanged(!isRoleChanged);
            setAddRole("");
          }
        })
        .catch((error) => console.log(error));
    }
  }

  function updateRole(id) {
    fetch("http://localhost:5000/roles/show/" + id)
      .then((response) => response.json())
      .then((data) => {
        setAddRole(data[0].name);
        setId(data[0]._id);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteRole(id) {
    axios
      .put("http://localhost:5000/roles/delete/" + id, {
        isDeleted: true,
      })
      .then((data) => {
        if (data) {
          setIsRoleChanged(!isRoleChanged);
          setDisplayRoleDelete(false);
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
                  <Image
                    src="/img/warehouse.png"
                    width="100px"
                    height="100px"
                  />
                  <h3>Store</h3>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/user">
            <div className={styles.card}>
              <div className={styles.box}>
                <div className={styles.content}>
                  <Image src="/img/man.png" width="100px" height="100px" />
                  <h3>User</h3>
                </div>
              </div>
            </div>
          </Link>

          <div className={styles.card} onClick={handleShowRole}>
            <div className={styles.box}>
              <div className={styles.content}>
                <Image src="/img/shield.png" width="100px" height="100px" />
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
                value={addRole}
                onChange={(e) => setAddRole(e.target.value)}
              />
            </Form.Group>
          </Form>
          <Button
            variant="primary"
            className={styles.btnAdd}
            onClick={() => {
              validationInput();
            }}
          >
            <Row>
              <Col xs={8}>Add Role</Col>
              <Col xs={4}>
                <Image src="/img/plus.png" width="30px" height="30px" />
              </Col>
            </Row>
          </Button>
          <Table striped bordered hover className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {roles &&
                roles.map((role) => {
                  return (
                    <tr>
                      <td>{role.name}</td>
                      <td>
                        <Button
                          className={styles.btnEdit}
                          onClick={() => {
                            updateRole(role._id);
                          }}
                        >
                          <FaRegEdit className={styles.FaRegEdit} />
                        </Button>
                      </td>
                      <td>
                        <Button
                          className={styles.btnEdit}
                          onClick={() => {
                            setDisplayRoleDelete(true);
                            setDeletedRoleId(role._id);
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
        </Modal.Body>
      </Modal>

      <SweetAlert
        warning
        show={displayRoleDelete}
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title="Are you sure?"
        onConfirm={() => deleteRole(deletedRoleId)}
        onCancel={() => setDisplayRoleDelete(false)}
        focusCancelBtn
      >
        You will not be able to recover this role!
      </SweetAlert>

      <SweetAlert
        warning
        show={msgError}
        title="Please Enter All Data"
        onConfirm={() => setMsgError(false)}
      ></SweetAlert>
    </Layout>
  );
}
