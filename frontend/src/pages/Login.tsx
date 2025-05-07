import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`

const LoginForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: #3182f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #2b6cb0;
  }
`

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API 연동
    console.log('Login attempt:', { email, password })
    navigate('/')
  }

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <h2>로그인</h2>
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">로그인</Button>
      </LoginForm>
    </LoginContainer>
  )
}

export default Login 