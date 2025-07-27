"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaDev } from "react-icons/fa";
import Image from "next/image";

interface SocialLink {
    name: string;
    icon: React.ReactNode;
    url: string;
    onHover: (() => void) | null;
    stats: null;
    loading: boolean;
    renderStats: ((stats: null) => React.ReactNode) | null;
}

// ---------- Tooltip Portal ----------
const TooltipPortal = ({
    children,
    isVisible,
    triggerRef,
}: {
    children: React.ReactNode;
    isVisible: boolean;
    triggerRef: React.RefObject<HTMLDivElement>;
}) => {
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setTooltipPosition({
                x: rect.left + rect.width / 2,
                y: rect.bottom + 8,
            });
        }
    }, [isVisible, triggerRef]);

    if (!isVisible) return null;

    return createPortal(
        <div
            className="fixed pointer-events-none transition-opacity duration-300"
            style={{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
                transform: "translateX(-50%)",
                zIndex: 99999,
            }}
        >
            {children}
        </div>,
        document.body
    );
};

const SocialIcons = () => {
    const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

    // Refs for tooltip positioning
    const iconRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>(
        {
            GitHub: useRef<HTMLDivElement>(null),
            LeetCode: useRef<HTMLDivElement>(null),
            LinkedIn: useRef<HTMLDivElement>(null),
            "Dev.to": useRef<HTMLDivElement>(null),
        }
    );

    // Replace with your actual usernames
    const GITHUB_USERNAME = "DecodersLord";
    const LEETCODE_USERNAME = "PriyankSevak";
    const LINKEDIN_USERNAME = "priyank-sevak";
    const DEV_TO_USERNAME = "decoders_lord";

    const socialLinks: SocialLink[] = [
        {
            name: "GitHub",
            icon: <FaGithub className="w-6 h-6" />,
            url: `https://github.com/${GITHUB_USERNAME}`,
            onHover: null,
            stats: null, // no stats object needed
            loading: false,
            renderStats: () => (
                <a
                    href={`https://github.com/${GITHUB_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        src={`https://github-readme-streak-stats.herokuapp.com/?user=DecodersLord&stroke=373251&background=1e1e2e&ring=22d3ee&fire=ff6f61&currStreakNum=ededed&currStreakLabel=22d3ee&sideNums=ededed&sideLabels=22d3ee&dates=ededed&hide_border=false`}
                        alt="GitHub Streak Stats"
                        className="rounded-lg shadow-lg"
                        width={500}
                        height={120}
                    />
                </a>
            ),
        },
        {
            name: "LeetCode",
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.85 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                </svg>
            ),
            url: `https://leetcode.com/${LEETCODE_USERNAME}`,
            onHover: null,
            stats: null,
            loading: false,
            renderStats: () => (
                <a
                    href={`https://leetcode.com/${LEETCODE_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        src={`https://leetcard.jacoblin.cool/${LEETCODE_USERNAME}?theme=catppuccinMocha&font=Source+Code+Pro&ext=heatmap`}
                        alt="LeetCode Stats Card"
                        className="rounded-lg shadow-lg"
                        width={500}
                        height={150}
                    />
                </a>
            ),
        },
        {
            name: "LinkedIn",
            icon: <FaLinkedin className="w-6 h-6" />,
            url: `https://linkedin.com/in/${LINKEDIN_USERNAME}`,
            onHover: null,
            stats: null,
            loading: false,
            renderStats: null,
        },
        {
            name: "Dev.to",
            icon: <FaDev className="w-6 h-6" />,
            url: `https://dev.to/${DEV_TO_USERNAME}`,
            onHover: null,
            stats: null,
            loading: false,
            renderStats: null,
        },
    ];

    return (
        <div className="flex gap-4 mt-6">
            {socialLinks.map((social) => (
                <div key={social.name}>
                    <div
                        ref={iconRefs.current[social.name]}
                        className="relative group"
                        onMouseEnter={() => {
                            setHoveredIcon(social.name);
                            social.onHover?.();
                        }}
                        onMouseLeave={() => setHoveredIcon(null)}
                    >
                        <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:btn-primary"
                        >
                            <div className="text-gray-700 hover:text-blue-600 transition-colors">
                                {social.icon}
                            </div>
                        </a>
                    </div>

                    {/* Stats Tooltip */}
                    <TooltipPortal
                        isVisible={
                            hoveredIcon === social.name && !!social.renderStats
                        }
                        triggerRef={iconRefs.current[social.name]}
                    >
                        {social.renderStats && social.renderStats(null)}
                    </TooltipPortal>

                    {/* Loading Tooltip */}
                    <TooltipPortal
                        isVisible={
                            hoveredIcon === social.name && social.loading
                        }
                        triggerRef={iconRefs.current[social.name]}
                    >
                        <div className="bg-custom text-white p-3 rounded-lg shadow-lg">
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span className="text-sm">
                                    Loading stats...
                                </span>
                            </div>
                        </div>
                    </TooltipPortal>
                </div>
            ))}
        </div>
    );
};

export default SocialIcons;
