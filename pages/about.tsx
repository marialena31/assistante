import { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import FadeIn from '../components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '../components/animations/StaggerChildren';
import LanguageSkills from '../components/LanguageSkills';
import { createClient } from '../utils/supabase/client';

export type AboutContent = {
  title: string;
  subtitle: string;
  headerDescription: string;
  headerValues: string;
  profile: {
    name: string;
    title: string;
    highlights: string[];
  };
  experiences: {
    year: string;
    title: string;
    details: string[];
  }[];
  formations: {
    year: string;
    title: string;
    details: string[];
  }[];
  skills: {
    title: string;
    description: string;
  }[];
  callToAction: {
    title: string;
    description: string;
    buttonText: string;
  };
};

export default function About() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAboutContent() {
      try {
        const { data, error } = await supabase
          .schema('api')
          .from('contents')
          .select('title, content')
          .eq('slug', 'about')
          .eq('type', 'page')
          .single();

        if (error) throw error;
        
        const parsedContent = data.content ? JSON.parse(data.content) : null;
        
        if (!parsedContent) {
          console.error('No content found for about page');
          return;
        }

        setAboutContent(parsedContent);
      } catch (error) {
        console.error('Error fetching about content:', error);
      }
    }

    fetchAboutContent();
  }, []);

  if (!aboutContent) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={aboutContent.title} 
      description={aboutContent.headerDescription}
    >
      <div className="container py-12 space-y-16">
        {/* Header Section */}
        <FadeIn className="max-w-3xl mx-auto text-center">
          <h1 className="h1 mb-6">{aboutContent.title}</h1>
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">{aboutContent.subtitle}</p>
          <div className="prose prose-lg max-w-none mb-6">
            {aboutContent.headerDescription}
          </div>
          <div className="prose prose-lg max-w-none text-primary font-medium">
            {aboutContent.headerValues}
          </div>
        </FadeIn>

        {/* Profile Section */}
        {aboutContent.profile && (
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="h2 mb-2">{aboutContent.profile.title}</h2>
                <p className="text-xl text-gray-600">{aboutContent.profile.name}</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {aboutContent.profile.highlights.map((highlight, index) => (
                  <div key={index} className="card bg-white shadow-sm hover:shadow-md transition-shadow p-6">
                    <p className="text-lg leading-relaxed">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Experiences Section */}
        {aboutContent.experiences && aboutContent.experiences.length > 0 && (
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <h2 className="h2 text-center mb-10">Expériences</h2>
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200"></div>
                <div className="space-y-12">
                  {aboutContent.experiences.map((experience, index) => (
                    <div key={index} className="relative">
                      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4 w-4 h-4 rounded-full bg-primary"></div>
                      <div className={`card shadow-sm hover:shadow-md transition-shadow p-6 w-[calc(50%-2rem)] ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                        <div className="text-primary font-semibold mb-2">{experience.year}</div>
                        <h3 className="text-xl font-semibold mb-4">{experience.title}</h3>
                        <div className="prose prose-lg">
                          {experience.details.map((detail, detailIndex) => (
                            <p key={detailIndex} className="text-gray-600">{detail}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Formations Section */}
        {aboutContent.formations && aboutContent.formations.length > 0 && (
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <h2 className="h2 text-center mb-10">Formation</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {aboutContent.formations.map((formation, index) => (
                  <div key={index} className="card bg-white shadow-sm hover:shadow-md transition-shadow p-6">
                    <div className="text-primary font-semibold mb-2">{formation.year}</div>
                    <h3 className="text-xl font-semibold mb-4">{formation.title}</h3>
                    <div className="prose prose-lg">
                      {formation.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Skills Section */}
        {aboutContent.skills && aboutContent.skills.length > 0 && (
          <FadeIn>
            <div className="max-w-5xl mx-auto">
              <h2 className="h2 text-center mb-10">Compétences</h2>
              <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {aboutContent.skills.map((skill, index) => (
                  <StaggerItem key={index}>
                    <div className="card bg-white shadow-sm hover:shadow-md transition-shadow p-6 h-full flex flex-col">
                      <h3 className="text-lg font-semibold mb-3">{skill.title}</h3>
                      <p className="text-gray-600 flex-grow">{skill.description}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </FadeIn>
        )}

        {/* Call to Action Section */}
        {aboutContent.callToAction && (
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="card bg-gradient-to-br from-primary/5 to-primary/10 p-10 text-center rounded-2xl">
                <h2 className="h2 mb-4">{aboutContent.callToAction.title}</h2>
                <p className="text-xl text-gray-600 mb-8">{aboutContent.callToAction.description}</p>
                <a 
                  href="/contact" 
                  className="inline-block px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  {aboutContent.callToAction.buttonText}
                </a>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </Layout>
  );
}
