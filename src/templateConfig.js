export const builtInTemplates = [
  {
    id: 'ats-classic',
    name: 'Classic ATS',
    description: 'Single-column, parser-friendly layout with strong section hierarchy.',
    layout: 'single-column',
    atsFriendly: true,
    sections: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
  },
  {
    id: 'ats-modern',
    name: 'Modern ATS',
    description: 'Clean two-column structure with generous spacing and simple hierarchy.',
    layout: 'two-column',
    atsFriendly: true,
    sections: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'],
  },
  {
    id: 'ats-compact',
    name: 'Compact ATS',
    description: 'Condensed one-page resume template ideal for high-volume screening.',
    layout: 'single-column',
    atsFriendly: true,
    sections: ['summary', 'experience', 'skills', 'education', 'certifications'],
  },
];

export function normalizeTemplateConfig(config = {}) {
  return {
    id: config.id || `custom-${Date.now()}`,
    name: config.name || 'Custom ATS Template',
    description: config.description || 'User-defined ATS friendly template',
    layout: config.layout || 'single-column',
    atsFriendly: config.atsFriendly !== false,
    sections: Array.isArray(config.sections) && config.sections.length > 0
      ? config.sections
      : ['summary', 'experience', 'education', 'skills'],
    custom: true,
  };
}

export function mergeTemplateOptions(builtIn = builtInTemplates, customTemplates = []) {
  return [...builtIn, ...customTemplates.map(normalizeTemplateConfig)];
}
