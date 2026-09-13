'use client';

export default function ErrorPage({ error }: { error: Error & { digest?: string } }) {
  return <p>Could not fetch note details. {error.message}</p>;
}
