import React from 'react';
import TemplateGallery from '@/components/TemplateSelection/TemplateGallery';
import { ResumeSection } from '@/components/ui';

export default function TemplateSelection() {
  return (
    <ResumeSection title="Choose a Template">
      <TemplateGallery />
    </ResumeSection>
  );
}