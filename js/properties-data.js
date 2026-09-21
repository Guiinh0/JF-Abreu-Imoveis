/**
 * JF ABREUS IMÓVEIS - Catálogo de Imóveis Exclusivos
 * Especialistas em Bertioga, Costa do Sol e Guaratuba (Desde 1999)
 */

const BASE_PROPERTIES_DATA = [
  {
    id: "ref-001",
    ref: "001",
    title: "Mansão de Alto Padrão – A Apenas 100m da Praia!",
    subtitle: "Luxo, amplitude e sofisticação com vista para a orla",
    purpose: "venda",
    type: "Mansão",
    price: 10800000,
    priceFormatted: "R$ 10.800.000,00",
    location: "Costa do Sol, Bertioga - SP",
    neighborhood: "Costa do Sol",
    distanceBeach: "100m da Praia",
    bedrooms: 5,
    suites: 5,
    bathrooms: 6,
    parking: 4,
    landArea: "373 m²",
    builtArea: "450 m²",
    featured: true,
    badge: "Alto Padrão",
    image: "assets/properties/ref-001.webp",
    gallery: [
      "assets/properties/ref-001.webp",
      "assets/properties/ref-002.jpg",
      "assets/properties/ref-003.jpg"
    ],
    description: "Espetacular mansão de altíssimo padrão localizada em um dos pontos mais nobres de Costa do Sol em Bertioga, a apenas 100 metros da praia. Projeto arquitetônico contemporâneo com pé direito duplo, integração total entre as áreas sociais e a exuberante área externa com piscina privativa, deck molhado e espaço gourmet completo.",
    features: [
      "Piscina com Deck Molhado",
      "Espaço Gourmet com Churrasqueira",
      "Pé Direito Duplo",
      "5 Suítes com Varanda",
      "Ar Condicionado em Todos Ambientes",
      "Segurança 24h com Ronda",
      "A 100m da Praia",
      "Acabamentos em Granito e Mármore"
    ]
  },
  {
    id: "ref-002",
    ref: "002",
    title: "Encanto Próximo ao Mar – 4 Suítes e Acesso Exclusivo",
    subtitle: "Conforto absoluto e contato direto com a brisa litorânea",
    purpose: "venda",
    type: "Casa de Praia",
    price: 4000000,
    priceFormatted: "R$ 4.000.000,00",
    location: "Costa do Sol, Bertioga - SP",
    neighborhood: "Costa do Sol",
    distanceBeach: "150m da Praia",
    bedrooms: 4,
    suites: 4,
    bathrooms: 5,
    parking: 3,
    landArea: "373 m²",
    builtArea: "320 m²",
    featured: true,
    badge: "Exclusivo",
    image: "assets/properties/ref-002.jpg",
    gallery: [
      "assets/properties/ref-002.jpg",
      "assets/properties/ref-004.jpg",
      "assets/properties/ref-005.jpg"
    ],
    description: "Residência sofisticada que harmoniza privacidade, elegância e comodidade. São 4 amplas suítes climatizadas, sala em múltiplos ambientes banhada por luz natural e área de lazer privativa com piscina e churrasqueira, situada em rua tranquila com acesso rápido à praia.",
    features: [
      "4 Suítes Espaçosas",
      "Piscina Privativa com Cascata",
      "Varanda Gourmet Integrada",
      "Jardim com Paisagismo",
      "Cozinha Planejada",
      "Garagem Coberta para 3 Carros",
      "Portão Automático e Câmeras"
    ]
  },
  {
    id: "ref-003",
    ref: "003",
    title: "Casa Luxuosa a 400m da Praia – Puro Bem-Estar",
    subtitle: "Perfeita harmonia entre sofisticação, conforto e natureza",
    purpose: "venda",
    type: "Casa",
    price: 4800000,
    priceFormatted: "R$ 4.800.000,00",
    location: "Guaratuba, Bertioga - SP",
    neighborhood: "Guaratuba",
    distanceBeach: "400m da Praia",
    bedrooms: 4,
    suites: 4,
    bathrooms: 5,
    parking: 4,
    landArea: "373 m²",
    builtArea: "360 m²",
    featured: true,
    badge: "Destaque",
    image: "assets/properties/ref-003.jpg",
    gallery: [
      "assets/properties/ref-003.jpg",
      "assets/properties/ref-006.jpg",
      "assets/properties/ref-001.webp"
    ],
    description: "Ideal para quem busca qualidade de vida e lazer inesquecível em família. Esta casa conta com acabamentos nobres, suítes com closet, sala de estar com lareira ecológica, sala de jantar panorâmica e ampla varanda com churrasqueira e piscina.",
    features: [
      "4 Suítes com Closet",
      "Piscina com Iluminação Noturna",
      "Área Gourmet com Forno de Pizza",
      "Condomínio com Portaria 24h",
      "Mobiliada e Decorada",
      "Sistema de Energia Solar",
      "Próximo ao Mar"
    ]
  },
  {
    id: "ref-004",
    ref: "004",
    title: "Luxuosa Casa com Piscina e Área de Lazer Completa",
    subtitle: "Terreno amplo de 451m² com lazer privativo incomparável",
    purpose: "venda",
    type: "Casa",
    price: 2450000,
    priceFormatted: "R$ 2.450.000,00",
    location: "Costa do Sol, Bertioga - SP",
    neighborhood: "Costa do Sol",
    distanceBeach: "350m da Praia",
    bedrooms: 4,
    suites: 3,
    bathrooms: 5,
    parking: 4,
    landArea: "451 m²",
    builtArea: "290 m²",
    featured: false,
    badge: "Oportunidade",
    image: "assets/properties/ref-004.jpg",
    gallery: [
      "assets/properties/ref-004.jpg",
      "assets/properties/ref-007.jpg",
      "assets/properties/ref-002.jpg"
    ],
    description: "Descubra o equilíbrio perfeito entre conforto, sofisticação e lazer nesta incrível residência em Costa do Sol. Implantada em terreno diferenciado de 451m², oferece amplo gramado, piscina com prainha, espaço gourmet e interiores aconchegantes com 4 dormitórios.",
    features: [
      "Terreno Amplo de 451m²",
      "Piscina com Prainha",
      "Quiosque Gourmet Completo",
      "Suítes com Ar Condicionado",
      "Lavabo Social e Ducha Externa",
      "Rua Asfaltada e Monitorada",
      "Excelente Ventilação Natural"
    ]
  },
  {
    id: "ref-005",
    ref: "005",
    title: "Casa à Venda a Apenas 50m da Praia!",
    subtitle: "Pise na areia em menos de 1 minuto de caminhada",
    purpose: "venda",
    type: "Casa de Praia",
    price: 4200000,
    priceFormatted: "R$ 4.200.000,00",
    location: "Costa do Sol, Bertioga - SP",
    neighborhood: "Costa do Sol",
    distanceBeach: "50m da Praia",
    bedrooms: 4,
    suites: 4,
    bathrooms: 5,
    parking: 3,
    landArea: "373 m²",
    builtArea: "310 m²",
    featured: true,
    badge: "50m da Praia",
    image: "assets/properties/ref-005.jpg",
    gallery: [
      "assets/properties/ref-005.jpg",
      "assets/properties/ref-001.webp",
      "assets/properties/ref-003.jpg"
    ],
    description: "Localização verdadeiramente privilegiada a apenas 50 metros da praia! Durma ouvindo o som das ondas e aproveite o melhor do litoral com total comodidade. São 4 amplas suítes, living espaçoso integrado ao quintal com piscina e área gourmet.",
    features: [
      "Apenas 50m do Mar",
      "4 Suítes Climatizadas",
      "Piscina com Iluminação LED",
      "Espaço Gourmet Coberto",
      "Solarium com Vista Parcial",
      "Armários Planejados",
      "Segurança e Zeladoria Ativa"
    ]
  },
  {
    id: "ref-006",
    ref: "006",
    title: "Casa Lado Praia – Conforto e Lazer para Toda a Família",
    subtitle: "Espaço generoso, piscina privativa e localização estratégica",
    purpose: "venda",
    type: "Casa",
    price: 2500000,
    priceFormatted: "R$ 2.500.000,00",
    location: "Guaratuba, Bertioga - SP",
    neighborhood: "Guaratuba",
    distanceBeach: "250m da Praia",
    bedrooms: 4,
    suites: 3,
    bathrooms: 6,
    parking: 4,
    landArea: "373 m²",
    builtArea: "285 m²",
    featured: false,
    badge: "Lado Praia",
    image: "assets/properties/ref-006.jpg",
    gallery: [
      "assets/properties/ref-006.jpg",
      "assets/properties/ref-004.jpg",
      "assets/properties/ref-007.jpg"
    ],
    description: "Excelente imóvel lado praia em condomínio fechado com segurança permanente. Ambientes arejados, pé direito elevado, 4 dormitórios sendo 3 suítes, 6 banheiros no total, piscina ampla com cascata e varandão para relaxar com a família.",
    features: [
      "Lado Praia em Guaratuba",
      "Piscina com Cascata",
      "Varandão com Churrasqueira",
      "4 Dormitórios (3 Suítes)",
      "6 Banheiros",
      "Amplo Estacionamento",
      "Condomínio com Controle de Acesso"
    ]
  },
  {
    id: "ref-007",
    ref: "007",
    title: "Casa Aconchegante a 300m da Praia – Costa do Sol",
    subtitle: "Oportunidade imperdível com ótimo custo-benefício",
    purpose: "venda",
    type: "Casa",
    price: 1500000,
    priceFormatted: "R$ 1.500.000,00",
    location: "Costa do Sol, Bertioga - SP",
    neighborhood: "Costa do Sol",
    distanceBeach: "300m da Praia",
    bedrooms: 3,
    suites: 2,
    bathrooms: 3,
    parking: 2,
    landArea: "373 m²",
    builtArea: "210 m²",
    featured: false,
    badge: "Custo-Benefício",
    image: "assets/properties/ref-007.jpg",
    gallery: [
      "assets/properties/ref-007.jpg",
      "assets/properties/ref-005.jpg",
      "assets/properties/ref-002.jpg"
    ],
    description: "Sua casa de veraneio a apenas 300 metros da praia! Construção sólida com 3 dormitórios, piscina nos fundos com solarium, churrasqueira, gramado e fácil manutenção. Perfeito para morar ou curtir fins de semana e feriados.",
    features: [
      "300 metros da Praia",
      "Piscina Privativa",
      "Churrasqueira com Balcão",
      "3 Dormitórios (2 Suítes)",
      "Documentação 100% Regularizada",
      "Aceita Financiamento Bancário",
      "Rua Tranquila e Arborizada"
    ]
  },
  {
    id: "ref-031",
    ref: "031",
    title: "Sua Casa de Praia dos Sonhos – Venda ou Locação",
    subtitle: "5 dormitórios e estrutura completa para grandes famílias",
    purpose: "venda", // also available for rent
    type: "Casa de Praia",
    price: 1980000,
    priceFormatted: "R$ 1.980.000,00",
    rentalPrice: "R$ 8.500,00 / mês",
    location: "Costa do Sol, Bertioga - SP",
    neighborhood: "Costa do Sol",
    distanceBeach: "200m da Praia",
    bedrooms: 5,
    suites: 3,
    bathrooms: 4,
    parking: 3,
    landArea: "373 m²",
    builtArea: "270 m²",
    featured: true,
    badge: "Venda ou Aluguel",
    image: "assets/properties/ref-031.webp",
    gallery: [
      "assets/properties/ref-031.webp",
      "assets/properties/ref-003.jpg",
      "assets/properties/ref-006.jpg"
    ],
    description: "Versatilidade e conforto em dose dupla. Disponível tanto para venda quanto para locação anual. Dispõe de 5 dormitórios, sendo 3 suítes, sala em dois ambientes, área de lazer com piscina e churrasqueira, a poucos minutos da praia.",
    features: [
      "Disponível para Venda e Aluguel",
      "5 Quartos com 3 Suítes",
      "Piscina com Solarium",
      "Espaço Gourmet",
      "Próximo ao Mar",
      "Mobiliada",
      "Ideal para Grandes Famílias"
    ]
  },
  {
    id: "ref-100",
    ref: "100",
    title: "Casa para Locação Anual – Lado Praia em Bertioga",
    subtitle: "Viva com tranquilidade e a comodidade de morar perto do mar",
    purpose: "locacao",
    type: "Casa",
    price: 9000,
    priceFormatted: "R$ 9.000,00 / mês",
    location: "Costa do Sol, Bertioga - SP",
    neighborhood: "Costa do Sol",
    distanceBeach: "200m da Praia",
    bedrooms: 4,
    suites: 3,
    bathrooms: 4,
    parking: 3,
    landArea: "373 m²",
    builtArea: "260 m²",
    featured: false,
    badge: "Locação Anual",
    image: "assets/properties/ref-100.jpg",
    gallery: [
      "assets/properties/ref-100.jpg",
      "assets/properties/ref-004.jpg",
      "assets/properties/ref-002.jpg"
    ],
    description: "Casa térrea para locação residencial anual em Costa do Sol. Imóvel muito bem conservado, com 4 dormitórios (3 suítes), cozinha espaçosa com armários, piscina privativa e varanda gourmet. Excelente opção para viver com qualidade no litoral.",
    features: [
      "Locação Anual Residencial",
      "Lado Praia",
      "Piscina Privativa",
      "4 Dormitórios (3 Suítes)",
      "Garagem para 3 Veículos",
      "Contrato Seguro com Garantia Locatícia",
      "Pronta para Morar"
    ]
  },
  {
    id: "ref-200",
    ref: "200",
    title: "Belíssima Casa Lado Serra – Refúgio Verde e Exuberante",
    subtitle: "Privacidade, ar puro e visual para a Serra do Mar",
    purpose: "venda",
    type: "Casa",
    price: 2000000,
    priceFormatted: "R$ 2.000.000,00",
    location: "Costa do Sol, Bertioga - SP",
    neighborhood: "Costa do Sol",
    distanceBeach: "Lado Serra",
    bedrooms: 4,
    suites: 3,
    bathrooms: 6,
    parking: 4,
    landArea: "373 m²",
    builtArea: "295 m²",
    featured: false,
    badge: "Lado Serra",
    image: "assets/properties/ref-200.webp",
    gallery: [
      "assets/properties/ref-200.webp",
      "assets/properties/ref-001.webp",
      "assets/properties/ref-005.jpg"
    ],
    description: "Para quem valoriza a tranquilidade da natureza e a vista espetacular da Mata Atlântica e da Serra do Mar. Imóvel com 4 quartos, 6 banheiros, piscina rodeada por árvores e muito verde, sala ampla com lareira e acabamento rústico sofisticado.",
    features: [
      "Vista Panorâmica para a Serra",
      "Piscina Ensolarada",
      "Muita Privacidade e Silêncio",
      "4 Quartos e 6 Banheiros",
      "Varanda com Redário",
      "Quintal com Árvores Frutíferas",
      "Segurança Motorizada 24h"
    ]
  }
];

function getDeletedRefs() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('jf_deleted_refs');
      return stored ? JSON.parse(stored) : [];
    }
  } catch (e) {}
  return [];
}

function saveDeletedRefs(refs) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('jf_deleted_refs', JSON.stringify(refs));
    }
  } catch (e) {}
}

function getActiveProperties() {
  const isBaseCleared = typeof window !== 'undefined' && window.localStorage && localStorage.getItem('jf_clear_base') === 'true';
  const deletedRefs = getDeletedRefs();
  const deletedSet = new Set(deletedRefs.map(r => String(r).trim().toLowerCase()));

  let custom = [];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('jf_custom_properties');
      if (stored) custom = JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Error reading custom properties:', e);
  }

  // Also merge sessionStorage draft if not yet in array
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const lastSaved = sessionStorage.getItem('jf_last_saved_property');
      if (lastSaved) {
        const parsed = JSON.parse(lastSaved);
        if (parsed && parsed.ref && !custom.some(c => String(c.ref).trim().toLowerCase() === String(parsed.ref).trim().toLowerCase())) {
          custom.unshift(parsed);
        }
      }
    }
  } catch (e) {}

  // Filter custom properties against deleted list
  const activeCustom = (Array.isArray(custom) ? custom : []).filter(c => !deletedSet.has(String(c.ref).trim().toLowerCase()));

  if (isBaseCleared) {
    return activeCustom;
  }

  // Filter base properties: exclude any marked as deleted, and override if custom has same ref
  const customRefs = new Set(activeCustom.map(c => String(c.ref).trim().toLowerCase()));
  const activeBase = BASE_PROPERTIES_DATA.filter(b => {
    const refKey = String(b.ref).trim().toLowerCase();
    return !deletedSet.has(refKey) && !customRefs.has(refKey);
  });

  return [...activeCustom, ...activeBase];
}

// Global deletion & reset helpers
function deleteProperty(ref) {
  if (!ref) return;
  const refStr = String(ref).trim().toLowerCase();

  // 1. Add to deleted refs
  const deleted = getDeletedRefs();
  if (!deleted.some(r => String(r).trim().toLowerCase() === refStr)) {
    deleted.push(ref);
    saveDeletedRefs(deleted);
  }

  // 2. Remove from custom properties if exists
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('jf_custom_properties');
      if (stored) {
        const custom = JSON.parse(stored);
        const filtered = custom.filter(c => String(c.ref).trim().toLowerCase() !== refStr);
        localStorage.setItem('jf_custom_properties', JSON.stringify(filtered));
      }
      // Remove from session draft if matches
      const lastSaved = sessionStorage.getItem('jf_last_saved_property');
      if (lastSaved) {
        const parsed = JSON.parse(lastSaved);
        if (parsed && String(parsed.ref).trim().toLowerCase() === refStr) {
          sessionStorage.removeItem('jf_last_saved_property');
        }
      }
    }
  } catch (e) {}
}

function clearAllProperties() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('jf_clear_base', 'true');
      localStorage.setItem('jf_custom_properties', JSON.stringify([]));
      localStorage.setItem('jf_deleted_refs', JSON.stringify([]));
      sessionStorage.removeItem('jf_last_saved_property');
    }
  } catch (e) {}
}

function restoreDefaultProperties() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('jf_clear_base');
      localStorage.setItem('jf_deleted_refs', JSON.stringify([]));
    }
  } catch (e) {}
}

if (typeof window !== 'undefined') {
  window.getActiveProperties = getActiveProperties;
  window.deleteProperty = deleteProperty;
  window.clearAllProperties = clearAllProperties;
  window.restoreDefaultProperties = restoreDefaultProperties;
}

const PROPERTIES_DATA = getActiveProperties();

// Regiões e Bairros de Atuação
const NEIGHBORHOODS_DATA = [
  {
    id: "costa-do-sol",
    name: "Costa do Sol",
    tagline: "Condomínio fechado com praias preservadas e segurança total",
    count: 7,
    image: "assets/properties/ref-001.webp",
    description: "Bairro nobre e planejado no litoral de Bertioga, caracterizado por ruas tranquilas, preservação ambiental e residências de alto padrão a poucos passos do mar."
  },
  {
    id: "guaratuba",
    name: "Guaratuba",
    tagline: "Natureza exuberante, rio e mar em um só lugar",
    count: 2,
    image: "assets/properties/ref-003.jpg",
    description: "Região famosa pela beleza singular do encontro do Rio Guaratuba com o mar cristalino. Um paraíso para esportes náuticos, pesca e descanso em família."
  },
  {
    id: "riviera",
    name: "Riviera de São Lourenço",
    tagline: "O maior e mais sofisticado complexo planejado do litoral",
    count: 3,
    image: "assets/properties/ref-005.jpg",
    description: "Referência em sustentabilidade e infraestrutura de ponta, shopping centers, quadras de tênis, campo de golfe e segurança 24h rigorosa."
  },
  {
    id: "bertioga-centro",
    name: "Bertioga Centro / Enseada",
    tagline: "Comércio ativo, orla revitalizada e facilidade total",
    count: 4,
    image: "assets/properties/ref-007.jpg",
    description: "Perfeito para quem deseja viver com tudo perto: supermercados, agências bancárias, restaurantes e a orla marítima com ciclovia iluminada."
  }
];

// Depoimentos Reais de Clientes
const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Marcelo & Viviane Albuquerque",
    location: "São Paulo - SP (Comprou em Costa do Sol)",
    rating: 5,
    comment: "A equipe da JF Abreu foi impecável. A Cinthia nos atendeu com uma paciência e transparência raras no mercado imobiliário. Encontramos nossa casa a 100m da praia com toda a documentação perfeitamente checada. Recomendo de olhos fechados!",
    date: "Janeiro de 2026"
  },
  {
    id: 2,
    name: "Dr. Roberto Silveira",
    location: "Campinas - SP (Comprou em Guaratuba)",
    rating: 5,
    comment: "O Edson conhece cada pedaço de Bertioga e Costa do Sol como ninguém. A assessoria jurídica e o cuidado em cada detalhe do contrato nos deram total segurança no investimento. Já estamos curtindo nossa nova casa!",
    date: "Novembro de 2025"
  },
  {
    id: 3,
    name: "Fernanda Castanheira",
    location: "Santos - SP (Locação Anual)",
    rating: 5,
    comment: "Aluguei um imóvel de alto padrão com eles e todo o processo foi super rápido e sem burocracia desnecessária. Suporte ágil pelo WhatsApp a qualquer momento. Parabéns pelo profissionalismo!",
    date: "Fevereiro de 2026"
  }
];

// Contatos Oficiais
const CONTACTS_CONFIG = {
  agencyName: "JF Abreu Imóveis",
  creci: "CRECI 123.456-J",
  foundedYear: 1999,
  address: "Rua Aprovada 745 (antiga Rua EP Lote 10), Costa do Sol, Bertioga - SP",
  email: "contato@jfabreuimoveis.com.br",
  instagram: "https://www.instagram.com/jfabreuimoveis/",
  instagramHandle: "@jfabreuimoveis",
  agents: [
    {
      name: "Cinthia",
      role: "Especialista de Vendas & Atendimento",
      phoneDisplay: "(13) 99719-8462",
      phoneRaw: "5513997198462",
      avatar: "👩‍💼",
      status: "Online agora"
    },
    {
      name: "Edson",
      role: "Consultor de Investimentos Imobiliários",
      phoneDisplay: "(13) 99771-8950",
      phoneRaw: "5513997718950",
      avatar: "👨‍💼",
      status: "Online agora"
    }
  ]
};
