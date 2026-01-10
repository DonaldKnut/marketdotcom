import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isValid } from 'date-fns'

// Utility function to merge Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency in Nigerian Naira
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount)
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-NG').format(num)
}

// Format date in a readable format
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (!isValid(dateObj)) return 'Invalid date'
  return format(dateObj, 'MMM dd, yyyy')
}

// Format date with time
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (!isValid(dateObj)) return 'Invalid date'
  return format(dateObj, 'MMM dd, yyyy hh:mm a')
}

// Get relative time (e.g., "2 hours ago")
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (!isValid(dateObj)) return 'Invalid date'
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

// Generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Generate a referral code
export function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Generate a verification code (6 digits)
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number (basic Nigerian format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+234|234|0)[789]\d{9}$/
  return phoneRegex.test(phone)
}

// Calculate discount percentage
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0) return 0
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

// Calculate total price with tax and delivery
export function calculateTotal(
  subtotal: number,
  taxRate: number = 0,
  deliveryFee: number = 0,
  discount: number = 0
): number {
  const tax = subtotal * taxRate
  return subtotal + tax + deliveryFee - discount
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Check if user is admin
export function isAdmin(role: string): boolean {
  return role === 'ADMIN'
}

// Get user initials from name
export function getInitials(name: string): string {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Capitalize first letter
export function capitalize(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Convert snake_case or kebab-case to Title Case
export function toTitleCase(text: string): string {
  if (!text) return ''
  return text
    .split(/[-_\s]+/)
    .map(word => capitalize(word))
    .join(' ')
}

// Get status color classes
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    'on_delivery': 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  }
  return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

// Get order status display text
export function getOrderStatusText(status: string): string {
  const statusTexts: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    on_delivery: 'On Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }
  return statusTexts[status.toLowerCase()] || toTitleCase(status)
}

// Get delivery status display text
export function getDeliveryStatusText(status: string): string {
  const statusTexts: Record<string, string> = {
    scheduled: 'Scheduled',
    in_transit: 'In Transit',
    delivered: 'Delivered',
  }
  return statusTexts[status.toLowerCase()] || toTitleCase(status)
}

// Check if order can be cancelled
export function canCancelOrder(orderDate: Date, windowMinutes: number = 30): boolean {
  const now = new Date()
  const orderTime = new Date(orderDate)
  const diffInMinutes = (now.getTime() - orderTime.getTime()) / (1000 * 60)
  return diffInMinutes <= windowMinutes
}

// Calculate estimated delivery time
export function getEstimatedDeliveryTime(): string {
  const now = new Date()
  const minTime = new Date(now.getTime() + 30 * 60 * 1000) // 30 minutes from now
  const maxTime = new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2 hours from now

  const formatTime = (date: Date) => format(date, 'hh:mm a')
  return `${formatTime(minTime)} - ${formatTime(maxTime)}`
}

// Validate product form
export function validateProductForm(form: any): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  if (!form.name?.trim()) {
    errors.name = 'Product name is required'
  } else if (form.name.length < 2) {
    errors.name = 'Product name must be at least 2 characters'
  }

  if (!form.categoryId) {
    errors.categoryId = 'Category is required'
  }

  if (form.basePrice < 0) {
    errors.basePrice = 'Price cannot be negative'
  }

  if (form.stock < 0) {
    errors.stock = 'Stock cannot be negative'
  }

  if (!form.unit?.trim()) {
    errors.unit = 'Unit is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Sleep utility for testing
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Check if running on client side
export function isClient(): boolean {
  return typeof window !== 'undefined'
}

// Get base URL for API calls
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

// Generate pagination info
export function getPaginationInfo(
  currentPage: number,
  totalItems: number,
  pageSize: number
): {
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  startItem: number
  endItem: number
} {
  const totalPages = Math.ceil(totalItems / pageSize)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return {
    totalPages,
    hasNextPage,
    hasPrevPage,
    startItem,
    endItem,
  }
}

// Deep clone an object
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as unknown as T

  const clonedObj = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key])
    }
  }
  return clonedObj
}