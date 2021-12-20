import Layout from "../components/Layout";
import { Table, Container, Row, Col, Button, Form } from "react-bootstrap";
import styles from "../styles/user.module.css";
import { useEffect, isUserChanged, useState } from "react";

const countriesTable = () => {
  const [users, setUser] = useState([]);

  useEffect(async () => {
    const resUsers = await fetch("http://localhost:5000/users/show");
    const users = await resUsers.json();
    setUser(users);
  }, [isUserChanged]);

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
                    placeholder="Enter name"
                    autoComplete="off"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    email<span>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    autoComplete="off"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                



                </Form.Group>
              </Col>
             
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    password<span>*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
              <Form.Group className="mb-3">
              <Form.Label>
                 phone<span>*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            
            
            
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                  address
                 <span>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    autoComplete="off"
                    onChange={(e) => setUserName(e.target.value)}
                  />


                </Form.Group>
              </Col>
              <Col>
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
              </Col>

              <Col>
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
              </Col>
              
              <Col>

              <Button
              variant="primary"
              className={styles.btn}
             
            >
              Role
            </Button>
              </Col>
            </Row>
            {/*              
              <Col>
              
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
              </Col>
               */}
            {/* </Row> */}
            <Row>
              <Col>
                <Table striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>email</th>
                      <th>phone</th>
                      <th>address</th>
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
