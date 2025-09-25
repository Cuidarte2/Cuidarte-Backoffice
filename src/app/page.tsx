'use client'
import {
  Container,
  Box,
  Typography,
  Button,
} from '@mui/material'

import RevealOnScroll from './components/RevealOnScroll'
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import Link from 'next/link';
import { MotionTypography } from './components/MotionTypography';

export default function HomePage() {


  return (
    <>
      {/* Hero */}
      <script src="https://elfsightcdn.com/platform.js" async></script>
      <Box
        component="section"
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '50vh', sm: '60vh' },
          backgroundImage: 'url(/fondo2.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0, 0, 0, 0.4)'
          }
        }}
      >
        <MotionTypography
          variant="h1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.02, textShadow: '0px 4px 8px rgba(0,0,0,0.8)' }}
          sx={{
            position: 'relative',
            zIndex: 1,
            color: 'common.white',
            fontWeight: 300,
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            textAlign: 'center',
            cursor: 'default'
          }}
        >
          Cuidarte te atiende<br />los 365 días del año
        </MotionTypography>
      </Box>

      {/* Contenido */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 8 } }}>
        <RevealOnScroll>
          {/* Misión */}
          <Box textAlign="center" mb={{ xs: 4, md: 6 }} px={{ xs: 2, md: 0 }}>
            <MotionTypography
              variant="h4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ color: 'primary.dark', scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200 }}
              gutterBottom
              sx={{ cursor: 'pointer' }}
            >
              Nuestra Misión
            </MotionTypography>
            <Typography color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.6 }}>
              Cuidarte: así nos definimos…
              Concebimos los cuidados como un verdadero arte, en el sentido de saber trasmitir toda la empatía y entrega a quienes lo requieren. Somos un equipo multidisciplinario dedicados a brindar cuidados profesionales
            </Typography>
          </Box>

          {/* Visión */}
          <Box textAlign="center" mb={{ xs: 4, md: 6 }} px={{ xs: 2, md: 0 }}>
            <MotionTypography
              variant="h4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ color: 'primary.dark', scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200 }}
              gutterBottom
              sx={{ cursor: 'pointer' }}
            >
              Nuestra Visión
            </MotionTypography>
            <Typography color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.6 }}>
              Brindar tranquilidad, tanto a la familia como a la persona que requiere cuidados es fundamental, por lo que nuestra tarea debe ser realizada por profesionales comprometidos y experiencia, quienes mediante la empatía y la practicidad podrán brindar soluciones a quienes estén afrontando un quebranto de salud.
            </Typography>
          </Box>
          <div
            className="elfsight-app-c59f9ef4-7e7a-456c-aede-386b4a062036"
            data-elfsight-app-lazy
          ></div>


          {/* CTA */}
          <Box textAlign="center" mb={{ xs: 6, md: 8 }}>
            <MotionTypography
              variant="h5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, color: 'secondary.main' }}
              transition={{ duration: 0.6 }}
              gutterBottom
              sx={{ cursor: 'pointer' }}
            >
              ¿Quieres saber más? Ponte en contacto ahora
            </MotionTypography>
            <Button
              component="a"
              href="https://wa.me/59891234567?text=¡Hola%20quiero%20más%20info!"
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              startIcon={<WhatsAppIcon />}
              sx={{
                mt: 2,
                bgcolor: '#25D366',
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.08)',
                  boxShadow: theme => theme.shadows[8],
                  bgcolor: '#1ebe5b'
                }
              }}
            >
              Chateá con nosotros
            </Button>
          </Box>
        </RevealOnScroll>
      </Container>

      {/* Footer */}
      <Box component="footer" bgcolor="grey.100" py={{ xs: 4, sm: 6 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © Cuidarte 2024.
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            098500411 – comercialcuidarte2@gmail.com
          </Typography>
          <Box sx={{ display: 'inline-flex', gap: 4, mt: 1 }}>
            <Link href="https://www.instagram.com/cuidarte.sh/" target="_blank" rel="noopener">
              <Box
                component="span"
                sx={{
                  color: 'text.secondary',
                  transition: 'color 0.3s, transform 0.3s',
                  '&:hover': {
                    color: 'primary.main',
                    transform: 'rotate(20deg) scale(1.2)'
                  },
                  display: 'inline-flex'
                }}
              >
                <InstagramIcon fontSize="large" />
              </Box>
            </Link>
            <Link href="https://www.facebook.com/..." target="_blank" rel="noopener">
              <Box
                component="span"
                sx={{
                  color: 'text.secondary',
                  transition: 'color 0.3s, transform 0.3s',
                  '&:hover': {
                    color: 'primary.main',
                    transform: 'rotate(-20deg) scale(1.2)'
                  },
                  display: 'inline-flex'
                }}
              >
                <FacebookIcon fontSize="large" />
              </Box>
            </Link>
          </Box>
        </Container>
      </Box>
    </>
  )


}