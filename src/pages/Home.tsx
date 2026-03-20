import { motion } from 'motion/react';
import { Github, Linkedin, Mail, ArrowRight, Code2, Terminal, Cpu, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const PROJECTS_DATA = [
  { number: "01", title: "Nexus Analytics", description: "Real-time data visualization dashboard for enterprise metrics.", tags: ["React", "D3.js", "Firebase"] },
  { number: "02", title: "Aura E-Commerce", description: "High-performance headless commerce storefront.", tags: ["Next.js", "Stripe", "Tailwind"] },
  { number: "03", title: "Orbit Chat", description: "Encrypted real-time messaging platform with WebRTC.", tags: ["React", "Socket.io", "WebRTC"] },
  { number: "04", title: "Synthwave Audio", description: "Browser-based digital audio workstation and synthesizer.", tags: ["Web Audio API", "TypeScript", "Canvas"] },
  { number: "05", title: "Quantum CMS", description: "Headless content management system with AI generation.", tags: ["Node.js", "PostgreSQL", "OpenAI"] },
  { number: "06", title: "Vanguard Security", description: "Automated vulnerability scanning and reporting tool.", tags: ["Python", "Docker", "React"] },
  { number: "07", title: "Lumina Design System", description: "Open-source component library for React applications.", tags: ["Storybook", "Framer Motion", "Tailwind"] },
  { number: "08", title: "Apex Logistics", description: "Supply chain management and route optimization software.", tags: ["Next.js", "Google Maps API", "Redis"] }
];

export default function Home() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const visibleProjects = showAllProjects ? PROJECTS_DATA : PROJECTS_DATA.slice(0, 4);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-32"
    >
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(0,255,0,0.1)_0%,_transparent_60%)] filter blur-[60px] opacity-50 pointer-events-none" />
        
        <div className="z-10 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-[#00FF00] tracking-widest text-sm"
          >
            01 // KRISH SHAH - SOFTWARE ENGINEER
          </motion.div>
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] text-white">
            Building<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF00] to-emerald-600">
              Digital
            </span><br />
            Futures
          </h1>
          
          <p className="max-w-xl text-xl text-white/60 font-light leading-relaxed">
            I craft high-performance web applications, scalable systems, and innovative digital experiences. Specializing in modern React, Node.js, and cloud architecture.
          </p>
          
          <div className="flex items-center space-x-6 pt-8">
            <Link 
              to="/blog" 
              className="group flex items-center space-x-2 bg-[#00FF00] text-black px-8 py-4 font-mono font-bold uppercase tracking-wider hover:bg-white transition-colors"
            >
              <span>Read My Thoughts</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="flex space-x-4">
              <SocialLink href="https://github.com/krishcshah" icon={<Github />} />
              <SocialLink href="https://www.linkedin.com/in/krishcshah/" icon={<Linkedin />} />
              <SocialLink href="mailto:hello@krishshah.de" icon={<Mail />} />
            </div>
          </div>
        </div>
      </section>

      {/* Skills / Stack */}
      <section className="border-t border-white/10 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="col-span-1">
            <h2 className="text-4xl font-black uppercase tracking-tighter">The Stack</h2>
            <p className="text-white/50 mt-4 font-mono text-sm">Tools and technologies I use to bring ideas to life.</p>
          </div>
          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <SkillCard 
              icon={<Code2 className="text-[#00FF00]" size={32} />}
              title="Frontend"
              skills={['React / Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion']}
            />
            <SkillCard 
              icon={<Terminal className="text-[#00FF00]" size={32} />}
              title="Backend"
              skills={['Node.js', 'Express', 'PostgreSQL', 'Firebase']}
            />
            <SkillCard 
              icon={<Cpu className="text-[#00FF00]" size={32} />}
              title="DevOps & Cloud"
              skills={['Docker', 'AWS', 'CI/CD', 'Vercel']}
            />
            <SkillCard 
              icon={<Brain className="text-[#00FF00]" size={32} />}
              title="Machine Learning"
              skills={['Python', 'TensorFlow', 'PyTorch', 'Scikit-Learn']}
            />
          </div>
        </div>
      </section>

      {/* Selected Projects */}
      <section className="border-t border-white/10 pt-24 pb-24">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-5xl font-black uppercase tracking-tighter">Projects</h2>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#00FF00] font-mono text-sm hover:underline underline-offset-4">
            VIEW ALL ON GITHUB [→]
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleProjects.map((project) => (
            <ProjectCard 
              key={project.number}
              number={project.number}
              title={project.title}
              description={project.description}
              tags={project.tags}
            />
          ))}
        </div>

        {PROJECTS_DATA.length > 4 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="group flex items-center space-x-2 border border-[#00FF00] text-[#00FF00] px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-[#00FF00] hover:text-black transition-colors"
            >
              <span>{showAllProjects ? 'Show Less' : 'Show More'}</span>
              {showAllProjects ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        )}
      </section>

      {/* Timeline Section */}
      <section className="border-t border-white/10 pt-24 pb-24">
        <div className="mb-16">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Timeline</h2>
          <p className="text-white/50 mt-4 font-mono text-sm">My education and experience journey.</p>
        </div>
        
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
          
          <TimelineItem 
            year="2025 - Ongoing"
            title="Software Systems Engineering"
            organization="RWTH Aachen University"
            description="Focusing on advanced software architecture, systems design, and engineering methodologies."
          />

          <TimelineItem 
            year="2025 - Ongoing"
            title="Data Science"
            organization="RWTH Aachen University"
            description="Specializing in machine learning, data engineering, and statistical analysis."
          />
          
          <TimelineItem 
            year="2021 - 2024"
            title="B.E. Computer Engineering"
            organization="TSEC, University of Mumbai"
            description="Graduated with a Bachelor of Engineering in Computer Engineering."
          />

        </div>
      </section>
    </motion.div>
  );
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-4 border border-white/10 hover:border-[#00FF00] hover:text-[#00FF00] transition-colors rounded-none"
    >
      {icon}
    </a>
  );
}

function SkillCard({ icon, title, skills }: { icon: React.ReactNode, title: string, skills: string[] }) {
  return (
    <div className="p-8 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold uppercase tracking-wide mb-4">{title}</h3>
      <ul className="space-y-2 font-mono text-sm text-white/60">
        {skills.map(skill => (
          <li key={skill} className="flex items-center space-x-2">
            <span className="text-[#00FF00]">&gt;</span>
            <span>{skill}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectCard({ number, title, description, tags }: { number: string, title: string, description: string, tags: string[] }) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-video bg-white/5 border border-white/10 mb-6 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FF00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="font-mono text-6xl font-black text-white/10 group-hover:text-[#00FF00]/20 transition-colors">{number}</span>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold uppercase tracking-tight mb-2 group-hover:text-[#00FF00] transition-colors">{title}</h3>
          <p className="text-white/60 font-light mb-4">{description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="text-xs font-mono px-2 py-1 border border-white/20 text-white/60">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function TimelineItem({ year, title, organization, description }: { year: string, title: string, organization: string, description: string }) {
  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#050505] group-hover:border-[#00FF00] group-hover:bg-[#00FF00]/10 transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_8px_#050505] z-10">
        <div className="w-2 h-2 rounded-full bg-white/50 group-hover:bg-[#00FF00] transition-colors" />
      </div>
      
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-none border border-white/10 bg-white/5 hover:border-white/30 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
          <h3 className="font-bold text-xl uppercase tracking-tight text-white">{title}</h3>
          <span className="font-mono text-[#00FF00] text-sm shrink-0">{year}</span>
        </div>
        <div className="text-white/80 font-mono text-sm mb-4">{organization}</div>
        <p className="text-white/60 font-light text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
