'use client'
import { useEffect, useRef, useState } from 'react'
import { Box, Fade } from '@mui/material'

interface Props { children: React.ReactNode }

export default function RevealOnScroll({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <Box ref={ref}>
      <Fade in={visible} timeout={600}>
        <Box>{children}</Box>
      </Fade>
    </Box>
  )
}