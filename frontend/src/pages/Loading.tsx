import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'

const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #527e66;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
`

const TextContainer = styled.div`
  position: relative;
  height: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`

const Text = styled(motion.div)`
  font-size: 2rem;
  color: #F8F7F3;
  text-align: center;
  position: absolute;
  width: 100%;
  font-weight: 500;
`

const Loading = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const texts = [
    "수고하셨습니다!",
    "제출해주신 데이터는 별도로 저장/활용 되지 않아요",
    "이제 연금을 계산해드릴게요"
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= texts.length - 1) {
          clearInterval(timer)
          setTimeout(() => {
            navigate('/result', { state: location.state })
          }, 3000)
          return prev
        }
        return prev + 1
      })
    }, 2500)

    return () => clearInterval(timer)
  }, [navigate, texts.length, location.state])

  return (
    <LoadingContainer>
      <TextContainer>
        <AnimatePresence>
          {texts.map((text, index) => (
            index <= currentIndex && (
              <Text
                key={text}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ 
                  duration: 1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                style={{ 
                  top: `${index * 120}px`,
                  zIndex: texts.length - index
                }}
              >
                {text}
              </Text>
            )
          ))}
        </AnimatePresence>
      </TextContainer>
    </LoadingContainer>
  )
}

export default Loading 