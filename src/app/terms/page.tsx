import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <Link href="/auth/register">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Registration
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-600">Last updated: January 2025</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Marketdotcom, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily use Marketdotcom for personal, non-commercial transitory viewing only.
              </p>
              <p className="text-gray-700 mb-4">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to decompile or reverse engineer any software contained on Marketdotcom</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Service Description</h2>
              <p className="text-gray-700 mb-4">
                Marketdotcom provides online grocery shopping services including:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Personal shopping services</li>
                <li>Daily and monthly thrift plans</li>
                <li>Custom food packages</li>
                <li>Doorstep delivery services</li>
                <li>Customer wallet and referral programs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times.
              </p>
              <p className="text-gray-700 mb-4">
                You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Orders and Payment</h2>
              <p className="text-gray-700 mb-4">
                All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason.
              </p>
              <p className="text-gray-700 mb-4">
                Payment must be received in full before order processing begins. We accept various payment methods as displayed on our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Delivery</h2>
              <p className="text-gray-700 mb-4">
                We strive to deliver orders within 4 hours of the scheduled delivery time. Delivery times may vary based on location and availability.
              </p>
              <p className="text-gray-700 mb-4">
                Customers should place orders at least one day in advance, or before 10 AM for same-day delivery. Orders placed after 3 PM may be rolled over to the next day.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Refund Policy</h2>
              <p className="text-gray-700 mb-4">
                We offer refunds for damaged or incorrect items. Refund requests must be made within 24 hours of delivery.
              </p>
              <p className="text-gray-700 mb-4">
                Refunds will be processed to the original payment method within 5-7 business days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                In no event shall Marketdotcom or its suppliers be liable for any damages arising out of the use or inability to use the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account immediately, without prior notice, for any reason whatsoever.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These terms shall be interpreted and governed by the laws of Nigeria.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-700 mt-2">
                Email: legal@marketdotcom.ng<br />
                Phone: +234-903-181-2756<br />
                Address: 38 Agberu Rd, Off Alasoro Street, Elebu Oja, Ibadan, Oyo State
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
