import { StaticImageData } from "next/image";
import avatar_1 from "@/assets/img/testimonial/avatar.png";
import avatar_2 from "@/assets/img/testimonial/avatar-2.png";
import avatar_3 from "@/assets/img/testimonial/avatar-3.png";

interface DataType {
  id: number;
  page: string;
  avatar: StaticImageData;
  name: string;
  designation: string;
  rating: number;
  desc: string;
}

export const testi_data: DataType[] = [
  {
    id: 1,
    page: "home_2",
    avatar: avatar_1,
    name: "Esther Howard",
    designation: "CEO, Traveller",
    rating: 3.5,
    desc: "Working with this platform transformed the way I manage my travel business. The tools are intuitive and the support team is always ready to help.",
  },
  {
    id: 2,
    page: "home_2",
    avatar: avatar_2,
    name: "Floyd Miles",
    designation: "Marketing Director, AdVenture",
    rating: 2.5,
    desc: "I was skeptical at first, but after just two weeks I saw a noticeable improvement in our campaign performance. Truly a game changer for our team.",
  },
  {
    id: 3,
    page: "home_2",
    avatar: avatar_3,
    name: "Jacob Jones",
    designation: "Product Manager, Techify",
    rating: 4.7,
    desc: "The onboarding process was seamless and the dashboard gives us real-time insights we never had before. Highly recommend it to any product team.",
  },
  {
    id: 4,
    page: "home_2",
    avatar: avatar_2,
    name: "Annette Black",
    designation: "Operations Lead, Logistics Co.",
    rating: 3.5,
    desc: "Our team productivity went up by 40% after adopting this solution. It streamlined our daily workflows and eliminated a lot of manual back-and-forth.",
  },
];

export const testi_data_plataform: DataType[] = [
  {
    id: 1,
    page: "home_2",
    avatar: avatar_1,
    name: "Courtney Henry",
    designation: "UX Designer, Pixelcraft",
    rating: 1.5,
    desc: "The platform's interface is clean and well thought out. As a designer, I appreciate the attention to detail — it made adoption effortless for our whole team.",
  },
  {
    id: 2,
    page: "home_2",
    avatar: avatar_2,
    name: "Ralph Edwards",
    designation: "CTO, DevBridge",
    rating: 2.5,
    desc: "Integration with our existing stack took less than a day. The API documentation is clear and the developer experience is one of the best I've encountered.",
  },
  {
    id: 3,
    page: "home_2",
    avatar: avatar_3,
    name: "Savannah Nguyen",
    designation: "Head of Growth, ScaleUp",
    rating: 3.5,
    desc: "We tested three platforms before choosing this one. The analytics features alone made the decision easy — we finally have data we can actually act on.",
  },
  {
    id: 4,
    page: "home_2",
    avatar: avatar_1,
    name: "Jerome Bell",
    designation: "Founder, StartNow",
    rating: 3.5,
    desc: "As a startup founder wearing many hats, I needed a platform that just works. This exceeded my expectations and freed up hours every single week.",
  },
];

export const testi_data_programs: DataType[] = [
  {
    id: 1,
    page: "home_2",
    avatar: avatar_3,
    name: "Brooklyn Simmons",
    designation: "Program Coordinator, EduPath",
    rating: 3.5,
    desc: "Managing multiple programs used to be chaotic. Now everything is centralized and our coordinators can focus on what really matters — the students.",
  },
  {
    id: 2,
    page: "home_2",
    avatar: avatar_1,
    name: "Cameron Williamson",
    designation: "Training Manager, SkillBridge",
    rating: 3.5,
    desc: "The program tracking features are outstanding. We can monitor progress, send automated reminders, and generate reports in minutes instead of hours.",
  },
  {
    id: 3,
    page: "home_2",
    avatar: avatar_2,
    name: "Leslie Alexander",
    designation: "Director of Education, LearnMore",
    rating: 3.5,
    desc: "Our enrollment numbers increased by 60% after switching. The user experience for participants is so smooth that drop-off rates dropped significantly.",
  },
  {
    id: 4,
    page: "home_2",
    avatar: avatar_3,
    name: "Guy Hawkins",
    designation: "Community Manager, ConnectHub",
    rating: 3.5,
    desc: "I love how easy it is to launch a new program and invite participants. The whole cycle from setup to completion is handled in one place — no more spreadsheets.",
  },
];