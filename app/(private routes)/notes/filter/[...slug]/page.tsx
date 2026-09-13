import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tagParam = slug?.[0] || 'all';
  const displayTag = tagParam === 'all' ? 'All notes' : `${tagParam} notes`;

  return {
    title: `${displayTag} | NoteHub`,
    description: `Browse ${displayTag.toLowerCase()} on NoteHub.`,
    openGraph: {
      title: `${displayTag} | NoteHub`,
      description: `Browse ${displayTag.toLowerCase()} on NoteHub.`,
      url: "https://notehub.com/",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub Open Graph Image",
        }
      ]
    }
  };
}

export default async function NotesPage({ params }: PageProps) {
  const { slug } = await params;
  const tagParam = slug?.[0] || 'all';
  const tag = tagParam === 'all' ? undefined : tagParam;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tagParam} />
    </HydrationBoundary>
  );
}
