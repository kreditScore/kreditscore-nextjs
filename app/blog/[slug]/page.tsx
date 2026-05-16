import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";
import { getAllPostsMeta, getPostBySlug, getPostSlugs } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

type Props = { params: { slug: string } };

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

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return { title: "Article not found | KreditScore" };
  }
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: `${post.title} | KreditScore Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url,
      siteName: "KreditScore",
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const allMeta = getAllPostsMeta();
  const related = allMeta.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "KreditScore",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-3xl mx-auto px-5 py-10 md:py-14">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[#FF8C00] font-medium hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          All articles
        </Link>

        <header className="mb-10 pb-8 border-b border-gray-200/80">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#87CEEB]" />
              {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#87CEEB]" />
              {post.readingMinutes} min read
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#87CEEB]" />
              {post.author}
            </span>
          </div>
          <h1 className="text-3xl md:text-[2rem] font-bold text-[#2c3e50] leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">{post.description}</p>
          <div className="flex flex-wrap gap-2 mt-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-3 py-1 rounded-full bg-orange-50 text-[#b45309] border border-orange-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <footer className="mt-14 pt-10 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-6">
            This article is for general information only. Interest rates, terms, and
            approval depend on the lender&apos;s policies.
          </p>
          <Link
            href="/instant-personal-loan-online"
            className="inline-flex items-center justify-center rounded-full bg-[#FF8C00] text-white px-6 py-3 text-sm font-semibold hover:bg-[#e67e00] transition-colors w-full sm:w-auto"
          >
            Apply for a loan
          </Link>
        </footer>

        {related.length > 0 && (
          <section className="mt-14" aria-labelledby="related-heading">
            <h2
              id="related-heading"
              className="text-lg font-semibold text-[#2c3e50] mb-4"
            >
              Read more
            </h2>
            <ul className="space-y-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="block rounded-xl border border-gray-200 bg-white/80 px-4 py-3 hover:border-[#FF8C00]/40 hover:bg-orange-50/30 transition-colors"
                  >
                    <span className="font-medium text-[#2c3e50]">{p.title}</span>
                    <span className="block text-xs text-gray-500 mt-1">
                      {formatDate(p.date)} · {p.readingMinutes} min read
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </>
  );
}
