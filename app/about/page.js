"use client"

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  Award,
  LucideBookOpen,
  Globe,
  ExternalLink,
  Calendar,
  Code,
  Signature,
  CheckCircle,
} from "lucide-react";

// 修正導入路徑
import TitleBar from "@/components/layout/TitleBar";
import { ProfileCard, ProfileItem } from "@/components/card/ProfileCard";
import { ProfileHeader } from "@/components/card/ProfileHeader";

// 直接導入數據
import { ProfileData } from "../../data/ProfileData";

export default function AboutPage() {
  const profile = ProfileData;
  
  // 定義需要的函數
  const t = (key) => {
    const translations = {
      'aboutMe': '關於我',
      'whoAmI': '我是誰',
      'about': '關於',
      'experience': '工作經驗',
      'education': '教育背景',
      'licensesAndCerts': '證照與認證',
      'volunteerExp': '志願服務',
      'projects': '專案經驗',
      'testScores': '成績',
      'languages': '語言能力',
      'issuedOn': '發行於',
      'expiresOn': '到期於',
      'credentialNo': '證書編號：',
      'seeCredential': '查看證書',
      'score': '分數',
      'skills': '技能',
      'achievements': '成就'
    };
    return translations[key] || key;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-6xl mx-auto px-4 py-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TitleBar 
          title={t('aboutMe')}
          subtitle={t('whoAmI')}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ProfileHeader
          avatar={profile.avatar}
          name={profile.name}
          role={profile.role}
          location={profile.location}
          connections={profile.connections}
        />
      </motion.div>

      {/* 關於我 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ProfileCard 
          icon={Signature} 
          title={t('about')}
          section="about"
        >
          <p className="text-zinc-400 whitespace-pre-line">
            {profile.about}
          </p>
        </ProfileCard>
      </motion.div>

      {/* 工作經驗 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ProfileCard 
          icon={Briefcase} 
          title={t('experience')}
          section="experience"
        >
          {profile.experience.map((exp, index) => (
            <ProfileItem
              key={index}
              icon={Briefcase}
              title={exp.title}
              subtitle={exp.company}
              period={exp.period}
              location={exp.location}
              description={exp.description}
              section="experience"
            />
          ))}
        </ProfileCard>
      </motion.div>

      {/* 教育背景 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ProfileCard 
          icon={GraduationCap} 
          title={t('education')}
          section="education"
        >
          {profile.education.map((edu, index) => (
            <ProfileItem
              key={index}
              icon={GraduationCap}
              title={edu.school}
              subtitle={`${edu.degree} · ${edu.field}`}
              period={edu.period}
              section="education"
              extra={
                <>
                  {edu.skills && edu.skills.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-zinc-300">{t('skills')}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {edu.skills.map((skill, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-zinc-300">{t('achievements')}</p>
                      <ul className="mt-1 space-y-1">
                        {edu.achievements.map((achievement, i) => (
                          <li key={i} className="text-sm text-zinc-400 flex items-start">
                            <CheckCircle size={14} className="mr-1 mt-1 text-emerald-500 flex-shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              }
            />
          ))}
        </ProfileCard>
      </motion.div>

      {/* 證照與認證 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <ProfileCard 
          icon={Award} 
          title={t('licensesAndCerts')}
          section="certification"
        >
          {profile.certifications.map((cert, index) => (
            <ProfileItem
              key={index}
              icon={Award}
              title={cert.name}
              subtitle={cert.issuer}
              period={`${t('issuedOn')} ${cert.issue_date || cert.issued}${cert.expired_date ? ` · ${t('expiresOn')} ${cert.expired_date}` : ''}`}
              section="certification"
              extra={
                <>
                  {cert.credential_id && (
                    <p className="text-sm text-zinc-500">
                      {t('credentialNo')}{cert.credential_id}
                    </p>
                  )}
                  {(cert.credential_url || cert.link) && (
                    <Link 
                      href={cert.credential_url || cert.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs text-neutral-700 px-2 py-1 border border-neutral-700 rounded hover:bg-neutral-100"
                    >
                      {t('seeCredential')}
                      <ExternalLink size={12} className="ml-1 inline" />
                    </Link>
                  )}
                </>
              }
            />
          ))}
        </ProfileCard>
      </motion.div>

      {/* 志願服務 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <ProfileCard 
          icon={Calendar} 
          title={t('volunteerExp')}
          section="volunteer"
        >
          {profile.volunteer.map((vol, index) => (
            <ProfileItem
              key={index}
              icon={Calendar}
              title={vol.role}
              subtitle={vol.organization}
              period={vol.period}
              description={vol.description}
              section="volunteer"
            />
          ))}
        </ProfileCard>
      </motion.div>

      {/* 專案經驗 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <ProfileCard 
          icon={Code} 
          title={t('projects')}
          section="project"
        >
          {profile.projects.map((project, index) => (
            <ProfileItem
              key={index}
              icon={Code}
              title={project.name}
              period={project.period}
              description={project.description}
              section="project"
              extra={
                <>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {project.achievements && project.achievements.length > 0 && (
                    <div className="mt-3">
                      <ul className="mt-1 space-y-1">
                        {project.achievements.map((achievement, i) => (
                          <li key={i} className="text-sm text-zinc-400 flex items-start">
                            <CheckCircle size={14} className="mr-1 mt-1 text-emerald-500 flex-shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              }
            />
          ))}
        </ProfileCard>
      </motion.div>

      {/* 成績 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <ProfileCard 
          icon={LucideBookOpen} 
          title={t('testScores')}
          section="score"
        >
          {profile.scores.map((score, index) => (
            <ProfileItem
              key={index}
              icon={LucideBookOpen}
              title={score.test}
              subtitle={`${t('score')} ${score.score}`}
              period={score.date}
              section="score"
            />
          ))}
        </ProfileCard>
      </motion.div>

      {/* 語言能力 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <ProfileCard 
          icon={Globe} 
          title={t('languages')}
          section="language"
        >
          {profile.languages.map((lang, index) => (
            <ProfileItem
              key={index}
              icon={Globe}
              title={lang.name}
              subtitle={lang.level}
              section="language"
            />
          ))}
        </ProfileCard>
      </motion.div>
    </motion.div>
  );
}