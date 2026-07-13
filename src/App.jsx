import { useEffect, useMemo, useState } from 'react';
import { Download, Plus, Trash2 } from 'lucide-react';
import { pdf, Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { builtInTemplates, mergeTemplateOptions, normalizeTemplateConfig } from './templateConfig';

const initialResume = {
  personal: {
    name: 'Hexa Bro',
    jobTitle: 'Frontend Developer',
    email: 'hexabro663@email.com',
    phone: '+91 6206734552',
    location: 'Noida,201009',
    website: 'google.com',
    github: 'github.com/hexa-bro',
    linkedin: 'linkedin.com/in/hexabro',
    summary: 'Creative frontend developer focused on building polished web experiences with React, design systems, and performance-driven UI.',
  },
  experience: [
    {
      id: 1,
      title: 'Senior Frontend Engineer',
      company: 'Noida pvt',
      location: 'Remote',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      bullets: ['Led UI architecture for a SaaS dashboard used by 30k+ users.', 'Improved core web vitals and reduced page load time by 40%.'],
    },
  ],
  education: [
    {
      id: 1,
      degree: 'B.Tech Computer Science',
      institution: 'University of Washington',
      location: 'Noida, Metrostation',
      graduation: '2021',
      details: 'Graduated with honors; focus on HCI and software engineering.',
    },
  ],
  projects: [
    {
      id: 1,
      title: 'Resume Builder',
      tech: 'React, Tailwind, jsPDF',
      link: 'github.com/hexabro/resume-builder',
      description: 'Built a React-based application that generates polished resumes and exports them as PDFs.',
    },
  ],
  skills: 'React, Tailwind CSS, JavaScript, TypeScript, Node.js',
  certifications: 'AWS Cloud Practitioner, Google UX Design',
  template: 'ats-modern',
  accent: '#2563eb',
};

const accentOptions = ['#2563eb', '#7c3aed', '#0f766e', '#dc2626', '#000000'];
const storageKey = 'resume-builder-custom-templates';

const formatUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};

function ResumeDocument({ resumeData, templateDefinition }) {
  const styles = StyleSheet.create({
    page: {
      padding: 28,
      fontFamily: 'Helvetica',
      backgroundColor: '#ffffff',
      color: '#0f172a',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: resumeData.accent,
    },
    name: { fontSize: 24, fontWeight: 700, color: resumeData.accent },
    title: { fontSize: 11, color: '#334155', marginTop: 4 },
    contact: { fontSize: 10, color: '#475569', textAlign: 'right' },
    body: { flexDirection: templateDefinition?.layout === 'two-column' ? 'row' : 'column', gap: 12 },
    leftColumn: { flex: 1, paddingRight: 8 },
    rightColumn: { width: 170, paddingLeft: 8, borderLeftWidth: 1, borderLeftColor: resumeData.accent },
    sectionTitle: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: resumeData.accent, marginBottom: 6, textTransform: 'uppercase' },
    paragraph: { fontSize: 10, lineHeight: 1.5, color: '#334155', marginBottom: 6 },
    bullet: { fontSize: 10, lineHeight: 1.4, color: '#334155', marginBottom: 4, paddingLeft: 8 },
    entryTitle: { fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 2 },
    entryMeta: { fontSize: 10, color: '#64748b', marginBottom: 4 },
  });

  const sections = templateDefinition?.sections || ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'];
  const showSection = (section) => sections.includes(section);
  const isTwoColumn = templateDefinition?.layout === 'two-column';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{resumeData.personal.name || 'Your Name'}</Text>
            <Text style={styles.title}>{resumeData.personal.jobTitle || 'Your Title'}</Text>
          </View>
          <View>
            <Text style={styles.contact}>{resumeData.personal.email}</Text>
            <Text style={styles.contact}>{resumeData.personal.phone}</Text>
            <Text style={styles.contact}>{resumeData.personal.location}</Text>
          </View>
        </View>
        <View style={styles.body}>
          {isTwoColumn ? (
            <>
              <View style={styles.leftColumn}>
                {showSection('summary') ? <><Text style={styles.sectionTitle}>Summary</Text><Text style={styles.paragraph}>{resumeData.personal.summary}</Text></> : null}
                {showSection('experience') ? <><Text style={styles.sectionTitle}>Experience</Text>{resumeData.experience.map((item) => (<View key={item.id} style={{ marginBottom: 8 }}><Text style={styles.entryTitle}>{item.title || 'Role'}</Text><Text style={styles.entryMeta}>{item.company || 'Company'} · {item.location} · {item.startDate} - {item.current ? 'Present' : item.endDate}</Text>{item.bullets.filter(Boolean).map((bullet, index) => (<Text key={`${item.id}-${index}`} style={styles.bullet}>• {bullet}</Text>))}</View>))}</> : null}
                {showSection('projects') ? <><Text style={styles.sectionTitle}>Projects</Text>{resumeData.projects.map((item) => (<View key={item.id} style={{ marginBottom: 8 }}><Text style={styles.entryTitle}>{item.title || 'Project Title'}</Text><Text style={styles.entryMeta}>{item.link}</Text><Text style={styles.paragraph}>{item.tech}</Text><Text style={styles.paragraph}>{item.description}</Text></View>))}</> : null}
              </View>
              <View style={styles.rightColumn}>
                {showSection('education') ? <><Text style={styles.sectionTitle}>Education</Text>{resumeData.education.map((item) => (<View key={item.id} style={{ marginBottom: 8 }}><Text style={styles.entryTitle}>{item.degree || 'Degree'}</Text><Text style={styles.entryMeta}>{item.institution}</Text><Text style={styles.paragraph}>{item.graduation}</Text><Text style={styles.paragraph}>{item.details}</Text></View>))}</> : null}
                {showSection('skills') ? <><Text style={styles.sectionTitle}>Skills</Text><Text style={styles.paragraph}>{resumeData.skills}</Text></> : null}
                {showSection('certifications') ? <><Text style={styles.sectionTitle}>Certifications</Text><Text style={styles.paragraph}>{resumeData.certifications}</Text></> : null}
                <Text style={styles.sectionTitle}>Links</Text>
                {resumeData.personal.website ? <Link src={formatUrl(resumeData.personal.website)} style={styles.paragraph}>{resumeData.personal.website}</Link> : null}
                {resumeData.personal.github ? <Link src={formatUrl(resumeData.personal.github)} style={styles.paragraph}>{resumeData.personal.github}</Link> : null}
                {resumeData.personal.linkedin ? <Link src={formatUrl(resumeData.personal.linkedin)} style={styles.paragraph}>{resumeData.personal.linkedin}</Link> : null}
              </View>
            </>
          ) : (
            <View style={styles.leftColumn}>
              {showSection('summary') ? <><Text style={styles.sectionTitle}>Summary</Text><Text style={styles.paragraph}>{resumeData.personal.summary}</Text></> : null}
              {showSection('experience') ? <><Text style={styles.sectionTitle}>Experience</Text>{resumeData.experience.map((item) => (<View key={item.id} style={{ marginBottom: 8 }}><Text style={styles.entryTitle}>{item.title || 'Role'}</Text><Text style={styles.entryMeta}>{item.company || 'Company'} · {item.location} · {item.startDate} - {item.current ? 'Present' : item.endDate}</Text>{item.bullets.filter(Boolean).map((bullet, index) => (<Text key={`${item.id}-${index}`} style={styles.bullet}>• {bullet}</Text>))}</View>))}</> : null}
              {showSection('education') ? <><Text style={styles.sectionTitle}>Education</Text>{resumeData.education.map((item) => (<View key={item.id} style={{ marginBottom: 8 }}><Text style={styles.entryTitle}>{item.degree || 'Degree'}</Text><Text style={styles.entryMeta}>{item.institution}</Text><Text style={styles.paragraph}>{item.graduation}</Text><Text style={styles.paragraph}>{item.details}</Text></View>))}</> : null}
              {showSection('skills') ? <><Text style={styles.sectionTitle}>Skills</Text><Text style={styles.paragraph}>{resumeData.skills}</Text></> : null}
              {showSection('certifications') ? <><Text style={styles.sectionTitle}>Certifications</Text><Text style={styles.paragraph}>{resumeData.certifications}</Text></> : null}
              {showSection('projects') ? <><Text style={styles.sectionTitle}>Projects</Text>{resumeData.projects.map((item) => (<View key={item.id} style={{ marginBottom: 8 }}><Text style={styles.entryTitle}>{item.title || 'Project Title'}</Text><Text style={styles.entryMeta}>{item.link}</Text><Text style={styles.paragraph}>{item.tech}</Text><Text style={styles.paragraph}>{item.description}</Text></View>))}</> : null}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

function App() {
  const [resumeData, setResumeData] = useState(initialResume);
  const [customTemplates, setCustomTemplates] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Could not load custom templates', error);
      return [];
    }
  });
  const [customTemplateForm, setCustomTemplateForm] = useState({
    name: '',
    description: '',
    layout: 'single-column',
    sections: 'summary, experience, education, skills',
  });
  const [templateJson, setTemplateJson] = useState('');
  const [templateMessage, setTemplateMessage] = useState('Built-in ATS templates are available instantly.');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, JSON.stringify(customTemplates));
    }
  }, [customTemplates]);

  const templateOptions = useMemo(() => mergeTemplateOptions(builtInTemplates, customTemplates), [customTemplates]);
  const selectedTemplate = templateOptions.find((template) => template.id === resumeData.template) || builtInTemplates[0];

  const updatePersonal = (field, value) => {
    setResumeData((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };

  const updateExperience = (id, field, value) => {
    setResumeData((prev) => ({ ...prev, experience: prev.experience.map((item) => (item.id === id ? { ...item, [field]: value } : item)) }));
  };

  const updateExperienceBullets = (id, index, value) => {
    setResumeData((prev) => ({ ...prev, experience: prev.experience.map((item) => (item.id === id ? { ...item, bullets: item.bullets.map((bullet, bulletIndex) => (bulletIndex === index ? value : bullet)) } : item)) }));
  };

  const addExperience = () => {
    setResumeData((prev) => ({ ...prev, experience: [...prev.experience, { id: Date.now(), title: '', company: '', location: '', startDate: '', endDate: '', current: false, bullets: [''] }] }));
  };

  const removeExperience = (id) => {
    setResumeData((prev) => ({ ...prev, experience: prev.experience.filter((item) => item.id !== id) }));
  };

  const updateEducation = (id, field, value) => {
    setResumeData((prev) => ({ ...prev, education: prev.education.map((item) => (item.id === id ? { ...item, [field]: value } : item)) }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({ ...prev, education: [...prev.education, { id: Date.now(), degree: '', institution: '', location: '', graduation: '', details: '' }] }));
  };

  const removeEducation = (id) => {
    setResumeData((prev) => ({ ...prev, education: prev.education.filter((item) => item.id !== id) }));
  };

  const updateProject = (id, field, value) => {
    setResumeData((prev) => ({ ...prev, projects: prev.projects.map((item) => (item.id === id ? { ...item, [field]: value } : item)) }));
  };

  const addProject = () => {
    setResumeData((prev) => ({ ...prev, projects: [...prev.projects, { id: Date.now(), title: '', tech: '', link: '', description: '' }] }));
  };

  const removeProject = (id) => {
    setResumeData((prev) => ({ ...prev, projects: prev.projects.filter((item) => item.id !== id) }));
  };

  const handleSampleData = () => {
    setResumeData(initialResume);
  };

  const handleAddCustomTemplate = (event) => {
    event.preventDefault();
    const normalizedTemplate = normalizeTemplateConfig({
      name: customTemplateForm.name,
      description: customTemplateForm.description,
      layout: customTemplateForm.layout,
      sections: customTemplateForm.sections.split(',').map((section) => section.trim()).filter(Boolean),
    });

    setCustomTemplates((prev) => [...prev, normalizedTemplate]);
    setResumeData((prev) => ({ ...prev, template: normalizedTemplate.id }));
    setCustomTemplateForm({ name: '', description: '', layout: 'single-column', sections: 'summary, experience, education, skills' });
    setTemplateMessage(`Saved ${normalizedTemplate.name} to the template registry.`);
  };

  const handleRemoveCustomTemplate = (templateId) => {
    setCustomTemplates((prev) => prev.filter((template) => template.id !== templateId));
    setResumeData((prev) => ({ ...prev, template: builtInTemplates[0].id }));
    setTemplateMessage('Removed the custom template from the registry.');
  };

  const handleImportTemplate = () => {
    try {
      const parsedTemplate = JSON.parse(templateJson);
      const normalizedTemplate = normalizeTemplateConfig(parsedTemplate);
      setCustomTemplates((prev) => [...prev, normalizedTemplate]);
      setResumeData((prev) => ({ ...prev, template: normalizedTemplate.id }));
      setTemplateJson('');
      setTemplateMessage(`Imported ${normalizedTemplate.name} from JSON.`);
    } catch (error) {
      console.error('Could not import template JSON', error);
      setTemplateMessage('The template JSON could not be parsed.');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await pdf(<ResumeDocument resumeData={resumeData} templateDefinition={selectedTemplate} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF export failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row">
        <div className="w-full rounded-3xl bg-white p-4 shadow-sm lg:max-w-120">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Resume Builder</p>
              <h1 className="text-2xl font-bold">ATS-ready resumes and custom templates</h1>
            </div>
            <button onClick={handleSampleData} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Load Sample Data
            </button>
          </div>

          <div className="space-y-5">
            <section className="rounded-2xl border border-slate-200 p-4">
              <h2 className="mb-3 text-lg font-semibold">Template Library</h2>
              <div className="space-y-2">
                {templateOptions.map((template) => (
                  <div key={template.id} className={`w-full rounded-2xl border p-3 text-left ${resumeData.template === template.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <button type="button" onClick={() => setResumeData((prev) => ({ ...prev, template: template.id }))} className="flex-1 text-left">
                        <div>
                          <p className="font-semibold">{template.name}</p>
                          <p className="text-sm text-slate-600">{template.description}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500">{template.layout} · {template.atsFriendly ? 'ATS-friendly' : 'Custom'}</p>
                        </div>
                      </button>
                      {resumeData.template === template.id ? <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">Live</span> : null}
                      {template.custom ? (
                        <button type="button" onClick={() => handleRemoveCustomTemplate(template.id)} className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-4">
              <h2 className="mb-3 text-lg font-semibold">Create a Custom Template</h2>
              <form onSubmit={handleAddCustomTemplate} className="space-y-3">
                <input className="w-full rounded-xl border border-slate-200 p-2" placeholder="Template name" value={customTemplateForm.name} onChange={(event) => setCustomTemplateForm((prev) => ({ ...prev, name: event.target.value }))} />
                <textarea className="min-h-20 w-full rounded-xl border border-slate-200 p-2" placeholder="Template description" value={customTemplateForm.description} onChange={(event) => setCustomTemplateForm((prev) => ({ ...prev, description: event.target.value }))} />
                <select className="w-full rounded-xl border border-slate-200 p-2" value={customTemplateForm.layout} onChange={(event) => setCustomTemplateForm((prev) => ({ ...prev, layout: event.target.value }))}>
                  <option value="single-column">Single Column</option>
                  <option value="two-column">Two Column</option>
                </select>
                <input className="w-full rounded-xl border border-slate-200 p-2" placeholder="sections: summary, experience, education" value={customTemplateForm.sections} onChange={(event) => setCustomTemplateForm((prev) => ({ ...prev, sections: event.target.value }))} />
                <button type="submit" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Save Template</button>
              </form>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold">Integration flow</p>
                <p className="mt-1 text-sm text-slate-600">Template registry → preview adapter → local storage persistence → PDF export.</p>
              </div>
              <textarea className="mt-3 min-h-24 w-full rounded-xl border border-slate-200 p-2" placeholder='{"id":"custom-1","name":"Executive Draft","description":"Leadership-ready ATS template","layout":"single-column","atsFriendly":true,"sections":["summary","experience","education","skills"]}' value={templateJson} onChange={(event) => setTemplateJson(event.target.value)} />
              <button type="button" onClick={handleImportTemplate} className="mt-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Import Template JSON</button>
              {templateMessage ? <p className="mt-2 text-sm text-slate-600">{templateMessage}</p> : null}
            </section>

            <section className="rounded-2xl border border-slate-200 p-4">
              <h2 className="mb-3 text-lg font-semibold">Personal Information</h2>
              <div className="grid gap-3 md:grid-cols-2">
                <input className="rounded-xl border border-slate-200 p-2" placeholder="Name" value={resumeData.personal.name} onChange={(e) => updatePersonal('name', e.target.value)} />
                <input className="rounded-xl border border-slate-200 p-2" placeholder="Job Title" value={resumeData.personal.jobTitle} onChange={(e) => updatePersonal('jobTitle', e.target.value)} />
                <input className="rounded-xl border border-slate-200 p-2" placeholder="Email" value={resumeData.personal.email} onChange={(e) => updatePersonal('email', e.target.value)} />
                <input className="rounded-xl border border-slate-200 p-2" placeholder="Phone" value={resumeData.personal.phone} onChange={(e) => updatePersonal('phone', e.target.value)} />
                <input className="rounded-xl border border-slate-200 p-2" placeholder="Location" value={resumeData.personal.location} onChange={(e) => updatePersonal('location', e.target.value)} />
                <input className="rounded-xl border border-slate-200 p-2" placeholder="Website" value={resumeData.personal.website} onChange={(e) => updatePersonal('website', e.target.value)} />
                <input className="rounded-xl border border-slate-200 p-2" placeholder="GitHub" value={resumeData.personal.github} onChange={(e) => updatePersonal('github', e.target.value)} />
                <input className="rounded-xl border border-slate-200 p-2" placeholder="LinkedIn" value={resumeData.personal.linkedin} onChange={(e) => updatePersonal('linkedin', e.target.value)} />
              </div>
              <textarea className="mt-3 min-h-24 w-full rounded-xl border border-slate-200 p-2" placeholder="Summary" value={resumeData.personal.summary} onChange={(e) => updatePersonal('summary', e.target.value)} />
            </section>

            <section className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Work Experience</h2>
                <button onClick={addExperience} className="rounded-full bg-slate-100 p-2 text-slate-600"><Plus size={16} /></button>
              </div>
              <div className="space-y-3">
                {resumeData.experience.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-medium">Entry</p>
                      <button onClick={() => removeExperience(item.id)} className="text-red-500"><Trash2 size={16} /></button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <input className="rounded-xl border border-slate-200 p-2" placeholder="Job Title" value={item.title} onChange={(e) => updateExperience(item.id, 'title', e.target.value)} />
                      <input className="rounded-xl border border-slate-200 p-2" placeholder="Company" value={item.company} onChange={(e) => updateExperience(item.id, 'company', e.target.value)} />
                      <input className="rounded-xl border border-slate-200 p-2" placeholder="Location" value={item.location} onChange={(e) => updateExperience(item.id, 'location', e.target.value)} />
                      <input className="rounded-xl border border-slate-200 p-2" placeholder="Start Date" value={item.startDate} onChange={(e) => updateExperience(item.id, 'startDate', e.target.value)} />
                      <input className="rounded-xl border border-slate-200 p-2" placeholder="End Date" value={item.endDate} onChange={(e) => updateExperience(item.id, 'endDate', e.target.value)} />
                      <label className="flex items-center gap-2 rounded-xl border border-slate-200 p-2 text-sm">
                        <input type="checkbox" checked={item.current} onChange={(e) => updateExperience(item.id, 'current', e.target.checked)} />
                        Currently Working
                      </label>
                    </div>
                    <div className="mt-3 space-y-2">
                      {item.bullets.map((bullet, index) => (
                        <input key={`${item.id}-${index}`} className="w-full rounded-xl border border-slate-200 p-2" placeholder={`Bullet ${index + 1}`} value={bullet} onChange={(e) => updateExperienceBullets(item.id, index, e.target.value)} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Education</h2>
                <button onClick={addEducation} className="rounded-full bg-slate-100 p-2 text-slate-600"><Plus size={16} /></button>
              </div>
              <div className="space-y-3">
                {resumeData.education.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-medium">Entry</p>
                      <button onClick={() => removeEducation(item.id)} className="text-red-500"><Trash2 size={16} /></button>
                    </div>
                    <div className="grid gap-3">
                      <input className="rounded-xl border border-slate-200 p-2" placeholder="Degree" value={item.degree} onChange={(e) => updateEducation(item.id, 'degree', e.target.value)} />
                      <input className="rounded-xl border border-slate-200 p-2" placeholder="Institution" value={item.institution} onChange={(e) => updateEducation(item.id, 'institution', e.target.value)} />
                      <input className="rounded-xl border border-slate-200 p-2" placeholder="Location" value={item.location} onChange={(e) => updateEducation(item.id, 'location', e.target.value)} />
                      <input className="rounded-xl border border-slate-200 p-2" placeholder="Graduation Date" value={item.graduation} onChange={(e) => updateEducation(item.id, 'graduation', e.target.value)} />
                      <textarea className="min-h-20 rounded-xl border border-slate-200 p-2" placeholder="Details" value={item.details} onChange={(e) => updateEducation(item.id, 'details', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Projects</h2>
                <button onClick={addProject} className="rounded-full bg-slate-100 p-2 text-slate-600"><Plus size={16} /></button>
              </div>
              <div className="space-y-3">
                {resumeData.projects.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-medium">Project</p>
                      <button onClick={() => removeProject(item.id)} className="text-red-500"><Trash2 size={16} /></button>
                    </div>
                    <div className="grid gap-3">
                      <input className="rounded-xl border border-slate-200 p-2" placeholder="Title" value={item.title} onChange={(e) => updateProject(item.id, 'title', e.target.value)} />
                      <input className="rounded-xl border border-slate-200 p-2" placeholder="Tech Stack" value={item.tech} onChange={(e) => updateProject(item.id, 'tech', e.target.value)} />
                      <input className="rounded-xl border border-slate-200 p-2" placeholder="Link" value={item.link} onChange={(e) => updateProject(item.id, 'link', e.target.value)} />
                      <textarea className="min-h-20 rounded-xl border border-slate-200 p-2" placeholder="Description" value={item.description} onChange={(e) => updateProject(item.id, 'description', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 p-4">
              <h2 className="mb-3 text-lg font-semibold">Skills & Certifications</h2>
              <textarea className="mb-3 min-h-24 w-full rounded-xl border border-slate-200 p-2" placeholder="Skills" value={resumeData.skills} onChange={(e) => setResumeData((prev) => ({ ...prev, skills: e.target.value }))} />
              <textarea className="min-h-24 w-full rounded-xl border border-slate-200 p-2" placeholder="Certifications" value={resumeData.certifications} onChange={(e) => setResumeData((prev) => ({ ...prev, certifications: e.target.value }))} />
            </section>
          </div>
        </div>

        <div className="flex-1 rounded-3xl bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Live Preview</p>
              <h2 className="text-xl font-bold">Resume Preview</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2">
                {templateOptions.map((template) => (
                  <button key={template.id} onClick={() => setResumeData((prev) => ({ ...prev, template: template.id }))} className={`rounded-full px-3 py-2 text-sm font-semibold ${resumeData.template === template.id ? 'bg-slate-900 text-white' : 'bg-slate-100'}`}>{template.name}</button>
                ))}
              </div>
              <div className="flex gap-2">
                {accentOptions.map((color) => (
                  <button key={color} onClick={() => setResumeData((prev) => ({ ...prev, accent: color }))} className={`h-7 w-7 rounded-full border-2 ${resumeData.accent === color ? 'border-slate-900' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                ))}
              </div>
              <button onClick={handleExport} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                <Download size={16} /> Download PDF
              </button>
            </div>
          </div>
          <div className="flex justify-center overflow-auto rounded-3xl bg-slate-100 p-3">
            <div className={`w-198.5 max-w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm ${selectedTemplate?.layout === 'two-column' ? 'font-sans' : 'font-serif'}`} style={{ minHeight: '1123px' }}>
              <header className="flex items-start justify-between border-b border-slate-200 pb-4" style={{ borderColor: resumeData.accent }}>
                <div>
                  <h3 className="text-3xl font-bold" style={{ color: resumeData.accent }}>{resumeData.personal.name || 'Your Name'}</h3>
                  <p className="mt-1 text-lg font-medium text-slate-700">{resumeData.personal.jobTitle || 'Your Title'}</p>
                </div>
                <address className="text-right text-sm text-slate-600 not-italic">
                  <p>{resumeData.personal.email}</p>
                  <p>{resumeData.personal.phone}</p>
                  <p>{resumeData.personal.location}</p>
                </address>
              </header>

              <main className={selectedTemplate?.layout === 'two-column' ? 'mt-5 flex gap-6' : 'mt-5'}>
                {selectedTemplate?.layout === 'two-column' ? (
                  <>
                    <section className="flex-1">
                      {selectedTemplate.sections.includes('summary') ? <article className="mb-4"><h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: resumeData.accent }}>Summary</h4><p className="text-sm leading-6 text-slate-700">{resumeData.personal.summary}</p></article> : null}
                      {selectedTemplate.sections.includes('experience') ? <article className="mb-4"><h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: resumeData.accent }}>Experience</h4>{resumeData.experience.map((item) => (<div key={item.id} className="mb-3"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-slate-800">{item.title || 'Role'}</p><p className="text-sm text-slate-600">{item.company || 'Company'} · {item.location}</p></div><p className="text-sm text-slate-500">{item.startDate} - {item.current ? 'Present' : item.endDate}</p></div><ul className="mt-2 space-y-1">{item.bullets.filter(Boolean).map((bullet, index) => (<li key={`${item.id}-${index}`} className="flex gap-2 text-sm leading-6 text-slate-700"><span style={{ color: resumeData.accent }}>•</span><span>{bullet}</span></li>))}</ul></div>))}</article> : null}
                      {selectedTemplate.sections.includes('projects') ? <article className="mb-4"><h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: resumeData.accent }}>Projects</h4>{resumeData.projects.map((item) => (<div key={item.id} className="mb-3"><div className="flex items-center justify-between gap-3"><p className="font-semibold text-slate-800">{item.title || 'Project Title'}</p><p className="text-sm text-slate-500">{item.link}</p></div><p className="text-sm text-slate-600">{item.tech}</p><p className="mt-1 text-sm leading-6 text-slate-700">{item.description}</p></div>))}</article> : null}
                    </section>
                    <aside className="w-57.5 border-l border-slate-200 pl-5" style={{ borderColor: resumeData.accent }}>
                      {selectedTemplate.sections.includes('education') ? <article className="mb-4"><h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: resumeData.accent }}>Education</h4>{resumeData.education.map((item) => (<div key={item.id} className="mb-3"><p className="font-semibold text-slate-800">{item.degree || 'Degree'}</p><p className="text-sm text-slate-600">{item.institution}</p><p className="text-sm text-slate-500">{item.graduation}</p><p className="mt-1 text-sm leading-6 text-slate-700">{item.details}</p></div>))}</article> : null}
                      {selectedTemplate.sections.includes('skills') ? <article className="mb-4"><h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: resumeData.accent }}>Skills</h4><p className="text-sm leading-6 text-slate-700">{resumeData.skills}</p></article> : null}
                      {selectedTemplate.sections.includes('certifications') ? <article className="mb-4"><h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: resumeData.accent }}>Certifications</h4><p className="text-sm leading-6 text-slate-700">{resumeData.certifications}</p></article> : null}
                      <article className="mb-4"><h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: resumeData.accent }}>Links</h4><p className="text-sm text-slate-700">{resumeData.personal.website}</p><p className="text-sm text-slate-700">{resumeData.personal.github}</p><p className="text-sm text-slate-700">{resumeData.personal.linkedin}</p></article>
                    </aside>
                  </>
                ) : (
                  <section className="w-full space-y-4">
                    {selectedTemplate.sections.includes('summary') ? <article><h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: resumeData.accent }}>Summary</h4><p className="text-sm leading-6 text-slate-700">{resumeData.personal.summary}</p></article> : null}
                    {selectedTemplate.sections.includes('experience') ? <article><h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: resumeData.accent }}>Experience</h4>{resumeData.experience.map((item) => (<div key={item.id} className="mb-3"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-slate-800">{item.title || 'Role'}</p><p className="text-sm text-slate-600">{item.company || 'Company'} · {item.location}</p></div><p className="text-sm text-slate-500">{item.startDate} - {item.current ? 'Present' : item.endDate}</p></div><ul className="mt-2 space-y-1">{item.bullets.filter(Boolean).map((bullet, index) => (<li key={`${item.id}-${index}`} className="flex gap-2 text-sm leading-6 text-slate-700"><span style={{ color: resumeData.accent }}>•</span><span>{bullet}</span></li>))}</ul></div>))}</article> : null}
                    {selectedTemplate.sections.includes('education') ? <article><h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: resumeData.accent }}>Education</h4>{resumeData.education.map((item) => (<div key={item.id} className="mb-3"><p className="font-semibold text-slate-800">{item.degree || 'Degree'}</p><p className="text-sm text-slate-600">{item.institution}</p><p className="text-sm text-slate-500">{item.graduation}</p><p className="mt-1 text-sm leading-6 text-slate-700">{item.details}</p></div>))}</article> : null}
                    {selectedTemplate.sections.includes('skills') ? <article><h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: resumeData.accent }}>Skills</h4><p className="text-sm leading-6 text-slate-700">{resumeData.skills}</p></article> : null}
                    {selectedTemplate.sections.includes('certifications') ? <article><h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: resumeData.accent }}>Certifications</h4><p className="text-sm leading-6 text-slate-700">{resumeData.certifications}</p></article> : null}
                  </section>
                )}
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;