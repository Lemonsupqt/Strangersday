import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const links = {
    portal: [
      { label: 'Home', href: '#home' },
      { label: 'BFF Zone', href: '#friends' },
      { label: 'Game Vault', href: '#games' },
      { label: 'Game Night', href: '#schedule' },
    ],
    features: [
      { label: 'Voice Chat', href: '#' },
      { label: 'Screen Share', href: '#' },
      { label: 'Game Sync', href: '#' },
      { label: 'Achievements', href: '#achievements' },
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'Bug Report', href: '#' },
      { label: 'Feedback', href: '#' },
    ],
  }

  const socials = [
    { icon: '🐦', label: 'Twitter', href: '#' },
    { icon: '💬', label: 'Discord', href: '#' },
    { icon: '📸', label: 'Instagram', href: '#' },
    { icon: '🎮', label: 'Twitch', href: '#' },
  ]

  return (
    <footer 
      className="relative py-16 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, transparent, rgba(10, 10, 15, 1))',
        borderTop: '1px solid rgba(255, 8, 68, 0.1)'
      }}
    >
      {/* Decorative Elements */}
      <div 
        className="absolute top-0 left-0 w-full h-1"
        style={{
          background: 'linear-gradient(90deg, transparent, #ff0844, #7b2cbf, transparent)'
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{
                  background: 'linear-gradient(135deg, #ff0844, #7b2cbf)',
                  boxShadow: '0 0 20px rgba(255, 8, 68, 0.4)'
                }}
              >
                ⚔
              </div>
              <div>
                <h3 
                  className="font-creepy text-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #ff0844, #ff6b9d)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  UPSIDE DOWN
                </h3>
                <p className="text-xs font-elite tracking-widest" style={{ color: '#6b7280' }}>
                  GAMING PORTAL
                </p>
              </div>
            </div>
            <p className="mb-6 max-w-sm" style={{ color: '#a0a0b0' }}>
              Your dark sanctuary for long-distance gaming. Where Stranger Things meets Wednesday Addams, 
              and every gaming session is legendary.
            </p>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all duration-300"
                  style={{
                    background: 'rgba(26, 26, 46, 0.8)',
                    border: '1px solid rgba(255, 8, 68, 0.2)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 8, 68, 0.3), rgba(123, 44, 191, 0.3))'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(26, 26, 46, 0.8)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-gothic font-semibold mb-4 flex items-center gap-2">
              <span>🌀</span>
              <span>Portal</span>
            </h4>
            <ul className="space-y-2">
              {links.portal.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: '#6b7280' }}
                    onMouseOver={(e) => e.target.style.color = '#ff6b9d'}
                    onMouseOut={(e) => e.target.style.color = '#6b7280'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-gothic font-semibold mb-4 flex items-center gap-2">
              <span>⚡</span>
              <span>Features</span>
            </h4>
            <ul className="space-y-2">
              {links.features.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: '#6b7280' }}
                    onMouseOver={(e) => e.target.style.color = '#ff6b9d'}
                    onMouseOut={(e) => e.target.style.color = '#6b7280'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-gothic font-semibold mb-4 flex items-center gap-2">
              <span>💀</span>
              <span>Support</span>
            </h4>
            <ul className="space-y-2">
              {links.support.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: '#6b7280' }}
                    onMouseOver={(e) => e.target.style.color = '#ff6b9d'}
                    onMouseOut={(e) => e.target.style.color = '#6b7280'}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255, 8, 68, 0.1)' }}
        >
          <p className="text-sm text-center md:text-left" style={{ color: '#6b7280' }}>
            © {currentYear} Upside Down Gaming Portal. Made with 🖤 for long-distance BFFs.
          </p>
          <div className="flex items-center gap-6 text-sm" style={{ color: '#6b7280' }}>
            <a 
              href="#" 
              className="hover:text-pink-400 transition-colors"
              onMouseOver={(e) => e.target.style.color = '#ff6b9d'}
              onMouseOut={(e) => e.target.style.color = '#6b7280'}
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="hover:text-pink-400 transition-colors"
              onMouseOver={(e) => e.target.style.color = '#ff6b9d'}
              onMouseOut={(e) => e.target.style.color = '#6b7280'}
            >
              Terms
            </a>
            <a 
              href="#" 
              className="hover:text-pink-400 transition-colors"
              onMouseOver={(e) => e.target.style.color = '#ff6b9d'}
              onMouseOut={(e) => e.target.style.color = '#6b7280'}
            >
              Cookies
            </a>
          </div>
        </div>

        {/* Easter Egg Quote */}
        <div className="mt-8 text-center">
          <p 
            className="font-elite text-xs tracking-wider opacity-50"
            style={{ color: '#ff6b9d' }}
          >
            "In the darkness, we found each other. In gaming, we stay connected." — The Upside Down Manifesto
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
