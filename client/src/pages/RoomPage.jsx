import React, { useEffect, useState, useRef } from 'react'
import { findDOMNode } from 'react-dom'
import { useRoute } from 'wouter'
import { useHistory } from 'react-router-dom'
import copy from 'copy-to-clipboard'
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
        console.log('seeek')
        if (player.current !== null) {
          console.log(time)
          player.current.currentTime = time
        }
      })

      changePause(socket, () => {
        player.current.pause()
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

  const handleCopy = () => {
    copy(window.location.href)
  }

  const handleSeek = () => {
    if (player.current !== null && admin) {
      seek(socket, player.current.currentTime)
    }
  }

  return (
    <>
      <h2 className="text-center">
        Комната – {id}{' '}
        <Button outline onClick={handleCopy}>
          Скопировать
        </Button>
      </h2>
      {admin && (
        <Form className="m-3" onSubmit={(e) => e.preventDefault()}>
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
            width="640"
            height="360"
            controls={admin}
            onPlay={handlePlay}
            onPause={handlePause}
            onSeeked={handleSeek}
          >
            <source src={video} type="video/mp4" />
          </video>

          {!admin && (
            <Button className="m-3" onClick={handleFullScreen}>
              На весь экран
            </Button>
          )}
        </>
      )}
    </>
  )
}
