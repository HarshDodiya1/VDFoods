"use client";
import React from "react";
import Head from "next/head";

export const dynamic = "force-dynamic";

const VDFoodsPolicies: React.FC = () => {
  const policySections = [
    {
      id: "terms",
      title: "Terms & Conditions",
      content: (
        <div className="space-y-6 mt-8 bg-white">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl shadow-lg border border-purple-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Terms and Conditions
            </h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-6">
                For the purpose of these Terms and Conditions, the term "we",
                "us", "our" used anywhere on this page shall mean
                <strong> VISHNUKUMAR DUNGARAJI CHAUDHARY</strong>, whose
                registered/operational office is Tharad Hwy, Krishna Nagar, Dama
                Deesa Gujarat 385535. "You", "your", "user", "visitor" shall
                mean any natural or legal person who is visiting our website
                and/or agreed to purchase from us.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Website Content
                  </h4>
                  <p className="text-gray-700 text-sm">
                    The content of the pages of this website is subject to
                    change without notice. Neither we nor any third parties
                    provide any warranty or guarantee as to the accuracy,
                    timeliness, performance, completeness or suitability of the
                    information and materials found or offered on this website
                    for any particular purpose.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 text-red-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    User Responsibility
                  </h4>

                  <p className="text-gray-700 text-sm">
                    Your use of any information or materials on our website
                    and/or product pages is entirely at your own risk, for which
                    we shall not be liable. It shall be your own responsibility
                    to ensure that any products, services or information
                    available through our website meet your specific
                    requirements.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 text-red-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Intellectual Property
                  </h4>

                  <p className="text-gray-700 text-sm">
                    Our website contains material which is owned by or licensed
                    to us. This material includes, but is not limited to, the
                    design, layout, look, appearance and graphics. Reproduction
                    is prohibited other than in accordance with the copyright
                    notice.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 text-purple-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Governing Law
                  </h4>

                  <p className="text-gray-700 text-sm">
                    Any dispute arising out of use of our website and/or
                    purchase with us and/or any engagement with us is subject to
                    the laws of India.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-8 rounded-xl shadow-lg border border-green-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Privacy Policy
            </h3>

            <div className="space-y-6">
              <p className="text-gray-700">
                VISHNUKUMAR DUNGARAJI CHAUDHARY is committed to ensuring that
                your privacy is protected. This privacy policy sets out how we
                use and protect any information that you give us when you visit
                our website.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Information We Collect
                  </h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>
                      • Name and contact information including email address
                    </li>
                    <li>
                      • Demographic information such as postcode, preferences
                      and interests
                    </li>
                    <li>
                      • Other information relevant to customer surveys and/or
                      offers
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 text-green-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    How We Use Your Information
                  </h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Internal record keeping and service improvement</li>
                    <li>
                      • Sending promotional emails about new products and offers
                    </li>
                    <li>• Market research purposes</li>
                    <li>
                      • Customizing the website according to your interests
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 text-red-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Third-Party Disclosure
                  </h4>
                  <p className="text-gray-700 text-sm">
                    We do not sell, distribute, or lease your personal
                    information to third parties unless we have your permission
                    or are required by law to do so. We may share your
                    information with trusted third-party service providers (such
                    as courier companies and payment gateways) only to the
                    extent necessary to fulfill your orders and operate our
                    business.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 text-orange-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Data Security
                  </h4>
                  <p className="text-gray-700 text-sm">
                    We are committed to ensuring that your information is
                    secure. To prevent unauthorized access or disclosure, we
                    have put in place suitable physical, electronic, and
                    managerial procedures to safeguard and secure the
                    information we collect online.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 text-purple-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Cookies Policy
                  </h4>
                  <p className="text-gray-700 text-sm">
                    We use cookies to analyze web traffic and improve our
                    website. You can choose to accept or decline cookies. Most
                    web browsers automatically accept cookies, but you can
                    usually modify your browser setting to decline cookies if
                    you prefer. This may prevent you from taking full advantage
                    of the website.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 text-red-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Your Rights
                  </h4>
                  <p className="text-gray-700 text-sm">
                    You may restrict the collection or use of your personal
                    information at any time. You also have the right to request
                    access to or deletion of your personal data. If you believe
                    any information we are holding on you is incorrect or
                    incomplete, please write to or email us as soon as possible
                    at <strong>vdfoods77@gmail.com</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "cancellation",
      title: "Cancellation & Refund",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-8 rounded-xl shadow-lg border border-orange-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Cancellation & Refund Policy
            </h3>

            <p className="text-gray-700 mb-6">
              VISHNUKUMAR DUNGARAJI CHAUDHARY believes in helping its customers
              as far as possible, and has therefore a liberal cancellation
              policy.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 text-orange-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Cancellation Timeline
                </h4>
                <p className="text-gray-700 text-sm">
                  Cancellations will be considered only if the request is made
                  within <strong>3-5 days</strong> of placing the order.
                  However, cancellation requests may not be entertained if
                  orders have been communicated to vendors/merchants and they
                  have initiated the shipping process.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 text-red-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Non-Cancellable Items
                </h4>
                <p className="text-gray-700 text-sm">
                  We do not accept cancellation requests for perishable items
                  like flowers, eatables, etc. However, refund/replacement can
                  be made if the customer establishes that the quality of
                  product delivered is not good.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Damaged/Defective Items
                </h4>
                <p className="text-gray-700 text-sm">
                  In case of receipt of damaged or defective items, please
                  report the same to our Customer Service team within
                  <strong> 3-5 days</strong> of receipt. The request will be
                  entertained once the merchant has checked and determined the
                  same.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <svg
                    className="w-6 h-6 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                  Refund Processing
                </h4>
                <p className="text-gray-700 text-sm">
                  In case of any refunds approved by VISHNUKUMAR DUNGARAJI
                  CHAUDHARY, it will take <strong>3-5 days </strong>
                  for the refund to be processed to the end customer.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Shipping Policy",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-xl shadow-lg border border-indigo-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Shipping Policy
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  International Shipping
                </h4>
                <p className="text-gray-700 text-sm">
                  For international buyers, orders are shipped and delivered
                  through registered international courier companies and/or
                  International speed post only.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  Domestic Shipping
                </h4>
                <p className="text-gray-700 text-sm">
                  For domestic buyers, orders are shipped through registered
                  domestic courier companies and/or speed post only.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 text-purple-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Shipping Timeline
                </h4>
                <p className="text-gray-700 text-sm">
                  Orders are shipped within <strong>6-8 days</strong> or as per
                  the delivery date agreed at the time of order confirmation.
                  Delivery is subject to courier company/post office norms.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 text-red-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Important Notice
                </h4>
                <p className="text-gray-700 text-sm">
                  VISHNUKUMAR DUNGARAJI CHAUDHARY is not liable for any delay in
                  delivery by the courier company/postal authorities and only
                  guarantees to hand over the consignment to the courier company
                  within the specified timeline.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 text-orange-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Delivery Confirmation
                </h4>
                <p className="text-gray-700 text-sm">
                  Delivery of all orders will be to the address provided by the
                  buyer. Delivery confirmation will be sent to your registered
                  email ID. For any issues, contact our helpdesk at{" "}
                  <strong>9104029941</strong> or
                  <strong>vdfoods77@gmail.com</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>VD Foods | Terms, Privacy, Shipping & Refund Policies</title>
        <meta
          name="description"
          content="Official policies for VISHNUKUMAR DUNGARAJI CHAUDHARY (VD Foods), including detailed Terms & Conditions, Privacy Policy, Shipping, Cancellation, and Refund information."
        />
        {/* Added Canonical tag for better SEO, assuming this is the main policy page */}
        <link rel="canonical" href="https://yourwebsite.com/policies" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* SEO Improvement: Added a main, clear H1 heading for the page */}
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
            VD Foods Official Policies 📜
          </h1>
          {policySections.map((section) => (
            <div key={section.id} id={section.id}>
              {section.content}
            </div>
          ))}
        </main>
      </div>
    </>
  );
};

export default VDFoodsPolicies;
