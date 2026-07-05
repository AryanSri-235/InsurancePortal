"use client";

const REVIEWS = [
  {
    name: "Rajesh Kumar",
    city: "Delhi",
    rating: 5,
    date: "Jan 2025",
    comment:
      "Claim was processed within 48 hours. Excellent service and very responsive support team.",
    policyType: "Health",
  },
  {
    name: "Priya Sharma",
    city: "Mumbai",
    rating: 4,
    date: "Dec 2024",
    comment:
      "Good coverage but the renewal process took a bit longer than expected. Overall satisfied.",
    policyType: "Term",
  },
  {
    name: "Amit Singh",
    city: "Bangalore",
    rating: 5,
    date: "Nov 2024",
    comment:
      "Zero hassle claim settlement. The online portal is very user-friendly and transparent.",
    policyType: "Motor",
  },
  {
    name: "Sunita Patel",
    city: "Ahmedabad",
    rating: 4,
    date: "Oct 2024",
    comment:
      "Premium is competitive and the advisor was very helpful in explaining all terms clearly.",
    policyType: "Health",
  },
];

const RATING_BREAKDOWN = [
  { star: 5, percent: 65, color: "bg-emerald-400" },
  { star: 4, percent: 22, color: "bg-amber-400" },
  { star: 3, percent: 8, color: "bg-amber-400" },
  { star: 2, percent: 3, color: "bg-amber-400" },
  { star: 1, percent: 2, color: "bg-amber-400" },
];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "#f59e0b" : "none"}
      stroke={filled ? "#f59e0b" : "#d1d5db"}
      strokeWidth={1.5}
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
    </svg>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} filled={star <= rating} />
      ))}
    </div>
  );
}

interface Props {
  providerName: string;
}

export default function ProviderReviews({ providerName }: Props) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Customer Reviews for {providerName}
        </h2>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT SIDE */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="flex flex-col items-start gap-2">
              <span className="text-5xl font-black text-amber-500">4.5</span>

              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#f59e0b"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                ))}
              </div>

              <p className="text-sm text-gray-400">Based on 2,400+ reviews</p>

              <div className="mt-4 w-full flex flex-col gap-2">
                {RATING_BREAKDOWN.map(({ star, percent, color }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-5 text-right">
                      {star}★
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-7 text-right">
                      {percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 flex flex-col gap-4">
            {REVIEWS.map((review, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">
                      {review.name}
                    </span>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {review.policyType}
                  </span>
                </div>

                <div className="mb-2">
                  <StarRow rating={review.rating} />
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-2">
                  {review.comment}
                </p>

                <p className="text-xs text-gray-400">📍 {review.city}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-400 italic">
          Reviews are verified by our team and may take 2–3 days to appear
          after submission.
        </p>
      </div>
    </section>
  );
}
