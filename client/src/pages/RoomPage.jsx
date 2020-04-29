import React, { useEffect, useState, useRef, useCallback } from 'react'
import { findDOMNode } from 'react-dom'
import { useHistory, useParams } from 'react-router-dom'
import copy from 'copy-to-clipboard'
import { isIOS } from 'react-device-detect'
import { leaveRoom, useSync, joinRoom, onRoomJoined } from '../context'
import { isUuid } from 'uuidv4'
import { Button } from 'reactstrap'
import { toast } from 'react-toastify'
import screenfull from 'screenfull'
import { useDropzone } from 'react-dropzone'

export const RoomPage = () => {
  const { socket, connection } = useSync()

  const history = useHistory()
  const { id } = useParams()

  const [admin, setAdmin] = useState()
  const [hidden, setHidden] = useState(false)

  const localPlayer = useRef(null)
  const localStream = useRef(null)

  useEffect(() => {
    connection.checkPresence(id, (isRoomExist, roomid) => {
      if (isRoomExist === true) {
        connection.join(roomid)
      } else {
        connection.open(roomid)
      }
    })
  }, [connection, id])

  useEffect(() => {
    if (admin === false) {
      connection.onstream = (event) => {
        localStream.current.srcObject = event.stream
      }

      connection.onstreamended = () => {
        toast.success('Вещание завершено!')
        history.push('/')
      }
    }
  }, [admin, localStream.current])

  const onDrop = useCallback((acceptedFiles) => {
    if (localPlayer.current !== null) {
      setHidden(true)
      localPlayer.current.src = URL.createObjectURL(acceptedFiles[0])

      connection.attachStreams = [localPlayer.current.captureStream()]
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleFullScreen = () => {
    if (localStream.current !== null)
      screenfull.request(findDOMNode(localStream.current))
  }

  useEffect(() => {
    if (!isUuid(id)) {
      history.push('/')
    } else {
      joinRoom(socket, id)

      onRoomJoined(socket, ({ admin }) => {
        setAdmin(admin)
      })
    }
    return () => {
      if (!isUuid(id)) {
        history.push('/')
      } else {
        leaveRoom(socket)
      }
    }
  }, [history, id, socket])

  const copyURL = () => {
    copy(window.location.href)
    toast.success('Скопировано!')
  }

  const copyID = () => {
    copy(id)
    toast.success('Скопировано!')
  }

  return (
    <>
      <h2 className="text-center">
        {id}
        <div>
          <Button className="m-2" outline onClick={copyID}>
            Скопировать ID
          </Button>
          <Button className="m-2" outline onClick={copyURL}>
            Скопировать ссылку
          </Button>
        </div>
      </h2>

      {admin ? (
        <>
          {!hidden && (
            <div
              {...getRootProps()}
              style={{
                width: '200px',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                background: '#eee',
                padding: 10,
                borderRadius: 10,
                marginBottom: 15,
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p style={{ margin: 0 }}>Отпустите видео сюда ...</p>
              ) : (
                <p style={{ margin: 0 }}>
                  Перетащите сюда видео или нажмите для выбора
                </p>
              )}
            </div>
          )}

          <video
            style={{ display: hidden ? 'block' : 'none' }}
            ref={localPlayer}
            width={400}
            controls
          />
        </>
      ) : (
        <>
          <video width="100%" ref={localStream} autoPlay playsInline />

          {admin === false && !isIOS && (
            <Button className="m-3" onClick={handleFullScreen}>
              На весь экран
            </Button>
          )}
        </>
      )}
    </>
  )
}
