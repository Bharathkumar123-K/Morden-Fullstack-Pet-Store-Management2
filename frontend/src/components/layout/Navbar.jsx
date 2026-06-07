import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { FiShoppingCart, FiUser, FiMenu, FiX, FiBell, FiHeart, FiLogOut, FiSettings } from 'react-icons/fi'
import { MdPets } from 'react-icons/md'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
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
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <MdPets className="text-2xl" />
            <span>PetStore</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className="text-gray-600 hover:text-primary-600 text-sm font-medium transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user && (
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <FiShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
                )}
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <Link to={getDashboardLink()} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FiSettings /> Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FiUser /> Profile
                    </Link>
                    {user.role === 'customer' && (
                      <>
                        <Link to="/wishlist" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <FiHeart /> Wishlist
                        </Link>
                        <Link to="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <FiShoppingCart /> My Orders
                        </Link>
                      </>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-600 px-3 py-1.5">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-4">Sign Up</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="block py-2 text-gray-600 hover:text-primary-600 text-sm font-medium">
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
