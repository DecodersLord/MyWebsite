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
} from "react-icons/si";
import { FiGithub, FiExternalLink } from "react-icons/fi";

export type Category = "Front-end" | "Back-end" | "Game-dev";

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
    | "docker";

export interface Project {
    id: string;
    title: string;
    description: string;
    category: Category;
    technologies: TechTag[];
    image?: string;
    github?: string;
    live?: string;
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
};
