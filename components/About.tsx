export default function About() {
  return (
    <section
      id="about"
      className="relative mt-12 overflow-hidden rounded-[2rem] bg-gradient-to-r from-amber-50 via-white to-amber-100 px-6 py-12 shadow-2xl shadow-orange-200 sm:px-10"
    >
      <div className="absolute inset-y-0 right-0 hidden w-80 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_55%)] lg:block" />
      <div className="absolute -top-10 left-6 h-24 w-24 rounded-full bg-amber-200/70 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-amber-700">
            Experience the Story
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Where Coffee Craft Meets Warm Community
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            From the first coffee houses of the Middle East to the cozy
            corners of today’s cafes, coffee has always been a bridge between
            people, ideas, and memorable moments. Our cafe honors that story
            with handcrafted blends, welcoming spaces, and thoughtful service.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-amber-200 bg-white/95 p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-amber-700">
                Heritage
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Coffeehouses became cultural hubs more than 500 years ago,
                inspiring conversation, art, and community.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950/5 p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-900">
                Craft
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                We blend classic roasting traditions with modern flavors and a
                menu designed for comfort, connection, and joy.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50/95 p-6 shadow-[0_28px_70px_-36px_rgba(15,23,42,0.25)]">
          <div className="rounded-[1.75rem] bg-amber-500/10 p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-amber-700">
              Coffee History
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">
              A Journey Through Time
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              From the Ottoman coffee houses to the modern cafe scene, coffee
              has evolved while keeping its timeless power to bring people
              together.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">1600s</p>
              <p className="mt-2 text-sm text-slate-600">
                Coffee houses first appeared as inviting social spaces where
                artists, thinkers, and travelers met over warm cups.
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">1900s</p>
              <p className="mt-2 text-sm text-slate-600">
                Coffee culture spread around the world, creating modern
                havens for work, relaxation, and friendly conversation.
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-950">Today</p>
              <p className="mt-2 text-sm text-slate-600">
                We continue the tradition with fresh beans, cozy design, and a
                welcoming atmosphere for every visit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
