import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  unit: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (id: string) => number
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === newItem.id)

          if (existingItem) {
            const newQuantity = existingItem.quantity + (newItem.quantity || 1)
            toast.success(`Updated ${newItem.name} quantity to ${newQuantity} in cart`, {
              duration: 3000,
              style: {
                background: 'rgba(34, 197, 94, 0.95)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              },
              icon: '🛒',
            })
            return {
              items: state.items.map(item =>
                item.id === newItem.id
                  ? { ...item, quantity: newQuantity }
                  : item
              )
            }
          }

          toast.success(`Added ${newItem.name} to cart`, {
            duration: 3000,
            style: {
              background: 'rgba(34, 197, 94, 0.95)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(34, 197, 94, 0.3)',
            },
            icon: '🛒',
          })

          return {
            items: [...state.items, { ...newItem, quantity: newItem.quantity || 1 }]
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getItemQuantity: (id) => {
        const item = get().items.find(item => item.id === id)
        return item?.quantity || 0
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
    }),
    {
      name: 'marketdotcom-cart',
    }
  )
)
