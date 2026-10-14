export type CustomerAnswer = { question: string; answer: string };
export type ServicePageContent = {
  path: string;
  legacySlug: string;
  title: string;
  seoTitle: string;
  description: string;
  introduction: string;
  scope: string[];
  planningTitle: string;
  planning: string;
  enquiry: string[];
  answers: CustomerAnswer[];
};

// Published scopes are limited to the cleaning staff offering already on the site.
export const servicePages: ServicePageContent[] = [
  {
    path: "/services/commercial-cleaning",
    legacySlug: "office-commercial-cleaning",
    title: "Commercial cleaning staff for offices and business premises",
    seoTitle: "Commercial Cleaning Staff Colombo & Sri Lanka | Work Bridge",
    description: "Cleaning staff supply for offices and commercial buildings, with a Colombo operational focus and island-wide Sri Lanka coverage. Discuss your facility needs.",
    introduction: "Work Bridge Solution provides cleaning personnel for offices, corporate spaces and commercial facilities. This service is for businesses arranging cleaning staff as part of their facility operations, rather than a pre-priced package of specialist cleaning treatments.",
    scope: ["Cleaning personnel for offices and corporate premises", "Staffing enquiries for commercial buildings and business centres", "Discussion of facility tasks and operating-hour requirements"],
    planningTitle: "Plan around the way your workplace operates",
    planning: "An office, a shared commercial building and a customer-facing business can have different access and cleaning requirements. Describe which spaces need attention, when those spaces are occupied and who coordinates access. This gives the team a useful starting point for discussing personnel requirements without assuming the same arrangement suits every workplace.",
    enquiry: ["Building location and the areas requiring cleaning staff", "Tasks, access restrictions and operating hours", "Expected staffing needs and intended start date"],
    answers: [
      { question: "What commercial cleaning service does Work Bridge Solution provide?", answer: "We supply cleaning personnel for offices, corporate spaces, business premises and commercial facilities. The tasks and staffing arrangement should be discussed for the individual property." },
      { question: "Can factories and other businesses enquire?", answer: "Yes. Businesses can enquire about cleaning workforce requirements for their premises. Describe the site and tasks so the team can discuss suitability; specialist industrial cleaning processes are not advertised as part of this service." },
      { question: "Does a cleaning staff enquiry include equipment or specialist treatments?", answer: "Do not assume equipment, chemicals, specialist treatments or a particular schedule are included. State these requirements in your enquiry and clarify responsibilities with the team before agreeing a scope." }
    ]
  },
  {
    path: "/services/hotel-housekeeping",
    legacySlug: "hotel-housekeeping-support",
    title: "Hotel housekeeping staff for hospitality properties",
    seoTitle: "Hotel Housekeeping Staff Sri Lanka & Colombo | Work Bridge",
    description: "Discuss housekeeping personnel for hotels, resorts and guest accommodation. Work Bridge Solution focuses on Colombo and serves businesses island-wide in Sri Lanka.",
    introduction: "Work Bridge Solution provides cleaning and housekeeping manpower for hotels, resorts and guest accommodation. Hospitality enquiries can cover personnel requirements for rooms and common areas, with the property's own operating context guiding the discussion.",
    scope: ["Housekeeping manpower for hotels, resorts and guest accommodation", "Personnel requirements for rooms and common areas", "Discussion of hospitality property staffing requirements"],
    planningTitle: "Separate room requirements from shared-area requirements",
    planning: "Guest rooms and shared hospitality spaces do not have identical routines. For a useful enquiry, explain which areas require personnel and describe the property's housekeeping expectations. Include your intended schedule and start date as requirements to discuss, not as an assumption of guaranteed staff or shift availability.",
    enquiry: ["Property type, location and rooms or common areas involved", "Housekeeping tasks and the property's operating requirements", "Requested staffing arrangement and intended start date"],
    answers: [
      { question: "How can hotels request housekeeping staff?", answer: "Contact Work Bridge Solution by email, WhatsApp or phone with the property location, areas requiring housekeeping personnel, tasks and intended start date. The team can then discuss the enquiry in the context of the hotel." },
      { question: "Is this only for hotels in Colombo?", answer: "No. Colombo is the primary operational focus, and Work Bridge Solution offers island-wide service coverage across Sri Lanka, including enquiries from hotels and other hospitality properties." },
      { question: "Are laundry, food service or other hotel roles included?", answer: "This page describes cleaning and housekeeping manpower. Do not assume other hospitality roles are included; ask the team about any requirement outside that scope." }
    ]
  },
  {
    path: "/services/apartment-cleaning",
    legacySlug: "apartment-cleaning-staff",
    title: "Apartment cleaning staff for managed residential properties",
    seoTitle: "Apartment Cleaning Staff Colombo & Sri Lanka | Work Bridge",
    description: "Cleaning staff supply for apartment complexes, residential towers and serviced apartments, with Colombo focus and island-wide Sri Lanka service coverage.",
    introduction: "Work Bridge Solution supplies cleaning staff for apartment complexes, residential towers, serviced apartments and managed residences. This page is intended for property managers and businesses planning cleaning personnel for residential facilities.",
    scope: ["Cleaning staff for apartment complexes and residential towers", "Common-area upkeep staffing requirements", "Cleaning workforce enquiries for serviced apartments and managed residences"],
    planningTitle: "Describe the areas managed by your property team",
    planning: "Specify whether the enquiry concerns shared spaces, managed accommodation or another part of the property. Include access arrangements and the routines residents depend on. A clear description helps distinguish building-wide staffing requirements from a request for a one-off clean of an individual home.",
    enquiry: ["Residential property location and type", "Shared or managed areas requiring cleaning personnel", "Tasks, access arrangements and requested staffing period"],
    answers: [
      { question: "Who can enquire about apartment cleaning staff?", answer: "Apartment property managers, managed residential facilities and serviced-apartment businesses can enquire about cleaning personnel for their properties." },
      { question: "Is this a household cleaning booking service?", answer: "The offering described here is cleaning staff supply for managed residential properties. If you need a one-off clean for an individual home, contact the team to clarify suitability rather than assuming it is included." },
      { question: "Can an apartment complex outside Colombo enquire?", answer: "Yes. Work Bridge Solution has a Colombo operational focus and island-wide Sri Lanka service coverage. Include the property location when contacting the team." }
    ]
  },
  {
    path: "/services/outsourced-workforce-solutions",
    legacySlug: "outsourced-cleaning-manpower",
    title: "Outsourced cleaning workforce solutions for businesses",
    seoTitle: "Outsourced Cleaning Workforce Sri Lanka | Work Bridge",
    description: "Plan outsourced cleaning personnel for managed facilities and commercial properties in Colombo and across Sri Lanka. Discuss your site's workforce requirements.",
    introduction: "Work Bridge Solution offers outsourced cleaning manpower arrangements for commercial properties and managed facilities. The scope described here is cleaning workforce support; it does not imply that every category of labour or security personnel is available under the same arrangement.",
    scope: ["Outsourced cleaning personnel for commercial and managed facilities", "Cleaning workforce arrangements shaped around facility requirements", "Discussion of roles, staffing expectations and site coordination"],
    planningTitle: "Clarify the arrangement, not just the number of people",
    planning: "Describe the cleaning roles you need and how they fit into your site's operations. Before agreeing an arrangement, discuss who defines tasks, coordinates access and receives questions about the work. Employment, supervision, equipment and other responsibilities should be clarified directly rather than inferred from the term outsourcing.",
    enquiry: ["Facility location, type and cleaning roles needed", "Expected staffing period, operating requirements and start date", "Responsibilities you want to clarify before an agreement"],
    answers: [
      { question: "What workforce scope is described on this page?", answer: "This page describes outsourced cleaning personnel for commercial properties and managed facilities. It does not advertise security staff or general labour roles as part of the published cleaning scope." },
      { question: "What information helps with a quotation enquiry?", answer: "Share your facility type and location, the cleaning tasks, expected staffing needs, operating requirements and intended start date. Any equipment or coordination expectations should also be raised for discussion." },
      { question: "Are prices or replacement guarantees published?", answer: "No standard prices or replacement guarantees are stated on this website. Contact the team to discuss requirements and clarify any proposed terms before agreeing an arrangement." }
    ]
  }
];

export const servicePath = (legacySlug: string) => servicePages.find(page => page.legacySlug === legacySlug)?.path ?? "/services";

export const commonAnswers: CustomerAnswer[] = [
  { question: "Which businesses can enquire?", answer: "Hotels, apartment properties, offices, factories, commercial buildings and other businesses can contact Work Bridge Solution about cleaning workforce requirements. Suitability and scope should be discussed for the individual site." },
  { question: "Does Work Bridge Solution operate outside Colombo?", answer: "Yes. Colombo is the primary operational focus, with island-wide service coverage across Sri Lanka. The listed office address is in Ambalangoda; this does not imply a physical Colombo branch." },
  { question: "What information is useful for a quotation enquiry?", answer: "Describe the property type and location, cleaning tasks, operating hours, staffing requirements and intended start date. Raise any equipment or coordination requirements for clarification rather than assuming they are included." },
  { question: "How can businesses contact Work Bridge Solution?", answer: "Email info@workbridgesolution.com, or call or WhatsApp +94 76 356 8325 or +94 77 618 0810. Use the contact actions below or visit the Contact page." }
];
