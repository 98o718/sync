import React, { useState } from 'react'
import {
  Form,
  FormGroup,
  Input,
  Button,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { isUuid } from '../../../server/node_modules/uuidv4/build/lib/uuidv4'
import { toast } from 'react-toastify'

export const JoinPage = () => {
  const [id, setId] = useState('')
  const history = useHistory()

  const handleChange = (e) => {
    e.persist()
    setId(e.target.value)
  }

  const handleSubmit = () => {
    if (!isUuid(id)) {
      toast.error('Некорректный идентификатор!')
    } else {
      history.push(`/room/${id}`)
    }
  }

  return (
    <>
      <h2 className="text-center">Присоединиться к комнате</h2>
      <Form className="m-3" onSubmit={(e) => e.preventDefault()}>
        <FormGroup>
          <InputGroup>
            <Input
              className="p-4"
              placeholder="ID"
              value={id}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <InputGroupAddon addonType="append">
              <Button onClick={handleSubmit} type="button" color="success">
                Присоединиться
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
      </Form>
    </>
  )
}
