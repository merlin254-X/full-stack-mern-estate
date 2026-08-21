import React from 'react';

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="relative bg-slate-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="text-amber-400 font-medium tracking-widest uppercase text-sm mb-4">
            Est. 2023 · East Africa
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            About East Bridge<br />Real-Developers
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            A Kenyan-Rwandan partnership building the platform that makes buying land, 
            booking apartments, selling property, and renovating homes simple across East Africa.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Our Story</h2>
          <div className="space-y-5 text-slate-600 leading-relaxed">
            <p>
              In 2023, two brothers — one from Kenya, one from Rwanda — decided to merge their 
              different worlds into one mission. Derrick Marine came from civil engineering. 
              Umuhoza Lionel came from software. Both went through the ALX Full Stack Software 
              Engineering program with a backend focus.
            </p>
            <p>
              We saw the same problem on both sides of the border: finding land, apartments, 
              or renovation partners was still complicated, expensive, and full of friction. 
              So we built East Bridge — a platform designed specifically for East Africans 
              who want to buy land, rent or sell property, and access trusted civil engineering 
              and renovation services without the usual headaches.
            </p>
            <p>
              What started as a final project between two brothers is now becoming a serious 
              regional platform. We are building it the way we wish someone had built it for us.
            </p>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-12">
          The Founders
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Lionel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>
            <div className="p-8">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-white text-xl font-bold">
                  UL
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Umuhoza Lionel</h3>
                  <p className="text-amber-600 font-medium text-sm">Co-Founder · Rwanda</p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Full-stack developer and product-minded builder. Focused on the platform 
                architecture, user experience, and turning complex real-estate processes 
                into clean digital flows that actually work for people on the ground.
              </p>
            </div>
          </div>

          {/* Derrick */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
            <div className="p-8">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-white text-xl font-bold">
                  DM
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Derrick Marine</h3>
                  <p className="text-blue-600 font-medium text-sm">Co-Founder · Kenya</p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Civil engineer turned technologist. Brings deep understanding of land, 
                construction, and the real-world constraints of property development. 
                Ensures the platform stays grounded in how things actually get built and bought.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom strip */}
      <section className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-300 text-lg">
            Built by two brothers. Made for East Africa.
          </p>
        </div>
      </section>
    </div>
  );
}