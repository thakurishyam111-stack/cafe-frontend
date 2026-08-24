"use client"

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="error-shell">
      <section className="error-card" role="alert">
        <div className="error-badge">Oops! Something went wrong</div>
        <h1 className="error-title">The cafe page hit a snag.</h1>
        <p className="error-copy">
          We&apos;re sorry, but this page could not be loaded properly. Please try again,
          head back to the homepage, or contact the team if the issue continues.
        </p>

       

        <p className="error-note">Error ID: {error.digest ?? 'unknown'}</p>
      </section>
    </main>
  )
}
