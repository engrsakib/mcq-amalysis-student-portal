"use client";

import { BookCard } from "@/components/dashboard/book-card";
import {
  BooksMultiCarousel,
  type BooksCarouselLayout,
} from "@/components/dashboard/books-multi-carousel";
import { useUserBooks } from "@/hooks/use-user-books";

type BooksSectionProps = {
  layout?: BooksCarouselLayout;
};

export function BooksSection({ layout = "full" }: BooksSectionProps) {
  const { books, total, loading, error } = useUserBooks();

  return (
    <BooksMultiCarousel
      layout={layout}
      title="Books"
      countLabel={books.length > 0 ? Math.min(total, books.length) : undefined}
      loading={loading}
      error={error}
      items={books}
      emptyMessage="No books available."
      autoSlideMs={3000}
      dotItemLabel="book"
      renderItem={(book) => <BookCard book={book} />}
    />
  );
}
