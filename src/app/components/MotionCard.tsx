'use client'
import { Paper } from '@mui/material'
import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  index: number
}

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i }
  })
}

export default function MotionCard({ children, index }: Props) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transition: 'transform 0.3s',
          '&:hover': { transform: 'translateY(-6px)' }
        }}
      >
        {children}
      </Paper>
    </motion.div>
  )
}