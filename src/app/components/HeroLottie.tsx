import Image from 'next/image'
import { Box, Container, Typography, Button } from '@mui/material'

export default function Hero() {
  return (
    <Box
      sx={{
        position: 'relative',
        height: 450,
        backgroundColor: 'grey.800',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'common.white'
      }}
    >
      <Image
        src="/hero-seniors.jpg"
        alt="Acompañamiento a adultos mayores"
        fill
        style={{ objectFit: 'cover', filter: 'brightness(0.6)' }}
      />
      <Container sx={{ position: 'relative', textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Acompañamiento con cariño<br/>y profesionalismo
        </Typography>
        <Button variant="contained" color="secondary" size="large">
          Conocé nuestros planes
        </Button>
      </Container>
    </Box>
  )
}
