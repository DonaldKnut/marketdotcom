"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Save, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/components/forms/product-form"
import { useDashboard } from "@/hooks/useDashboard"
import { useProducts } from "@/hooks/useProducts"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const { categories, products } = useDashboard()
  const { updateProduct } = useProducts(products)
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const productId = params.id as string

  useEffect(() => {
    const foundProduct = products.find(p => p.id === productId)
    if (foundProduct) {
      setProduct(foundProduct)
    }
    setLoading(false)
  }, [products, productId])

  const handleSaveProduct = async (productData: any) => {
    try {
      const updatedProduct = await updateProduct(productId, productData)
      if (updatedProduct) {
        // Success - redirect back to manage products
        router.push("/dashboard?tab=manage-products")
      } else {
        // Handle error
        console.error("Failed to update product")
      }
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/dashboard?tab=manage-products">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard?tab=manage-products"
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-sm text-gray-600">Update product information</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard?tab=manage-products">
                <Button variant="outline" className="flex items-center space-x-2">
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <ProductForm
                initialData={product}
                categories={categories}
                onSubmit={handleSaveProduct}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}