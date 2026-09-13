interface DocumentTypeBadgeProps {
  type: string;
  size?: "sm" | "md";
  className?: string;
}

export function DocumentTypeBadge({
  type,
  size = "md",
  className = "",
}: DocumentTypeBadgeProps) {
  let label = type;
  let colorClasses = "bg-black/5 text-[#686d66] border-black/8";

  switch (type) {
    case "RFC":
      label = "RFC Proposal";
      colorClasses = "bg-[#252724] text-white border-transparent";
      break;
    case "ADR":
      label = "Architecture Decision";
      colorClasses = "bg-[#e7f2e4] text-[#4c7649] border-[#d2e4ce]";
      break;
    case "POST_MORTEM":
      label = "Incident Post-Mortem";
      colorClasses = "bg-[#fae4e1] text-[#b83324] border-[#f2d0cc]";
      break;
    case "RUNBOOK":
      label = "Operational Runbook";
      colorClasses = "bg-[#f7efe3] text-[#82551a] border-[#edd9c0]";
      break;
    case "ONBOARDING":
      label = "Onboarding Guide";
      colorClasses = "bg-[#eaf1f7] text-[#2c5375] border-[#d6e4f0]";
      break;
    case "STANDARD":
    default:
      label = "Technical Standard";
      colorClasses = "bg-black/5 text-[#626760] border-black/8";
      break;
  }

  const isSmall = size === "sm";

  return (
    <span
      className={`inline-flex items-center rounded-md border font-semibold uppercase tracking-wider ${
        isSmall ? "px-1.5 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]"
      } ${colorClasses} ${className}`}
    >
      {label}
    </span>
  );
}
