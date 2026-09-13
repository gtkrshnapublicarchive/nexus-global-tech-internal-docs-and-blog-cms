"use client";

import { AlertCircle, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { FormIssue } from "@/shared/lib/format_error";

interface FeedbackAlertProps {
  type: "error" | "success" | "warning";
  title?: string;
  message: string;
  issues?: FormIssue[];
  onDismiss?: () => void;
  className?: string;
}

export function FeedbackAlert({
  type,
  title,
  message,
  issues = [],
  onDismiss,
  className = "",
}: FeedbackAlertProps) {
  const isError = type === "error";
  const isSuccess = type === "success";

  const containerClasses = isError
    ? "border-[#edd5d2] bg-[#fbf5f4]"
    : isSuccess
      ? "border-[#d7e5d5] bg-[#f5f9f4]"
      : "border-[#faebd7] bg-[#fdfaf5]";

  const iconClasses = isError
    ? "bg-[#fae4e1] text-[#b83324]"
    : isSuccess
      ? "bg-[#e7f2e4] text-[#4c7649]"
      : "bg-[#faedd9] text-[#9c6a1e]";

  const defaultTitle = isError
    ? "Submission Issues Detected"
    : isSuccess
      ? "Action Completed"
      : "Notice";

  return (
    <div
      role="alert"
      className={`relative rounded-2xl border p-4 sm:p-5 shadow-sm transition duration-150 animate-in fade-in zoom-in-98 ${containerClasses} ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClasses}`}
        >
          {isError && <AlertCircle className="h-4 w-4" />}
          {isSuccess && <CheckCircle2 className="h-4 w-4" />}
          {!isError && !isSuccess && <AlertTriangle className="h-4 w-4" />}
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-['Fraunces'] text-sm font-semibold tracking-tight text-[#20211f]">
              {title || defaultTitle}
            </h4>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-lg p-1 text-[#81857e] transition hover:bg-black/5 hover:text-[#20211f]"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <p className="mt-1 text-xs leading-relaxed text-[#5c6158]">
            {message}
          </p>

          {issues.length > 0 && (
            <ul className="mt-3 divide-y divide-black/5 rounded-xl border border-black/6 bg-white/70 px-3 py-1.5 text-xs">
              {issues.map((issue, idx) => (
                <li
                  key={`${issue.field ?? "general"}-${idx}`}
                  className="flex items-center gap-2.5 py-1.5 text-[#252824]"
                >
                  {issue.field && (
                    <span className="shrink-0 rounded-md bg-[#fae4e1] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#912417]">
                      {issue.field}
                    </span>
                  )}
                  <span className="leading-snug">{issue.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
