import React, { useState, useEffect } from 'react'

const Hero = () => {
  const [glitchText, setGlitchText] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)

  const quotes = [
    { text: "Friends don't lie... but they DO rage quit.", author: "The Upside Down Code" },
    { text: "I would rather die than abandon my gaming BFF.", author: "Wednesday's Gaming Manifesto" },
    { text: "Distance means nothing when you're in the same party.", author: "Long Distance Legends" },
    { text: "The monster in the dark? That's just lag.", author: "Hawkins Gaming Guild" },
  ]

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchText(true)
      setTimeout(() => setGlitchText(false), 200)
    }, 5000)

    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 6000)

    return () => {
      clearInterval(glitchInterval)
      clearInterval(quoteInterval)
    }
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stranger Things inspired lights */}
        <div 
          className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl animate-pulse"
          style={{ background: 'rgba(255, 8, 68, 0.15)' }}
        />
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl"
          style={{ 
            background: 'rgba(123, 44, 191, 0.15)',
            animation: 'pulse-glow 4s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)' }}
        />

        {/* Floating Icons */}
        {['🎮', '👾', '🕹️', '⚔️', '🏆', '💀', '🦇', '🕷️'].map((emoji, index) => (
          <div
            key={index}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${10 + (index * 12)}%`,
              top: `${20 + (index % 3) * 25}%`,
              animation: `upside-down-drift ${3 + index}s ease-in-out infinite`,
              animationDelay: `${index * 0.5}s`
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Main Title */}
        <div className="mb-8">
          <p 
            className="font-elite text-lg tracking-[0.5em] mb-4"
            style={{ color: '#ff6b9d' }}
          >
            ☠ WELCOME TO THE ☠
          </p>
          
          <h1 
            className={`font-creepy text-6xl sm:text-8xl md:text-9xl mb-6 leading-none ${glitchText ? 'animate-pulse' : ''}`}
            style={{
              background: 'linear-gradient(135deg, #ff0844 0%, #ff6b9d 50%, #7b2cbf 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: glitchText ? '3px 3px 0 rgba(0, 212, 255, 0.5), -3px -3px 0 rgba(255, 8, 68, 0.5)' : 'none',
              filter: 'drop-shadow(0 0 30px rgba(255, 8, 68, 0.4))'
            }}
          >
            UPSIDE DOWN
          </h1>

          <h2 
            className="font-gothic text-3xl sm:text-4xl md:text-5xl tracking-wider"
            style={{
              color: '#e8e8e8',
              textShadow: '0 0 20px rgba(123, 44, 191, 0.5)'
            }}
          >
            Gaming Portal
          </h2>
        </div>

        {/* Tagline */}
        <p 
          className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 font-light leading-relaxed"
          style={{ color: '#a0a0b0' }}
        >
          Where <span style={{ color: '#ff0844' }}>Stranger Things</span> meets{' '}
          <span style={{ color: '#7b2cbf' }}>Wednesday Addams</span>.
          <br />
          Your dark sanctuary for <span className="font-semibold" style={{ color: '#20e3b2' }}>long-distance gaming</span> with your BFF.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button 
            className="group px-8 py-4 rounded-xl font-gothic font-semibold text-lg tracking-wider transition-all duration-300 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #ff0844, #7b2cbf)',
              boxShadow: '0 0 30px rgba(255, 8, 68, 0.4)'
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <span>🎮</span>
              <span>Enter the Void</span>
            </span>
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            />
          </button>

          <button 
            className="px-8 py-4 rounded-xl font-gothic font-semibold text-lg tracking-wider transition-all duration-300"
            style={{
              background: 'transparent',
              border: '2px solid #7b2cbf',
              color: '#e8e8e8',
              boxShadow: '0 0 20px rgba(123, 44, 191, 0.2)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(123, 44, 191, 0.2)'
              e.target.style.boxShadow = '0 0 30px rgba(123, 44, 191, 0.4)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent'
              e.target.style.boxShadow = '0 0 20px rgba(123, 44, 191, 0.2)'
            }}
          >
            <span className="flex items-center justify-center gap-3">
              <span>👻</span>
              <span>Find Your BFF</span>
            </span>
          </button>
        </div>

        {/* Quote Carousel */}
        <div 
          className="max-w-2xl mx-auto p-6 rounded-2xl"
          style={{
            background: 'rgba(26, 26, 46, 0.6)',
            border: '1px solid rgba(255, 8, 68, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="relative h-20 overflow-hidden">
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500"
              style={{ opacity: 1 }}
            >
              <p className="font-elite text-lg mb-2" style={{ color: '#a0a0b0' }}>
                "{quotes[currentQuote].text}"
              </p>
              <p className="text-sm" style={{ color: '#ff6b9d' }}>
                — {quotes[currentQuote].author}
              </p>
            </div>
          </div>
          
          {/* Quote Navigation Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuote(index)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: currentQuote === index ? '#ff0844' : 'rgba(255, 8, 68, 0.3)',
                  boxShadow: currentQuote === index ? '0 0 10px #ff0844' : 'none'
                }}
              />
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div 
            className="w-8 h-12 rounded-full border-2 flex items-start justify-center p-2"
            style={{ borderColor: 'rgba(255, 8, 68, 0.5)' }}
          >
            <div 
              className="w-1.5 h-3 rounded-full"
              style={{ 
                background: '#ff0844',
                animation: 'float 2s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to top, #0a0a0f, transparent)'
        }}
      />
    </section>
  )
}

export default Hero
