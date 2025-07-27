import { motion } from "framer-motion";
import { TechTag, TECHS } from "../types";

export function MobileFilterDrawer({
    techs,
    selectedTechs,
    toggleTech,
    onClose,
    onClearAll,
}: {
    techs: typeof TECHS;
    selectedTechs: Set<TechTag>;
    toggleTech: (t: TechTag) => void;
    onClose: () => void;
    onClearAll: () => void;
}) {
    return (
        <>
            <motion.div
                className="fixed inset-0 bg-black/50 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />
            <motion.aside
                className="fixed right-0 top-0 h-full w-80 bg-custom z-50 shadow-xl p-6 flex flex-col"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-heading">
                        Filter by Technology
                    </h4>
                    <button
                        className="p-2 rounded-md hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                        onClick={onClose}
                        aria-label="Close filter"
                    >
                        ✕
                    </button>
                </div>

                {/* Selected count */}
                {selectedTechs.size > 0 && (
                    <div className="mb-4 px-3 py-2 bg-[var(--color-accent)]/10 rounded-lg">
                        <p className="text-sm text-subtle">
                            {selectedTechs.size} filter
                            {selectedTechs.size !== 1 ? "s" : ""} active
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-3 mb-6">
                    {Object.entries(techs).map(([key, meta]) => {
                        const active = selectedTechs.has(key as TechTag);
                        return (
                            <button
                                key={key}
                                onClick={() => toggleTech(key as TechTag)}
                                className={`flex flex-col items-center gap-2 rounded-lg p-3 text-center shadow-sm transition-all ${
                                    active
                                        ? "bg-[var(--color-accent)] text-white scale-105"
                                        : "bg-white text-[var(--color-foreground)] hover:bg-[var(--color-accent)]/10"
                                }`}
                                title={meta.label}
                            >
                                <span className="text-xl">{meta.icon}</span>
                                <span className="text-xs font-medium">
                                    {meta.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {selectedTechs.size > 0 && (
                    <button
                        className="mt-auto w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                        onClick={() => {
                            onClearAll();
                            onClose();
                        }}
                    >
                        Clear All Filters
                    </button>
                )}
            </motion.aside>
        </>
    );
}
