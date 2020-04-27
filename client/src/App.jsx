import React from 'react'
import { Row, Col, Button, Navbar, NavbarBrand, Container } from 'reactstrap'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { CreatePage, RoomPage, JoinPage } from './pages'
import io from 'socket.io-client'
import { SocketProvider } from './socket'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const socket = io(process.env.REACT_APP_WS_ENDPOINT)

const App = () => {
  return (
    <Router>
      <SocketProvider socket={socket}>
        <ToastContainer position="top-center" autoClose={1500} />
        <Navbar
          className="bg-primary"
          dark
          style={{ width: '100%' }}
          expand="md"
        >
          <NavbarBrand color="white" tag={Link} to="/">
            sync
          </NavbarBrand>
        </Navbar>
        <Container>
          <Row className="w-100 flex-column align-items-center p-3 m-0">
            <Switch>
              <Route exact path="/">
                <Col
                  style={{ width: '100%', maxWidth: 230 }}
                  className="d-flex flex-column flex-grow-0"
                >
                  <Button
                    color="primary"
                    className="m-2 p-3"
                    tag={Link}
                    to="create"
                  >
                    Создать комнату
                  </Button>
                  <Button
                    color="success"
                    className="m-2 p-3"
                    tag={Link}
                    to="join"
                  >
                    Присоединиться
                  </Button>
                </Col>
              </Route>

              <Route path="/create" component={CreatePage} />
              <Route path="/join" component={JoinPage} />
              <Route path="/room/:id" component={RoomPage} />
            </Switch>
          </Row>
        </Container>
      </SocketProvider>
    </Router>
  )
}

export default App
