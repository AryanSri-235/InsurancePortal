interface RelatedBlogsProps {
  category: string;
}

const categoryColorMap: Record<string, string> = {
  term: "bg-blue-600",
  health: "bg-emerald-600",
  motor: "bg-orange-500",
  life: "bg-purple-600",
};

const categoryAccentMap: Record<string, string> = {
  term: "text-blue-600 bg-blue-50",
  health: "text-emerald-600 bg-emerald-50",
  motor: "text-orange-500 bg-orange-50",
  life: "text-purple-600 bg-purple-50",
};

const categoryButtonMap: Record<string, string> = {
  term: "text-blue-600 hover:text-blue-800",
  health: "text-emerald-600 hover:text-emerald-800",
  motor: "text-orange-500 hover:text-orange-700",
  life: "text-purple-600 hover:text-purple-800",
};

const blogData: Record<string, string[]> = {
  term: [
    "How to Choose Term Insurance in 2025",
    "Return of Premium vs Pure Term: Which is Better?",
    "Top 5 Riders You Should Add to Your Term Plan",
  ],
  health: [
    "Family Floater vs Individual Health Plan: Full Comparison",
    "What Pre-existing Diseases Mean for Your Health Cover",
    "Top Health Insurance Plans for Senior Citizens 2025",
  ],
  motor: [
    "Zero Depreciation Add-on: Is It Worth the Extra Cost?",
    "How to Claim Motor Insurance Step by Step",
    "NCB: How to Protect Your No-Claim Bonus",
  ],
  life: [
    "ULIP vs Mutual Fund: Where Should You Invest?",
    "Endowment Plans: Pros, Cons and When to Buy",
    "Tax Benefits of Life Insurance Under 80C and 10(10D)",
  ],
};

const fallbackBlogs = [
  "Understanding Your Insurance Policy: A Complete Guide",
  "How to File an Insurance Claim Without Hassle",
  "Top Insurance Mistakes to Avoid in 2025",
];

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    term: "Term Insurance",
    health: "Health Insurance",
    motor: "Motor Insurance",
    life: "Life Insurance",
  };
  return labels[category.toLowerCase()] ?? category.charAt(0).toUpperCase() + category.slice(1) + " Insurance";
}

export default function RelatedBlogs({ category }: RelatedBlogsProps) {
  const key = category.toLowerCase();
  const articles = blogData[key] ?? fallbackBlogs;
  const topBarColor = categoryColorMap[key] ?? "bg-gray-600";
  const accentClass = categoryAccentMap[key] ?? "text-gray-600 bg-gray-50";
  const buttonClass = categoryButtonMap[key] ?? "text-gray-600 hover:text-gray-800";
  const label = getCategoryLabel(category);

  return (
    <section className="py-16 bg-gray-50 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <span className={`inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${accentClass}`}>
            Related Articles
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Learn More About {label}
          </h2>
        </div>

        {/* Blog cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((title, index) => (
            <article
              key={index}
              className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-200 shadow-sm hover:shadow-md flex flex-col"
            >
              {/* Colored top bar */}
              <div className={`h-1.5 w-full ${topBarColor}`} />

              <div className="p-6 flex flex-col flex-1">
                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    5 min read
                  </span>
                  <span>•</span>
                  <span>Jan 2025</span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-base text-gray-800 leading-snug flex-1 mb-4">
                  {title}
                </h3>

                {/* Read more button */}
                <button
                  type="button"
                  className={`self-start text-sm font-semibold transition-colors duration-150 ${buttonClass}`}
                  aria-label={`Read more: ${title}`}
                >
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
