"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import TitleBar from "@/components/layout/TitleBar";

import { ProjectData } from "../../data/ProjectData";

export default function Projects() {
  const [isMobile, setIsMobile] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    function checkScreenSize() {
      setIsMobile(window.innerWidth < 1000);
    }
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    setInitialized(true);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  if (!initialized) return null;

  return (
    <div className="w-screen min-h-dvh relative flex justify-center">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TitleBar title="Projects" subtitle="My Recent Works" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {ProjectData.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={project.image || `https://placehold.co/600x400/transparent/white?text=${project.title}`}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority={index < 2}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-white/10 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div id="project-links" className="flex gap-4 mt-auto">
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline link-underline-blue"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline link-underline-gray"
                      >
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
