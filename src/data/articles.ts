export interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  role?: string;
  date: string;
  category: string;
  image?: string;
  readTime?: string;
  sources?: string;
  body?: string[];
}

export const featuredArticle: Article = {
  id: "featured",
  title: "Bunreacht na hÉireann & the Indian Constitution: The Shared Architecture of Two Republics",
  excerpt: "When Sir B.N. Rau travelled to Dublin in 1947 to consult Éamon de Valera, he sought a constitutional philosophy beyond classical laissez-faire. What India adapted from Article 45 became Part IV's Directive Principles of State Policy.",
  author: "Deliberately Éire Research",
  role: "Constitutional & Historical Studies",
  date: "Feb 15, 2026",
  category: "Constitutional History",
  readTime: "11 min read",
  sources: "Constituent Assembly Debates (Vol. VII); Bunreacht na hÉireann (1937); National Archives of Ireland",
  body: [
    "India's Directive Principles of State Policy (Part IV of the Constitution) are among the most distinctive innovations in post-colonial constitutional law. Non-justiciable yet fundamental in governance, their immediate ancestor was not Westminster, Washington, or Paris, but Article 45 of Bunreacht na hÉireann, enacted in Dublin just ten years before Indian independence.",
    "The connection was not accidental. In December 1947, Sir Benegal Narsing Rau, Constitutional Advisor to the Constituent Assembly of India, travelled to Dublin for extensive consultations with Taoiseach Éamon de Valera, Chief Justice Conor Maguire, and drafters of the 1937 Irish Constitution.",
    "## The Dublin Consultations of 1947",
    "B.N. Rau arrived in Ireland seeking answers to a fundamental dilemma facing post-colonial states: How does an emerging republic guarantee essential socioeconomic transformation without permitting the judiciary to paralyze state-led agrarian and social reform through narrow property-rights jurisprudence?",
    "Ireland had addressed this through Article 45—'Directive Principles of Social Policy'—expressly stating that these principles were intended for the general guidance of the Oireachtas and 'shall not be cognisable by any Court under any of the provisions of this Constitution.'",
    "De Valera advised Rau that separating fundamental legal rights from non-justiciable social directives was essential to avoid continuous constitutional deadlock between socialist legislation and judicial review.",
    "## Part IV of the Indian Constitution",
    "Dr. B.R. Ambedkar and the Drafting Committee placed these principles into Part IV of the Indian Draft Constitution (Articles 36–51). In the Constituent Assembly Debates, Ambedkar explicitly defended the Irish precedent against critics who dismissed the principles as mere 'pious wishes.'",
    "'The Directive Principles are like the Instrument of Instructions which were issued to the Governor-General... whoever captures power will not be free to do what he likes with it,' Ambedkar argued.",
    "From the right to adequate livelihood (Article 39) to equal pay for equal work, maternity relief, and the separation of the judiciary from the executive (Article 50), the Irish mechanism gave the newborn Indian Republic a charter for progressive social democracy.",
    "## A Lasting Constitutional Kinship",
    "The constitutional conversation between Ireland and India did not end in 1950. Decades later, Indian Supreme Court landmark cases like *Kesavananda Bharati (1973)* and *Minerva Mills (1980)* continually referenced Irish constitutional jurisprudence on the harmonious balance between Fundamental Rights and Directive Principles.",
    "As both republics navigate 21st-century questions of sovereignty, pluralism, and global technological shifts, the shared lineage of 1937 and 1947 remains a foundational testament to deliberate statecraft across continents."
  ],
};

export const featuredPosts: Article[] = [
  {
    id: "fp1",
    title: "1913–1947: How the Dublin Lockout and Ghadar Movement Connected Anti-Colonial Struggles",
    excerpt: "Long before formal embassies opened, Irish and Indian nationalists shared underground printing presses, legal defense networks, and mutual recognition across continents.",
    author: "Archival Research",
    date: "Feb 10, 2026",
    category: "Diplomatic History",
    readTime: "8 min read",
  },
  {
    id: "fp2",
    title: "Tagore, Yeats, and the Abbey Theatre: The 1912 Literary Confluence That Echoes Today",
    excerpt: "When W.B. Yeats introduced Rabindranath Tagore's Gitanjali to European audiences, it sparked a deep philosophical kinship between the Celtic and Bengal Renaissances.",
    author: "Cultural Heritage",
    date: "Jan 28, 2026",
    category: "Literature & Thought",
    readTime: "9 min read",
  },
  {
    id: "fp3",
    title: "The Irish-Indian Demographic Mosaic: CSO Census Data on Healthcare, Tech & Integration",
    excerpt: "Over 45,000 Indian citizens now live in Ireland, representing the state's fastest-growing non-EU community and a vital pillar of the HSE and tech innovation corridors.",
    author: "CSO / Eurostat Analysis",
    date: "Jan 19, 2026",
    category: "Modern Diaspora",
    readTime: "7 min read",
  },
  {
    id: "fp4",
    title: "Sister Nivedita (Margaret Noble): The Tyrone Schoolteacher Who Transformed Indian Education",
    excerpt: "Born in Dungannon, Co. Tyrone, Margaret Noble embraced the teachings of Swami Vivekananda and pioneered female education and national revival in Calcutta.",
    author: "Biographical Essays",
    date: "Jan 5, 2026",
    category: "Historical Figures",
    readTime: "10 min read",
  },
  {
    id: "fp5",
    title: "Bilateral Trade & Aviation Leasing: How Dublin & New Delhi Exchanged €5.8B in 2025",
    excerpt: "A deep dive into Enterprise Ireland and IDA trade figures: how Irish aircraft leasing engines and Indian IT & pharma form a critical economic artery.",
    author: "Economic Briefings",
    date: "Dec 18, 2025",
    category: "Trade & Economy",
    readTime: "6 min read",
  },
];

export const gridArticles: Article[] = [
  {
    id: "g1",
    title: "Annie Besant & The Irish Home Rule Blueprint in Madras and Bombay",
    excerpt: "Examining how Besant, inspired by Isaac Butt and Parnell, adapted the Home Rule League model to mobilize millions across British India in 1916.",
    author: "Historical Studies",
    date: "Feb 18, 2026",
    category: "Diplomatic History",
    readTime: "7 min read",
  },
  {
    id: "g2",
    title: "Subhas Chandra Bose in Dublin (1936): The Secret Meetings with Éamon de Valera",
    excerpt: "Declassified archival cables reveal the discreet diplomatic discussions between Netaji and Irish cabinet ministers regarding post-imperial governance.",
    author: "Diplomatic Archives",
    date: "Feb 12, 2026",
    category: "Diplomatic History",
    readTime: "10 min read",
  },
  {
    id: "g3",
    title: "The Symbolism of the Tricolour: Saffron, White, and Green in Two Revolutions",
    excerpt: "Why the national flags of Ireland and India share the same palette: an exploration of 19th-century republican vexillology, peace, and sacred heritage.",
    author: "Visual History",
    date: "Feb 4, 2026",
    category: "Culture & Symbols",
    readTime: "5 min read",
  },
  {
    id: "g4",
    title: "Higher Education in Ireland: Non-EU Student Dynamics & the Third-Level Graduate Scheme",
    excerpt: "Analysis of UCD, Trinity, and UCC enrollment data, graduate visa policies (Stamp 1G), and the long-term career integration of Indian researchers in Ireland.",
    author: "Policy Analysis",
    date: "Jan 25, 2026",
    category: "Higher Education",
    readTime: "8 min read",
  },
];

export const topicClusters = [
  { name: "Constitutional & Legal Lineage", count: 18 },
  { name: "Freedom Struggles & Diplomacy", count: 24 },
  { name: "Literature, Art & Thought", count: 16 },
  { name: "Diaspora, Tech & Higher Ed", count: 32 },
];

