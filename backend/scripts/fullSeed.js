const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Bio = require('../models/Bio');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Project = require('../models/Project');

dotenv.config({ path: path.join(__dirname, '../.env') });

const BioData = {
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
      { name: "React Js", image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K" },
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
      { name: "Ant Design", image: "data:image/png;base64,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" },
      { name: "Redux", image: "https://d33wubrfki0l68.cloudfront.net/0834d0215db51e91525a25acf97433051f280f2f/c30f5/img/redux.svg" },
      { name: "Context API", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAdVBMVEUiIiIiISEgFxQfEw4bAAA4aXRk4f9f1fM8dYQhHx5m5v8uS1MyWGJdz+1WvNcgGRc3ZnFYw99NpLtSssoeCgAaAABh2vo6b30dBABJmq4hHRwpO0EVAAA1YGkyVl9i3f5Bg5VGkqY/fY0sREtLoLYnNTgmLzE4G9YqAAABcUlEQVR4AYyR0W6EIBBFh2UWFlVc1BmRtQXtyv9/YtWkibUvPU83kDs5MPAvhDilCzcJeDsCgrxd7u5K6Qcagw+t1P3XrZBFiVVtpbR1hWUhz5Obp0PRYFvXLTYC3bM5T310PYAhZjIAffe4nZuD9cKgG0eHRng7nJvhxVMPo/740CP0E7/CSQc/lVMq2o2otviJP0oGE9dupnqgjaGm2dWc0By9xrmSBrs4gnkGcosdqHSuEbC7tRSE5/iFTimHX5G9CNTu/oARdv23pbVgLlay7/1ZEBEAvJ3JAGqVUceoMSuNYGi2fvfJ3AI93dzRq+te1M3uSdByPoxC0xadTRNXSIQVT8l2RdsEOBC9WBSz1u8NrZnVsh3BDyHHaa06nZLuqnWKOZz/9m7RNF4vi/aNQXv/u5UgmEW4buVogqHEnMjApWlEAZStzlnbTFAIAydkUrUafQh+3EKS8Au5lnLXF70sVwkXTBBwIIKB71EMAFZ+G3kZOpXgAAAAAElFTkSuQmCC" },
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
  },
  {
    title: "Others",
    skills: [
      { name: "GitHub", image: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" },
      { name: "Vercel", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAAAAABXZoBIAAAAZ0lEQVR4AWMYwkBICI/krCm45eQ/ftfCKbnp//9FuOTsfv3//98Fh+TB/0BwELtc8H8wiMMqeRUieRWbXPF/KCjGIvkYJvkYU27KfzjoxAi4jwjJ7/KY/keA1ahy3E2dSKCJm2FEAQAD1l2xzdeQ1AAAAABJRU5ErkJggg==" },
      { name: "Netlify", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcBAMAAACAI8KnAAAALVBMVEX////f9PQAt7QAu7iM2dj7/v43xMKe3934/f3a8vLGz8+Mn54hwL0ANDI9xcM3IX9gAAAAUUlEQVR4AWOgHDAKoHCZFFC4zAa4uSwBKFynVBS9YeocDUhc1ko0e1fvgrF4jI2NGvbe5lA2Nj6AxkUoRjMKt0VOT5kU0B1J2EcI76MHDsUAANZSEj24Z6GKAAAAAElFTkSuQmCC" },
      { name: "Render", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpix2GnOWQeWgrpXRYDLC7yGaT5-aVg4UD8A&s" },
      { name: "VS Code", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/512px-Visual_Studio_Code_1.35_icon.svg.png?20210804221519" },
      { name: "Postman", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ5yPOAbr-LrEa8ANO47RBo4f2txsvjPL-fw&s" },
      { name: "Android Studio", image: "https://developer.android.com/static/studio/images/new-studio-logo-1_1920.png" },
      { name: "Wordpress", image: "https://www.shutterstock.com/image-vector/vinnytsia-ukraine-may-7-2023-260nw-2299940409.jpg" },
      { name: "Figma", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAA51BMVEUwMzwvMjovMjsmMToXMT1MNjh8OzSCSUlSPEHDRyf5Txz0Tg7/cmLNYVcfMTyqQyvyTh7xSxWxWFEJLDcuMTnKSCXXZVpTNTbzSwD/cmAzLx+tRkvdUXvSWUfRcG7QipqpZms9JyYuMDgsLTSDTs6iWf+nW/8AJAUAl8wAwP8tLzcmLil2SLWkVf8PhaYavP4jhrIvJikfLBupUP8AuO8vHhsGncktLjZCNVwaRkYqSFwrLDM2IEBwWbWDguAkHhAsLjYsLTUsJjITp20A1HsuEy0uIjIbk2UE2IgKz4MoS0ErLDQqODnoj8cFAAABZklEQVR4AaTMVQLCMBAE0N1JoO6O0/sfkqnLLy+eFfmHThvMDHytQ6AK2MuVHHIt3wpABRPj+RSEg8hgMgfjxE8pY4jyGKQqOrIpzUEqlOYgtPDPQXAISEtb7dvWFigBSDmAaVI/CII2DLuuC11TlgyXUk7M7f6g+vl6f76mL8ueQ/pR+atrLJAchmEA6Jn+pGpAPggzM7j/f89JOqZNTLsBuFmE7biI6IJ+tW/x4dHm+PSMnuehH3yLoSVEsSck71Ff6Q7t14jSkKLmqIWHmy0xRW5uoK9sJWYacvohUXiI6JUVW4kZXbqqm5boLr7rXyp2faZVRmuWDeM0M0sVBEHVa25ZpnomW7f9IPalz+jEilcF/UDbhRNHPsmAoQc1wEAs+1skNwD0IPYtrpPEaR2+oqgBwHgeO13nCAOw4QsoGgNc79u03UcAQ5qNIa+MQPt1XY2pzFdUZaqKHU9fN3yr6l9M9QI6YW0Sw7c5lAAAAABJRU5ErkJggg==" },
    ]
  }
];

const experiencesData = [
  {
    id: 0,
    img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAXVBMVEVHcEyiJCgkHyCSIiUgHh8jHyAkHyAkHyAkHyAkHyAjHyAlHyAtHyDDJCgkHh/CJCjBJCjDJCgPHx/CJCjCJCjEJCjCJCjCJCjCJCjCJCjCJCjCJCjBJCjCJCjCJCig5WzSAAAAH3RSTlMACtgPPP+yuctx8lwGeCn/LEWMuGmq1cLhiRpaN5vyFmcndwAAAORJREFUeAGVjwWCg0AQBBuZ+NK4w/+feVkhA+cpnBrFu0QxkPygkMrpJN/Ls1gu+B6Ra3qTy/07d5XY3m4pjjwMkIpIhliOjgaGOYqoFMtNTQGQ1fOs2ZQSyyXTljnbjgGTZbhdXZdgeyoNB+Alx2nmgXEnF3r6xtdesZPw/2Y8aenIVTbeOVb73kabNHTf8NT2Q8sWrtQSpJvNhMytVBVkQUvnpH4Dr/7rNG4yoQZjolbxmT61n/KioWNQ6bdTqsrsZM0DCHiZGAxUioN0yevqzBw142dZtEjYYmGO7+kLYMJ/+QCtIROWkmLklgAAAABJRU5ErkJggg==",
    role: "Front End Developer",
    company: "ICOGZ Technologies",
    date: "May 2025 – Present",
    desc: "Contributed to the development of enterprise-level analytics and AI-powered dashboard platforms...",
    skills: ["React Js", "JavaScript", "Redux", "REST APIs", "amCharts", "ECharts", "TanStack", "Tailwind CSS", "Git"]
  },
  {
    id: 1,
    img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAV1BMVEVHcEzP4+Mydp89e6MlbpwTaJmFrKlSkGgpd0oxelAbapkrcp0KazcDajRaj61vn7EvdJ49fKNJiWUNazjz+fh6qqUkdUdZjq46eaE2f1YbcUFCf6VGgacsbMNAAAAAHXRSTlMACr6Y//8UP9W3//D//0cu36tguAUh8lnQj5+EcQD4cHEAAAENSURBVHgBjdEFFsMgEATQQZa4e5P7n7PLUvLq7cTzcfB3lDbqEylLZI17Q0maqZwKovyOI5WVx7ppmbt77tOKMzDm3Rh4ijSzpKmgbxW1Zy08MJWVyqqUcVn9mAIbwXmrSncJiMbz7nkVTJsTqbjxgboTHKaIhWU+IgtmUyk4GmBntoHXG1YV4wyJ8I7uDqcTp8BtRHeP2tbY/YwDXlx5hytpLDD2EauyBw5LjLl1MAG3gGkixGNdiJq6xolNH0nWzo476YCqnN0DGUwtFYx9uY0JsFhpUHYbTuckNTEmytiixhKow6T5sTZMwn7a7SE0Tlwr15EkzJxOTSvd0z23NYx9pcgrxnck3Dn8mytWJxXIZcGtVQAAAABJRU5ErkJggg==",
    role: "Software Developer",
    company: "MGrid Technologies",
    date: "Dec 2023 – May 2025",
    desc: "Developed a scalable Admin Panel and responsive website for managing products, cars, orders, and users...",
    skills: ["React Js", "JavaScript", "Firebase", "React Native", "Tailwind CSS", "Redux", "Git"]
  },
  {
    id: 2,
    img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAk1BMVEX////Phe/SjfDt1Pnj4+N8fHyFhYX//f+uAOSxEuXHbez68f3S0tIAAACvAOWzIeazIubWl/EXFxfmwvfBWer15fzgsfT36/zPg++5OOj78/704vu+TenqzPjiuPXrzvjEYusODg4+Pj7Kysrs7OypqamWlpa+vr5GRkYmJiazs7P29vZycnJNTU2goKBdXV1nZ2c0zpqnAAAA2klEQVR4AXzQBRLDMAxE0Q1LaQ1lZqb7X69RIZz8GQ89M+C4jodSfhAmARExU9wpYldJCWpjLVOviv0fWkNm0IjCw1EDymByojo0zFaYx0WEoJ5MSdjo2SSPI0GaY7EkkzCt8igLLMk715yw3uTRpAi4xEW0OcRkS6vald8GXgFNHvPv3AFz3YRq/33nFw/HIipEGZ7UuQ3V7tKCSl39FlQq+OHtkMeD+nX3v+/MIx7Pn+5qEPD3X61F4NKGQNiG8F8pEjMXEbj0vx+PbRzH7ylIoWcIPX19AwYA+lMb+2fcBXEAAAAASUVORK5CYII=",
    role: "Web Developer Intern",
    company: "Technnohacks",
    date: "Aug 2023 – Oct 2023",
    desc: "Developed responsive web pages using HTML, CSS, JavaScript, and React.js...",
    skills: ["HTML", "CSS", "JavaScript", "React Js", "Bootstrap", "Responsive Design"]
  }
];

const educationData = [
  {
    id: 0,
    img: "data:image/jpeg;base64,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",
    school: "MGM College of Engineering, Nanded",
    degree: "B.Tech, Computer Science Engineering",
    date: "Aug 2019 - July 2023",
    grade: "8.07 CGPA",
    desc: "I earned my Bachelor's degree in Computer Science and Engineering from MGM College of Engineering, Nanded, achieving a CGPA of 8.07..."
  },
  {
    id: 1,
    img: "data:image/jpeg;base64,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",
    school: "Madinatul Uloom Junior College",
    degree: "HSC(XII), Science Stream",
    date: "Jun 2017 - Apr 2019",
    desc: "I completed my Higher Secondary Certificate (HSC) at Madinatul Uloom Junior College, Nanded, where I pursued the Science stream."
  },
  {
    id: 2,
    img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAn1BMVEVHcEz8VFHvVFVUndCIqsE7a6X4OTa7VnMQTJAaTY88aaQfUJImWJf/Z1qBaJkAR5EUSo1Fc6v6S0s2hL0LRYsiVZb1RUcfUZP4Ix7wGhxOhrozaaQiWZmjZ4r0Hx+RXosObq8kXZ1FebAgUZL8Qz/0LzHzKSvxIybwJyrzLzLvHiL1MTH1Oj18msXyLTD+goP1QUT2QUTzNTj1PkE3ZqG3AQefAAAANXRSTlMAIzgOBVZuwPHhk9GcF5r+/kotGv+umezh/yZtjmr3qEeAOcFEnczv27//jX4YsgxlU6yofWLkzaEAAAGhSURBVHgBZZGFsqswFAAXqyAVCKVIBYdAvf//a88yc2Hm7WiyyVHmaLrB/5gWwGK5WpuAbcIcxwVvs91t976HtQqY44oQ8xBtN8d4mbDaJcxII5Fhnk7H8yUDey3mdm85woKrbeVAkYQ7Y5KBbaxWBqDuEvJykkZIsc0r3QTQ6wqyfOolXTT26tB2C6CXcgBnClzH401c0YYaGiljjcJFweKsQRgC1chdnvsRIhSPVi9gvwZ4aq+4fbwhLJQcBzOFYG0A/shT5zOV1D+ML5hOAGh3gDfkoYraY9p/ZQI8G4AeMtWqdoCvgfH350sOgN9DqKQ/QpqQrI3HW0ofGGuIQvVzhH1BujY7KZ8A54qbyFTOD9z2rPMhrn2AUT74CgsAPg/M5CuK40tFij+wUosBvYa9CKteBTpKj1z87GXQr7ud0b/+uS5eUIjZvr9ie/VbD6ja+I2xEtm0TrE6aWMNVS9lTRCJ8OfbTrim3jR9J2PZVFh/zijSXZQF+F170J/Pl0dQCqdQ6manwb9ocesDWM4uLJjQDl1zHyqgSL9pMonf6FQm1ymIb50AAAAASUVORK5CYII=",
    school: "Iqra Urdu High School",
    degree: "SSC(X)",
    date: "Jun 2016 - Mar 2017",
    desc: "I completed my Secondary School Certificate (SSC) education at Iqra Urdu High School, Nanded."
  }
];

const projectsData = [
  {
    id: 0,
    title: "VS Code Clone design",
    description: "Developed a static VS Code clone, replicating its visual layout and structure...",
    image: "https://github.com/Anas9764/FSJS-Bootcamp/blob/main/VsCode%20Clone%20Project/Vscode%20clone%20output.jpeg?raw=true",
    tags: ["React Js", " Tailwind CSS"],
    category: "web app",
    github: "https://github.com/Anas9764/FSJS-Bootcamp/tree/main/VsCode%20Clone%20Project",
    webapp: "https://vscode-clone-project97.netlify.app/"
  },
  {
    id: 9,
    title: "Food calories Tracker",
    description: "Designed and developed a 'Calories-Tracking' web application using the MERN stack...",
    image: "https://raw.githubusercontent.com/BobsProgrammingAcademy/food-tracker/refs/heads/main/static/images/FoodLog.png",
    tags: ["React Js", "MongoDb", "Node Js", "Express Js", "Redux", "Bootstrap"],
    category: "web app",
    github: "https://github.com/Anas9764/Calories-Tacker.git",
    webapp: "https://Calories-Tracking.netlify"
  },
  {
    id: 19,
    title: "Currency Converter",
    description: "Developed a Currency Converter application using JavaScript, HTML, CSS, and Bootstrap...",
    image: "https://github.com/Anas9764/Currency-Converter/blob/master/output.png?raw=true",
    tags: ["JavaScript", "Css", "HTML", "API", "Bootstrap"],
    category: "web app",
    github: "https://github.com/Anas9764/Currency-Converter",
    webapp: "https://currency-converter-s.netlify.app/"
  }
];

const fullSeed = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB Atlas`);

    await User.deleteMany({});
    const hashedPassword = await bcrypt.hash("Pass@123", 10);
    await User.create({ email: "anasqureshi.dev@gmail.com", password: hashedPassword });
    console.log("Admin User Updated");

    await Bio.deleteMany({}); await Bio.create(BioData);
    await Skill.deleteMany({}); await Skill.create(skillsData);
    await Experience.deleteMany({}); await Experience.create(experiencesData);
    await Education.deleteMany({}); await Education.create(educationData);
    await Project.deleteMany({}); await Project.create(projectsData);

    console.log('Database synchronization complete.');
    process.exit();
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

fullSeed();
