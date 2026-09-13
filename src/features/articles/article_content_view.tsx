"use client";

import Image from "next/image";
import { CodeBlockCopyEnhancer } from "@/shared/ui/code_block_copy_enhancer";
import { ArticleChangelog, ArticleRevisionItem } from "./article_changelog";

interface ArticleContentViewProps {
  title: string;
  coverImageUrl: string | null;
  compiledHtml: string;
  revisions: ArticleRevisionItem[];
}

export function ArticleContentView({
  title,
  coverImageUrl,
  compiledHtml,
  revisions,
}: ArticleContentViewProps) {
  return (
    <article className="lg:col-span-8 space-y-6">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-black/8 bg-[#fbfbfa] shadow-sm">
        <Image
          src={coverImageUrl || "/images/architecture_cover.jpg"}
          alt={title}
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="rounded-2xl border border-black/8 bg-white p-6 sm:p-10 shadow-sm">
        <CodeBlockCopyEnhancer>
          <div
            className="prose max-w-none text-sm sm:text-base leading-relaxed text-[#20211f] space-y-4
            [&_h2]:font-['Fraunces'] [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-[#20211f] [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-black/6
            [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:text-[#20211f] [&_h3]:mt-6 [&_h3]:mb-2
            [&_p]:text-[#40433d] [&_p]:leading-7
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:text-[#40433d]
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:text-[#40433d]
            [&_code]:rounded-md [&_code]:bg-[#f2f5f0] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-[#20211f]
            [&_pre]:rounded-xl [&_pre]:bg-[#20211f] [&_pre]:p-4 [&_pre]:text-white [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:text-emerald-300 [&_pre_code]:p-0
            [&_blockquote]:border-l-4 [&_blockquote]:border-[#5a8357] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#626760]
            [&_table]:w-full [&_table]:text-xs [&_table]:border-collapse [&_th]:border-b [&_th]:border-black/10 [&_th]:p-2 [&_th]:text-left [&_td]:border-b [&_td]:border-black/6 [&_td]:p-2"
            dangerouslySetInnerHTML={{ __html: compiledHtml }}
          />
        </CodeBlockCopyEnhancer>
      </div>

      <ArticleChangelog revisions={revisions} />
    </article>
  );
}
