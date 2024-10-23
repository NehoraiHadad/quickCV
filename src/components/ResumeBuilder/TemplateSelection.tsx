import React from 'react';
import TemplateGallery from '@/components/TemplateSelection/TemplateGallery';

export default function TemplateSelection() {
  return (
    <div className="space-y-4 ">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">Choose a Template</h2>
      <TemplateGallery />
    </div>
  );
}