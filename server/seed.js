/**
 * Database seed script.
 * Populates Profile, Skill, and Project collections with sample data.
 * Run with: node server/seed.js
 *
 * WARNING: This clears existing data in these collections before inserting.
 * Edit the sample data below to reflect your real information before running
 * against a production database.
 */
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });


const mongoose = require('mongoose');
const Profile = require('./models/Profile');
const Skill = require('./models/Skill');
const Project = require('./models/Project');

const sampleProfile = {
  name: 'B Srinivas',
  role: 'Full Stack Developer',
  bio: 'B.Tech Information Technology student and Full Stack Developer Intern, passionate about building practical web applications with clean architecture. Experienced with Java, Python, and modern web technologies, with a growing focus on full-stack development, UI/UX, and building real production-style projects.',
  email: 'your-email@example.com',
  github: 'https://github.com/nivas-7',
  linkedin: 'https://linkedin.com/in/B-Srinivas',
  resume: '/resume.pdf',
  profileImage: '/images/profile.jpg',
  education: [
    {
      degree: 'B.Tech in Information Technology',
      institution: 'CMR Institute of Technology, Hyderabad (JNTUH)',
      year: '2024 - 2028 · CGPA: 8.3',
    },
    {
      degree: 'Intermediate (MPC)',
      institution: 'Sri Chaitanya Junior College, Hyderabad',
      year: '2022 - 2024 · 96.8%',
    },
  ],
  experience: [
    {
      title: 'Full Stack Developer Intern',
      company: 'Codec Technologies',
      duration: '2026 (Hybrid)',
      description: 'Working on full-stack web development projects, building production-style applications end-to-end.',
    },
  ],
};

const sampleSkills = [
  { name: 'Java', icon: '☕', level: 75, category: 'Backend', order: 1 },
  { name: 'Python', icon: '🐍', level: 70, category: 'Backend', order: 2 },
  { name: 'C', icon: '🔧', level: 65, category: 'Backend', order: 3 },
  { name: 'JavaScript', icon: '🟨', level: 72, category: 'Frontend', order: 4 },
  { name: 'HTML/CSS', icon: '🎨', level: 80, category: 'Frontend', order: 5 },
  { name: 'MySQL', icon: '🗄️', level: 60, category: 'Database', order: 6 },
  { name: 'Git/GitHub', icon: '🔧', level: 75, category: 'Tools', order: 7 },
  { name: 'Node.js', icon: '🟢', level: 65, category: 'Backend', order: 8 },
];

const sampleProjects = [
  {
    title: 'Crime Records Management System',
    description:
      'A console-based application built with Core Java, implementing full CRUD operations using OOP principles for managing crime records.',
    image: '/images/projects/crime-records.jpg',
    technologies: ['Java', 'OOP', 'Console App'],
    githubLink: 'https://github.com/nivas-7',
    liveDemo: '',
    featured: true,
    order: 1,
  },
  {
    title: 'Hotel Booking System',
    description:
      'A menu-driven hotel booking application built in Python, using CSV files for persistent CRUD-based data storage.',
    image: '/images/projects/hotel-booking.jpg',
    technologies: ['Python', 'Data Structures', 'CSV'],
    githubLink: 'https://github.com/nivas-7',
    liveDemo: '',
    featured: false,
    order: 2,
  },
  {
    title: 'Personal Portfolio Website',
    description:
      'This very site — a full-stack portfolio built with Node.js, Express, MongoDB, and vanilla JavaScript, following MVC architecture with dynamic content, security hardening, and a working contact form.',
    image: '/images/projects/portfolio.jpg',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JavaScript'],
    githubLink: 'https://github.com/nivas-7',
    liveDemo: '',
    featured: true,
    order: 3,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([Profile.deleteMany({}), Skill.deleteMany({}), Project.deleteMany({})]);
    console.log('Cleared existing Profile, Skill, and Project data.');

    // Insert fresh sample data
    await Profile.create(sampleProfile);
    await Skill.insertMany(sampleSkills);
    await Project.insertMany(sampleProjects);

    console.log('✅ Database seeded successfully!');
    console.log(`   - 1 profile`);
    console.log(`   - ${sampleSkills.length} skills`);
    console.log(`   - ${sampleProjects.length} projects`);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seedDatabase();