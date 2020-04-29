import React from 'react'
import { Row, Col, Button, Navbar, NavbarBrand, Container } from 'reactstrap'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom'
import { CreatePage, RoomPage, JoinPage } from './pages'
import io from 'socket.io-client'
import { SyncProvider } from './context'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RTCMultiConnection from 'rtcmulticonnection-react-js'

const socket = io(process.env.REACT_APP_WS_ENDPOINT)
const connection = new RTCMultiConnection()

connection.socketURL = process.env.REACT_APP_RTC_ENDPOINT

connection.dontCaptureUserMedia = true
connection.autoCreateMediaElement = false

connection.codecs = {
  video: 'vp8',
  audio: 'opus',
}

connection.direction = 'one-to-many'

if (process.env.NODE_ENV !== 'development') {
  connection.iceTransportPolicy = 'relay'
  connection.iceProtocols = {
    udp: false,
    tcp: true,
  }
}

if (process.env.REACT_APP_STUN && process.env.REACT_APP_TURN) {
  connection.iceServers = []
  connection.iceServers.push({
    urls: process.env.REACT_APP_STUN,
  })
  connection.iceServers.push({
    urls: process.env.REACT_APP_TURN,
    credential: process.env.REACT_APP_TURN_PWD,
    username: process.env.REACT_APP_TURN_USERNAME,
  })
}

const App = () => {
  return (
    <Router>
      <SyncProvider
        value={{
          socket,
          connection,
        }}
      >
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
              <Route>
                <Redirect to="/" />
              </Route>
            </Switch>
          </Row>
        </Container>
      </SyncProvider>
    </Router>
  )
}

export default App
