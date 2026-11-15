// All text shown on the About page lives here, so the content can be
// updated without touching the layout in About.jsx. Company logos live in ./logos.
//
// Items marked "TODO" are placeholders: please confirm or replace them
// with the club's real details before publishing.

import oracleLogo from './logos/oracle.svg';
import morganStanleyLogo from './logos/morganstanley.svg';
import hsbcLogo from './logos/hsbc.svg';
import siemensHealthineersLogo from './logos/siemens-healthineers.svg';
import nokiaLogo from './logos/nokia.svg';
import bnpParibasLogo from './logos/bnp-paribas.svg';
import daimlerTruckLogo from './logos/daimler-truck.svg';
import tcsLogo from './logos/tcs.svg';
import redBusLogo from './logos/redbus.svg';
import syncronLogo from './logos/syncron.svg';

export const intro = {
  eyebrow: 'About QUEST',
  title: 'A Search Within.',
  lead:
    'QUEST is a student community at SIT that helps students explore opportunities, build skills, and grow together, from their first day on campus to their first day at work.',
};

export const whoWeAre = {
  id: 'who-we-are',
  title: 'Who We Are',
  paragraphs: [
    'QUEST is run by students, for students. We bring together people from every branch and every year who want to make the most of their time in college, and who believe the best way to grow is alongside others.',
    'Our members organise workshops, mock tests, interview practice and community events through the year. Each one is designed to close the gap between the classroom and the career that follows it.',
  ],
};

export const mission = {
  id: 'our-mission',
  title: 'Our Mission',
  paragraphs: [
    'To help every student discover what they are capable of, by giving them the guidance, practice and community they need to move confidently from campus to corporate.',
  ],
  pillarsIntro: 'We work towards this through three commitments:',
  pillars: [
    {
      title: 'Explore opportunities.',
      text: 'Open doors to careers, people and ideas that students might not find on their own.',
    },
    {
      title: 'Build skills.',
      text: 'Practise what matters, from aptitude and coding to group discussions and interviews.',
    },
    {
      title: 'Grow together.',
      text: 'Create a community where seniors guide juniors and every member has someone to learn from.',
    },
  ],
};

export const impact = {
  id: 'our-impact',
  title: 'Our Impact',
  paragraphs: [
    'Our work is measured by where our members go next. QUEST alumni now build careers at leading companies in technology, finance, engineering and research, and many of them return to mentor the students who follow.',
  ],
  programmesTitle: 'What we do',
  programmes: [
    {
      title: 'Freshers Day',
      text: 'Welcomes new students into the QUEST community.',
    },
    {
      title: 'Recruitments',
      text: 'Brings new members into the team that runs QUEST.',
    },
    {
      title: 'Placement IQ',
      text: 'Workshops on careers, resumes, LinkedIn and interview preparation.',
    },
    {
      title: 'QUEST Test Series',
      text: 'Three days of aptitude and coding tests, group discussion and personal interviews.',
    },
  ],
  companiesTitle: 'Our Alumni',
  companies: [
    { name: 'Oracle', logo: oracleLogo },
    { name: 'Morgan Stanley', logo: morganStanleyLogo },
    { name: 'Syncron', logo: syncronLogo },
    { name: 'Siemens Healthineers', logo: siemensHealthineersLogo },
    { name: 'HSBC', logo: hsbcLogo },
    { name: 'redBus', logo: redBusLogo },
    { name: 'Nokia', logo: nokiaLogo },
    { name: 'BNP Paribas', logo: bnpParibasLogo },
    { name: 'Daimler Truck', logo: daimlerTruckLogo },
    { name: 'TCS', logo: tcsLogo },
  ],
  actions: [
    { label: 'Meet our alumni', to: '/alumni' },
    { label: 'Explore events', to: '/events' },
  ],
};
