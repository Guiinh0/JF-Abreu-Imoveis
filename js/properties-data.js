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
    title: "Casa de Praia de Alto Padrão – Boracéia",
    subtitle: "Conforto absoluto a passos da praia e contato íntimo com a natureza",
    purpose: "locacao",
    type: "Casa de Praia",
    price: 12000,
    priceFormatted: "R$ 12.000,00 / mês",
    location: "Boracéia, Bertioga - SP",
    neighborhood: "Boracéia",
    distanceBeach: "150m da Praia",
    bedrooms: 4,
    suites: 4,
    bathrooms: 5,
    parking: 3,
    landArea: "373 m²",
    builtArea: "320 m²",
    featured: true,
    badge: "Locação Anual",
    image: "assets/properties/bairro-boraceia.jpg",
    gallery: [
      "assets/properties/bairro-boraceia.jpg",
      "assets/properties/ref-002.jpg",
      "assets/properties/ref-004.jpg"
    ],
    description: "Residência sofisticada em Boracéia para locação anual que harmoniza privacidade, elegância e comodidade. São 4 amplas suítes climatizadas, sala em múltiplos ambientes banhada por luz natural e área de lazer privativa com piscina e churrasqueira, situada em condomínio tranquilo com acesso rápido à praia.",
    features: [
      "4 Suítes Espaçosas",
      "Piscina Privativa com Cascata",
      "Varanda Gourmet Integrada",
      "Jardim com Paisagismo Tropical",
      "Cozinha Planejada Completa",
      "Garagem Coberta para 3 Carros",
      "Portaria com Segurança 24h"
    ]
  }
];

// Sincronização automática de dados para o catálogo limpo
const DATA_VERSION = 'v2_clean_2props';
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (localStorage.getItem('jf_data_version') !== DATA_VERSION) {
      localStorage.setItem('jf_data_version', DATA_VERSION);
      localStorage.removeItem('jf_clear_base');
      localStorage.removeItem('jf_deleted_refs');
      localStorage.removeItem('jf_custom_properties');
      if (window.sessionStorage) {
        sessionStorage.removeItem('jf_last_saved_property');
      }
    }
  }
} catch (e) {}

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
    id: "boraceia",
    name: "Boracéia",
    filterKey: "Boracéia",
    tagline: "Praia exuberante, tranquilidade e contato com a natureza",
    image: "assets/properties/bairro-boraceia.jpg",
    description: "Praia ampla de areias douradas e águas cristalinas, com condomínios fechados tranquilos e cercados pela rica vegetação nativa da Mata Atlântica."
  },
  {
    id: "costa-do-sol",
    name: "Costa do Sol",
    filterKey: "Costa do Sol",
    tagline: "Condomínio fechado com praias preservadas e segurança total",
    image: "assets/properties/ref-001.webp",
    description: "Bairro nobre e planejado no litoral de Bertioga, caracterizado por ruas tranquilas, preservação ambiental e residências de alto padrão a poucos passos do mar."
  },
  {
    id: "indaia",
    name: "Indaiá",
    filterKey: "Indaiá",
    tagline: "Mar calmo, orla ampla e excelente infraestrutura familiar",
    image: "assets/properties/bairro-indaia.jpg",
    description: "Região com enseada de mar calmo ideal para banho e esportes náuticos, orla revitalizada e arborizada, além de ótimas opções gastronômicas."
  },
  {
    id: "riviera",
    name: "Riviera de São Lourenço",
    filterKey: "Riviera",
    tagline: "O maior e mais sofisticado complexo planejado do litoral",
    image: "assets/properties/ref-005.jpg",
    description: "Referência em sustentabilidade e infraestrutura de ponta, shopping centers, quadras de tênis, campo de golfe e segurança 24h rigorosa."
  },
  {
    id: "guaruja",
    name: "Guarujá",
    filterKey: "Guarujá",
    tagline: "A Pérola do Atlântico: mansões à beira-mar e requinte",
    image: "assets/properties/bairro-guaruja.jpg",
    description: "Litoral consagrado com condomínios de alto padrão como Pernambuco e Acapulco, mansões em encostas com vista panorâmica para o mar e marinas."
  },
  {
    id: "mogi-das-cruzes",
    name: "Mogi das Cruzes",
    filterKey: "Mogi das Cruzes",
    tagline: "Condomínios fechados nobres, ar puro e conexão serra-mar",
    image: "assets/properties/bairro-mogi.jpg",
    description: "Imóveis de alto padrão em condomínios renomados (como Aruã), cercados de verde, segurança total e fácil acesso entre a capital e o litoral."
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
