import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Global, css } from '@emotion/react'
import Home from './pages/Home'
import Calculator from './pages/Calculator'
import Loading from './pages/Loading'
import Result from './pages/Result'

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700&display=swap');
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'IBM Plex Sans KR', sans-serif;
  }
`

function App() {
  return (
    <Router>
      <Global styles={globalStyles} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  )
}

export default App 