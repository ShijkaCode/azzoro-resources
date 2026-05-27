import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="section-kicker">404</p>
          <h1 className="text-4xl font-semibold text-balance sm:text-5xl">Page not found</h1>
          <p className="max-w-md text-muted-foreground">
            The page you requested does not exist yet in the new App Router foundation.
          </p>
          <Link
            href="/en"
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Return home
          </Link>
        </main>
      </body>
    </html>
  );
}