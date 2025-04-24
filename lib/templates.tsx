import type { ResumeData, Template } from "./types"

// Modern Template
const ModernTemplate = ({ resumeData }: { resumeData: ResumeData }) => {
  const { personalInfo, education, experience, projects, skills } = resumeData

  return (
    <div className="flex h-full flex-col bg-white p-8 text-black gap-3">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-xl text-gray-600">{personalInfo.title}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.website && <p>{personalInfo.website}</p>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-lg font-semibold">Summary</h2>
          <p className="text-sm">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-lg font-semibold">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{exp.position}</h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </p>
                </div>
                <p className="text-sm">
                  {exp.company}, {exp.location}
                </p>
                {exp.description && <p className="mt-1 text-sm">{exp.description}</p>}
                {exp.bullets.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {exp.bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-lg font-semibold">Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : "Present"}
                  </p>
                </div>
                {project.link && (
                  <p className="text-sm text-blue-600 hover:underline">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      {project.link}
                    </a>
                  </p>
                )}
                {project.description && <p className="mt-1 text-sm">{project.description}</p>}
                {project.bullets.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {project.bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-lg font-semibold">Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{edu.institution}</h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
                <p className="text-sm">
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                </p>
                {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-lg font-semibold">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// Classic Template
const ClassicTemplate = ({ resumeData }: { resumeData: ResumeData }) => {
  const { personalInfo, education, experience, projects, skills } = resumeData

  return (
    <div className="flex h-full flex-col bg-white p-8 text-black gap-3">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-wider">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-lg">{personalInfo.title}</p>
        <div className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.website && <p>{personalInfo.website}</p>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="mb-2 text-center text-xl font-bold uppercase tracking-wider">Professional Summary</h2>
          <div className="mb-3 h-px w-full bg-black"></div>
          <p className="text-sm">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-center text-xl font-bold uppercase tracking-wider">Work Experience</h2>
          <div className="mb-3 h-px w-full bg-black"></div>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold">
                  <h3>{exp.company}</h3>
                  <p className="text-sm">
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </p>
                </div>
                <p className="text-sm italic">
                  {exp.position}, {exp.location}
                </p>
                {exp.description && <p className="mt-1 text-sm">{exp.description}</p>}
                {exp.bullets.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {exp.bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-center text-xl font-bold uppercase tracking-wider">Projects</h2>
          <div className="mb-3 h-px w-full bg-black"></div>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between font-bold">
                  <h3>{project.title}</h3>
                  <p className="text-sm">
                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : "Present"}
                  </p>
                </div>
                {project.link && (
                  <p className="text-sm text-blue-600 hover:underline">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      {project.link}
                    </a>
                  </p>
                )}
                {project.description && <p className="mt-1 text-sm">{project.description}</p>}
                {project.bullets.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-sm">
                    {project.bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-center text-xl font-bold uppercase tracking-wider">Education</h2>
          <div className="mb-3 h-px w-full bg-black"></div>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between font-bold">
                  <h3>{edu.institution}</h3>
                  <p className="text-sm">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
                <p className="text-sm">
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                </p>
                {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="mb-2 text-center text-xl font-bold uppercase tracking-wider">Skills</h2>
          <div className="mb-3 h-px w-full bg-black"></div>
          <p className="text-sm">{skills.join(", ")}</p>
        </section>
      )}
    </div>
  )
}

// Minimalist Template
const MinimalistTemplate = ({ resumeData }: { resumeData: ResumeData }) => {
  const { personalInfo, education, experience, projects, skills } = resumeData

  return (
    <div className="flex h-full flex-col bg-white p-8 text-black gap-3">
      <header className="mb-8">
        <h1 className="text-2xl font-light">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-sm text-gray-600">{personalInfo.title}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.website && <p>{personalInfo.website}</p>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-8">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-500">About</h2>
          <p className="text-sm">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">Experience</h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{exp.position}</h3>
                  <p className="text-xs text-gray-500">
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  {exp.company}, {exp.location}
                </p>
                {exp.description && <p className="mt-2 text-sm">{exp.description}</p>}
                {exp.bullets.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {exp.bullets.map((bullet, index) => (
                      <li key={index}>• {bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">Projects</h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-xs text-gray-500">
                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : "Present"}
                  </p>
                </div>
                {project.link && (
                  <p className="text-xs text-blue-500 hover:underline">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      {project.link}
                    </a>
                  </p>
                )}
                {project.description && <p className="mt-2 text-sm">{project.description}</p>}
                {project.bullets.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {project.bullets.map((bullet, index) => (
                      <li key={index}>• {bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">Education</h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{edu.institution}</h3>
                  <p className="text-xs text-gray-500">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
                <p className="text-sm">
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                </p>
                {edu.description && <p className="mt-2 text-sm">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500">Skills</h2>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill, index) => (
              <span key={index} className="text-sm">
                {skill}
                {index < skills.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// Professional Template
const ProfessionalTemplate = ({ resumeData }: { resumeData: ResumeData }) => {
  const { personalInfo, education, experience, projects, skills } = resumeData

  return (
    <div className="flex h-full flex-col bg-white p-8 text-black gap-3">
      <header className="mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-3xl font-bold">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-lg font-medium text-gray-700">{personalInfo.title}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.website && <p>{personalInfo.website}</p>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="mb-2 text-xl font-bold text-gray-800">Professional Summary</h2>
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-xl font-bold text-gray-800">Professional Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-gray-300 pl-4">
                <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                  <h3 className="font-bold">{exp.position}</h3>
                  <p className="text-sm font-medium text-gray-600">
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {exp.company}, {exp.location}
                </p>
                {exp.description && <p className="mt-1 text-sm">{exp.description}</p>}
                {exp.bullets.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {exp.bullets.map((bullet, index) => (
                      <li key={index} className="mb-1">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-xl font-bold text-gray-800">Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border-l-2 border-gray-300 pl-4">
                <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                  <h3 className="font-bold">{project.title}</h3>
                  <p className="text-sm font-medium text-gray-600">
                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : "Present"}
                  </p>
                </div>
                {project.link && (
                  <p className="text-sm text-blue-600 hover:underline">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      {project.link}
                    </a>
                  </p>
                )}
                {project.description && <p className="mt-1 text-sm">{project.description}</p>}
                {project.bullets.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {project.bullets.map((bullet, index) => (
                      <li key={index} className="mb-1">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-xl font-bold text-gray-800">Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-gray-300 pl-4">
                <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                  <h3 className="font-bold">{edu.institution}</h3>
                  <p className="text-sm font-medium text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
                <p className="text-sm">
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                </p>
                {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold text-gray-800">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// Creative Template
const CreativeTemplate = ({ resumeData }: { resumeData: ResumeData }) => {
  const { personalInfo, education, experience, projects, skills } = resumeData

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-purple-50 to-white p-8 text-black">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-purple-800">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-xl font-medium text-purple-600">{personalInfo.title}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.website && <p>{personalInfo.website}</p>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-8 rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-purple-700">About Me</h2>
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 inline-block border-b-2 border-purple-400 pb-1 text-xl font-bold text-purple-800">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                  <h3 className="font-bold text-purple-700">{exp.position}</h3>
                  <p className="text-sm font-medium text-gray-600">
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {exp.company}, {exp.location}
                </p>
                {exp.description && <p className="mt-2 text-sm">{exp.description}</p>}
                {exp.bullets.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {exp.bullets.map((bullet, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-purple-500">✦</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 inline-block border-b-2 border-purple-400 pb-1 text-xl font-bold text-purple-800">
            Projects
          </h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                  <h3 className="font-bold text-purple-700">{project.title}</h3>
                  <p className="text-sm font-medium text-gray-600">
                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : "Present"}
                  </p>
                </div>
                {project.link && (
                  <p className="text-sm text-purple-600 hover:underline">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      {project.link}
                    </a>
                  </p>
                )}
                {project.description && <p className="mt-2 text-sm">{project.description}</p>}
                {project.bullets.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {project.bullets.map((bullet, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-purple-500">✦</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 inline-block border-b-2 border-purple-400 pb-1 text-xl font-bold text-purple-800">
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                  <h3 className="font-bold text-purple-700">{edu.institution}</h3>
                  <p className="text-sm font-medium text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
                <p className="text-sm">
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                </p>
                {edu.description && <p className="mt-2 text-sm">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="mb-4 inline-block border-b-2 border-purple-400 pb-1 text-xl font-bold text-purple-800">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// Executive Template
const ExecutiveTemplate = ({ resumeData }: { resumeData: ResumeData }) => {
  const { personalInfo, education, experience, projects, skills } = resumeData

  return (
    <div className="flex h-full flex-col bg-white p-8 text-black gap-3">
      <header className="mb-8 border-b-2 border-gray-900 pb-4">
        <h1 className="text-4xl font-bold uppercase tracking-wide">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="mt-1 text-xl font-medium uppercase tracking-wider text-gray-700">{personalInfo.title}</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.website && <p>{personalInfo.website}</p>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-bold uppercase tracking-wide">Executive Summary</h2>
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold uppercase tracking-wide">Professional Experience</h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex flex-col justify-between border-b border-gray-300 pb-1 sm:flex-row sm:items-center">
                  <h3 className="text-lg font-bold">{exp.company}</h3>
                  <p className="text-sm font-medium">
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </p>
                </div>
                <p className="text-base font-medium">
                  {exp.position}, {exp.location}
                </p>
                {exp.description && <p className="mt-2 text-sm">{exp.description}</p>}
                {exp.bullets.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {exp.bullets.map((bullet, index) => (
                      <li key={index} className="mb-1">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold uppercase tracking-wide">Key Projects</h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex flex-col justify-between border-b border-gray-300 pb-1 sm:flex-row sm:items-center">
                  <h3 className="text-lg font-bold">{project.title}</h3>
                  <p className="text-sm font-medium">
                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : "Present"}
                  </p>
                </div>
                {project.link && (
                  <p className="text-sm text-blue-700 hover:underline">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      {project.link}
                    </a>
                  </p>
                )}
                {project.description && <p className="mt-2 text-sm">{project.description}</p>}
                {project.bullets.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {project.bullets.map((bullet, index) => (
                      <li key={index} className="mb-1">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold uppercase tracking-wide">Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                  <h3 className="font-bold">
                    {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  </h3>
                  <p className="text-sm font-medium">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
                <p className="text-base">{edu.institution}</p>
                {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-bold uppercase tracking-wide">Core Competencies</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {skills.map((skill, index) => (
              <div key={index} className="border-l-2 border-gray-400 pl-2 text-sm">
                {skill}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// Technical Template
const TechnicalTemplate = ({ resumeData }: { resumeData: ResumeData }) => {
  const { personalInfo, education, experience, projects, skills } = resumeData

  return (
    <div className="flex h-full flex-col bg-white p-8 text-black gap-3">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-xl text-gray-700">{personalInfo.title}</p>
          </header>

          {personalInfo.summary && (
            <section className="mb-6">
              <h2 className="mb-2 text-lg font-semibold text-gray-800">Professional Summary</h2>
              <p className="text-sm">{personalInfo.summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="mb-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-800">Work Experience</h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                      <h3 className="font-bold">{exp.position}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {exp.company}, {exp.location}
                    </p>
                    {exp.description && <p className="mt-1 text-sm">{exp.description}</p>}
                    {exp.bullets.length > 0 && (
                      <ul className="mt-2 list-disc pl-5 text-sm">
                        {exp.bullets.map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="mb-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-800">Technical Projects</h2>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                      <h3 className="font-bold">{project.title}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : "Present"}
                      </p>
                    </div>
                    {project.link && (
                      <p className="text-sm text-blue-600 hover:underline">
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          {project.link}
                        </a>
                      </p>
                    )}
                    {project.description && <p className="mt-1 text-sm">{project.description}</p>}
                    {project.bullets.length > 0 && (
                      <ul className="mt-2 list-disc pl-5 text-sm">
                        {project.bullets.map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-800">Education</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                      <h3 className="font-bold">{edu.institution}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    </div>
                    <p className="text-sm">
                      {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                    </p>
                    {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg bg-gray-50 p-4">
            <section className="mb-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-800">Contact</h2>
              <div className="space-y-2 text-sm">
                {personalInfo.email && <p>{personalInfo.email}</p>}
                {personalInfo.phone && <p>{personalInfo.phone}</p>}
                {personalInfo.location && <p>{personalInfo.location}</p>}
                {personalInfo.website && <p>{personalInfo.website}</p>}
              </div>
            </section>

            {skills.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold text-gray-800">Technical Skills</h2>
                <div className="space-y-3">
                  {skills.map((skill, index) => (
                    <div key={index} className="rounded-md bg-white p-2 text-sm shadow-sm">
                      {skill}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Academic Template
const AcademicTemplate = ({ resumeData }: { resumeData: ResumeData }) => {
  const { personalInfo, education, experience, projects, skills } = resumeData

  return (
    <div className="flex h-full flex-col bg-white p-8 text-black gap-3">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">
          {personalInfo.firstName} {personalInfo.lastName}, {personalInfo.title}
        </h1>
        <div className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.website && <p>{personalInfo.website}</p>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-xl font-bold">Research Interests</h2>
          <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-xl font-bold">Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                  <h3 className="font-bold">{edu.institution}</h3>
                  <p className="text-sm">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                </p>
                {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-xl font-bold">Research Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                  <h3 className="font-bold">{project.title}</h3>
                  <p className="text-sm">
                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : "Present"}
                  </p>
                </div>
                {project.link && (
                  <p className="text-sm text-blue-600 hover:underline">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      {project.link}
                    </a>
                  </p>
                )}
                {project.description && <p className="mt-1 text-sm">{project.description}</p>}
                {project.bullets.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {project.bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-xl font-bold">Professional Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                  <h3 className="font-bold">{exp.position}</h3>
                  <p className="text-sm">
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </p>
                </div>
                <p className="text-sm font-medium">
                  {exp.company}, {exp.location}
                </p>
                {exp.description && <p className="mt-1 text-sm">{exp.description}</p>}
                {exp.bullets.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {exp.bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-xl font-bold">Skills & Competencies</h2>
          <p className="text-sm">{skills.join(", ")}</p>
        </section>
      )}
    </div>
  )
}

// Simple Template
const SimpleTemplate = ({ resumeData }: { resumeData: ResumeData }) => {
  const { personalInfo, education, experience, projects, skills } = resumeData

  return (
    <div className="flex h-full flex-col bg-white p-8 text-black gap-3">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-lg text-gray-700">{personalInfo.title}</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-600">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.website && <p>{personalInfo.website}</p>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="mb-2 text-base font-bold uppercase">Summary</h2>
          <p className="text-sm">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-base font-bold uppercase">Experience</h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{exp.position}</h3>
                  <p className="text-xs text-gray-600">
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </p>
                </div>
                <p className="text-xs">
                  {exp.company}, {exp.location}
                </p>
                {exp.bullets.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-xs">
                    {exp.bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-base font-bold uppercase">Projects</h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-xs text-gray-600">
                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : "Present"}
                  </p>
                </div>
                {project.link && (
                  <p className="text-xs text-blue-600 hover:underline">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      {project.link}
                    </a>
                  </p>
                )}
                {project.bullets.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 text-xs">
                    {project.bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-base font-bold uppercase">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <h3 className="font-medium">{edu.institution}</h3>
                  <p className="text-xs text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
                <p className="text-xs">
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="mb-2 text-base font-bold uppercase">Skills</h2>
          <p className="text-xs">{skills.join(", ")}</p>
        </section>
      )}
    </div>
  )
}

// Helper function to format dates
function formatDate(dateString: string): string {
  if (!dateString) return ""

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
  } catch (e) {
    // If the date is not in a valid format, return it as is
    return dateString
  }
}

export const templates: Template[] = [
  {
    id: "modern",
    name: "Modern",
    component: ModernTemplate,
  },
  {
    id: "classic",
    name: "Classic",
    component: ClassicTemplate,
  },
  {
    id: "minimalist",
    name: "Minimalist",
    component: MinimalistTemplate,
  },
  {
    id: "professional",
    name: "Professional",
    component: ProfessionalTemplate,
  },
  {
    id: "creative",
    name: "Creative",
    component: CreativeTemplate,
  },
  {
    id: "executive",
    name: "Executive",
    component: ExecutiveTemplate,
  },
  {
    id: "technical",
    name: "Technical",
    component: TechnicalTemplate,
  },
  {
    id: "academic",
    name: "Academic",
    component: AcademicTemplate,
  },
  {
    id: "simple",
    name: "Simple",
    component: SimpleTemplate,
  },
]
