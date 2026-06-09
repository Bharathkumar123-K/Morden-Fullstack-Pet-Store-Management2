import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { FiShoppingCart, FiUser, FiMenu, FiX, FiBell, FiHeart, FiLogOut, FiSettings } from 'react-icons/fi'
import { MdPets } from 'react-icons/md'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Pets', to: '/pets' },
    { label: 'Products', to: '/products' },
    { label: 'Services', to: '/services' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ]

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin'
    if (user?.role === 'staff') return '/staff'
    return '/dashboard'
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100/80 shadow-sm/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-primary-600 font-black text-2xl tracking-tight font-display hover:scale-[1.02] transition-transform">
            <div className="w-9 h-9 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20">
              <MdPets className="text-xl" />
            </div>
            <span>PetStore</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => {
              const isActive = location.pathname === l.to
              return (
                <Link 
                  key={l.to} 
                  to={l.to} 
                  className={`relative py-2 text-sm font-semibold transition-all duration-300 ${isActive ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
                >
                  {l.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full animate-fade-in" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user && (
              <Link to="/cart" className="relative p-2 text-slate-600 hover:text-primary-600 transition-colors bg-slate-50 hover:bg-primary-50/50 rounded-xl">
                <FiShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce shadow-md shadow-primary-500/30">{cartCount}</span>
                )}
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-100 bg-slate-50">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline text-sm font-semibold text-slate-700 pr-1.5">{user.name?.split(' ')[0]}</span>
                </button>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100/80 py-2.5 z-40 animate-fade-in">
                      <div className="px-4 py-2.5 border-b border-slate-50">
                        <p className="font-bold text-sm text-slate-900 leading-tight">{user.name}</p>
                        <p className="text-xs text-slate-500 capitalize mt-0.5">{user.role}</p>
                      </div>
                      <div className="py-1">
                        <Link to={getDashboardLink()} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                          <FiSettings className="text-slate-400" /> Dashboard
                        </Link>
                        <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                          <FiUser className="text-slate-400" /> Profile
                        </Link>
                        {user.role === 'customer' && (
                          <>
                            <Link to="/wishlist" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                              <FiHeart className="text-slate-400" /> Wishlist
                            </Link>
                            <Link to="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                              <FiShoppingCart className="text-slate-400" /> My Orders
                            </Link>
                          </>
                        )}
                      </div>
                      <div className="border-t border-slate-50 pt-1 mt-1">
                        <button onClick={() => { handleLogout(); setDropdownOpen(false); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                          <FiLogOut /> Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-primary-600 px-4 py-2 rounded-xl transition-all">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5 shadow-sm rounded-xl">Sign Up</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 animate-fade-in space-y-1">
            {navLinks.map(l => {
              const isActive = location.pathname === l.to
              return (
                <Link 
                  key={l.to} 
                  to={l.to} 
                  onClick={() => setMenuOpen(false)} 
                  className={`block py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  {l.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
