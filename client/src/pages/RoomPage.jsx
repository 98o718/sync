import React, { useEffect, useState, useRef } from 'react'
import { findDOMNode } from 'react-dom'
import { useRoute } from 'wouter'
import { useHistory } from 'react-router-dom'
import copy from 'copy-to-clipboard'
import { isIOS } from 'react-device-detect'
import {
  leaveRoom,
  useSocket,
  joinRoom,
  onRoomJoined,
  changeUrl,
  handleUrlChange,
  changePlay,
  play,
  pause,
  changePause,
  seek,
  changeSeek,
} from '../socket'
import { isUuid } from 'uuidv4'
import {
  Form,
  FormGroup,
  Input,
  Button,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap'
import { toast } from 'react-toastify'
import screenfull from 'screenfull'

export const RoomPage = () => {
  const socket = useSocket()

  const history = useHistory()
  const [, { id }] = useRoute('/room/:id')

  const [admin, setAdmin] = useState(false)
  const [url, setUrl] = useState('https://ohhmode.ru/09.mp4')
  const [video, setVideo] = useState()

  const player = useRef(null)

  const handleChange = (e) => {
    e.persist()
    setUrl(e.target.value)
  }

  const handleSubmit = () => {
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/i

    if (!urlRegex.test(url)) {
      toast.error('Введите корректный URL!')
    } else {
      toast.success('Видео добавлено!')
      setVideo(url)
      changeUrl(socket, url)
    }
  }

  const handleFullScreen = () => {
    if (player.current !== null) screenfull.request(findDOMNode(player.current))
  }

  useEffect(() => {
    if (!admin) {
      handleUrlChange(socket, (url) => setVideo(url))

      changePlay(socket, (time) => {
        if (player.current !== null) {
          player.current.currentTime = time
          player.current.play()
        }
      })

      changeSeek(socket, (time) => {
        if (player.current !== null) {
          player.current.currentTime = time
        }
      })

      changePause(socket, () => {
        if (player.current !== null) {
          player.current.pause()
        }
      })
    } else {
      socket.off('play')
      socket.off('seek')
      socket.off('pause')
    }
  }, [admin, socket])

  useEffect(() => {
    if (!id) history.push('/')
  }, [id, history])

  useEffect(() => {
    if (!isUuid(id)) {
      history.push('/')
    } else {
      joinRoom(socket, id)

      onRoomJoined(socket, ({ admin, url }) => {
        setAdmin(admin)
        if (url !== null) setVideo(url)
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

  const handlePlay = () => {
    if (player.current !== null && admin) {
      player.current.play()
      play(socket, player.current.currentTime)
    }
  }

  const handlePause = () => {
    if (player.current !== null && admin) {
      player.current.pause()
      pause(socket)
    }
  }

  const copyURL = () => {
    copy(window.location.href)
    toast.success('Скопировано!')
  }

  const copyID = () => {
    copy(id)
    toast.success('Скопировано!')
  }

  const handleSeek = () => {
    if (player.current !== null && admin) {
      seek(socket, player.current.currentTime)
    }
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
      {admin && (
        <Form className="m-2" onSubmit={(e) => e.preventDefault()}>
          <FormGroup>
            <InputGroup>
              <Input
                className="p-4"
                placeholder="URL"
                value={url}
                onChange={handleChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <InputGroupAddon addonType="append">
                <Button onClick={handleSubmit} type="button" color="success">
                  Добавить
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
        </Form>
      )}

      {video && (
        <>
          <video
            ref={player}
            id="vid"
            width="100%"
            // width="640"
            // height="360"
            controls={admin || isIOS}
            onPlay={handlePlay}
            onPause={handlePause}
            onSeeked={handleSeek}
          >
            <source src={video} type="video/mp4" />
          </video>

          {!admin && !isIOS && (
            <Button className="m-3" onClick={handleFullScreen}>
              На весь экран
            </Button>
          )}
        </>
      )}
    </>
  )
}
