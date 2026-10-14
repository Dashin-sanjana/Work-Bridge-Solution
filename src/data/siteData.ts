import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ClipboardCheck,
  Hotel,
  Landmark,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Service = {
  title: string;
  slug: string;
  summary: string;
  image: string;
  icon: LucideIcon;
  benefits: string[];
  facilities: string[];
};

export type Industry = {
  title: string;
  summary: string;
  image: string;
  icon: LucideIcon;
};

export const strengths = [
  {
    title: "Cleaning Personnel",
    text: "Cleaning personnel supplied for professional business environments.",
    icon: Users
  },
  {
    title: "Flexible Staffing",
    text: "Discuss long-term, short-term, and temporary workforce requirements.",
    icon: CalendarClock
  },
  {
    title: "Service Coordination",
    text: "Clear communication during enquiry and service planning.",
    icon: ShieldCheck
  },
  {
    title: "Property Requirements",
    text: "Attention to the cleanliness and presentation needs discussed for each property.",
    icon: BadgeCheck
  }
];

export const services: Service[] = [
  {
    title: "Hotel Housekeeping Support",
    slug: "hotel-housekeeping-support",
    summary:
      "Professional cleaning and housekeeping manpower for hotels, resorts, guest accommodation, and hospitality establishments.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    icon: Hotel,
    benefits: ["Guest-facing presentation", "Shift-based staffing discussions", "Support for rooms and common areas"],
    facilities: ["Hotels", "Resorts", "Guest accommodation", "Hospitality facilities"]
  },
  {
    title: "Apartment Cleaning Staff",
    slug: "apartment-cleaning-staff",
    summary:
      "Cleaning staff supply for luxury apartments, residential towers, serviced apartments, and managed properties.",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    icon: Building2,
    benefits: ["Common-area upkeep", "Resident-focused service culture", "Flexible manpower planning"],
    facilities: ["Luxury apartments", "Residential towers", "Serviced apartments", "Managed residences"]
  },
  {
    title: "Office & Commercial Cleaning",
    slug: "office-commercial-cleaning",
    summary:
      "Cleaning personnel for offices, corporate spaces, business premises, and commercial facilities.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    icon: Landmark,
    benefits: ["Cleaner workplaces", "Business-hour coordination", "Consistent facility presentation"],
    facilities: ["Offices", "Business centers", "Commercial buildings", "Corporate premises"]
  },
  {
    title: "Outsourced Cleaning Manpower",
    slug: "outsourced-cleaning-manpower",
    summary:
      "Flexible cleaning workforce arrangements planned around each client's facility requirements.",
    image:
      "/hospitality-hero.jpg",
    icon: BriefcaseBusiness,
    benefits: ["Staffing requirements discussion", "Role and responsibility planning", "Workforce support aligned to your site"],
    facilities: ["Commercial properties", "Managed facilities", "Retail spaces", "Mixed-use properties"]
  }
];

export const industries: Industry[] = [
  {
    title: "Hotels and Resorts",
    summary: "Cleaning manpower for guest environments where presentation and consistency matter.",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    icon: Hotel
  },
  {
    title: "Luxury Apartments",
    summary: "Staffing support for residential towers, serviced apartments, and premium managed properties.",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    icon: Building2
  },
  {
    title: "Corporate Offices",
    summary: "Professional cleaning personnel for workspaces, offices, and administrative facilities.",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
    icon: Landmark
  },
  {
    title: "Shopping Malls",
    summary: "Flexible cleaning workforce support for high-footfall commercial environments.",
    image:
      "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=1200&q=80",
    icon: Sparkles
  },
  {
    title: "Commercial Buildings",
    summary: "Manpower supply for multi-tenant properties, business buildings, and shared facilities.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    icon: Building2
  },
  {
    title: "Other Managed Facilities",
    summary: "Cleaning workforce arrangements shaped around each managed facility's operating needs.",
    image:
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80",
    icon: Workflow
  }
];

export const advantages = [
  { title: "Business-Focused Personnel", text: "Cleaning personnel for business environments.", icon: Users },
  { title: "Professional Service Coordination", text: "Clear communication and service coordination.", icon: ClipboardCheck },
  { title: "Scalable Workforce", text: "Manpower plans shaped around changing needs.", icon: Workflow },
  { title: "Service Requirements", text: "Cleanliness and presentation priorities discussed for each site.", icon: ShieldCheck },
  { title: "Direct Communication", text: "Direct contact channels for enquiry and planning.", icon: MessagesSquare }
];

export const approach = [
  "Understand the property, operating hours, and staffing expectations.",
  "Recommend a suitable cleaning manpower arrangement.",
  "Discuss service requirements, role clarity, and onboarding arrangements.",
  "Communicate about attendance and service-related concerns raised by the client."
];
