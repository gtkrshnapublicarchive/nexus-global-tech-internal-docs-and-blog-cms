"use client";

interface StudioPanesProps {
  content: string;
  setContent: (v: string) => void;
  compiledHtml: string;
  contentError?: string;
  clearContentError: () => void;
}

export function StudioPanes({
  content,
  setContent,
  compiledHtml,
  contentError,
  clearContentError,
}: StudioPanesProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left Pane: Raw Markdown Textarea */}
      <div className="flex flex-col rounded-2xl border border-black/8 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between border-b border-black/6 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#686d66]">
            Markdown Raw Source
          </span>
          <span className="text-[11px] text-[#737870]">GitHub Flavored (GFM)</span>
        </div>

        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (contentError) clearContentError();
          }}
          rows={22}
          className={`w-full font-mono text-xs leading-relaxed text-[#20211f] bg-[#fbfbfa] p-4 rounded-xl border focus:outline-none focus:ring-2 resize-y ${
            contentError
              ? "border-red-300 focus:border-red-400 focus:ring-red-400/20"
              : "border-black/8 focus:border-[#668c63] focus:ring-[#668c63]/20"
          }`}
          placeholder="Write your markdown content..."
        />
        {contentError && (
          <p className="mt-2 text-[11px] font-medium text-red-600">
            {contentError}
          </p>
        )}
      </div>

      {/* Right Pane: Live HTML Preview */}
      <div className="flex flex-col rounded-2xl border border-black/8 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between border-b border-black/6 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#686d66]">
            Live Formatted Preview
          </span>
          <span className="text-[11px] text-[#5a8357] font-semibold">Real-Time Sync</span>
        </div>

        <div className="overflow-y-auto rounded-xl border border-black/6 bg-[#fbfbfa] p-5 h-[520px]">
          <div
            className="prose max-w-none text-xs sm:text-sm leading-relaxed text-[#20211f] space-y-3
              [&_h2]:font-['Fraunces'] [&_h2]:text-xl [&_h2]:font-medium [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:pb-1 [&_h2]:border-b [&_h2]:border-black/6
              [&_h3]:font-semibold [&_h3]:text-base [&_h3]:mt-4 [&_h3]:mb-1
              [&_p]:text-[#40433d] [&_p]:leading-6
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1
              [&_code]:rounded [&_code]:bg-white [&_code]:border [&_code]:border-black/10 [&_code]:px-1 [&_code]:font-mono [&_code]:text-xs
              [&_pre]:rounded-lg [&_pre]:bg-[#20211f] [&_pre]:p-3 [&_pre]:text-white [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:text-emerald-300 [&_pre_code]:p-0
              [&_blockquote]:border-l-4 [&_blockquote]:border-[#5a8357] [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-[#626760]"
            dangerouslySetInnerHTML={{ __html: compiledHtml }}
          />
        </div>
      </div>
    </div>
  );
}
