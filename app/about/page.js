"use client"

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

// 修正導入路徑
import TitleBar from "@/components/layout/TitleBar";
import { ProfileCard, ProfileItem } from "@/components/card/ProfileCard";
import { ProfileHeader } from "@/components/card/ProfileHeader";

// 直接導入數據
import { ProfileData } from "../../data/ProfileData";

export default function AboutPage() {
  // 直接使用導入的數據，不需要 useState 和 useEffect
  const profile = ProfileData;
  
  // 定義需要的函數
  const t = (key) => {
    // 這裡應該用您的翻譯系統，暫時用一個簡單的對象替代
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
      'score': '分數'
    };
    return translations[key] || key;
  };
  
  const handleEdit = (section, index) => {
    console.log(`編輯 ${section} 索引 ${index}`);
  };
  
  const handleAdd = (section) => {
    console.log(`新增 ${section}`);
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <TitleBar 
        title={t('aboutMe')}
        subtitle={t('whoAmI')}
      />

      <ProfileHeader
        avatar={profile.avatar}
        name={profile.name}
        role={profile.role}
        location={profile.location}
        connections={profile.connections}
        onEdit={() => handleEdit('header', 0)}
      />

      {/* 關於我 */}
      <ProfileCard 
        icon={Signature} 
        title={t('about')}
        section="about"
        onEdit={() => handleEdit('about', 0)}
      >
        <p className="text-zinc-400 whitespace-pre-line">
          {profile.about}
        </p>
      </ProfileCard>

      {/* 工作經驗 */}
      <ProfileCard 
        icon={Briefcase} 
        title={t('experience')}
        section="experience"
        onAdd={() => handleAdd('experience')}
        onEdit={() => handleEdit('experience', -1)}
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
            onEdit={() => handleEdit('experience', index)}
          />
        ))}
      </ProfileCard>

      {/* 教育背景 */}
      <ProfileCard 
        icon={GraduationCap} 
        title={t('education')}
        section="education"
        onAdd={() => handleAdd('education')}
        onEdit={() => handleEdit('education', -1)}
      >
        {profile.education.map((edu, index) => (
          <ProfileItem
            key={index}
            icon={GraduationCap}
            title={edu.school}
            subtitle={`${edu.degree} · ${edu.field_of_study}`}
            period={edu.period}
            section="education"
            onEdit={() => handleEdit('education', index)}
          />
        ))}
      </ProfileCard>

      {/* 證照與認證 */}
      <ProfileCard 
        icon={Award} 
        title={t('licensesAndCerts')}
        section="certification"
        onAdd={() => handleAdd('certification')}
        onEdit={() => handleEdit('certification', -1)}
      >
        {profile.certifications.map((cert, index) => (
          <ProfileItem
            key={index}
            icon={Award}
            title={cert.name}
            subtitle={cert.issuer}
            period={`${t('issuedOn')} ${cert.issue_date}${cert.expired_date ? ` · ${t('expiresOn')} ${cert.expired_date}` : ''}`}
            section="certification"
            onEdit={() => handleEdit('certification', index)}
            extra={
              <>
                {cert.credential_id && (
                  <p className="text-sm text-zinc-500">
                    {t('credentialNo')}{cert.credential_id}
                  </p>
                )}
                {cert.credential_url && (
                  <Link 
                    href={cert.credential_url} 
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

      {/* 志願服務 */}
      <ProfileCard 
        icon={Calendar} 
        title={t('volunteerExp')}
        section="volunteer"
        onAdd={() => handleAdd('volunteer')}
        onEdit={() => handleEdit('volunteer', -1)}
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
            onEdit={() => handleEdit('volunteer', index)}
          />
        ))}
      </ProfileCard>

      {/* 專案經驗 */}
      <ProfileCard 
        icon={Code} 
        title={t('projects')}
        section="project"
        onAdd={() => handleAdd('project')}
        onEdit={() => handleEdit('project', -1)}
      >
        {profile.projects.map((project, index) => (
          <ProfileItem
            key={index}
            icon={Code}
            title={project.name}
            period={project.period}
            description={project.description}
            section="project"
            onEdit={() => handleEdit('project', index)}
          />
        ))}
      </ProfileCard>

      {/* 成績 */}
      <ProfileCard 
        icon={LucideBookOpen} 
        title={t('testScores')}
        section="score"
        onAdd={() => handleAdd('score')}
        onEdit={() => handleEdit('score', -1)}
      >
        {profile.scores.map((score, index) => (
          <ProfileItem
            key={index}
            icon={LucideBookOpen}
            title={score.test}
            subtitle={`${t('score')} ${score.score}`}
            period={score.date}
            section="score"
            onEdit={() => handleEdit('score', index)}
          />
        ))}
      </ProfileCard>

      {/* 語言能力 */}
      <ProfileCard 
        icon={Globe} 
        title={t('languages')}
        section="language"
        onAdd={() => handleAdd('language')}
        onEdit={() => handleEdit('language', -1)}
      >
        {profile.languages.map((lang, index) => (
          <ProfileItem
            key={index}
            icon={Globe}
            title={lang.name}
            subtitle={lang.level}
            section="language"
            onEdit={() => handleEdit('language', index)}
          />
        ))}
      </ProfileCard>
    </div>
  );
}