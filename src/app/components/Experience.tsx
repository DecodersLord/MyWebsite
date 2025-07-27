"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { motion } from "framer-motion";
import Card from "../components/Card";

interface Experiences {
    id: string;
    company_name: string;
    Description: string;
    start_date: string;
    end_date: string;
    role: string;
}

export default function Experience() {
    const [experiences, setExperiences] = useState<Experiences[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchExperiences() {
            try {
                const querySnapshot = await getDocs(
                    collection(db, "Experience")
                );
                const exps: Experiences[] = [];
                querySnapshot.forEach((doc) => {
                    exps.push({
                        id: doc.id,
                        ...(doc.data() as Omit<Experiences, "id">),
                    });
                });
                setExperiences(exps);
            } catch (error) {
                console.error("Error fetching experiences:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchExperiences();
    }, []);

    if (loading) return <p className="text-center">Loading experience...</p>;

    return (
        <section className="w-full max-w-4xl mx-auto px-6 py-16">
            <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
                Experience
            </h2>

            <div className="relative pl-6 md:pl-10">
                <div className="absolute left-3 md:left-5 top-0 bottom-0 w-[2px] bg-slate-300 dark:bg-slate-700" />
                {experiences.map((exp, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.45 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="relative mb-10"
                    >
                        <span className="absolute -left-[7px] md:-left-[9px] top-2 h-3 w-3 md:h-4 md:w-4 rounded-full bg-indigo-500 border-4 border-white dark:border-gray-900 shadow" />
                        <Card>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {exp.role}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {exp.company_name}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                {exp.start_date} - {exp.end_date}
                            </p>
                            <ul className="list-disc ml-5 mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                {exp.Description.split("\n").map((b, j) => (
                                    <li key={j}>{b}</li>
                                ))}
                            </ul>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
