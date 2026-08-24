import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="error-shell">
      <section className="error-card">
        <div className="error-badge">404 • Page missing</div>
        <h1 className="error-title">This page is not available.</h1>
        <p className="error-copy">
          The page you requested may have been moved, removed, or never existed. Let&apos;s
          bring you back to the café experience.
        </p>

        <div className="error-actions">
          <Link href="/" className="error-btn-primary">
            Return home
          </Link>
          <Link href="/Menu" className="error-btn-secondary">
            View menu
          </Link>
        </div>

        <p className="error-note">If you believe this is a mistake, please refresh and try again.</p>
      </section>
    </main>
  )
}
