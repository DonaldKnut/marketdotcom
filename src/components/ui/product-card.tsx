'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Plus,
  Minus,
  ShoppingCart,
  Star,
  Heart,
  Package,
  Edit,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Product } from '@prisma/client'
import { formatCurrency, getInitials, cn } from '@/lib/helpers'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product, variation?: any, quantity?: number) => void
  onEdit?: (product: Product) => void
  onDelete?: (productId: string) => void
  className?: string
  showAdminActions?: boolean
}

export function ProductCard({
  product,
  onAddToCart,
  onEdit,
  onDelete,
  className,
  showAdminActions = false,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariation, setSelectedVariation] = useState((product as any).variations?.[0] || null)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, selectedVariation, quantity)
    }
  }

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 99))
  }

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1))
  }

  const currentPrice = selectedVariation ? selectedVariation.price : product.basePrice
  const hasVariations = (product as any).variations?.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("group", className)}
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-100 to-orange-200">
              <Package className="h-12 w-12 text-orange-400" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {!product.inStock && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
            {hasVariations && (
              <Badge variant="secondary" className="text-xs">
                Multiple Options
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isWishlisted ? "text-red-500 fill-red-500" : "text-gray-400"
              )}
            />
          </button>

          {/* Admin Actions */}
          {showAdminActions && (
            <div className="absolute top-2 right-2 flex gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-sm"
                >
                  <Edit className="h-3 w-3" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors shadow-sm"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Category */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs">
              {(product as any).category?.name}
            </Badge>
            <div className="flex items-center text-xs text-gray-500">
              <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
              <span>4.5</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>

          {/* Variations */}
          {hasVariations && (
            <div className="mb-3">
              <select
                value={selectedVariation?.id || ''}
                onChange={(e) => {
                  const variation = (product as any).variations?.find((v: any) => v.id === e.target.value)
                  setSelectedVariation(variation || null)
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {(product as any).variations?.map((variation: any) => (
                  <option key={variation.id} value={variation.id}>
                    {variation.name} - {formatCurrency(variation.price)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Price and Stock */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-orange-600">
                {formatCurrency(currentPrice)}
              </span>
              {hasVariations && selectedVariation && (
                <span className="text-xs text-gray-500">
                  per {product.unit}
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-600">
                {product.stock} {product.unit}
              </span>
              <div className="text-xs text-gray-500">
                in stock
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {product.inStock ? (
            <div className="w-full space-y-3">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-2 text-sm font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= 99}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              {onAddToCart && (
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              )}
            </div>
          ) : (
            <Button disabled className="w-full">
              Out of Stock
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}