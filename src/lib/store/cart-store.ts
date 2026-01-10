import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  maxQuantity: number // stock available
  variation?: {
    id: string
    name: string
    type: string
  }
}

interface CartStore {
  items: CartItem[]
  totalItems: number
  totalPrice: number

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (productId: string, variationId?: string) => number
  isInCart: (productId: string, variationId?: string) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (newItem) => {
        const { items } = get()
        const quantity = newItem.quantity || 1
        const itemKey = newItem.variation
          ? `${newItem.productId}-${newItem.variation.id}`
          : newItem.productId

        const existingItemIndex = items.findIndex(item => {
          const existingKey = item.variation
            ? `${item.productId}-${item.variation.id}`
            : item.productId
          return existingKey === itemKey
        })

        let updatedItems: CartItem[]

        if (existingItemIndex >= 0) {
          // Update existing item quantity
          const existingItem = items[existingItemIndex]
          const newQuantity = Math.min(
            existingItem.quantity + quantity,
            existingItem.maxQuantity
          )

          updatedItems = [...items]
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantity
          }
        } else {
          // Add new item
          updatedItems = [...items, { ...newItem, quantity }]
        }

        // Calculate totals
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        set({ items: updatedItems, totalItems, totalPrice })
      },

      removeItem: (itemId) => {
        const { items } = get()
        const updatedItems = items.filter(item => item.id !== itemId)

        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        set({ items: updatedItems, totalItems, totalPrice })
      },

      updateQuantity: (itemId, quantity) => {
        const { items } = get()

        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        const updatedItems = items.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              quantity: Math.min(quantity, item.maxQuantity)
            }
          }
          return item
        })

        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        set({ items: updatedItems, totalItems, totalPrice })
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 })
      },

      getItemQuantity: (productId, variationId) => {
        const { items } = get()
        const item = items.find(item => {
          if (variationId) {
            return item.productId === productId && item.variation?.id === variationId
          }
          return item.productId === productId && !item.variation
        })
        return item?.quantity || 0
      },

      isInCart: (productId, variationId) => {
        const { items } = get()
        return items.some(item => {
          if (variationId) {
            return item.productId === productId && item.variation?.id === variationId
          }
          return item.productId === productId && !item.variation
        })
      }
    }),
    {
      name: 'marketdotcom-cart',
      version: 1,
    }
  )
)
