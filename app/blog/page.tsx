import Link from "next/link";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { getAllPostsMeta } from "@/lib/blog";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function BlogIndexPage() {
  const posts = getAllPostsMeta();

  return (
    <div className="max-w-5xl mx-auto px-5 py-12 md:py-16">
      <header className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm text-[#2c3e50] shadow-sm border border-orange-100 mb-5">
          <BookOpen className="w-4 h-4 text-[#FF8C00]" />
          <span>Blog &amp; Articles</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#2c3e50] mb-4 leading-tight">
          Clear guides on loans, credit scores, and{" "}
          <span className="text-[#FF8C00]">personal finance</span>
        </h1>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
          No jargon — eligibility, documents, CIBIL, and practical tips you can use.
        </p>
      </header>

      <ul className="grid gap-6 md:gap-8">
        {posts.map((post, index) => (
          <li key={post.slug}>
            <article>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl bg-white/90 border border-gray-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(255,140,0,0.12)] hover:border-[#FF8C00]/30 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-start gap-6">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF8C00]/15 to-[#87CEEB]/25 text-[#2c3e50] font-bold text-lg"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-2">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#87CEEB]" />
                        {formatDate(post.date)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#87CEEB]" />
                        {post.readingMinutes} min read
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold text-[#2c3e50] group-hover:text-[#FF8C00] transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2 md:line-clamp-3">
                      {post.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-[#2c3e50]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex md:flex-col items-center md:items-end justify-end shrink-0">
                    <span className="inline-flex items-center gap-2 text-[#FF8C00] font-semibold text-sm group-hover:gap-3 transition-all">
                      Read
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          </li>
        ))}
      </ul>

      {posts.length === 0 && (
        <p className="text-center text-gray-600 py-16">
          No articles yet. New posts will appear here soon.
        </p>
      )}

      <section className="mt-16 rounded-2xl bg-gradient-to-r from-[#FF8C00]/10 via-white to-[#87CEEB]/15 border border-orange-100/80 p-8 text-center">
        <h2 className="text-lg font-semibold text-[#2c3e50] mb-2">
          Ready to apply for a loan?
        </h2>
        <p className="text-gray-600 text-sm mb-5 max-w-lg mx-auto">
          Apply online and explore options that match your profile.
        </p>
        <Link
          href="/instant-personal-loan-online"
          className="inline-flex items-center gap-2 rounded-full bg-[#FF8C00] text-white px-6 py-3 text-sm font-semibold hover:bg-[#e67e00] transition-colors shadow-md"
        >
          Start a personal loan
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
