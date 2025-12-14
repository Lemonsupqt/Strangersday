import React, { useEffect, useRef } from 'react'

const ParticleBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = canvas.height + 10
        this.size = Math.random() * 3 + 1
        this.speedY = Math.random() * 0.5 + 0.2
        this.speedX = (Math.random() - 0.5) * 0.3
        this.opacity = Math.random() * 0.5 + 0.2
        this.color = this.getRandomColor()
        this.rotation = 0
        this.rotationSpeed = (Math.random() - 0.5) * 0.02
      }

      getRandomColor() {
        const colors = [
          'rgba(255, 8, 68, ',    // Demogorgon red
          'rgba(123, 44, 191, ',  // Wednesday purple
          'rgba(0, 212, 255, ',   // Neon blue
          'rgba(255, 107, 157, ', // Eleven pink
        ]
        return colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.y -= this.speedY
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.2
        this.rotation += this.rotationSpeed
        
        if (this.y < -10) {
          this.reset()
        }
      }

      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color + this.opacity + ')'
        ctx.shadowBlur = 10
        ctx.shadowColor = this.color + '1)'
        
        // Draw a small cross/plus shape for some particles
        if (this.size > 2) {
          ctx.fillRect(-this.size/4, -this.size, this.size/2, this.size * 2)
          ctx.fillRect(-this.size, -this.size/4, this.size * 2, this.size/2)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, this.size, 0, Math.PI * 2)
          ctx.fill()
        }
        
        ctx.restore()
      }
    }

    const init = () => {
      resize()
      particles = []
      for (let i = 0; i < 50; i++) {
        const p = new Particle()
        p.y = Math.random() * canvas.height // Spread initial particles
        particles.push(p)
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })
      
      animationFrameId = requestAnimationFrame(animate)
    }

    init()
    animate()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}

export default ParticleBackground
