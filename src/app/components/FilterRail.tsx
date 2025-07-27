import React from "react";
import { TechTag, TECHS } from "../types";

export const FilterRail = React.memo(function FilterRail({
    techs,
    selectedTechs,
    toggleTech,
}: {
    techs: typeof TECHS;
    selectedTechs: Set<TechTag>;
    toggleTech: (t: TechTag) => void;
}) {
    return (
        <div className="flex flex-col gap-2">
            {Object.entries(techs).map(([key, meta]) => {
                const active = selectedTechs.has(key as TechTag);
                return (
                    <button
                        key={key}
                        onClick={() => toggleTech(key as TechTag)}
                        className={`rounded-full p-3 shadow-md transition-all duration-200 ${
                            active
                                ? "bg-[var(--color-accent)] text-white scale-110"
                                : "bg-white text-[var(--color-foreground)] hover:bg-[var(--color-accent)] hover:text-white hover:scale-105"
                        }`}
                        title={meta.label}
                    >
                        <span className="text-xl">{meta.icon}</span>
                    </button>
                );
            })}
        </div>
    );
});
