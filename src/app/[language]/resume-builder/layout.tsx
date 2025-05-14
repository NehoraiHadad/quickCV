'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar/Navbar';
import { NavbarDropdown } from '@/components/ui/Navbar';
import { useParams } from 'next/navigation';
import { ResumeProvider } from '@/context/ResumeContext';
import NavbarDataButtons from '@/components/ResumeBuilder/NavbarDataButtons';

interface ResumeBuilderLayoutProps {
  children: React.ReactNode;
}

// Component for the Exit link
function ExitButton() {
  return (
    <Link
      href={`/`}
      className="inline-block text-blue-500 hover:text-blue-700 font-medium py-1.5 px-3 rounded-lg transition-colors duration-300 text-sm"
    >
      Exit
    </Link>
  );
}

export default function ResumeBuilderLayout({ 
  children
}: ResumeBuilderLayoutProps) {
  // Use the useParams hook which is the recommended way to access route params in client components
  const params = useParams<{ language: string }>();
  const language = params.language;
  
  // Define navbar items
  const navItems = [
    {
      label: "Resume Builder",
      href: `/${language}/resume-builder`,
    },
  ];
  
  // Define dropdown items
  const sectionDropdownItems = [
    {
      label: "Personal Info",
      href: `/${language}/resume-builder?section=personal-info`,
    },
    {
      label: "Work Experience",
      href: `/${language}/resume-builder?section=work-experience`,
    },
    {
      label: "Education",
      href: `/${language}/resume-builder?section=education`,
    },
    {
      label: "Skills",
      href: `/${language}/resume-builder?section=skills`,
    },
    {
      label: "Projects",
      href: `/${language}/resume-builder?section=projects`,
    },
    {
      label: "Additional",
      href: `/${language}/resume-builder?section=additional`,
    },
  ];
  
  const templateDropdownItems = [
    {
      label: "Template Selection",
      href: `/${language}/resume-builder?section=template`,
    },
    {
      label: "Colors",
      href: `/${language}/resume-builder?section=colors`,
    },
  ];

  // Logo for navbar
  const navbarLogo = (
    <Image
      src="/images/logo.png"
      alt="QuickCV Logo"
      width={110}
      height={38}
      priority
      className="inline-block py-1"
    />
  );


  return (
    <ResumeProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar 
          logo={navbarLogo}
          items={navItems}
          actions={<NavbarDataButtons />}
          farRightAction={<ExitButton />}
          sticky
        >
          <NavbarDropdown 
            label="Resume Sections"
            items={sectionDropdownItems}
            className="ml-2"
          />
          <NavbarDropdown 
            label="Template"
            items={templateDropdownItems}
            className="ml-2"
          />
        </Navbar>
        
        <main className="flex-1 pt-20">
          {children}
        </main>
      </div>
    </ResumeProvider>
  );
} 