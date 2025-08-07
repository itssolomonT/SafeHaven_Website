'use client'

import Layout from '../components/Layout'

export default function TermsOfService() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using SafeHaven Security Systems' website and services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
              <p className="mb-4">
                SafeHaven Security Systems provides home security solutions including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Security system installation and monitoring</li>
                <li>24/7 professional monitoring services</li>
                <li>Smart home integration</li>
                <li>Technical support and maintenance</li>
                <li>Consultation and assessment services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Terms</h2>
              <p className="mb-4">
                Payment is due upon service completion unless otherwise agreed upon in writing. We accept all major credit cards, bank transfers, and cash payments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Warranty and Support</h2>
              <p className="mb-4">
                Our security systems come with a standard warranty covering defects in materials and workmanship. Extended warranty options are available for purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p>
                SafeHaven Security Systems shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p><strong>Email:</strong> legal@safehaven.com</p>
                <p><strong>Phone:</strong> (555) 123-4567</p>
                <p><strong>Address:</strong> SafeHaven Security Systems, 123 Security Blvd, Suite 100</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
} 