
export function formateaEstrellasRating(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0 && rating % 0.5 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    '★'.repeat(fullStars) +
    (hasHalfStar ? '☆' : '') +
    '☆'.repeat(emptyStars)
  );
}