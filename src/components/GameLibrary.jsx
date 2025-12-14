import React, { useState } from 'react'

const GameLibrary = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', label: 'All Games', icon: '🎮' },
    { id: 'horror', label: 'Horror', icon: '👻' },
    { id: 'coop', label: 'Co-op', icon: '🤝' },
    { id: 'competitive', label: 'Competitive', icon: '⚔️' },
    { id: 'adventure', label: 'Adventure', icon: '🗺️' },
    { id: 'wishlist', label: 'Wishlist', icon: '⭐' },
  ]

  const games = [
    {
      id: 1,
      title: "Dead by Daylight",
      cover: "🔪",
      category: "horror",
      rating: 9.5,
      hoursPlayed: 247,
      bffPlayed: true,
      lastSession: "2 hours ago",
      description: "Survive the killer or become one",
      tags: ["Horror", "Survival", "Multiplayer"],
      color: "#ff0844"
    },
    {
      id: 2,
      title: "Phasmophobia",
      cover: "👻",
      category: "horror",
      rating: 9.2,
      hoursPlayed: 156,
      bffPlayed: true,
      lastSession: "Yesterday",
      description: "Ghost hunting with friends",
      tags: ["Horror", "Co-op", "Investigation"],
      color: "#7b2cbf"
    },
    {
      id: 3,
      title: "It Takes Two",
      cover: "💕",
      category: "coop",
      rating: 9.8,
      hoursPlayed: 34,
      bffPlayed: true,
      lastSession: "Last week",
      description: "The ultimate co-op adventure",
      tags: ["Co-op", "Adventure", "Puzzle"],
      color: "#ff6b9d"
    },
    {
      id: 4,
      title: "Lethal Company",
      cover: "🏭",
      category: "horror",
      rating: 9.0,
      hoursPlayed: 89,
      bffPlayed: true,
      lastSession: "3 days ago",
      description: "Corporate horror meets chaos",
      tags: ["Horror", "Co-op", "Survival"],
      color: "#20e3b2"
    },
    {
      id: 5,
      title: "Valorant",
      cover: "🎯",
      category: "competitive",
      rating: 8.5,
      hoursPlayed: 412,
      bffPlayed: true,
      lastSession: "Today",
      description: "Tactical shooter supremacy",
      tags: ["Competitive", "FPS", "Team"],
      color: "#ff0844"
    },
    {
      id: 6,
      title: "Overwatch 2",
      cover: "🦸",
      category: "competitive",
      rating: 8.0,
      hoursPlayed: 289,
      bffPlayed: true,
      lastSession: "4 hours ago",
      description: "Heroes never die",
      tags: ["Competitive", "FPS", "Hero Shooter"],
      color: "#00d4ff"
    },
    {
      id: 7,
      title: "Stardew Valley",
      cover: "🌾",
      category: "coop",
      rating: 9.7,
      hoursPlayed: 198,
      bffPlayed: true,
      lastSession: "2 weeks ago",
      description: "Farm life with your bestie",
      tags: ["Co-op", "Farming", "Relaxing"],
      color: "#d4af37"
    },
    {
      id: 8,
      title: "The Forest",
      cover: "🌲",
      category: "horror",
      rating: 8.8,
      hoursPlayed: 67,
      bffPlayed: true,
      lastSession: "Last month",
      description: "Survive the cannibals",
      tags: ["Horror", "Survival", "Building"],
      color: "#7b2cbf"
    },
    {
      id: 9,
      title: "Hollow Knight",
      cover: "🗡️",
      category: "adventure",
      rating: 9.6,
      hoursPlayed: 78,
      bffPlayed: false,
      lastSession: "Playing solo",
      description: "Dark and beautiful metroidvania",
      tags: ["Adventure", "Metroidvania", "Indie"],
      color: "#1a1a2e"
    },
    {
      id: 10,
      title: "Little Nightmares III",
      cover: "🎭",
      category: "wishlist",
      rating: null,
      hoursPlayed: 0,
      bffPlayed: false,
      lastSession: "Coming Soon",
      description: "Awaiting release with BFF",
      tags: ["Horror", "Co-op", "Adventure"],
      color: "#ff0844",
      isWishlist: true
    },
    {
      id: 11,
      title: "Silent Hill 2 Remake",
      cover: "🌫️",
      category: "wishlist",
      rating: null,
      hoursPlayed: 0,
      bffPlayed: false,
      lastSession: "On Wishlist",
      description: "Psychological horror returns",
      tags: ["Horror", "Story", "Remake"],
      color: "#7b2cbf",
      isWishlist: true
    },
    {
      id: 12,
      title: "Sea of Thieves",
      cover: "🏴‍☠️",
      category: "adventure",
      rating: 8.7,
      hoursPlayed: 124,
      bffPlayed: true,
      lastSession: "5 days ago",
      description: "Pirate adventures await",
      tags: ["Adventure", "Co-op", "Open World"],
      color: "#00d4ff"
    },
  ]

  const filteredGames = games.filter(game => {
    const matchesFilter = activeFilter === 'all' || game.category === activeFilter
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <section id="games" className="py-24 relative">
      {/* Background Accent */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(123, 44, 191, 0.2) 0%, transparent 60%)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p 
            className="font-elite text-sm tracking-[0.3em] mb-4"
            style={{ color: '#ff0844' }}
          >
            🎮 YOUR DARK COLLECTION 🎮
          </p>
          <h2 
            className="font-creepy text-5xl md:text-6xl mb-6"
            style={{
              background: 'linear-gradient(135deg, #ff0844, #ff6b9d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            GAME VAULT
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#a0a0b0' }}>
            Your curated collection of goated games. Every title a memory, every session legendary.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search your vault..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-4 pl-12 rounded-xl"
                style={{
                  background: 'rgba(26, 26, 46, 0.9)',
                  border: '1px solid rgba(255, 8, 68, 0.3)',
                  color: '#e8e8e8'
                }}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className="px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2"
                style={{
                  background: activeFilter === cat.id 
                    ? 'linear-gradient(135deg, rgba(255, 8, 68, 0.3), rgba(123, 44, 191, 0.3))' 
                    : 'rgba(26, 26, 46, 0.6)',
                  border: activeFilter === cat.id 
                    ? '1px solid rgba(255, 8, 68, 0.5)' 
                    : '1px solid rgba(255, 8, 68, 0.2)',
                  color: activeFilter === cat.id ? '#ff6b9d' : '#a0a0b0',
                  boxShadow: activeFilter === cat.id ? '0 0 15px rgba(255, 8, 68, 0.2)' : 'none'
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 p-6 rounded-2xl"
          style={{
            background: 'rgba(26, 26, 46, 0.6)',
            border: '1px solid rgba(255, 8, 68, 0.2)'
          }}
        >
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#ff0844' }}>
              {games.filter(g => !g.isWishlist).length}
            </p>
            <p className="text-sm" style={{ color: '#6b7280' }}>Games Owned</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#7b2cbf' }}>
              {games.reduce((acc, g) => acc + g.hoursPlayed, 0)}h
            </p>
            <p className="text-sm" style={{ color: '#6b7280' }}>Hours Played</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#20e3b2' }}>
              {games.filter(g => g.bffPlayed).length}
            </p>
            <p className="text-sm" style={{ color: '#6b7280' }}>Played with BFF</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold" style={{ color: '#d4af37' }}>
              {games.filter(g => g.isWishlist).length}
            </p>
            <p className="text-sm" style={{ color: '#6b7280' }}>On Wishlist</p>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="group relative rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer"
              style={{
                background: 'rgba(26, 26, 46, 0.8)',
                border: `1px solid ${game.isWishlist ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 8, 68, 0.2)'}`,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                e.currentTarget.style.boxShadow = `0 20px 40px ${game.color}40`
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Game Cover */}
              <div 
                className="h-40 flex items-center justify-center relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${game.color}40, ${game.color}10)`
                }}
              >
                <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
                  {game.cover}
                </span>
                
                {/* BFF Badge */}
                {game.bffPlayed && !game.isWishlist && (
                  <div 
                    className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                    style={{
                      background: 'rgba(32, 227, 178, 0.2)',
                      border: '1px solid rgba(32, 227, 178, 0.4)',
                      color: '#20e3b2'
                    }}
                  >
                    <span>👯</span> BFF
                  </div>
                )}

                {/* Wishlist Badge */}
                {game.isWishlist && (
                  <div 
                    className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                    style={{
                      background: 'rgba(212, 175, 55, 0.2)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      color: '#d4af37'
                    }}
                  >
                    <span>⭐</span> SOON
                  </div>
                )}

                {/* Rating */}
                {game.rating && (
                  <div 
                    className="absolute top-3 left-3 px-2 py-1 rounded-lg text-sm font-bold"
                    style={{
                      background: 'rgba(10, 10, 15, 0.8)',
                      color: game.rating >= 9 ? '#d4af37' : '#e8e8e8'
                    }}
                  >
                    ★ {game.rating}
                  </div>
                )}
              </div>

              {/* Game Info */}
              <div className="p-4">
                <h3 className="font-gothic text-lg font-semibold mb-2 line-clamp-1">
                  {game.title}
                </h3>
                <p className="text-sm mb-3 line-clamp-1" style={{ color: '#6b7280' }}>
                  {game.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {game.tags.slice(0, 2).map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-0.5 rounded text-xs"
                      style={{
                        background: 'rgba(123, 44, 191, 0.2)',
                        color: '#a0a0b0'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between text-xs" style={{ color: '#6b7280' }}>
                  {!game.isWishlist ? (
                    <>
                      <span>🕐 {game.hoursPlayed}h played</span>
                      <span>{game.lastSession}</span>
                    </>
                  ) : (
                    <span>{game.lastSession}</span>
                  )}
                </div>
              </div>

              {/* Hover Overlay */}
              <div 
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'rgba(10, 10, 15, 0.9)'
                }}
              >
                <button 
                  className="px-6 py-3 rounded-xl font-gothic font-semibold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #ff0844, #7b2cbf)',
                    boxShadow: '0 0 20px rgba(255, 8, 68, 0.4)'
                  }}
                >
                  {game.isWishlist ? '🔔 Get Notified' : '🎮 Launch Game'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredGames.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🕳️</span>
            <p className="font-gothic text-xl" style={{ color: '#6b7280' }}>
              No games found in this dimension...
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default GameLibrary
