"use client";

interface ArchetypeFilterBarProps {
  selectedArchetype: string;
  onChange: (type: string) => void;
  counts: Record<string, number>;
}

const ARCHETYPES = [
  { key: "all", label: "All Formats" },
  { key: "RFC", label: "RFC Proposals" },
  { key: "ADR", label: "Architecture Decisions (ADR)" },
  { key: "POST_MORTEM", label: "Incident Post-Mortems" },
  { key: "RUNBOOK", label: "Operational Runbooks" },
  { key: "ONBOARDING", label: "Onboarding Guides" },
  { key: "STANDARD", label: "Technical Standards" },
];

export function ArchetypeFilterBar({
  selectedArchetype,
  onChange,
  counts,
}: ArchetypeFilterBarProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#81857e] mr-1 shrink-0">
        Archetype:
      </span>
      {ARCHETYPES.map((arch) => {
        const isSelected = selectedArchetype === arch.key;
        const count = counts[arch.key] ?? 0;

        return (
          <button
            key={arch.key}
            type="button"
            onClick={() => onChange(arch.key)}
            className={`shrink-0 rounded-lg px-2.5 py-1 font-medium transition cursor-pointer ${
              isSelected
                ? "bg-[#252724] text-white shadow-sm"
                : "bg-white border border-black/8 text-[#626760] hover:bg-black/4 hover:text-[#20211f]"
            }`}
          >
            <span>{arch.label}</span>
            {count > 0 && (
              <span
                className={`ml-1.5 font-mono text-[10px] ${
                  isSelected ? "text-white/80" : "text-[#81857e]"
                }`}
              >
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
