import {
    SiReact,
    SiJavascript,
    SiTypescript,
    SiHtml5,
    SiCss3,
    SiNodedotjs,
    SiMongodb,
    SiUnity,
    SiPython,
    SiNextdotjs,
    SiPostgresql,
    SiFirebase,
    SiDocker,
    SiGnubash,
} from "react-icons/si";
import { FiGithub, FiCloud } from "react-icons/fi";
import { FaGamepad, FaPalette, FaServer, FaLinux } from "react-icons/fa";

export type CategoryKey = "Front-end" | "Back-end" | "Game-dev" | "dev-ops";

export interface CategoryInfo {
    label: string;
    icon: React.ReactNode;
    color: string;
}

export const CATEGORIES: Record<CategoryKey, CategoryInfo> = {
    "Front-end": {
        label: "Front-end",
        icon: <FaPalette className="text-blue-500" />,
        color: "from-blue-500/20 to-cyan-500/20",
    },
    "Back-end": {
        label: "Back-end",
        icon: <FaServer className="text-gray-600" />,
        color: "from-green-500/20 to-emerald-500/20",
    },
    "Game-dev": {
        label: "Game-dev",
        icon: <FaGamepad className="text-green-500" />,
        color: "from-purple-500/20 to-pink-500/20",
    },
    "dev-ops": {
        label: "DevOps",
        icon: <FiCloud className="text-blue-400" />,
        color: "from-green-500/20 to-cyan-500/20",
    },
} as const;

export type Category = CategoryKey;

// Helper functions
export const getCategoryIcon = (category: Category) =>
    CATEGORIES[category]?.icon;
export const getCategoryLabel = (category: Category) =>
    CATEGORIES[category]?.label;
export const getCategoryColor = (category: Category) =>
    CATEGORIES[category]?.color;

export type TechTag =
    | "react"
    | "next"
    | "js"
    | "ts"
    | "html"
    | "css"
    | "node"
    | "mongodb"
    | "postgres"
    | "unity"
    | "python"
    | "firebase"
    | "github"
    | "docker"
    | "bash"
    | "linux";

export interface Project {
    id: string;
    title: string;
    description: string;
    category: Category;
    technologies: TechTag[];
    imageURL?: string;
    github?: string;
    live?: string;
}

export interface Experience {
    id: string;
    company_name: string;
    Description: string;
    start_date: string;
    end_date: string;
    role: string;
    skills: string[];
    sequence?: number;
}

export const TECHS: Record<
    TechTag,
    { label: string; icon: React.ReactNode; color?: string }
> = {
    react: { label: "React", icon: <SiReact /> },
    next: { label: "Next.js", icon: <SiNextdotjs /> },
    js: { label: "JavaScript", icon: <SiJavascript /> },
    ts: { label: "TypeScript", icon: <SiTypescript /> },
    html: { label: "HTML", icon: <SiHtml5 /> },
    css: { label: "CSS", icon: <SiCss3 /> },
    node: { label: "Node.js", icon: <SiNodedotjs /> },
    mongodb: { label: "MongoDB", icon: <SiMongodb /> },
    postgres: { label: "PostgreSQL", icon: <SiPostgresql /> },
    unity: { label: "Unity", icon: <SiUnity /> },
    python: { label: "Python", icon: <SiPython /> },
    firebase: { label: "Firebase", icon: <SiFirebase /> },
    github: { label: "GitHub", icon: <FiGithub /> },
    docker: { label: "Docker", icon: <SiDocker /> },
    bash: { label: "Bash", icon: <SiGnubash /> },
    linux: { label: "Linux", icon: <FaLinux /> },
};
