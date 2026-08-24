"use client"

import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <main className="error-shell">
          <section className="error-card" role="alert">
            <div className="error-badge">Critical issue</div>
            <h1 className="error-title">The cafe experience needs a quick restart.</h1>
            <p className="error-copy">
              A serious error interrupted this page. You can retry, return home, or
              refresh the browser to get back to the café quickly.
            </p>

            <div className="error-actions">
              <button className="error-btn-primary" onClick={() => reset()}>
                Try again
              </button>
              <Link href="/" className="error-btn-secondary">
                Go home
              </Link>
            </div>

            <p className="error-note">Error ID: {error.digest ?? 'unknown'}</p>
          </section>
        </main>
      </body>
    </html>
  )
}
