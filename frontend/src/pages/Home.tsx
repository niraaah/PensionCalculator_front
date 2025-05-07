import React, { useState, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import { motion, AnimatePresence } from 'framer-motion'

const PageContainer = styled.div`
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
  background-color: #24382c;
`

const Page = styled(motion.div)`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  position: absolute;
  background-color: transparent;
`

const Title = styled(motion.h1)`
  font-size: 2.8rem;
  color: #F8F7F3;
  margin-bottom: 1rem;
  font-weight: 700;
`

const Subtitle = styled(motion.h2)`
  font-size: 1.8rem;
  color: #F8F7F3;
  margin-bottom: 2rem;
  font-weight: 500;
`

const Description = styled(motion.p)`
  font-size: 1.2rem;
  color: #F8F7F3;
  line-height: 1.6;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`

const StartButton = styled(motion.button)`
  padding: 1.3rem 2.6rem;
  background-color: #f69516;
  color: #222;
  border: none;
  border-radius: 50px;
  font-size: 1.56rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
  transition: background 0.2s, color 0.2s;
  &:hover {
    background-color: #d17d0c;
    color: #222;
  }
`

const ProgressContainer = styled.div`
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 100;
`

const ProgressDot = styled.div<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#f69516' : 'rgba(246, 149, 22, 0.3)'};
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    background-color: #d17d0c;
  }
`

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`

const ArrowButton = styled(motion.button)`
  position: fixed;
  background: none;
  border: none;
  cursor: pointer;
  padding: 1rem;
  z-index: 100;
  opacity: 0.7;
  left: 50%;
  transform: translate(-50%, 0);
  transform-origin: center;
  transition: opacity 0.2s, transform 0.2s;
  &:hover {
    opacity: 1;
    transform: translate(-50%, 0) scale(1.1);
  }
  &:active {
    transform: translate(-50%, 0) scale(0.95);
  }
`

const UpArrowButton = styled(ArrowButton)`
  top: 2rem;
  &:hover {
    opacity: 1;
    transform: translate(-50%, -10px) scale(1.1);
  }
  &:active {
    transform: translate(-50%, -16px) scale(0.95);
  }
`

const DownArrowButton = styled(ArrowButton)`
  bottom: 2rem;
  &:hover {
    opacity: 1;
    transform: translate(-50%, 10px) scale(1.1);
  }
  &:active {
    transform: translate(-50%, 16px) scale(0.95);
  }
`

const ToTopButton = styled.button`
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  width: 48px;
  height: 48px;
  background: #f69516;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  opacity: 0.85;
  transition: background 0.2s, opacity 0.2s, transform 0.2s;
  z-index: 200;
  &:hover {
    background: #d17d0c;
    opacity: 1;
    transform: scale(1.08);
  }
`

const ToTopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#fff">
    <path d="m296-224-56-56 240-240 240 240-56 56-184-183-184 183Zm0-240-56-56 240-240 240 240-56 56-184-183-184 183Z"/>
  </svg>
)

const UpArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#f69516">
    <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/>
  </svg>
)

const DownArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#f69516">
    <path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z"/>
  </svg>
)

const Footer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 1.2rem;
  width: 100%;
  text-align: center;
  font-size: 20px;
  color: #222;
  opacity: 0.3;
  letter-spacing: 0.02em;
  pointer-events: none;
  z-index: 10;
`

const Home = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [showText, setShowText] = useState(false)

  const pages = [
    {
      title: '미래의 나는 연금을 얼마나 받을 수 있을까?',
      subtitle: '나의 노후',
    },
    {
      title: '현재 나이와 건강, 직업, 자산 등을',
      subtitle: '저에게 알려주시면',
    },
    {
      title: '연금 수급 시기에 따른',
      subtitle: '연금 수령액을 알려드릴게요',
    },
    {
      title: '연금 수령액 예측',
      subtitle: '연금 수령 시점에 따라 수령액이 달라집니다',
    },
    {
      title: '나의 노후를 위한 첫걸음',
      subtitle: '시작해볼까요?',
    },
  ]

  const changePage = useCallback((direction: number) => {
    if (isScrolling) return

    setIsScrolling(true)
    const newPage = currentPage + direction
    if (newPage >= 0 && newPage < pages.length) {
      setCurrentPage(newPage)
    }
    setTimeout(() => setIsScrolling(false), 800)
  }, [currentPage, isScrolling, pages.length])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (Math.abs(e.deltaY) < 10) return
      
      if (e.deltaY > 0) {
        changePage(1)
      } else {
        changePage(-1)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        changePage(1)
      } else if (e.key === 'ArrowUp') {
        changePage(-1)
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.touches[0].clientY)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEnd = e.changedTouches[0].clientY
      const diff = touchStart - touchEnd

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          changePage(1)
        } else {
          changePage(-1)
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [changePage, touchStart])

  useEffect(() => {
    setShowText(false)
    const timer = setTimeout(() => {
      setShowText(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [currentPage])

  return (
    <PageContainer>
      <AnimatePresence initial={false} mode="wait">
        {pages.map((page, index) => (
          index === currentPage && (
            <Page
              key={index}
              initial={{ opacity: 0, y: index > currentPage ? 100 : -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: index > currentPage ? -100 : 100 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <TextContainer>
                <Title
                  initial={{ opacity: 0, y: 20 }}
                  animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {page.title}
                </Title>
                <Subtitle
                  initial={{ opacity: 0, y: 20 }}
                  animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {page.subtitle}
                </Subtitle>
                {index === pages.length - 1 && (
                  <StartButton
                    initial={{ opacity: 0, y: 20 }}
                    animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    onClick={() => window.location.href = '/calculator'}
                  >
                    좋아요!
                  </StartButton>
                )}
              </TextContainer>
            </Page>
          )
        ))}
      </AnimatePresence>
      {currentPage > 0 && (
        <UpArrowButton
          onClick={() => changePage(-1)}
        >
          <UpArrowIcon />
        </UpArrowButton>
      )}
      {currentPage < pages.length - 1 && (
        <DownArrowButton
          onClick={() => changePage(1)}
        >
          <DownArrowIcon />
        </DownArrowButton>
      )}
      <ProgressContainer>
        {pages.map((_, index) => (
          <ProgressDot
            key={index}
            active={index === currentPage}
            onClick={() => setCurrentPage(index)}
          />
        ))}
      </ProgressContainer>
      {currentPage > 0 && (
        <ToTopButton onClick={() => setCurrentPage(0)}>
          <ToTopIcon />
        </ToTopButton>
      )}
      <Footer>Powered by 연금술사</Footer>
    </PageContainer>
  )
}

export default Home 