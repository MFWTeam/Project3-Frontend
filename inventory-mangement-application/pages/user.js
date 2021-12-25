import Layout from "../components/Layout";
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import styles from "../styles/user.module.css";
import { useEffect, useState } from "react";
import { VscTrash } from "react-icons/vsc";
import { FaRegEdit } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import Image from "next/image";
import axios from "axios";
import SweetAlert from "react-bootstrap-sweetalert";
import { useRouter } from "next/router";

const users = () => {
  const router = useRouter();
  useEffect(async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    if (token === null) {
      router.push("/signIn");
    }
  }, []);

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

  // disabled password
  const [disabled, setDisabled] = useState(false);
  // disabled password

  // Change password user data
  const [userChangePasswordId, setUserChangePasswordId] = useState("");
  const [userChangePasswordName, setUserChangePasswordName] = useState("");
  const [userChangePasswordEmail, setUserChangePasswordEmail] = useState("");
  const [userChangePasswordAddress, setUserChangePasswordAddress] =
    useState("");
  const [userChangePasswordPhone, setUserChangePasswordPhone] = useState("");
  const [userChangePasswordRole, setUserChangePasswordRole] = useState("");

  const [userCurrentPassword, setUserCurrentPassword] = useState("");
  const [userNewPassword, setUserNewPassword] = useState("");
  const [userConfirmNewPassword, setUserConfirmNewPassword] = useState("");

  // Change password user data

  // Data UserTracking
  const [actions, setActions] = useState([]);
  const [isActionChanged, setIsActionChanged] = useState(false);
  // Data UserTracking

  // Message Display
  const [msgError, setMsgError] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  // Message Display

  // Start Alert
  const [deletedUserId, setDeletedUserId] = useState("");
  const [displayUserDelete, setDisplayUserDelete] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(false);
  const [towPasswordSame, setTowPasswordSame] = useState(false);
  const [changePasswordDone, setChangePasswordDone] = useState(false);
  // End Alert

  // Start Model Store
  const [show, setShow] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  // End Model Store

  // Roles Data
  const [roles, setRoles] = useState([]);
  // Roles Data

  useEffect(async () => {
    const resRole = await fetch("http://localhost:5000/roles/show");
    const roles = await resRole.json();
    setRoles(roles);
  }, []);

  useEffect(async () => {
    const resUsers = await fetch("http://localhost:5000/users/show");
    const users = await resUsers.json();
    setUser(users);
  }, [isUserChanged]);

  useEffect(async () => {
    const usersActions = await fetch("http://localhost:5000/tracking/show");
    const action = await usersActions.json();
    setActions(action);
  }, [isActionChanged]);

  function validationInput() {
    if (userName === "" || password === "" || email === "" || role === "") {
      setMsgError(true);
    } else {
      if (validateEmail(email)) {
        setValidEmail(false);
        saveUser();
      } else {
        setValidEmail(true);
      }
    }
  }

  function validateEmail(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  }

  function saveUser() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (updateId) {
      axios
        .put(
          "http://localhost:5000/users/update/" + updateId,
          {
            name: userName,
            email: email,
            password: password,
            phone: phone,
            address: address,
            role: role,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((data) => {
          if (data) {
            setIsUserChanged(!isUserChanged);
            axios
              .post("http://localhost:5000/tracking/save", {
                username: data.data.token.name,
                action: `Update Data of (${userName})`,
              })
              .then((data) => {
                if (data) {
                  setIsActionChanged(!isActionChanged);
                  setUserName("");
                  setEmail("");
                  setPassword("");
                  setDisabled(false);
                  setPhone("");
                  setAddress("");
                  setRole("default");
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
          "http://localhost:5000/users/save",
          {
            name: userName,
            email: email,
            password: password,
            phone: phone,
            address: address,
            role: role,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((data) => {
          if (data) {
            setIsUserChanged(!isUserChanged);
            axios
              .post("http://localhost:5000/tracking/save", {
                username: data.data.token.name,
                action: `Add New User with Name (${userName})`,
              })
              .then((data) => {
                if (data) {
                  setIsActionChanged(!isActionChanged);
                  setUserName("");
                  setEmail("");
                  setPassword("");
                  setPhone("");
                  setAddress("");
                  setRole("default");
                  setId("");
                }
              })
              .catch((error) => console.log(error));
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
        setRole(data[0].role);
        setId(data[0]._id);
        setDisabled(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [deletedUsername, setDeletedUsername] = useState("");

  async function getDeletedUserName(id) {
    const deletedData = await fetch("http://localhost:5000/users/show/" + id);
    const found = await deletedData.json();
    setDeletedUsername(found[0].name);
  }

  function deleteUser(id) {
    const token = JSON.parse(localStorage.getItem("token"));
    axios
      .put(
        "http://localhost:5000/users/delete/" + id,
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
          setIsUserChanged(!isUserChanged);
          setDisplayUserDelete(false);
          axios
            .post("http://localhost:5000/tracking/save", {
              username: data.data.token.name,
              action: `Delete User with Name (${deletedUsername})`,
            })
            .then((data) => {
              if (data) {
                setIsActionChanged(!isActionChanged);
              }
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  }

  // function to get data of user that will be change his password
  function getDataOfUser(id) {
    fetch("http://localhost:5000/users/show/" + id)
      .then((response) => response.json())
      .then((data) => {
        setUserChangePasswordId(data[0]._id);
        setUserChangePasswordName(data[0].name);
        setUserChangePasswordEmail(data[0].email);
        setUserChangePasswordAddress(data[0].address);
        setUserChangePasswordPhone(data[0].phone);
        setUserChangePasswordRole(data[0].role);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function checkPasswords() {
    if (userNewPassword == userConfirmNewPassword) {
      updatePassword(userChangePasswordId);
    } else {
      setTowPasswordSame(true);
    }
  }

  function updatePassword(id) {
    const token = JSON.parse(localStorage.getItem("token"));
    axios
      .put(
        "http://localhost:5000/users/updatePassword/" + id,
        {
          prePassword: userCurrentPassword,
          newPassword: userNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((data) => {
        if (data.data.message !== "current password is incorrect") {
          setIsUserChanged(!isUserChanged);
          setChangePassword(false);
          setChangePasswordDone(true);

          axios
            .post("http://localhost:5000/tracking/save", {
              username: data.data.token.name,
              action: `Update Password for User (${userChangePasswordName})`,
            })
            .then((data) => {
              if (data) {
                setIsActionChanged(!isActionChanged);
              }
            })
            .catch((error) => console.log(error));
        } else {
          setCurrentPassword(true);
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
              <Col xs={6} md={3}></Col>
              <Col xs={6} md={3}></Col>
              <Col xs={6} md={3}></Col>
              <Col xs={6} md={3}>
                <Button
                  variant="primary"
                  className={styles.btnTracking}
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  <Row>
                    <Col xs={8}>User Actions</Col>
                    <Col xs={4}>
                      <Image
                        src="/img/eye-tracking.png"
                        width="50px"
                        height="50px"
                      />
                    </Col>
                  </Row>
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs={6} md={3}>
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
              <Col xs={6} md={3}>
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
              <Col xs={6} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Password<span>*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    disabled={disabled}
                    password={password}
                    autoComplete="off"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={6} md={3}>
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
            </Row>

            <Row>
              <Col xs={6} md={3}>
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
              <Col xs={6} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Role<span>*</span>
                  </Form.Label>
                  <Form.Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="default">Choose a Role</option>
                    {roles &&
                      roles.map((role, i) => {
                        return (
                          <option key={i} value={role.name}>
                            {role.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={6} md={3}>
                <Button
                  variant="primary"
                  className={styles.btnAdd}
                  onClick={() => {
                    validationInput();
                    // saveUser();
                  }}
                >
                  <Row>
                    <Col xs={8}>Add User</Col>
                    <Col xs={4}>
                      <Image src="/img/plus.png" width="30px" height="30px" />
                    </Col>
                  </Row>
                </Button>
              </Col>
              <Col xs={6} md={3}>
                <Button
                  variant="primary"
                  className={styles.btnAdd}
                  onClick={() => {
                    setUserName("");
                    setEmail("");
                    setPassword("");
                    setDisabled(false);
                    setPhone("");
                    setAddress("");
                    setRole("default");
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
            <hr />
            <Row>
              <Col>
                <Table striped bordered hover className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Edit</th>
                      <th>Delete</th>
                      <th>Change Password</th>
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
                                  getDeletedUserName(user._id);
                                  setDisplayUserDelete(true);
                                  setDeletedUserId(user._id);
                                }}
                              >
                                <VscTrash className={styles.VscTrash} />
                              </Button>
                            </td>
                            <td>
                              <Button
                                className={styles.btnEdit}
                                onClick={() => {
                                  getDataOfUser(user._id);
                                  setChangePassword(true);
                                }}
                              >
                                <RiLockPasswordLine
                                  className={styles.VscTrash}
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
            Users Actions
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover className={styles.table}>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Action</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {actions &&
                actions.map((action) => {
                  return (
                    <tr>
                      <td>{action.username}</td>
                      <td>{action.action}</td>
                      <td>{action.date}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <SweetAlert
        warning
        show={displayUserDelete}
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title="Are you sure?"
        onConfirm={() => deleteUser(deletedUserId)}
        onCancel={() => setDisplayUserDelete(false)}
        focusCancelBtn
      >
        You will not be able to recover this user!
      </SweetAlert>

      <SweetAlert
        warning
        show={msgError}
        title="Please Enter All Data"
        onConfirm={() => setMsgError(false)}
      ></SweetAlert>

      <SweetAlert
        warning
        show={validEmail}
        title="Please Enter Valid Email"
        onConfirm={() => setValidEmail(false)}
      >
        example@example.com
      </SweetAlert>

      <SweetAlert
        danger
        show={currentPassword}
        title="The Current Password Is Incorrect"
        onConfirm={() => setCurrentPassword(false)}
      ></SweetAlert>

      <SweetAlert
        danger
        show={towPasswordSame}
        title="New Password and Confirm New Password Is Not The Same"
        onConfirm={() => setTowPasswordSame(false)}
      ></SweetAlert>

      <SweetAlert
        success
        show={changePasswordDone}
        title="Password changed successfully"
        onConfirm={() => setChangePasswordDone(false)}
      ></SweetAlert>

      <Modal
        size="lg"
        show={changePassword}
        onHide={() => setChangePassword(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Change User Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Name<span>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={userChangePasswordName}
                    placeholder="Enter name"
                    disabled
                    autoComplete="off"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Email<span>*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={userChangePasswordEmail}
                    disabled
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter address"
                    value={userChangePasswordAddress}
                    disabled
                    autoComplete="off"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    placeholder="Enter phone"
                    value={userChangePasswordPhone}
                    disabled
                    autoComplete="off"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Role<span>*</span>
                  </Form.Label>
                  <Form.Select
                    value={userChangePasswordRole}
                    disabled
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="default">Choose a Role</option>
                    {roles &&
                      roles.map((role, i) => {
                        return (
                          <option key={i} value={role.name}>
                            {role.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    placeholder="Enter Current Password"
                    autoComplete="off"
                    value={userCurrentPassword}
                    onChange={(e) => setUserCurrentPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    placeholder="Enter New Password"
                    autoComplete="off"
                    value={userNewPassword}
                    onChange={(e) => setUserNewPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    placeholder="Confirm New Password"
                    autoComplete="off"
                    value={userConfirmNewPassword}
                    onChange={(e) => setUserConfirmNewPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  variant="primary"
                  className={styles.btnAdd}
                  onClick={() => {
                    checkPasswords();
                  }}
                >
                  <Row>
                    <Col xs={8}>Change Password</Col>
                    <Col xs={4}>
                      <Image src="/img/pencil.png" width="30px" height="30px" />
                    </Col>
                  </Row>
                </Button>
              </Col>
              <Col>
                <Button
                  variant="primary"
                  className={styles.btnAdd}
                  onClick={() => {
                    setUserCurrentPassword("");
                    setUserNewPassword("");
                    setUserConfirmNewPassword("");
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
          </Container>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default users;
