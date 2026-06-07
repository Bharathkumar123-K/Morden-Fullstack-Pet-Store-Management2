import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item) => {
    setCart(prev => {
      const id = item.petId || item.productId
      const exists = prev.find(i => (i.petId || i.productId) === id)
      if (exists) {
        if (item.itemType === 'pet') { toast.error('Pet already in cart'); return prev }
        return prev.map(i => (i.productId === id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i))
      }
      toast.success('Added to cart!')
      return [...prev, { ...item, quantity: item.quantity || 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => (i.petId || i.productId) !== id))
  }

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id)
    setCart(prev => prev.map(i => (i.productId === id ? { ...i, quantity } : i)))
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
