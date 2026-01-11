import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: January 2025</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                At Marketdotcom, we are committed to protecting your privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Personal Information</h3>
              <p className="text-gray-700 mb-4">We may collect the following personal information:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Name and contact information (email, phone number)</li>
                <li>Delivery addresses</li>
                <li>Payment information (processed securely through our payment partners)</li>
                <li>Account credentials and preferences</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">Usage Data</h3>
              <p className="text-gray-700 mb-4">We automatically collect certain information when you use our services:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Device information</li>
                <li>Referral sources</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use the collected information for:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Processing and fulfilling orders</li>
                <li>Providing customer support</li>
                <li>Sending order confirmations and updates</li>
                <li>Improving our services and website</li>
                <li>Personalizing your shopping experience</li>
                <li>Marketing and promotional communications (with consent)</li>
                <li>Preventing fraud and ensuring security</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li><strong>Service Providers:</strong> With trusted third-party service providers who help us operate our business</li>
                <li><strong>Payment Processors:</strong> With secure payment processors to complete transactions</li>
                <li><strong>Delivery Partners:</strong> With delivery services to fulfill orders</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access,
                alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure server infrastructure</li>
                <li>Regular security audits</li>
                <li>Employee access controls</li>
                <li>Regular data backups</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic.
              </p>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Types of Cookies We Use:</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You can control cookie settings through your browser preferences, though disabling certain cookies may affect website functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
                <li><strong>Restriction:</strong> Request limitation of processing</li>
                <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations.
                Account data is retained while your account is active and for a reasonable period thereafter for legal and regulatory purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Links</h2>
              <p className="text-gray-700 mb-4">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.
                We encourage you to review the privacy policies of any third-party websites you visit.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than Nigeria. We ensure that such transfers comply with applicable data protection laws
                and that appropriate safeguards are in place to protect your personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page
                and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@marketdotcom.ng<br />
                  <strong>Phone:</strong> +234-903-181-2756<br />
                  <strong>Address:</strong> 38 Agberu Rd, Off Alasoro Street, Elebu Oja, Ibadan, Oyo State<br />
                  <strong>Data Protection Officer:</strong> dpo@marketdotcom.ng
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}