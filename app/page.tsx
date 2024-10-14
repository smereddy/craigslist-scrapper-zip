import CraigslistScraper from '@/components/CraigslistScraper';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Craigslist Web Scraper</h1>
      <CraigslistScraper />
    </main>
  );
}