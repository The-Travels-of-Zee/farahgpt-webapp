import Markdown from "react-markdown";
import { privacyPolicy } from "@/constants";

function PrivacyPolicy() {
  return (
    <main className="bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50 min-h-screen pt-18 pb-20">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your privacy and data protection are fundamental to our commitment to the Muslim community
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Content Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 md:p-12">
          <article
            className="prose prose-slate prose-lg max-w-none
            prose-headings:text-slate-800 
            prose-headings:font-semibold
            prose-h1:text-3xl prose-h1:mb-8 prose-h1:text-emerald-700
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-emerald-600 prose-h2:border-b prose-h2:border-emerald-100 prose-h2:pb-3
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-slate-700
            prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-3 prose-h4:text-slate-600
            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
            prose-strong:text-slate-800 prose-strong:font-semibold
            prose-em:text-slate-700
            prose-ul:my-6 prose-ul:text-slate-600
            prose-ol:my-6 prose-ol:text-slate-600
            prose-li:my-2 prose-li:leading-relaxed
            prose-li:marker:text-emerald-500
            prose-blockquote:border-l-4 prose-blockquote:border-emerald-200 prose-blockquote:bg-emerald-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:my-8
            prose-blockquote:text-slate-700 prose-blockquote:italic
            prose-code:bg-slate-100 prose-code:text-emerald-700 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-medium
            prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
            prose-a:text-emerald-600 prose-a:font-medium prose-a:no-underline hover:prose-a:text-emerald-700 hover:prose-a:underline prose-a:transition-colors
            prose-table:border-collapse prose-table:border prose-table:border-slate-200 prose-table:rounded-lg prose-table:overflow-hidden
            prose-th:bg-emerald-50 prose-th:text-emerald-800 prose-th:font-semibold prose-th:p-4 prose-th:border prose-th:border-slate-200
            prose-td:p-4 prose-td:border prose-td:border-slate-200 prose-td:text-slate-600
            prose-hr:border-emerald-100 prose-hr:my-12
          "
          >
            <Markdown>{privacyPolicy.content}</Markdown>
          </article>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-lg font-semibold text-emerald-800">Questions?</h3>
            </div>
            <p className="text-emerald-700 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please don't hesitate to
              contact us.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PrivacyPolicy;
