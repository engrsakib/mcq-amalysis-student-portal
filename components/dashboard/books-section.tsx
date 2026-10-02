"use client";

import { BookCard } from "@/components/dashboard/book-card";
import { BooksMultiCarousel } from "@/components/dashboard/books-multi-carousel";
import { useUserBooks } from "@/hooks/use-user-books";

export function BooksSection() {
  const { books, total, loading, error } = useUserBooks();

  return (
    <BooksMultiCarousel
      title="Books"
      countLabel={books.length > 0 ? Math.min(total, books.length) : undefined}
      loading={loading}
      error={error}
      items={books}
      emptyMessage="No books available."
      autoSlideMs={3000}
      renderItem={(book) => <BookCard book={book} />}
    />
  );
}
