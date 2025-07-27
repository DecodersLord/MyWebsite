"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Card from "../components/Card";

interface Project {
    id: string;
    title: string;
    description: string;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const querySnapshot = await getDocs(
                    collection(db, "portfolio")
                );
                const projs: Project[] = [];
                querySnapshot.forEach((doc) => {
                    projs.push({
                        id: doc.id,
                        ...(doc.data() as Omit<Project, "id">),
                    });
                });
                setProjects(projs);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProjects();
    }, []);

    if (loading) return <p className="text-center">Loading projects...</p>;

    return (
        <section className="min-h-screen px-6 py-20">
            <h2 className="text-4xl font-bold text-center mb-12 text-amber-700">
                Projects
            </h2>
            <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map(({ id, title, description }) => (
                    <Card key={id} shadow="sm" padding="md">
                        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-3" />
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {description}
                        </p>
                    </Card>
                ))}
            </div>
        </section>
    );
}
