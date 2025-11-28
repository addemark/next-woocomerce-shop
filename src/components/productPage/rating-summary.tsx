import { StarIcon } from "@heroicons/react/20/solid";

type RatingSummaryProps = {
  ratingValue: number;
  ratingCount: number;
};

export function RatingSummary({
  ratingValue,
  ratingCount,
}: RatingSummaryProps) {
  return (
    <div className="mt-3" aria-label="Product rating">
      <h3 className="sr-only">Reviews</h3>
      <div className="flex items-center">
        <div className="flex items-center">
          {[0, 1, 2, 3, 4].map((star) => (
            <StarIcon
              key={star}
              aria-hidden="true"
              className={`${ratingValue > star ? "text-indigo-500" : "text-gray-300"} size-5 shrink-0`}
            />
          ))}
        </div>
        <p className="ml-3 text-sm text-gray-600">
          {ratingCount > 0
            ? `${ratingValue}/5 based on ${ratingCount} review(s)`
            : "No reviews yet"}
        </p>
      </div>
    </div>
  );
}
