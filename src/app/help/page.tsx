"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  ChevronRight,
  Star,
  Truck,
  CreditCard,
  ShoppingCart,
  User,
  ArrowLeft,
  Home,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

interface ContactMethod {
  icon: any
  title: string
  description: string
  action: string
  link: string
  available: string
  priority: number
}

interface Guide {
  id: string
  title: string
  description: string
  icon: any
  steps: string[]
  content: {
    introduction: string
    sections: Array<{
      title: string
      content: string
      tips?: string[]
    }>
    conclusion: string
  }
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null)

  const categories = [
    { id: "all", label: "All Topics", icon: HelpCircle },
    { id: "orders", label: "Orders & Delivery", icon: Truck },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "account", label: "Account", icon: User },
    { id: "shopping", label: "Shopping", icon: ShoppingCart }
  ]

  const guides = [
    {
      id: "getting-started",
      title: "Getting Started",
      description: "Learn how to create an account and place your first order",
      icon: User,
      steps: ["Create Account", "Verify Email", "Add Address", "Place Order"],
      content: {
        introduction: "Welcome to Marketdotcom! This guide will walk you through your first steps to becoming a valued customer and placing your first order.",
        sections: [
          {
            title: "1. Create Your Account",
            content: `Start by visiting our website and clicking "Register" in the top right corner.

**What you'll need:**
- A valid email address
- Your phone number
- A secure password (minimum 8 characters)

**Steps:**
1. Click "Register" on the homepage
2. Fill in your name, email, and phone number
3. Create a strong password
4. Agree to our Terms of Service
5. Click "Create Account"

You'll receive a confirmation email within minutes.`,
            tips: ["Use a real email address for verification", "Create a memorable but secure password"]
          },
          {
            title: "2. Verify Your Email",
            content: `After registration, check your email for a verification link.

**What to do:**
1. Open your email inbox
2. Look for an email from "Marketdotcom"
3. Click the "Verify Email" button
4. You'll be redirected to our website

**Troubleshooting:**
- Check your spam/junk folder
- The link expires in 24 hours
- Contact support if you don't receive the email`,
            tips: ["Add support@marketdotcom.ng to your contacts", "Complete verification before placing orders"]
          },
          {
            title: "3. Add Your Delivery Address",
            content: `Set up your delivery address for seamless ordering.

**Steps:**
1. Log into your dashboard
2. Go to "Account Settings"
3. Click "Add New Address"
4. Fill in your complete address details
5. Mark as default if it's your primary address

**Address Requirements:**
- Full street address
- City and state
- Valid phone number
- Landmark (optional but helpful)`,
            tips: ["Use detailed addresses for faster delivery", "You can add multiple addresses"]
          },
          {
            title: "4. Place Your First Order",
            content: `Now you're ready to shop!

**How to order:**
1. Browse our marketplace or choose a thrift plan
2. Add items to your cart
3. Select delivery date and time
4. Choose payment method
5. Complete checkout

**Available Plans:**
- Daily Thrift: Fresh groceries daily
- Weekly Thrift: Curated weekly packages
- Custom Orders: Build your own package

Your order will be confirmed immediately and you'll receive delivery updates via SMS and email.`,
            tips: ["Start with a Daily Thrift plan to try our service", "Orders can be customized to your preferences"]
          }
        ],
        conclusion: "Congratulations! You've successfully set up your account and placed your first order. Welcome to the Marketdotcom family!"
      }
    },
    {
      id: "shopping-guide",
      title: "Shopping Guide",
      description: "Master the art of smart shopping with our thrift plans",
      icon: ShoppingCart,
      steps: ["Browse Categories", "Choose Plan", "Customize Order", "Checkout"],
      content: {
        introduction: "Discover how to make the most of our marketplace and thrift plans for the best value and convenience.",
        sections: [
          {
            title: "Browse Our Categories",
            content: `Explore our wide range of fresh groceries and food items.

**Available Categories:**
- Fresh Vegetables & Fruits
- Proteins (Meat, Fish, Eggs)
- Grains & Staples
- Dairy Products
- Beverages & Snacks
- Household Essentials

**Navigation Tips:**
- Use the search bar for specific items
- Filter by price, availability, or rating
- Check product reviews and ratings
- Look for items on promotion`,
            tips: ["Browse during business hours for the freshest selection", "Check product availability before adding to cart"]
          },
          {
            title: "Choose the Right Plan",
            content: `Select the plan that best fits your needs and budget.

**Our Plans:**
- **Daily Thrift (₦2,500 - ₦15,000)**: Fresh groceries delivered daily
- **Weekly Thrift (₦15,000 - ₦50,000)**: Curated weekly packages
- **Monthly Thrift (₦50,000 - ₦200,000)**: Comprehensive monthly supply
- **Custom Orders**: Build your own package

**Plan Benefits:**
- Daily Thrift: Maximum freshness, flexible ordering
- Weekly Thrift: Cost savings, planned meals
- Custom Orders: Complete control over your grocery list`,
            tips: ["Start small with Daily Thrift to test our quality", "Weekly plans offer the best value for regular customers"]
          },
          {
            title: "Customize Your Order",
            content: `Personalize your order to match your preferences and dietary needs.

**Customization Options:**
- Substitute items you don't like
- Adjust quantities up or down
- Add special requests
- Choose organic/premium options
- Specify preparation preferences

**Quality Standards:**
- All items are fresh and locally sourced
- Vegetables are pesticide-free
- Proteins are hygienically processed
- Items meet Nigerian food safety standards`,
            tips: ["Be specific about substitutions to get exactly what you want", "Premium options are available for special dietary needs"]
          },
          {
            title: "Complete Your Purchase",
            content: `Secure and easy checkout process.

**Checkout Steps:**
1. Review your cart and customizations
2. Select delivery date and time slot
3. Choose payment method
4. Add delivery instructions
5. Complete payment

**Payment Security:**
- SSL-encrypted transactions
- Multiple payment options
- No card details stored
- Instant payment confirmation`,
            tips: ["Double-check your order before payment", "Use wallet balance for instant checkout"]
          }
        ],
        conclusion: "You've mastered the art of smart shopping with Marketdotcom! Enjoy fresh, quality groceries delivered right to your door."
      }
    },
    {
      id: "payment-methods",
      title: "Payment Methods",
      description: "Explore all available payment options and security features",
      icon: CreditCard,
      steps: ["Card Payment", "Bank Transfer", "Wallet Balance", "Security"],
      content: {
        introduction: "Learn about all the secure payment options available on Marketdotcom and how to use them safely.",
        sections: [
          {
            title: "Credit/Debit Card Payments",
            content: `Pay securely with your card through our encrypted payment gateway.

**Accepted Cards:**
- Visa
- Mastercard
- Verve
- American Express

**How it works:**
1. Select "Credit/Debit Card" at checkout
2. Enter your card details securely
3. Complete 3D Secure verification if required
4. Payment is processed instantly

**Security Features:**
- PCI DSS compliant
- SSL encryption
- Tokenization (we don't store card details)
- Fraud detection and prevention`,
            tips: ["Ensure your card has sufficient balance", "Keep your CVV private and secure"]
          },
          {
            title: "Bank Transfer (Paystack)",
            content: `Direct bank transfers through our secure payment partner.

**Supported Banks:**
- All Nigerian banks
- USSD codes for unsupported banks
- Internet banking portals

**Transfer Process:**
1. Select "Bank Transfer" at checkout
2. Choose your bank or USSD option
3. Complete the transfer using your banking app
4. Payment is confirmed automatically

**Benefits:**
- No card required
- Direct from your bank account
- Secure and traceable
- No additional fees`,
            tips: ["Use your mobile banking app for faster transfers", "Save transfer details for future payments"]
          },
          {
            title: "Wallet Balance",
            content: `Use your Marketdotcom wallet for instant payments.

**Wallet Features:**
- Instant payments (no processing time)
- Earn rewards on purchases
- Fund with multiple methods
- Track spending history

**How to use:**
1. Fund your wallet first
2. Select "Wallet Balance" at checkout
3. Payment is deducted instantly
4. Receive confirmation immediately

**Benefits:**
- Fastest payment method
- No transaction fees
- Earn loyalty points
- Secure wallet system`,
            tips: ["Fund your wallet in advance for faster checkout", "Monitor your balance to avoid insufficient funds"]
          },
          {
            title: "Payment Security & Safety",
            content: `Your security is our top priority.

**Security Measures:**
- Bank-level encryption (256-bit SSL)
- Secure payment gateways
- Fraud monitoring 24/7
- PCI DSS compliance

**Your Rights:**
- Secure transaction guarantee
- Refund for unauthorized charges
- 24/7 payment support
- Transparent fee structure

**Best Practices:**
- Never share payment details
- Use strong passwords
- Monitor your statements
- Report suspicious activity immediately`,
            tips: ["Enable transaction alerts on your accounts", "Regularly review your payment history"]
          }
        ],
        conclusion: "Now you're equipped with all the knowledge about our secure payment systems. Shop with confidence knowing your transactions are protected!"
      }
    },
    {
      id: "order-tracking",
      title: "Order Tracking",
      description: "Monitor your orders from placement to delivery",
      icon: Truck,
      steps: ["Order Confirmation", "Processing", "Out for Delivery", "Delivered"],
      content: {
        introduction: "Stay informed throughout your order journey with our comprehensive tracking system.",
        sections: [
          {
            title: "Order Confirmation",
            content: `Immediate confirmation when your order is placed.

**What happens next:**
1. Order received and validated
2. Payment confirmation
3. Order assigned to processing team
4. SMS and email confirmation sent

**Confirmation Details:**
- Order number and tracking ID
- Estimated delivery time
- Total amount paid
- Delivery address confirmation

**Next Steps:**
- Order moves to processing
- Inventory check begins
- Quality control inspection`,
            tips: ["Save your order number for reference", "Check email spam folder for confirmations"]
          },
          {
            title: "Order Processing",
            content: `Your order is prepared with care and attention.

**Processing Steps:**
1. Inventory verification
2. Quality control checks
3. Packaging with care
4. Final weight and pricing confirmation
5. Delivery assignment

**Quality Assurance:**
- Freshness checks for all items
- Weight verification
- Packaging standards
- Temperature control for perishables

**Timeline:**
- Processing typically takes 1-2 hours
- Urgent orders prioritized
- Large orders may take longer`,
            tips: ["Processing time varies by order size", "You can call to check processing status"]
          },
          {
            title: "Out for Delivery",
            content: `Your order is on its way to you!

**Delivery Process:**
1. Driver assigned and notified
2. Route optimization
3. Real-time GPS tracking
4. Customer notifications

**Delivery Features:**
- Professional, uniformed drivers
- Insulated delivery bags
- Contactless delivery options
- Photo verification on delivery

**Communication:**
- SMS updates every 30 minutes
- Driver contact information
- Estimated arrival time
- Rescheduling options`,
            tips: ["Ensure someone is available to receive delivery", "Have exact change ready if needed"]
          },
          {
            title: "Delivery & Receipt",
            content: `Successful delivery and order completion.

**Delivery Standards:**
- Items delivered as ordered
- Quality maintained throughout transit
- Proper packaging integrity
- Temperature-appropriate delivery

**Receipt Process:**
1. Driver verifies delivery
2. Customer signature or photo confirmation
3. Order status updated to "Delivered"
4. Feedback request sent

**Post-Delivery:**
- 24-hour feedback window
- Quality complaint period
- Loyalty points credited
- Next order suggestions`,
            tips: ["Inspect items immediately upon delivery", "Take photos if there are any issues"]
          }
        ],
        conclusion: "Your order tracking journey is complete! We hope you enjoyed your Marketdotcom experience and look forward to serving you again."
      }
    },
    {
      id: "wallet-management",
      title: "Wallet Management",
      description: "Learn to fund and manage your wallet balance",
      icon: Star,
      steps: ["Fund Wallet", "Track Balance", "Earn Points", "Redeem Rewards"],
      content: {
        introduction: "Master your Marketdotcom wallet for faster payments, rewards, and exclusive benefits.",
        sections: [
          {
            title: "Funding Your Wallet",
            content: `Add money to your wallet for convenient shopping.

**Funding Methods:**
- Bank Transfer (Paystack)
- Credit/Debit Card
- Direct bank deposit
- Mobile money (coming soon)

**Funding Steps:**
1. Go to Dashboard → Wallet
2. Click "Fund Wallet"
3. Choose amount and payment method
4. Complete payment
5. Funds available instantly

**Funding Limits:**
- Minimum: ₦100
- Maximum: ₦500,000 per transaction
- No monthly limits`,
            tips: ["Fund in advance for faster checkout", "Use bank transfer for larger amounts"]
          },
          {
            title: "Managing Your Balance",
            content: `Monitor and control your wallet balance effectively.

**Balance Features:**
- Real-time balance display
- Transaction history
- Spending analytics
- Low balance alerts

**Available Actions:**
- View transaction history
- Set auto-funding (coming soon)
- Transfer to bank (coming soon)
- Gift wallet balance

**Security Features:**
- PIN protection for large transactions
- Transaction limits
- Suspicious activity monitoring
- 24/7 balance monitoring`,
            tips: ["Keep track of your balance regularly", "Set up balance alerts for low funds"]
          },
          {
            title: "Earning Loyalty Points",
            content: `Earn points on every purchase for future rewards.

**Earning Rates:**
- 1 point per ₦100 spent
- Bonus points for referrals
- Double points on special occasions
- Extra points for wallet payments

**Point Benefits:**
- Points never expire
- Track points in real-time
- Convert to cash value
- Exclusive member discounts

**Point Tiers:**
- Bronze: 0-999 points
- Silver: 1,000-4,999 points
- Gold: 5,000-9,999 points
- Platinum: 10,000+ points`,
            tips: ["Use wallet payments to earn more points", "Points add up quickly with regular purchases"]
          },
          {
            title: "Redeeming Rewards",
            content: `Convert your points into valuable rewards and discounts.

**Redemption Options:**
- Cash back (₦50 per 500 points)
- Free delivery (200 points)
- Discount vouchers (300 points)
- Premium item upgrades (500 points)

**Redemption Process:**
1. Go to Wallet → Rewards
2. Choose reward option
3. Confirm redemption
4. Reward applied instantly

**Exclusive Perks:**
- Early access to sales
- Birthday bonuses
- Referral program benefits
- Priority customer support`,
            tips: ["Redeem points regularly to maximize value", "Combine with ongoing promotions for extra savings"]
          }
        ],
        conclusion: "You're now a wallet management expert! Enjoy faster payments, exclusive rewards, and VIP treatment with your Marketdotcom wallet."
      }
    },
    {
      id: "account-settings",
      title: "Account Settings",
      description: "Manage your profile, addresses, and preferences",
      icon: User,
      steps: ["Update Profile", "Manage Addresses", "Change Password", "Notifications"],
      content: {
        introduction: "Take control of your Marketdotcom account with comprehensive settings and preferences management.",
        sections: [
          {
            title: "Updating Your Profile",
            content: `Keep your personal information current and accurate.

**Profile Information:**
- Full name and contact details
- Profile picture (optional)
- Date of birth and gender
- Emergency contact information

**Update Process:**
1. Go to Dashboard → Account Settings
2. Click "Edit Profile"
3. Update information as needed
4. Save changes

**Privacy Settings:**
- Public profile visibility
- Contact information sharing
- Order history privacy
- Marketing preferences`,
            tips: ["Keep contact information current for delivery updates", "Upload a profile picture for personalized service"]
          },
          {
            title: "Managing Delivery Addresses",
            content: `Maintain multiple delivery addresses for convenience.

**Address Management:**
- Add unlimited addresses
- Set default address
- Edit existing addresses
- Delete unused addresses

**Address Types:**
- Home address
- Work address
- Vacation home
- Relative's address
- Custom labels

**Address Features:**
- GPS coordinates for accuracy
- Delivery instructions
- Contact person details
- Preferred delivery times`,
            tips: ["Add addresses in advance for faster checkout", "Include landmarks for easier delivery"]
          },
          {
            title: "Password & Security",
            content: `Maintain strong security for your account.

**Password Management:**
- Change password anytime
- Password strength requirements
- Password reset via email
- Two-factor authentication (coming soon)

**Security Features:**
- Login attempt monitoring
- Suspicious activity alerts
- Device management
- Session management

**Account Recovery:**
- Email verification for changes
- Security questions
- Backup contact methods
- Account recovery assistance`,
            tips: ["Use strong, unique passwords", "Enable login notifications for security"]
          },
          {
            title: "Notification Preferences",
            content: `Customize how and when you receive communications.

**Notification Types:**
- Order confirmations
- Delivery updates
- Payment confirmations
- Marketing promotions
- Account security alerts

**Communication Channels:**
- Email notifications
- SMS alerts
- Push notifications (mobile app)
- WhatsApp updates

**Frequency Settings:**
- Real-time updates
- Daily digests
- Weekly summaries
- Custom schedules

**Privacy Controls:**
- Unsubscribe options
- Communication preferences
- Data usage consent
- Marketing opt-outs`,
            tips: ["Customize notifications to your preference", "Keep delivery updates enabled for important information"]
          }
        ],
        conclusion: "Your account is now perfectly configured! Enjoy a personalized, secure, and convenient shopping experience with Marketdotcom."
      }
    }
  ]

  const faqs: FAQItem[] = [
    {
      id: "delivery-time",
      question: "How long does delivery take?",
      answer: "We deliver within 4 hours of your scheduled delivery time. Orders placed before 10 AM can be delivered same-day. Orders after 3 PM may be delivered the next day. You can choose your preferred delivery slot during checkout.",
      category: "orders",
      tags: ["delivery", "time", "schedule"]
    },
    {
      id: "order-tracking",
      question: "How can I track my order?",
      answer: "You can track your order in real-time through your dashboard. Go to 'My Orders' section to see current status, delivery updates, and estimated arrival time. You'll also receive SMS and email notifications.",
      category: "orders",
      tags: ["tracking", "status", "updates"]
    },
    {
      id: "payment-methods",
      question: "What payment methods do you accept?",
      answer: "We accept multiple payment methods: Credit/Debit cards (Visa, Mastercard, Verve), Bank transfers via Paystack, and Wallet balance. All payments are processed securely through our certified payment partners.",
      category: "payment",
      tags: ["payment", "methods", "secure"]
    },
    {
      id: "refund-policy",
      question: "What's your refund policy?",
      answer: "We offer full refunds for damaged or incorrect items within 24 hours of delivery. Refund requests must be submitted through your dashboard or by contacting support. Refunds are processed within 5-7 business days.",
      category: "orders",
      tags: ["refund", "return", "policy"]
    },
    {
      id: "wallet-funding",
      question: "How do I fund my wallet?",
      answer: "You can fund your wallet through bank transfer or card payment. Go to your dashboard → Wallet → Fund Wallet. Minimum funding amount is ₦100. Funds are instantly available for use.",
      category: "payment",
      tags: ["wallet", "funding", "balance"]
    },
    {
      id: "account-verification",
      question: "How do I verify my account?",
      answer: "After registration, check your email for a verification link. Click the link to verify your account. If you don't see the email, check your spam folder or request a new verification email.",
      category: "account",
      tags: ["verification", "email", "account"]
    },
    {
      id: "change-delivery-address",
      question: "Can I change my delivery address after placing an order?",
      answer: "Delivery address can only be changed within 30 minutes of order placement. Contact our support team immediately at +234-903-181-2756 or via WhatsApp to request address changes.",
      category: "orders",
      tags: ["address", "change", "delivery"]
    },
    {
      id: "loyalty-points",
      question: "How do loyalty points work?",
      answer: "Earn 1 point for every ₦100 spent. Points can be redeemed for discounts on future orders. Check your points balance in the dashboard and view redemption options.",
      category: "shopping",
      tags: ["points", "loyalty", "rewards"]
    },
    {
      id: "bulk-orders",
      question: "Do you accept bulk orders?",
      answer: "Yes! We cater to businesses and bulk orders. Contact our sales team at sales@marketdotcom.ng or call +234-903-181-2756 for bulk pricing and special arrangements.",
      category: "shopping",
      tags: ["bulk", "business", "wholesale"]
    },
    {
      id: "forgot-password",
      question: "I forgot my password. What should I do?",
      answer: "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password.",
      category: "account",
      tags: ["password", "reset", "login"]
    }
  ]

  const contactMethods: ContactMethod[] = [
    {
      icon: MessageCircle,
      title: "WhatsApp Support",
      description: "Get instant help via WhatsApp",
      action: "Chat Now",
      link: "https://wa.me/2349031812756",
      available: "24/7 Available",
      priority: 1
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support team",
      action: "Call Now",
      link: "tel:+2349031812756",
      available: "Mon-Sat: 8AM-8PM",
      priority: 2
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us detailed inquiries",
      action: "Send Email",
      link: "mailto:support@marketdotcom.ng",
      available: "Response within 24hrs",
      priority: 3
    }
  ]

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Help Center
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            How can we <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">help you</span> today?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to common questions, get support, and learn how to make the most of Marketdotcom.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-orange-500 shadow-lg"
              />
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="faq" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="faq" className="flex items-center space-x-2">
              <HelpCircle className="h-4 w-4" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4" />
              <span>Guides</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Contact</span>
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-8">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon
                      const count = category.id === "all"
                        ? faqs.length
                        : faqs.filter(faq => faq.category === category.id).length

                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                            selectedCategory === category.id
                              ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-900 border border-orange-200'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{category.label}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {count}
                          </Badge>
                        </button>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* FAQ Content */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <HelpCircle className="h-5 w-5" />
                      <span>
                        {selectedCategory === "all"
                          ? "All Questions"
                          : categories.find(c => c.id === selectedCategory)?.label
                        }
                      </span>
                    </CardTitle>
                    <p className="text-gray-600">
                      {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'} found
                    </p>
                  </CardHeader>
                  <CardContent>
                    {filteredFaqs.length === 0 ? (
                      <div className="text-center py-12">
                        <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No questions found</h3>
                        <p className="text-gray-500">Try adjusting your search or browse different categories.</p>
                      </div>
                    ) : (
                      <Accordion type="single" collapsible className="space-y-4">
                        {filteredFaqs.map((faq) => (
                          <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-6">
                            <AccordionTrigger className="hover:no-underline py-6">
                              <div className="flex items-center justify-between w-full text-left">
                                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                  {faq.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6">
                              <div className="text-gray-700 leading-relaxed border-t pt-4">
                                {faq.answer}
                              </div>
                              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {categories.find(c => c.id === faq.category)?.label}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span>Helpful</span>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Getting Started",
                  description: "Learn how to create an account and place your first order",
                  icon: User,
                  steps: ["Create Account", "Verify Email", "Add Address", "Place Order"]
                },
                {
                  title: "Shopping Guide",
                  description: "Master the art of smart shopping with our thrift plans",
                  icon: ShoppingCart,
                  steps: ["Browse Categories", "Choose Plan", "Customize Order", "Checkout"]
                },
                {
                  title: "Payment Methods",
                  description: "Explore all available payment options and security features",
                  icon: CreditCard,
                  steps: ["Card Payment", "Bank Transfer", "Wallet Balance", "Security"]
                },
                {
                  title: "Order Tracking",
                  description: "Monitor your orders from placement to delivery",
                  icon: Truck,
                  steps: ["Order Confirmation", "Processing", "Out for Delivery", "Delivered"]
                },
                {
                  title: "Wallet Management",
                  description: "Learn to fund and manage your wallet balance",
                  icon: Star,
                  steps: ["Fund Wallet", "Track Balance", "Earn Points", "Redeem Rewards"]
                },
                {
                  title: "Account Settings",
                  description: "Manage your profile, addresses, and preferences",
                  icon: User,
                  steps: ["Update Profile", "Manage Addresses", "Change Password", "Notifications"]
                }
              ].map((guide, index) => {
                const Icon = guide.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                            <Icon className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{guide.title}</CardTitle>
                          </div>
                        </div>
                        <p className="text-gray-600">{guide.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          {guide.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex items-center space-x-3 text-sm">
                              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {stepIndex + 1}
                              </div>
                              <span className="text-gray-700">{step}</span>
                            </div>
                          ))}
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                          onClick={() => setSelectedGuide((guide as Guide).id)}
                        >
                          Read Guide
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Methods */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                  <p className="text-gray-600 mb-8">
                    Our support team is here to help. Choose the contact method that works best for you.
                  </p>
                </div>

                <div className="space-y-4">
                  {contactMethods.map((method, index) => {
                    const Icon = method.icon
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                                <Icon className="h-6 w-6 text-orange-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900">{method.title}</h3>
                                  <Badge variant={method.priority === 1 ? "default" : "secondary"} className="text-xs">
                                    {method.available}
                                  </Badge>
                                </div>
                                <p className="text-gray-600 mb-4">{method.description}</p>
                                <Button asChild className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                                  <a href={method.link} target="_blank" rel="noopener noreferrer">
                                    {method.action}
                                    <ExternalLink className="h-4 w-4 ml-2" />
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Support Hours & Info */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Support Hours</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <div className="font-semibold text-green-900">WhatsApp Support</div>
                        <div className="text-sm text-green-700">Instant responses</div>
                      </div>
                      <Badge className="bg-green-500">24/7</Badge>
                    </div>

                    <div className="flex justify-between items-center py-3 px-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <div className="font-semibold text-blue-900">Phone Support</div>
                        <div className="text-sm text-blue-700">Mon-Sat: 8AM-8PM</div>
                      </div>
                      <Badge variant="secondary">Mon-Sat</Badge>
                    </div>

                    <div className="flex justify-between items-center py-3 px-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div>
                        <div className="font-semibold text-purple-900">Email Support</div>
                        <div className="text-sm text-purple-700">Response within 24hrs</div>
                      </div>
                      <Badge variant="outline">Daily</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>Visit Our Office</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900">Head Office</div>
                          <div className="text-gray-600 text-sm">
                            38 Agberu Rd, Off Alasoro Street<br />
                            Elebu Oja, Ibadan, Oyo State<br />
                            Nigeria
                          </div>
                        </div>
                      </div>
                      <div className="pt-3 border-t">
                        <div className="text-sm text-gray-600">
                          <strong>Business Hours:</strong><br />
                          Monday - Saturday: 8:00 AM - 8:00 PM<br />
                          Sunday: Closed
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Need Urgent Help?</h3>
              <p className="text-gray-700 mb-6">
                For urgent order issues or emergency support, contact us immediately.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-red-600 hover:bg-red-700">
                  <a href="https://wa.me/2349031812756" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Emergency WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="tel:+2349031812756">
                    <Phone className="h-5 w-5 mr-2" />
                    Call Now
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Guide Modal */}
        <Dialog open={!!selectedGuide} onOpenChange={() => setSelectedGuide(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedGuide && (() => {
              const guide = guides.find(g => g.id === selectedGuide)
              if (!guide) return null

              return (
                <div className="space-y-6">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-3 text-2xl">
                      <div className="p-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                        <guide.icon className="h-6 w-6 text-orange-600" />
                      </div>
                      <span>{guide.title}</span>
                    </DialogTitle>
                    <p className="text-gray-600">{guide.description}</p>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Introduction */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                      <p className="text-gray-700 leading-relaxed">{guide.content.introduction}</p>
                    </div>

                    {/* Steps Overview */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Overview</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {guide.steps.map((step, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Detailed Sections */}
                    <div className="space-y-6">
                      {guide.content.sections.map((section, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                              {index + 1}
                            </div>
                            {section.title}
                          </h3>

                          <div className="prose prose-gray max-w-none">
                            <div
                              className="text-gray-700 leading-relaxed whitespace-pre-line"
                              dangerouslySetInnerHTML={{ __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                            />
                          </div>

                          {section.tips && section.tips.length > 0 && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                              <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
                                💡 Pro Tips
                              </h4>
                              <ul className="text-sm text-yellow-700 space-y-1">
                                {section.tips.map((tip, tipIndex) => (
                                  <li key={tipIndex} className="flex items-start">
                                    <span className="text-yellow-500 mr-2">•</span>
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Conclusion */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-green-900">Congratulations!</h3>
                      </div>
                      <p className="text-green-700 leading-relaxed">{guide.content.conclusion}</p>
                    </div>
                  </div>
                </div>
              )
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}