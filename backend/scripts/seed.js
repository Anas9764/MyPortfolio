const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Bio = require('../models/Bio');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Project = require('../models/Project');

dotenv.config({ path: path.join(__dirname, '../.env') });

const bioData = {
  name: "Anas Qureshi",
  roles: [
    "Full Stack Developer",
    "Frontend Developer",
    "React Js Developer",
    "React Native Developer",
    "MERN Stack Developer",
  ],
  description: "I am an independent and self-driven professional committed to delivering high-quality web and app solutions. Focused on aligning user needs with business objectives, I ensure seamless user experiences. By prioritizing attention to detail, innovation, and problem-solving, I aim to exceed expectations and drive the success of every project I work on.",
  github: "https://github.com/Anas9764",
  resume: "https://drive.google.com/file/d/1XKfuJ7PWzQB27L9om-bLKZrAM-CdHbIA/view?usp=sharing",
  linkedin: "https://www.linkedin.com/in/qureshi-anas/?profileId=ACoAADYDX0UBYLucP7SKoiYkq0nopRHxp_yybog",
  twitter: "",
  insta: "",
  facebook: "",
};

const skillsData = [
  {
    title: "Frontend",
    skills: [
      { name: "React Js", image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiLz4KICAgIDxlbGxpcHNlIHJ4PSIxMSIgcnk9IjQuMiIgdHJhbnNmb3JtPSJyb3RhdGUoNjApIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDEyMCkiLz4KICA8L2c+Cjwvc3ZnPg==" },
      { name: "JavaScript", image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" },
      { name: "Next Js", image: "https://cdn.worldvectorlogo.com/logos/next-js.svg" },
      { name: "React Native", image: "https://cdn.worldvectorlogo.com/logos/react-native-1.svg" },
      { name: "Shadcn UI", image: "https://avatars.githubusercontent.com/u/139895814?s=200&v=4" },
      { name: "TanStack", image: "https://avatars.githubusercontent.com/u/72518640?s=200&v=4" },
      { name: "ECharts", image: "https://echarts.apache.org/en/images/logo.png" },
      { name: "amCharts", image: "https://www.amcharts.com/wp-content/uploads/2019/02/am5-new-logo.png" },
      { name: "HTML", image: "https://www.w3.org/html/logo/badge/html5-badge-h-solo.png" },
      { name: "CSS", image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" },
      { name: "Tailwind CSS", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAPFBMVEX////G6fxsyvk/v/g4vfhhyPmz4vuK1PoAtfckufgvu/hTxPn6/f+h2/tGwPjS7v255fxMwviT1/qn3vsZjXhWAAAAbElEQVR4AeWOCQqAMAwEq11r06b3//9qAwiI0QfowHINC2N+yLJabE53uycgUGTtF11CmDqLLVdZ57iJhSt9V+4cCQB5a1RGJgr9FrrW866GbmpoGylISlNC3RxnsbY+hLbX0GSJIKE6zOajHN4ZA8/fNs9XAAAAAElFTkSuQmCC" },
      { name: "Bootstrap", image: "https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png" },
      { name: "Material UI", image: "data:image/png;base64,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" },
      { name: "Ant Design", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAwFBMVEX////wYm9Up+DwZG8nkeBLo+A3meDwcW9cq+AhjuBAneAvleAYiuBEn+DwbW/waG/wdW9jr+Dy+P33+/0AgN262PL/+vqXxeu21POeyezwXGp/tuoAht8AfN3609b+8vPj7/qpz+37293ygIn3tLmJvOvV5/fvb2jvVWP85ef5w8f0l572tLHF3PRBkuJnp+b1oafxg330n53uTFvyjYzzlpXvYGLxc3vzjpbuX1buO0/4ysj2q7D1qKb3vLvuV1nUSGc7AAAIJklEQVR4nO2dbXuiOhCGBdH13a3UqtijVbSitVutVu3Wev7/vzpBCHkBAihYwsnzYa9uKTV3JzOZhDDJ5YSEhISEhISEhISEhISEhISEsi5V/ekWxKbn12739fmnWxGLWr16Gajea/10S65Xq19WqkBKuc89DWCp2uKeptVXIAv3tmn1q0gK37YBdiniMDzTtKbVImGZqlLjlaY1VYo0jPLIJ82ZpVikYJTalEMam8UFw6Nt3CwQhj8ayOJhGUW554vGjGM0C4LhyzaIxdMySpmjCN2aFotMGKXMzejpw0LC1PpczNdAH6sEw5S58JtWp1qpuE2jED5jioOYdmahYCpv0+lbhYYp36c9F7BYCJhi58m88tQBNARM2mlUiwX3mWIXXuziLmP3tBRHAcBSJ2GqxTa63FbKJEya/UbtFCskDMECaKrc0KidSr1OwFAsiMaBSWuEtlhwmGqlTf+Q3dMQTO0xjX5js2AwLruY6po0ZQwmjTTAX+oUjBeLRUPA1FIX0xwWBOPuY5a61TIJU/snXeON2oMsDkyl6/fDXaVGwqSLBmNxYHzsYqpbrpEwgCY1Pc3sYwUSxq+PWcJoajZN71aNDRCwS6FAwASw4D3Nhnn8Jx2mATG5QMIEsmA0NWia0S3aGiS1UwckOEwIFkQDYe7fkm9qoNRevVAgLBOKxUWTBhiHxYEp1kOxwCjgWKafbENDSO1VCiRMxX98odWt1TCfCfknSE4YSwGyRGiUSQMN85hcK8NJHSGWQnSWM40dme9fk2pkSGEsdjSLyAJo/jye9Sd030~" },
    ]
  },
  {
    title: "Backend",
    skills: [
      { name: "Node Js", image: "https://nodejs.org/static/images/logo.svg" },
      { name: "Express Js", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAbFBMVEX////8/Pz09PT19fX4+Pjd3d2ampoAAAAzNDWoqKno6Oh0dHRcXFzIycm5ubktLi4hIiN7e3yLi4tmZ2fi4uI9Pj7S0tIHCQuzs7NJSkru7u6goKB+f3/W1taNjo69vb1PT1BsbW0VFRc3ODhehn9TAAAA30lEQVR4Ad3QhXHEMBBA0W8QmAVmTq7/HjOeDdSQewNiLfBukjRNM4A0TeCR/0wSpY0xtiihMgWPsraYnLWd8yFEE3vyOIwAeprhMQ5Lm8O6uT3hWPwKjQspj+zsLvlBuwNmV1DaukS+t3sqs8MWkAU7ejMiGnMhkjoCqnZmQ3CZPwM8Hy/8Hd7xF7BWzjQIxulCsJaQbG6r7xXR2zNHrn1s0AwhUdNPjunejTLxTlHedS89EOMwFAkobzR4ewFptRyI9tPY18uZkFIYzUO5akWU22BflYKx2xGX1Rn/yxf+uwzyBt/vSwAAAABJRU5ErkJggg==" },
      { name: "Python", image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" },
      { name: "MongoDB", image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" },
      { name: "MySQL", image: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" },
      { name: "Firebase", image: "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" },
    ]
  }
];

const experiencesData = [
  {
    role: "Front End Developer",
    company: "ICOGZ Technologies",
    date: "May 2025 – Present",
    desc: "Contributed to the development of enterprise-level analytics and AI-powered dashboard platforms...",
    skills: ["React Js", "JavaScript", "Redux", "REST APIs", "amCharts", "ECharts", "TanStack", "Tailwind CSS", "Git"],
    img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAXVBMVEVHcEyiJCgkHyCSIiUgHh8jHyAkHyAkHyAkHyAkHyAjHyAlHyAtHyDDJCgkHh/CJCjBJCjDJCgPHx/CJCjCJCjEJCjCJCjCJCjCJCjCJCjCJCjCJCjBJCjCJCjCJCig5WzSAAAAH3RSTlMACtgPPP+yuctx8lwGeCn/LEWMuGmq1cLhiRpaN5vyFmcndwAAAORJREFUeAGVjwWCg0AQBBuZ+NK4w/+feVkhA+cpnBrFu0QxkPygkMrpJN/Ls1gu+B6Ra3qTy/07d5XY3m4pjjwMkIpIhliOjgaGOYqoFMtNTQGQ1fOs2ZQSyyXTljnbjgGTZbhdXZdgeyoNB+Alx2nmgXEnF3r6xtdesZPw/2Y8aenIVTbeOVb73kabNHTf8NT2Q8sWrtQSpJvNhMytVBVkQUvnpH4Dr/7rNG4yoQZjolbxmT61n/KioWNQ6bdTqsrsZM0DCHiZGAxUioN0yevqzBw142dZtEjYYmGO7+kLYMJ/+QCtIROWkmLklgAAAABJRU5ErkJggg=="
  }
];

const educationData = [
  {
    school: "MGM College of Engineering, Nanded",
    degree: "B.Tech, Computer Science Engineering",
    date: "Aug 2019 - July 2023",
    grade: "8.07 CGPA",
    desc: "I earned my Bachelor's degree in Computer Science and Engineering...",
    img: "data:image/jpeg;base64,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"
  }
];

const projectsData = [
  {
    id: 0,
    title: "VS Code Clone design",
    description: "Developed a static VS Code clone...",
    image: "https://github.com/Anas9764/FSJS-Bootcamp/blob/main/VsCode%20Clone%20Project/Vscode%20clone%20output.jpeg?raw=true",
    tags: ["React Js", "Tailwind CSS"],
    category: "web app",
    github: "https://github.com/Anas9764/FSJS-Bootcamp/tree/main/VsCode%20Clone%20Project",
    webapp: "https://vscode-clone-project97.netlify.app/"
  }
];

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);

    await Bio.deleteMany({});
    await Bio.create(bioData);
    console.log('Bio Seeded');

    await Skill.deleteMany({});
    await Skill.create(skillsData);
    console.log('Skills Seeded');

    await Experience.deleteMany({});
    await Experience.create(experiencesData);
    console.log('Experience Seeded');

    await Education.deleteMany({});
    await Education.create(educationData);
    console.log('Education Seeded');

    await Project.deleteMany({});
    await Project.create(projectsData);
    console.log('Projects Seeded');

    console.log('Database Seeded Successfully');
    process.exit();
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedDB();
