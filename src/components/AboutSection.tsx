'use client';

import React from 'react';
import Link from 'next/link';
import {
  Heart,
  Sparkles,
  Star,
  Award,
  ArrowUpRight,
  Crown,
} from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
className="relative overflow-hidden bg-[#F4C2C2] py-20 sm:py-24"
    >
      {/* ================= BACKGROUND DECORATIONS ================= */}

      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#F4C2C2]/60 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#E8A8A8]/35 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= SECTION HEADER ================= */}

        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DFA3A3] bg-[#F9DDDD]/80 px-4 py-2 shadow-sm backdrop-blur">
            <Sparkles size={14} className="text-rose-800" />

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-rose-800">
              Our Identity
            </span>

            <Sparkles size={14} className="text-rose-800" />
          </div>

          <h2 className="mt-5 font-serif text-4xl font-semibold text-maroon-950 sm:text-5xl">
            About

            <span className="ml-2 bg-gradient-to-r from-rose-900 via-rose-700 to-rose-900 bg-clip-text text-transparent">
              JANNAT ELEGANCE
            </span>
          </h2>

          {/* Decorative Divider */}

          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#DFA3A3]" />

            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#DFA3A3]" />
              <span className="h-2 w-2 rounded-full bg-rose-800" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#DFA3A3]" />
            </div>

            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#DFA3A3]" />
          </div>

          <p className="mt-5 text-sm leading-7 text-maroon-900/70 sm:text-base">
            A celebration of timeless Indian fashion, feminine grace and
            contemporary elegance—created for every woman who deserves to feel
            beautiful, confident and effortlessly elegant.
          </p>
        </div>

        {/* ================= OUR STORY + PHILOSOPHY ================= */}

        <div className="grid items-stretch gap-7 lg:grid-cols-2 lg:gap-10">
          {/* ================= OUR STORY ================= */}

          <div className="group relative overflow-hidden rounded-[32px] border border-[#DFA3A3]/70 bg-gradient-to-br from-[#F9DDDD] via-[#FCEAEA] to-[#F4C2C2]/70 p-7 shadow-lg shadow-[#DFA3A3]/25 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:p-10 lg:p-12">
            {/* Decorative Glow */}

            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#F4C2C2]/70 blur-3xl transition duration-500 group-hover:scale-125" />

            <div className="relative">
              {/* Icon + Title */}

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-900 to-rose-700 text-white shadow-lg shadow-[#DFA3A3]/40">
                  <Heart size={21} className="fill-white text-white" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-800">
                    The Beginning
                  </p>

                  <h3 className="mt-1 font-serif text-3xl font-semibold text-maroon-950">
                    Our Story
                  </h3>
                </div>
              </div>

              {/* Content */}

              <div className="mt-8 space-y-5 text-sm leading-8 text-maroon-900/75 sm:text-base">
                <p>
                  Jannat Elegance was born from a love for timeless Indian
                  fashion and the belief that every woman deserves to feel
                  beautiful, confident and effortlessly elegant.
                </p>

                <p>
                  We bring together traditional inspiration and contemporary
                  design to create ethnic wear that feels graceful, luxurious
                  and relevant to today&apos;s woman.
                </p>

                <p>
                  Every design is thoughtfully created with attention to
                  silhouette, fabric, colour and detail—because true elegance
                  lies in the little things.
                </p>
              </div>

              {/* Brand Feeling */}

              <div className="mt-9 border-t border-[#DFA3A3]/70 pt-7">
                <div className="rounded-2xl border border-[#E5B5B5] bg-white/30 p-5">
                  <p className="font-serif text-xl leading-8 italic text-maroon-900 sm:text-2xl">
                    Jannat Elegance is more than clothing.
                  </p>

                  <p className="mt-4 font-serif text-lg italic text-maroon-900/80">
                    It is a feeling.
                  </p>

                  <p className="mt-1 font-serif text-lg italic text-maroon-900/80">
                    It is confidence.
                  </p>

                  <p className="mt-1 font-serif text-lg font-semibold italic text-rose-800">
                    It is the queen within you.
                  </p>
                </div>
              </div>

              {/* DISCOVER CTA */}

              <div className="mt-8">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-rose-800 transition-colors hover:text-rose-600"
                >
                  Discover Our Story

                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* ================= OUR PHILOSOPHY ================= */}

          <div className="group relative overflow-hidden rounded-[32px] border border-maroon-800 bg-gradient-to-br from-maroon-950 via-rose-950 to-maroon-900 p-7 shadow-2xl shadow-maroon-950/20 sm:p-10 lg:p-12">
            {/* Background Glow */}

            <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-[#F4C2C2]/15 blur-3xl" />

            <div className="pointer-events-none absolute bottom-0 left-0 h-60 w-60 rounded-full bg-[#E8A8A8]/15 blur-3xl" />

            <div className="relative">
              {/* Icon + Heading */}

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#F4C2C2]/25 bg-[#F4C2C2]/10 text-[#F4C2C2]">
                  <Sparkles
                    size={21}
                    className="fill-[#F4C2C2] text-[#F4C2C2]"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F4C2C2]">
                    What We Believe
                  </p>

                  <h3 className="mt-1 font-serif text-3xl font-semibold text-white">
                    Our Philosophy
                  </h3>
                </div>
              </div>

              {/* Tagline */}

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#F4C2C2]">
                Designed With Grace. Made To Be Remembered.
              </p>

              {/* Description */}

              <div className="mt-5 space-y-5 text-sm leading-8 text-pink-100/75 sm:text-base">
                <p>
                  At Jannat Elegance, we believe fashion should do more than
                  dress you—it should express you.
                </p>

                <p>
                  Our designs celebrate femininity, Indian heritage and modern
                  elegance, creating pieces that you can cherish, wear and make
                  your own.
                </p>
              </div>

              {/* Philosophy Keywords */}

              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur transition-all duration-300 hover:bg-white/10">
                  <Sparkles size={16} className="mx-auto text-[#F4C2C2]" />

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#F4C2C2]">
                    Timeless
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur transition-all duration-300 hover:bg-white/10">
                  <Heart size={16} className="mx-auto text-[#F4C2C2]" />

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#F4C2C2]">
                    Feminine
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur transition-all duration-300 hover:bg-white/10">
                  <Star size={16} className="mx-auto text-[#F4C2C2]" />

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#F4C2C2]">
                    Elegant
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur transition-all duration-300 hover:bg-white/10">
                  <Award size={16} className="mx-auto text-[#F4C2C2]" />

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#F4C2C2]">
                    Effortless
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= WHY JANNAT ELEGANCE ================= */}

        <div className="mt-14 sm:mt-20">
          <div className="mb-9 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-rose-800">
              Why Jannat Elegance?
            </p>

            <h3 className="mt-3 font-serif text-3xl font-semibold text-maroon-950 sm:text-4xl">
              Crafted For Your Beautiful Moments
            </h3>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* ================= CARD 1 ================= */}

            <div className="group rounded-3xl border border-[#DFA3A3]/60 bg-gradient-to-br from-[#F9DDDD]/90 to-[#FCEAEA]/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#D39A9A] hover:shadow-xl hover:shadow-[#DFA3A3]/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-maroon-900 to-rose-800 text-white shadow-lg">
                <Award size={20} />
              </div>

              <h4 className="mt-5 font-serif text-xl font-semibold text-maroon-950">
                Thoughtful Designs
              </h4>

              <p className="mt-3 text-xs leading-6 text-maroon-900/65">
                Every piece is created with an eye for elegance and detail.
              </p>
            </div>

            {/* ================= CARD 2 ================= */}

            <div className="group rounded-3xl border border-[#DFA3A3]/60 bg-gradient-to-br from-[#F9DDDD]/90 to-[#FCEAEA]/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#D39A9A] hover:shadow-xl hover:shadow-[#DFA3A3]/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-900 to-rose-700 text-white shadow-lg">
                <Star size={20} />
              </div>

              <h4 className="mt-5 font-serif text-xl font-semibold text-maroon-950">
                Premium Feel
              </h4>

              <p className="mt-3 text-xs leading-6 text-maroon-900/65">
                We focus on beautiful fabrics, refined finishing and quality.
              </p>
            </div>

            {/* ================= CARD 3 ================= */}

            <div className="group rounded-3xl border border-[#DFA3A3]/60 bg-gradient-to-br from-[#F9DDDD]/90 to-[#FCEAEA]/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#D39A9A] hover:shadow-xl hover:shadow-[#DFA3A3]/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#DFA3A3] to-rose-800 text-white shadow-lg">
                <Sparkles size={20} />
              </div>

              <h4 className="mt-5 font-serif text-xl font-semibold text-maroon-950">
                Timeless Style
              </h4>

              <p className="mt-3 text-xs leading-6 text-maroon-900/65">
                Designed to remain elegant beyond fleeting trends.
              </p>
            </div>

            {/* ================= CARD 4 ================= */}

            <div className="group rounded-3xl border border-[#DFA3A3]/60 bg-gradient-to-br from-[#F9DDDD]/90 to-[#FCEAEA]/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#D39A9A] hover:shadow-xl hover:shadow-[#DFA3A3]/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-950 to-rose-700 text-white shadow-lg">
                <Heart size={20} className="fill-white" />
              </div>

              <h4 className="mt-5 font-serif text-xl font-semibold text-maroon-950">
                Made for Her
              </h4>

              <p className="mt-3 text-xs leading-6 text-maroon-900/65">
                Because every woman deserves to feel confident in what she
                wears.
              </p>
            </div>
          </div>
        </div>

        {/* ================= BRAND PROMISE ================= */}

        <div className="relative mt-16 overflow-hidden rounded-[36px] border border-maroon-800 bg-gradient-to-r from-maroon-950 via-rose-950 to-maroon-900 px-6 py-14 text-center shadow-2xl shadow-maroon-950/20 sm:mt-20 sm:px-12 sm:py-16 lg:px-16">
          {/* Decorations */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#F4C2C2]/15 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#E8A8A8]/15 blur-3xl" />

          <div className="relative">
            {/* Crown */}

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#F4C2C2]/25 bg-[#F4C2C2]/10 text-[#F4C2C2]">
              <Crown size={25} />
            </div>

            <span className="mt-6 block text-[10px] font-bold uppercase tracking-[0.3em] text-[#F4C2C2]">
              Brand Promise
            </span>

            <h3 className="mx-auto mt-4 max-w-4xl font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              Wear Your Elegance.
              <br className="hidden sm:block" />

              <span className="text-[#F4C2C2]">Own Your Moment.</span>
            </h3>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-pink-100/70 sm:text-base">
              Whether it&apos;s a festive celebration, a family gathering, a
              special occasion or simply a day when you want to feel
              beautiful—Jannat Elegance is designed to be part of your moments.
            </p>

            {/* ================= CTA BUTTON ================= */}

            <div className="mt-9 flex justify-center">
              <Link
                href="/collections"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#DFA3A3] to-rose-700 px-7 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                Shop Now

                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
