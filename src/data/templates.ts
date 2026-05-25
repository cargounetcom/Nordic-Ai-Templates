/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DesignTemplate {
  id: string;
  name: string;
  category: 'Furniture' | 'Jewelry' | 'Luxury' | 'Apothecary' | 'Fashion' | 'Ceramics' | 'Design Space';
  platform: 'WooCommerce' | 'Shopify' | 'Next.js' | 'Webflow';
  style: 'warm_scandinavian' | 'brutalist_copenhagen';
  tagline: string;
  price: string;
  fonts: {
    display: string;
    body: string;
  };
  colors: {
    bg: string;
    text: string;
    accent: string;
  };
  philosophy: string;
  items: {
    name: string;
    price: string;
    category: string;
    description: string;
    number: string;
  }[];
}

export const FiftyNordicTemplates: DesignTemplate[] = [
  // --- REMIXED & INSTALLED PREMIUM CORES ---
  {
    id: "tpl-remix-01",
    name: "NORDIC STORE (TAILWIND)",
    category: "Furniture",
    platform: "Next.js",
    style: "warm_scandinavian",
    tagline: "Clean Geometric Ecommerce & Minimalist Grids",
    price: "€89",
    fonts: { display: "Space Grotesk", body: "Inter" },
    colors: { bg: "#FCFCFA", text: "#1A1A1A", accent: "#3B82F6" },
    philosophy: "Inspired by Tailwind Toolbox's classic Nordic Store layout with bright high contrast product highlights and direct responsive masonry grids.",
    items: [
      { name: "Vinter Wooden Stool", price: "145", category: "Seating", description: "Rustic solid ash stool designed for cozy corners.", number: "01" },
      { name: "Fjord Nordic Lamp", price: "89", category: "Lighting", description: "Sleek geometric frosted glass pendant lamp.", number: "02" },
      { name: "Nordic Wireframe Basket", price: "45", category: "Objects", description: "Minimalist chrome-coated waste and fruit container.", number: "03" }
    ]
  },
  {
    id: "tpl-remix-02",
    name: "METRIC DESIGN OSLO",
    category: "Design Space",
    platform: "Next.js",
    style: "brutalist_copenhagen",
    tagline: "Prestigious Editorial Type & Structural Branding",
    price: "€149",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#0E0E10", text: "#F3F4F6", accent: "#FA4616" },
    philosophy: "Impeccable Norwegian typography and structural alignment based on Metric Design's studio layouts, blending raw editorial scale and geometric spacing.",
    items: [
      { name: "Metric Brand Identity Book", price: "280", category: "Publications", description: "Monolithic physical book of visual systems and identity grids.", number: "01" },
      { name: "Type Specimen Poster Block", price: "95", category: "Prints", description: "Limited letterpress print of custom municipal Grotesk styles.", number: "02" },
      { name: "Editorial Layout Grid Frame", price: "160", category: "Display", description: "Sleek black anodized frame to project layout proportions.", number: "03" }
    ]
  },
  {
    id: "tpl-remix-03",
    name: "SAVOY NORDIC",
    category: "Luxury",
    platform: "Shopify",
    style: "warm_scandinavian",
    tagline: "Refined Luxury Storefront & Elite Minimalist Aesthetics",
    price: "€129",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#FAF8F5", text: "#222222", accent: "#9D846F" },
    philosophy: "High-end curated boutique aesthetic inspired by Savoy's elegant Scandinavian retail layout with serene product cards and timeless beige tones.",
    items: [
      { name: "Savoy Lounge Chair Elite", price: "1850", category: "Seating", description: "Bespoke handsewn linen upholstery on premium oiled maple.", number: "01" },
      { name: "Clay Scented Candle Wax", price: "65", category: "Apothecary", description: "Organic beeswax infused with cedar, woodsmoke, and Nordic rain.", number: "02" },
      { name: "Atelier Woven Linen Wrap", price: "220", category: "Apparel", description: "Raw natural flax linen lightweight shawl with frayed hems.", number: "03" }
    ]
  },
  {
    id: "tpl-remix-04",
    name: "ATELIER MOND",
    category: "Ceramics",
    platform: "Webflow",
    style: "warm_scandinavian",
    tagline: "Bespoke Printshop Editorial & Rich Graphic Craft",
    price: "€99",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#F4EFEA", text: "#3C3228", accent: "#C8102E" },
    philosophy: "Capturing Swiss-German precise crafting, heavy artistic serifs, and high-impact custom color block panels characteristic of Atelier Mond's physical art store.",
    items: [
      { name: "Mond Custom Monograph Print", price: "180", category: "Prints", description: "Heavy textured canvas paper sheet celebrating typography limits.", number: "01" },
      { name: "Chalk Terracotta Vessel", price: "340", category: "Ceramics", description: "Rough hand-thrown Swiss clay vase with raw lime powder wash.", number: "02" },
      { name: "Atelier Solid Gold Monogram", price: "750", category: "Jewelry", description: "18k solid yellow gold customized letterpress seal necklace.", number: "03" }
    ]
  },
  {
    id: "tpl-remix-05",
    name: "NORDIC_MADE AGENCY",
    category: "Fashion",
    platform: "Shopify",
    style: "brutalist_copenhagen",
    tagline: "Elite Boutique Engineering & Creative Shop Storefronts",
    price: "€119",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#1C1C1E", text: "#E5E5EA", accent: "#10B981" },
    philosophy: "Representing Nordic Made's sleek digital agency product design with strict border-grids, professional code indicators, and technical elegance.",
    items: [
      { name: "Nordic Made Technical Parka", price: "410", category: "Apparel", description: "Seam-sealed weatherproof shell finished in matte basalt grey.", number: "01" },
      { name: "Steel Utility Clip Organizer", price: "38", category: "Objects", description: "Heavy spring-steel belt organizer with laser-etched branding.", number: "02" },
      { name: "Copenhagen Spatial Canvas Block", price: "190", category: "Objects", description: "Architectural raw plaster acoustic panel for home studies.", number: "03" }
    ]
  },

  // --- FURNITURE ---
  {
    id: "tpl-01",
    name: "STUDIO NORDÖ",
    category: "Furniture",
    platform: "WooCommerce",
    style: "warm_scandinavian",
    tagline: "Slow Oiled Timber & Sculptural Seats",
    price: "€89",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#FAF8F5", text: "#2C2A27", accent: "#c5a880" },
    philosophy: "Grounded in silence and material permanence, focusing on items that age gracefully with families.",
    items: [
      { name: "ARCH Lounge Chair", price: "€1,280", category: "Seating", description: "Oiled oak frame with premium natural linen webbing.", number: "01" },
      { name: "STAV Lime Plinth", price: "€420", category: "Plinths", description: "Solid lime-washed timber exhibition block.", number: "02" },
      { name: "KÄLLA Clay Vessel", price: "€185", category: "Homeware", description: "Handcrafted rough stoneware bowl.", number: "03" }
    ]
  },
  {
    id: "tpl-02",
    name: "COPENHAGEN_TECHNE",
    category: "Furniture",
    platform: "Shopify",
    style: "brutalist_copenhagen",
    tagline: "Cement Casts & Galvanized Iron",
    price: "€119",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#121212", text: "#F5F5F5", accent: "#FF5500" },
    philosophy: "We reject typical cozy design. We embrace rigid cubical layout grids and weight-bearing structures.",
    items: [
      { name: "CPH_01_REBAR_STOOL", price: "€640", category: "Seating", description: "Oiled solid rebar legs with unpolished concrete seating.", number: "01" },
      { name: "CPH_02_GRID_CONSOLE", price: "€1,890", category: "Shelving", description: "Laser-cut galvanized steel frame with glass grids.", number: "02" },
      { name: "CPH_03_RAW_CYLINDER", price: "€125", category: "Deskware", description: "Hollowed raw granite container with wire marks.", number: "03" }
    ]
  },
  {
    id: "tpl-03",
    name: "ÖLAND ATELIER",
    category: "Furniture",
    platform: "WooCommerce",
    style: "warm_scandinavian",
    tagline: "Limestone Tables & Woven Paper Cord",
    price: "€95",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#F4F0EA", text: "#332F2B", accent: "#AD9475" },
    philosophy: "Honoring the rocky shores of Öland with hand-quarried limestone and timeless Danish paper-cord weaves.",
    items: [
      { name: "ÖLAND Rock Bench", price: "€1,450", category: "Benches", description: "Fine-chiseled solid limestone top on thick ash legs.", number: "01" },
      { name: "KORN Woven Stool", price: "€310", category: "Stools", description: "Danish paper cord hand-woven over FSC beechwood.", number: "02" },
      { name: "STRAND Sand Sconce", price: "€220", category: "Lighting", description: "Wall lamp fabricated from textured sea-sand slurry.", number: "03" }
    ]
  },
  {
    id: "tpl-04",
    name: "KRAFT_WERK_46",
    category: "Furniture",
    platform: "Next.js",
    style: "brutalist_copenhagen",
    tagline: "Anodized Aluminum & Monolithic Rails",
    price: "€149",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#0D0E10", text: "#E5E7EB", accent: "#00E5FF" },
    philosophy: "Industrial-grade home-furnishing modular blocks. Strictly anodized coatings with visible hexagonal screw heads.",
    items: [
      { name: "SYS_46_T_TABLE", price: "€2,100", category: "Dining", description: "Three-piece interlocking anodized steel plate assembly.", number: "01" },
      { name: "SYS_46_WALL_RAIL", price: "€350", category: "Shelving", description: "Modular extruded aluminum rail with sliding brackets.", number: "02" },
      { name: "SYS_46_CEMENT_HEX", price: "€110", category: "Objects", description: "Solid aggregate concrete candle matrix.", number: "03" }
    ]
  },
  {
    id: "tpl-05",
    name: "MALMÖ SNICKERI",
    category: "Furniture",
    platform: "Shopify",
    style: "warm_scandinavian",
    tagline: "Fine Joinery & Untreated White Ash",
    price: "€79",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#FAF9F6", text: "#1F1E1C", accent: "#D1C2AC" },
    philosophy: "Celebrating traditional joints without glue or nails. Exposed tenons and silky ash woods.",
    items: [
      { name: "MALMÖ Mortise Table", price: "€2,400", category: "Tables", description: "Eight-person ash table constructed with wedged tenons.", number: "01" },
      { name: "SVALA Dining Chair", price: "€450", category: "Seating", description: "Minimalist ash chair with sculpted crescent back.", number: "02" },
      { name: "LOG Wood Platter", price: "€75", category: "Tableware", description: "Turned piece from fallen Scania orchard cherrywood.", number: "03" }
    ]
  },

  // --- JEWELRY ---
  {
    id: "tpl-06",
    name: "SÖLV STUDIO",
    category: "Jewelry",
    platform: "WooCommerce",
    style: "warm_scandinavian",
    tagline: "Recycled Sterling Silver & Raw Baltic Amber",
    price: "€69",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#FDFCFC", text: "#242526", accent: "#B2BEB5" },
    philosophy: "Capturing the cold, grey beauty of Baltic coastlines in liquid-like solid silver forms.",
    items: [
      { name: "BALTIC Drop Earring", price: "€140", category: "Earrings", description: "Molten Baltic amber suspended in organic sterling drops.", number: "01" },
      { name: "SÖLV Ribbon Ring", price: "€95", category: "Rings", description: "Thick beaten silver ring with an open raw back.", number: "02" },
      { name: "FJORD Link Choker", price: "€320", category: "Necklaces", description: "Hefty, individually hand-cast sea-battered links.", number: "03" }
    ]
  },
  {
    id: "tpl-07",
    name: "HEAVY_CARAT_LAB",
    category: "Jewelry",
    platform: "Shopify",
    style: "brutalist_copenhagen",
    tagline: "Oxidized Iron Bands & Conflict-Free Minerals",
    price: "€129",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#191919", text: "#EDEDED", accent: "#FFCC00" },
    philosophy: "Anti-delicate jewelry. Heavy industrial carats with blackened, sulfur-treated borders and unpolished gems.",
    items: [
      { name: "IRON_NODE_BAND", price: "€380", category: "Rings", description: "Blackened raw iron ring inset with rough lab-grown quartz.", number: "01" },
      { name: "HEAVY_LINK_BRACELET", price: "€750", category: "Bracelets", description: "Pure dark titanium interlocking link chain.", number: "02" },
      { name: "CUPRUM_WIRE_PENDANT", price: "€230", category: "Pendants", description: "Wrapped industrial copper wire loop on a stark black nylon thread.", number: "03" }
    ]
  },
  {
    id: "tpl-08",
    name: "NORDIC GLÖD",
    category: "Jewelry",
    platform: "Webflow",
    style: "warm_scandinavian",
    tagline: "Hand-forged Yellow Gold & Northern Light Sapphire",
    price: "€149",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#FAF6F0", text: "#3C3530", accent: "#D4AF37" },
    philosophy: "Glow inspired by the winter sun hovering above the snow. Radiant yellow gold paired with deep green stones.",
    items: [
      { name: "FROST Moss Sapphire Ring", price: "€1,800", category: "Rings", description: "18k gold band holding a raw green moss sapphire cluster.", number: "01" },
      { name: "GLÖD Ray Necklace", price: "€890", category: "Necklaces", description: "Delicate hammered gold disk representing the low arctic sun.", number: "02" },
      { name: "ISLAND Stud Earrings", price: "€340", category: "Earrings", description: "Tiny, textured absolute-gold granules reminiscent of volcanic ash.", number: "03" }
    ]
  },
  {
    id: "tpl-09",
    name: "PLUMBUM_CO",
    category: "Jewelry",
    platform: "WooCommerce",
    style: "brutalist_copenhagen",
    tagline: "Unrefined Titanium & Structural Pins",
    price: "€89",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#252627", text: "#F3F3F4", accent: "#C0C0C0" },
    philosophy: "Jewelry designed as wearable construction. No clasps, only functional structural safety pins.",
    items: [
      { name: "PIN_CPH_SAFETY", price: "€190", category: "Pins", description: "Chunky surgical titanium harness pin with stamped serial code.", number: "01" },
      { name: "WIRE_CABLE_CHOKER", price: "€410", category: "Necklaces", description: "Braided high-tensile steel bridge cable with a magnetic bolt lock.", number: "02" },
      { name: "BOLT_EAR_螺丝", price: "€95", category: "Earrings", description: "Single hexagonal earring shaped like a threaded plumbing nut.", number: "03" }
    ]
  },
  {
    id: "tpl-10",
    name: "BERG STONEWORK",
    category: "Jewelry",
    platform: "Shopify",
    style: "warm_scandinavian",
    tagline: "Sea Glass & Raw Granite Carving",
    price: "€75",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#F8F6F4", text: "#2F2D2A", accent: "#9D8470" },
    philosophy: "Honoring Scandinavian pebbles. We polish glass and wrap stones in organic raw hemp and silver wire.",
    items: [
      { name: "BERG Pebble Pendant", price: "€150", category: "Pendants", description: "Smooth sea-washed grey granite pebble framed in pure fine silver.", number: "01" },
      { name: "FALSTER Sea Glass Hook", price: "€120", category: "Earrings", description: "Semi-translucent frosted teal sea glass collected on Falster cliffs.", number: "02" },
      { name: "SKÄRGÅRD Stack Rings", price: "€210", category: "Rings", description: "Trio of silver bands shaped like winding shoreline maps.", number: "03" }
    ]
  },

  // --- LUXURY ---
  {
    id: "tpl-11",
    name: "KÄLLA SPA SUITE",
    category: "Luxury",
    platform: "WooCommerce",
    style: "warm_scandinavian",
    tagline: "Icelandic Silica Therapy & Cedar Tubs",
    price: "€189",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#F5F2EE", text: "#1E1C1A", accent: "#B6A795" },
    philosophy: "We believe luxury is a return to blank slates, quiet steam, and untouched white birch fibers.",
    items: [
      { name: "SILICA Volcanic Clay Mask", price: "€115", category: "Skincare", description: "Active Icelandic thermal ash extract that tightens skin pores.", number: "01" },
      { name: "KÄLLA Essential Essence", price: "€95", category: "Aroma", description: "Cold-pressed coastal pine needle and wet soil extracts.", number: "02" },
      { name: "SAUNA Linen Bath Blanket", price: "€195", category: "Linen", description: "Heavy-gauge, unbleached waffle linen robe crafted in Finland.", number: "03" }
    ]
  },
  {
    id: "tpl-12",
    name: "MONOCHROME_CPH",
    category: "Luxury",
    platform: "Shopify",
    style: "brutalist_copenhagen",
    tagline: "Carbon-Fiber Cases & Matte Hardware",
    price: "€249",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#0B0C0E", text: "#FFFFFF", accent: "#FF3366" },
    philosophy: "Luxury stripped of classical gold filigree. Only matte carbon-fiber sheets and aircraft-grade aluminum.",
    items: [
      { name: "CPH_CARB_BRIEFCASE", price: "€2,450", category: "Bags", description: "0.8mm ultra-light carbon-fiber travel block with numerical steel lock.", number: "01" },
      { name: "CPH_CHRONO_M1", price: "€4,800", category: "Watches", description: "Stark mechanical wrist-chronometer with sandblasted black titanium housing.", number: "02" },
      { name: "CPH_CARD_STEEL_CASE", price: "€195", category: "Wallet", description: "Laser soldered credit card plate box with neon eject spring.", number: "03" }
    ]
  },
  {
    id: "tpl-13",
    name: "SKANDINAVISK APOTHEK",
    category: "Apothecary",
    platform: "Shopify",
    style: "warm_scandinavian",
    tagline: "Raw Botanicals & Clinical Amber Bottles",
    price: "€85",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#FAF5F2", text: "#332A22", accent: "#8A6D55" },
    philosophy: "Distilled organic therapeutic remedies. Packaged in hand-blown brown glass bottles to shield Baltic moss extracts.",
    items: [
      { name: "MOSS Distillation Cream", price: "€85", category: "Botany", description: "Soothing cream for dry skin formulated from lichens of Lapland.", number: "01" },
      { name: "BARK Forest Scent No. 1", price: "€90", category: "Aroma", description: "Smoky birchwood oil blended with wild sweet-gale shrub.", number: "02" },
      { name: "SÄLT Organic Soap Slab", price: "€32", category: "Bath", description: "Rough slab of pink salt soap containing sea weed particles.", number: "03" }
    ]
  },
  {
    id: "tpl-14",
    name: "CYLINDER_LAB",
    category: "Luxury",
    platform: "Next.js",
    style: "brutalist_copenhagen",
    tagline: "Stark Matte Chronometers & Alumina Housings",
    price: "€199",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#1C1D1F", text: "#ECEFF1", accent: "#00FF66" },
    philosophy: "Pure geometric precision timers. No decorative hands, just a scrolling digital drum matrix.",
    items: [
      { name: "TIM_01_REVOLVING_STARK", price: "€1,200", category: "Watches", description: "Matte watch utilizing rotating anodized drums to display Nordic Standard Time.", number: "01" },
      { name: "TIM_02_DESK_PULSE", price: "€650", category: "Clocks", description: "Stark vertical concrete capsule pulse emitting subtle sound cues.", number: "02" },
      { name: "TIM_03_CEMENT_WEIGHT", price: "€140", category: "Paperweight", description: "Perfect 500g cylindrical iron block to secure fine sketchpapers.", number: "03" }
    ]
  },
  {
    id: "tpl-15",
    name: "REYKJAVÍK RITUALS",
    category: "Luxury",
    platform: "Webflow",
    style: "warm_scandinavian",
    tagline: "Geothermal Salt & Dark Moss Apothecary",
    price: "€95",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#F1EFEA", text: "#252729", accent: "#596153" },
    philosophy: "Utilizing mineral-rich volcanic salt and organic wild-grown dark riverbed mosses.",
    items: [
      { name: "VOLCANIC Salt Body Scrub", price: "€68", category: "Skincare", description: "Flakes of geothermal black charcoal basalt salt and sea oil.", number: "01" },
      { name: "RIVERBED Elixir Mask", price: "€110", category: "Spa", description: "Active sediment grey clay packed with minerals from Icelandic geysers.", number: "02" },
      { name: "HERB Infusion Tincture", price: "€45", category: "Toning", description: "A few drops to calm facial stress, brewed with wild sea-chamomile.", number: "03" }
    ]
  },

  // --- ADDITIONAL WORK SYSTEM EXPANSIONS (Templates #16 to #50) ---
  {
    id: "tpl-16",
    name: "OSLO CANDLEWORKS",
    category: "Apothecary",
    platform: "WooCommerce",
    style: "warm_scandinavian",
    tagline: "Organic Soy Wax in Rough Stoneware",
    price: "€59",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#F9F7F4", text: "#2E2D2A", accent: "#A48F70" },
    philosophy: "We pour unrefined organic soy wax into reusable stoneware vessels throwed by hand.",
    items: [
      { name: "SKOG Pine Needle Candle", price: "€45", category: "Candles", description: "Woody notes from Norwegian spruce and cold rain droplets.", number: "01" },
      { name: "FJELL Wild Thyme Melt", price: "€48", category: "Aroma", description: "Mountain moss and dried thyme blended with botanical soy wax.", number: "02" },
      { name: "LYS Stoneware Votive", price: "€75", category: "Vessels", description: "Empty thrown pot to collect custom candle remnants.", number: "03" }
    ]
  },
  {
    id: "tpl-17",
    name: "STARK_TEXT_EDIT",
    category: "Design Space",
    platform: "Next.js",
    style: "brutalist_copenhagen",
    tagline: "Typographic Layouts & Pure White Paper",
    price: "€105",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#F5F5F5", text: "#0F0F0F", accent: "#000000" },
    philosophy: "Typography represents thought. We print raw books with nothing but classic black ink.",
    items: [
      { name: "TYPO_01_RAW_COPH", price: "€45", category: "Posters", description: "Unstretched layout displaying the complete coordinates of CPH Architecture.", number: "01" },
      { name: "TYPO_02_GRID_BOOK", price: "€65", category: "Books", description: "280 pages of blank grid layout maps on rough unbleached offset wood pulp paper.", number: "02" },
      { name: "TYPO_03_METAL_RULER", price: "€120", category: "Metrology", description: "Solid stainless steel heavy printing guide engraved with millimeter metrics.", number: "03" }
    ]
  },
  {
    id: "tpl-18",
    name: "GOTHENBURG WEAVERS",
    category: "Fashion",
    platform: "WooCommerce",
    style: "warm_scandinavian",
    tagline: "Heavy Unwashed Hemp & Organic Wool",
    price: "€110",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#FAF7F2", text: "#3C3A33", accent: "#B69F82" },
    philosophy: "Textiles woven slowly in Scania. Using cold looms and organic fleeces.",
    items: [
      { name: "WEST COAST Wool Throw", price: "€260", category: "Blankets", description: "Heavy grey fleece blanket sourced from Scania heirloom sheep.", number: "01" },
      { name: "HEMP Worker Smock", price: "€195", category: "Apparel", description: "Stiff unwashed hemp shirt designed as a protective workshop garment.", number: "02" },
      { name: "LINEN Hand Drying Cloth", price: "€42", category: "Linen", description: "Coarse flax grid cloth with exceptional natural absorbency.", number: "03" }
    ]
  },
  {
    id: "tpl-19",
    name: "CEMENT_CAST_CO",
    category: "Ceramics",
    platform: "Shopify",
    style: "brutalist_copenhagen",
    tagline: "Industrial Aggregates & Fine Aggregate Air Bubbles",
    price: "€99",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#2E3033", text: "#EBEFF2", accent: "#FFAE00" },
    philosophy: "Unmolded cement blocks containing authentic air bubble marks and structural gravel grains.",
    items: [
      { name: "CEM_CONCRETE_SAUCER", price: "€60", category: "Dishes", description: "Heavy cement base to display ceramic keys or change elements.", number: "01" },
      { name: "CEM_MONOCHROME_POT", price: "€140", category: "Pots", description: "High-grade aggregate drainage cylinder for coastal mosses.", number: "02" },
      { name: "CEM_SQUARE_STAV", price: "€320", category: "Plinths", description: "Massive solid square cuboid designed to stand on warehouse floors.", number: "03" }
    ]
  },
  {
    id: "tpl-20",
    name: "ALICE & OAK",
    category: "Furniture",
    platform: "Webflow",
    style: "warm_scandinavian",
    tagline: "Gentle Curved Plywood & Natural Oil",
    price: "€89",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#FAF9F5", text: "#2E2C29", accent: "#D5BE9E" },
    philosophy: "Curved light plywood panels molded by hand in an old boatyard outside Gothenburg.",
    items: [
      { name: "ALICE Curved Plywood Stool", price: "€280", category: "Stools", description: "Graceful three-legged curved plywood stool.", number: "01" },
      { name: "OAK Floating Shelf", price: "€145", category: "Shelves", description: "Sleek wall rail with hidden steel anchor tabs.", number: "02" },
      { name: "LOG Spruce Bowl", price: "€95", category: "Vessels", description: "Thinly shaving spruce tree rings, finished in clear linseed oil.", number: "03" }
    ]
  },
  {
    id: "tpl-21",
    name: "VECTOR_CPH",
    category: "Design Space",
    platform: "WooCommerce",
    style: "brutalist_copenhagen",
    tagline: "Architectural Blueprints & Heavy Matte Board",
    price: "€120",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#151618", text: "#E1E2E5", accent: "#FF003C" },
    philosophy: "Copenhagen architectural details vector drawings plotted on thick industrial pulp backing.",
    items: [
      { name: "PLT_01_ELEV_CPH_HARBOUR", price: "€90", category: "Posters", description: "Fine detail elevation render of structural container ship crane piers.", number: "01" },
      { name: "PLT_02_MATTE_CARD_FRAME", price: "€150", category: "Frames", description: "Raw galvanized steel frame with flush hex bolts.", number: "02" },
      { name: "PLT_03_METAL_DRAWING_PINS", price: "€35", category: "Pins", description: "Surgical steel pins milled with mechanical knurl friction lines.", number: "03" }
    ]
  },
  {
    id: "tpl-22",
    name: "FALSTER CERAMICS",
    category: "Ceramics",
    platform: "WooCommerce",
    style: "warm_scandinavian",
    tagline: "Raw Dune Sand Glaze & Coarse Clay",
    price: "€69",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#F7F5F0", text: "#222120", accent: "#C1AC95" },
    philosophy: "Mixing Danish dune beach sand directly into liquid volcanic glazes. No two cups share the same color.",
    items: [
      { name: "DUNE Sand Coffee Cup", price: "€42", category: "Drinkware", description: "Sturdy unhandled clay tea cup with rough sand-speckled texture.", number: "01" },
      { name: "FALSTER Pitcher", price: "€160", category: "Tableware", description: "Tall, slender stoneware pitcher finished in high-iron clay wash.", number: "02" },
      { name: "CLIFF Fruit Platter", price: "€110", category: "Plates", description: "Flat slab plate with unglazed rough exterior rims.", number: "03" }
    ]
  },
  {
    id: "tpl-23",
    name: "KRAFT_LINEN",
    category: "Apothecary",
    platform: "Shopify",
    style: "brutalist_copenhagen",
    tagline: "Black Soap & Rough Heavy Flax Mats",
    price: "€85",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#1A1B1C", text: "#ECEFF1", accent: "#00E676" },
    philosophy: "Pure scrub soap brewed with natural birchwood charcoal powder. Strictly minimal packaging wraps.",
    items: [
      { name: "SOAP_CHARCOAL_BLOCK", price: "€30", category: "Bath", description: "Unrefined solid block of deep black charcoal cleansing compound.", number: "01" },
      { name: "HEAVY_FLAX_WEAVE", price: "€55", category: "Linen", description: "Coarse raw flax fiber washing pad for skin cell peeling.", number: "02" },
      { name: "SOAP_DOCK_ANODIZED", price: "€80", category: "Hardware", description: "Extruded gray aluminum slate to secure soap drainage.", number: "03" }
    ]
  },
  {
    id: "tpl-24",
    name: "SILENT APPAREL",
    category: "Fashion",
    platform: "WooCommerce",
    style: "warm_scandinavian",
    tagline: "Undyed Alpaca Sweaters & Soft Hemp Wraps",
    price: "€125",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#FAF8F4", text: "#3A3530", accent: "#CBBAA5" },
    philosophy: "Knitted garments created in traditional looms in a remote Swedish cottage. Left entirely undyed to protect fibers.",
    items: [
      { name: "SILENT Alpaca Knitwear", price: "€320", category: "Knitwear", description: "Boxy sweater of soft undyed silver alpaca fleece threads.", number: "01" },
      { name: "FLAX Lounge Trousers", price: "€180", category: "Apparel", description: "Wide-leg trousers of organic open-weave flax canvas.", number: "02" },
      { name: "SACHET Lavender Linen Packet", price: "€25", category: "Storage", description: "Linen pouch containing dried organic flowers to protect wool.", number: "03" }
    ]
  },
  {
    id: "tpl-25",
    name: "BLOCK_PLINTH_CO",
    category: "Furniture",
    platform: "Shopify",
    style: "brutalist_copenhagen",
    tagline: "Raw Concrete Blocks & Heavy L-Brackets",
    price: "€135",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#2B2C2D", text: "#F5F5F7", accent: "#FF0055" },
    philosophy: "Heavy-duty displays. Utilizing bolted structural L-brackets and aggregate cement cubes.",
    items: [
      { name: "PLI_AGGREGATE_BED_BLOCK", price: "€450", category: "Tables", description: "Massive solid square pedestal block serving as a raw side table.", number: "01" },
      { name: "PLI_STEEL_WALL_ANGLE", price: "€95", category: "Shelving", description: "Heavy sandblasted industrial angle bracket supporting wood planks.", number: "02" },
      { name: "PLI_HEX_TENSION_RATCHET", price: "€65", category: "Tools", description: "Cast-iron ratchet belt to link modular plinths together.", number: "03" }
    ]
  },
  {
    id: "tpl-26",
    name: "HEIRLOOM OAK",
    category: "Furniture",
    platform: "WooCommerce",
    style: "warm_scandinavian",
    tagline: "Solid Swedish Heartwood Cabinets",
    price: "€180",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#F8F5F2", text: "#2C2825", accent: "#B29C83" },
    philosophy: "Using massive 150-year-old fallen Swedish oaks. Timeless joints that look beautiful generations after.",
    items: [
      { name: "HEIRLOOM Oak Credenza", price: "€3,400", category: "Cabinets", description: "Massive solid oak side cabinet featuring seamless sliding doors.", number: "01" },
      { name: "SLATE Stoneware Handle", price: "€65", category: "Hardware", description: "Chipped stone latch handles to mount on personal carpentry projects.", number: "02" },
      { name: "OAK Scent Wax block", price: "€35", category: "Aroma", description: "Oak honey and wax brick to buff and seal solid raw wood grain.", number: "03" }
    ]
  },
  {
    id: "tpl-27",
    name: "STATION_CPH_CLOCK",
    category: "Luxury",
    platform: "Shopify",
    style: "brutalist_copenhagen",
    tagline: "Shorn Metal Frames & Revolving Drums",
    price: "€179",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#131415", text: "#EEF0F2", accent: "#FFA726" },
    philosophy: "We split hours into precise ticking numbers. Stark layout based on rail yard clocks.",
    items: [
      { name: "CLK_01_WALL_METRIC", price: "€480", category: "Clocks", description: "Oversized mechanical direct-current drum dial styled with raw copper bezels.", number: "01" },
      { name: "CLK_02_TRAVEL_CYL", price: "€210", category: "Watches", description: "Pill-like brushed aluminum travel alarm container with rolling dial rings.", number: "02" },
      { name: "CLK_03_METAL_STAND_BASE", price: "€85", category: "Stands", description: "Stark heavy brass base to elevate mechanical train timers.", number: "03" }
    ]
  },
  {
    id: "tpl-28",
    name: "GOTLAND FLEECE",
    category: "Fashion",
    platform: "Shopify",
    style: "warm_scandinavian",
    tagline: "Curly Grey Sheepskins & Hand-looms",
    price: "€115",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#F7F6F3", text: "#31302D", accent: "#AF9B83" },
    philosophy: "Ethically sheared curly wool fleeces from sheep of Gotland's green pastures.",
    items: [
      { name: "GOTLAND Curly Sheepskin Thr", price: "€290", category: "Hides", description: "Ultra-thick, un-dyed grey curly sheepskin throw for chairs.", number: "01" },
      { name: "ROVE Wool Blanket Yarn", price: "€85", category: "Yarns", description: "1.2kg spool of hand-spun raw roving yarn for heavy knit projects.", number: "02" },
      { name: "SLIPPERS Felted Wool Pod", price: "€110", category: "Footwear", description: "Cozy felted slippers crafted using local sea-water moss wash.", number: "03" }
    ]
  },
  {
    id: "tpl-29",
    name: "TERMINAL_BOOK_LAB",
    category: "Design Space",
    platform: "Webflow",
    style: "brutalist_copenhagen",
    tagline: "High-contrast Typography & Zinc Bookends",
    price: "€95",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#FDFDFD", text: "#111111", accent: "#0055FF" },
    philosophy: "Book design reduced to raw layout specs. Structured offset inks printed on raw cardboard folders.",
    items: [
      { name: "LAB_01_CPH_REPORT", price: "€40", category: "Magazines", description: "A photo essay recording under-bridge brutalist concrete pillars of Denmark.", number: "01" },
      { name: "LAB_02_ZINC_ANGLE_LOCK", price: "€160", category: "Metals", description: "Thick folded scrap zinc angle sheet that serves as a weighted bookend.", number: "02" },
      { name: "LAB_03_STAMP_MARK_INK", price: "€32", category: "Office", description: "Industrial waterproof black ink pad and custom initial stamps.", number: "03" }
    ]
  },
  {
    id: "tpl-30",
    name: "SVALBARD BOTANY",
    category: "Apothecary",
    platform: "WooCommerce",
    style: "warm_scandinavian",
    tagline: "Frozen Arctic Moss & Sea-kelp Moisturizers",
    price: "€95",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#F4F6F4", text: "#2A2E2A", accent: "#637D63" },
    philosophy: "Active anti-oxidant elements extracted under strict guidelines from remote polar lichens.",
    items: [
      { name: "POLAR Lichen Lip Lip Balm", price: "€35", category: "Balms", description: "Protective balm of wild Svalbard berry wax and polar flower oils.", number: "01" },
      { name: "KELP Ocean Foam Cleanse", price: "€75", category: "Bath", description: "Gentle soap wash derived from deep sea kelp forests, lightly salted.", number: "02" },
      { name: "SVALBARDR Vaporizer Fluid", price: "€65", category: "Aroma", description: "Air essence blend replicating frozen glacier wind and wet pebble moss.", number: "03" }
    ]
  },
  {
    id: "tpl-31",
    name: "REBAR_WALL_SHELF",
    category: "Furniture",
    platform: "Shopify",
    style: "brutalist_copenhagen",
    tagline: "Corrugated Concrete Reinforcement Bars",
    price: "€110",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#1D1E20", text: "#ECEFF1", accent: "#FF8F00" },
    philosophy: "Turning structural industrial scrap metal into elegant, rigid household frames.",
    items: [
      { name: "REB_HEAVY_PLANK_SHELF", price: "€390", category: "Shelving", description: "Two parallel raw structural iron rebars holding a burnt pine board.", number: "01" },
      { name: "REB_THREAD_S_HOOK", price: "€30", category: "Hooks", description: "S-hook bent by torch from actual 8mm high-grip building rebar steel.", number: "02" },
      { name: "REB_CONCRETE_BASE_LAMP", price: "€180", category: "Lighting", description: "Stark industrial porcelain lamp socket elevated by a curved rebar stand.", number: "03" }
    ]
  },
  {
    id: "tpl-32",
    name: "ÖSTERLEN LEATHER",
    category: "Fashion",
    platform: "WooCommerce",
    style: "warm_scandinavian",
    tagline: "Vegetable Tanned Hides & Linen Handsewing",
    price: "€140",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#FAF6F1", text: "#38312B", accent: "#C49A6C" },
    philosophy: "We hand-cut organic vegetable-tanned cowhides from Scania, sewing pieces with thick wax thread.",
    items: [
      { name: "ÖSTERLEN Workshop Apron", price: "€310", category: "Apparel", description: "Full-grain heavy canvas apron with solid oiled leather straps and brass snaps.", number: "01" },
      { name: "SADDLE Simple Card Slot", price: "€70", category: "Wallet", description: "Single-piece folded leather card folder that deepens to copper brown.", number: "02" },
      { name: "WAX Honey Thread Spool", price: "€24", category: "Tools", description: "Beeswax block harvested locally to grease handsewing linen yarn.", number: "03" }
    ]
  },
  {
    id: "tpl-33",
    name: "GRID_METAL_Atelier",
    category: "Design Space",
    platform: "Shopify",
    style: "brutalist_copenhagen",
    tagline: "Expanded Metal Screens & Linear Shadows",
    price: "€119",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#0E0E10", text: "#F1F2F3", accent: "#00E5FF" },
    philosophy: "Using perforated screen patterns to split light into digital-like square shadow streams.",
    items: [
      { name: "GRD_EXPANDED_CABINET", price: "€1,650", category: "Cabinets", description: "Perforated wire mesh industrial case which filters home outlines.", number: "01" },
      { name: "GRD_PERF_PENDANT_LAMP", price: "€420", category: "Lighting", description: "Laser steel cylinder throwing grid patterns across empty floorboards.", number: "02" },
      { name: "GRD_SQUARE_DRAIN_BOARD", price: "€85", category: "Tableware", description: "Industrial wire rack to clean raw stoneware mugs post wash.", number: "03" }
    ]
  },
  {
    id: "tpl-34",
    name: "SKÄR GARDEN OBJECTS",
    category: "Ceramics",
    platform: "WooCommerce",
    style: "warm_scandinavian",
    tagline: "Coarse Granite Pots & Rusted Iron Stands",
    price: "€79",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#FBF9F6", text: "#312F2C", accent: "#A28469" },
    philosophy: "Exquisite items crafted to be weathered outside by sea salt, moss, cold rain, and low autumn wind.",
    items: [
      { name: "SKÄR Chiseled Basin", price: "€480", category: "Garden", description: "Heavy solid granite sink block chiselled with longitudinal stone ridges.", number: "01" },
      { name: "RUST Iron Flower Tri-leg", price: "€150", category: "Stands", description: "Three interlocking unpainted iron rods designed to rust beautifully on lawns.", number: "02" },
      { name: "MOSS Harvest Baltic Basket", price: "€95", category: "Baskets", description: "Split wood basket woven from resilient Norwegian pine splints.", number: "03" }
    ]
  },
  {
    id: "tpl-35",
    name: "CAST_TITANIUM_LAB",
    category: "Jewelry",
    platform: "Next.js",
    style: "brutalist_copenhagen",
    tagline: "Anodized Grey Metal & Surgical Needles",
    price: "€159",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#1D1E1F", text: "#FFFFFF", accent: "#FF00FF" },
    philosophy: "Absolute durability. No gold plating, only sand-blasted pure grey titanium structures.",
    items: [
      { name: "TIT_01_RAW_LOCK_RING", price: "€290", category: "Rings", description: "Deep grooves cut by laser directly into architectural grade titanium cylinder.", number: "01" },
      { name: "TIT_02_MEDICAL_BAR_PIN", price: "€180", category: "Pins", description: "Stark lock bar shaped like a bone pin with micro stamped serial grid.", number: "02" },
      { name: "TIT_03_WIRE_LOO_BRACELET", price: "€450", category: "Bracelets", description: "Hard springy titanium wire loops that secure via raw metric clasp.", number: "03" }
    ]
  },
  {
    id: "tpl-36",
    name: "SILENT WEAVER CO",
    category: "Fashion",
    platform: "Webflow",
    style: "warm_scandinavian",
    tagline: "Finnish Nettle Weaves & Grey Linen Hats",
    price: "€89",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#F8F5F2", text: "#2E2A27", accent: "#9D8D7B" },
    philosophy: "Weaving robust garments using ancient stinging nettle fibers. Beautiful rough drapes and extreme strength.",
    items: [
      { name: "NETTLE Workshop Kimono", price: "€380", category: "Apparel", description: "Unisex coat woven from organic wild Finnish mountain nettles and flax.", number: "01" },
      { name: "SÖDRA Straw Bucket Hat", price: "€110", category: "Headwear", description: "Stitch hat braided slowly from golden Scania winter rye stalks.", number: "02" },
      { name: "CORD Waxed Sash Belt", price: "€45", category: "Accessories", description: "Heavy linen braid sash soaked in waterproofing pine honey compound.", number: "03" }
    ]
  },
  {
    id: "tpl-37",
    name: "MONO_SQUARE_SYS",
    category: "Furniture",
    platform: "WooCommerce",
    style: "brutalist_copenhagen",
    tagline: "Extruded Square Tubes & Rigid Bolt Joints",
    price: "€129",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#1B1C1D", text: "#F3F4F5", accent: "#7D8C99" },
    philosophy: "Furniture system based entirely on 25x25mm square steel tube profiles and exposed hex couplers.",
    items: [
      { name: "SQR_01_WORK_FRAME_DESK", price: "€1,280", category: "Tables", description: "Office table crafted block with square powder-coated steel tubes.", number: "01" },
      { name: "SQR_02_MODULAR_GRID_SHELF", price: "€690", category: "Shelving", description: "Four-level freestanding steel shelf block holding raw pine planks.", number: "02" },
      { name: "SQR_03_TUBE_COUPLER_BOX", price: "€45", category: "Accessories", description: "Trio of sand-cast aluminum adapters to lock square home elements.", number: "03" }
    ]
  },
  {
    id: "tpl-38",
    name: "HEMTREVNAD",
    category: "Luxury",
    platform: "Shopify",
    style: "warm_scandinavian",
    tagline: "Swedish Linden Wood Toys & Honey Soaps",
    price: "€79",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#FAF7F3", text: "#2B2824", accent: "#E59A5F" },
    philosophy: "Creating warmth (Hemtrevnad) in cold winters. Natural beeswax candles and wooden block puzzles.",
    items: [
      { name: "PUZZLE Alderwood Cabin Blocks", price: "€95", category: "Objects", description: "Six hand-carved nesting geometric blocks in sweet linden timber.", number: "01" },
      { name: "WAX Raw Forest Honey Candle", price: "€38", category: "Candles", description: "Pure honey wax candle releasing mild, sweet forest heather notes.", number: "02" },
      { name: "HEM Organic Linen Apron", price: "€85", category: "Kitchen", description: "Kitchen cover spun from natural flax linen fibers with dual box pockets.", number: "03" }
    ]
  },
  {
    id: "tpl-39",
    name: "PULSE_CABLE_CPH",
    category: "Jewelry",
    platform: "Shopify",
    style: "brutalist_copenhagen",
    tagline: "Sandblasted Silicon Bands & Brass Spikes",
    price: "€115",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#0D0E0F", text: "#F3F3F5", accent: "#FFFF00" },
    philosophy: "Interlocking electrical-looking hardware jewelry. Sandblasted industrial silicon tubes and raw heavy brass locks.",
    items: [
      { name: "PLS_SILICON_CHOKE", price: "€210", category: "Necklaces", description: "Matte black thick silicone cord with a solid knurled lock clasp.", number: "01" },
      { name: "PLS_BRASS_HEX_STUDS", price: "€95", category: "Earrings", description: "Threaded brass rods that bolt directly into unshielded metal threads.", number: "02" },
      { name: "PLS_METRIC_BAND", price: "€140", category: "Rings", description: "Deep laser cut ring highlighting metric increments of 1mm.", number: "03" }
    ]
  },
  {
    id: "tpl-40",
    name: "FJORD APOTHEK",
    category: "Apothecary",
    platform: "WooCommerce",
    style: "warm_scandinavian",
    tagline: "Ocean Salt & Cold-Distilled Sea Buckthorn",
    price: "€89",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#FAF8F5", text: "#242E28", accent: "#79A18E" },
    philosophy: "Healing compounds utilizing vitamin-rich orange sea buckthorn berries harvested on Baltic rocks.",
    items: [
      { name: "BUCKTHORN Facial Serum Oil", price: "€95", category: "Skincare", description: "Bright orange oil cold-extracted to replenish cells overnight.", number: "01" },
      { name: "OCEAN Salt Soap Slabs", price: "€30", category: "Bath", description: "Moisturizing bar loaded with sand minerals and coastal birch sap.", number: "02" },
      { name: "FJORD Bergamot Mist", price: "€58", category: "Aroma", description: "Scent mist with notes of wet cliff slate, salty wind, and wild orange herb.", number: "03" }
    ]
  },
  {
    id: "tpl-41",
    name: "STEEL_RAIL_DESIGNS",
    category: "Furniture",
    platform: "Next.js",
    style: "brutalist_copenhagen",
    tagline: "Industrial Galvanized Steel T-Profiles",
    price: "€149",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#1D1D1E", text: "#ECEFF1", accent: "#FF1744" },
    philosophy: "High tensile metal frames based on warehouse shelving profiles. Pure silver zinc coating.",
    items: [
      { name: "GALV_MODULAR_PLINTH", price: "€480", category: "Furniture", description: "Three-tier stackable zinc-coated display table which locks with mechanical rivets.", number: "01" },
      { name: "GALV_HEAVY_CLAMP_RAIL", price: "€110", category: "Shelving", description: "Galvanized iron rack holder that clamps directly to tables.", number: "02" },
      { name: "GALV_INDUSTRIAL_TRAY", price: "€65", category: "Storage", description: "Raw folded iron sorting basket with sturdy steel carrying loops.", number: "03" }
    ]
  },
  {
    id: "tpl-42",
    name: "ÖLAND BLOCK WORK",
    category: "Furniture",
    platform: "Webflow",
    style: "warm_scandinavian",
    tagline: "Raw-sawn Limestone Plinths & Timber",
    price: "€160",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#FAF7F2", text: "#34302C", accent: "#C19B72" },
    philosophy: "Honoring traditional Öland stonecutters. Beautiful limestone slabs nested inside heavy ash frames.",
    items: [
      { name: "ÖLAND Block Sofa Table", price: "€1,850", category: "Tables", description: "Massive block of solid honed limestone supported by ash-wood beams.", number: "01" },
      { name: "SAND Sconce Lamp Box", price: "€240", category: "Lighting", description: "Stony wall light container crafted from raw sea-shell aggregate paste.", number: "02" },
      { name: "ÖL Solid Wood Bowl", price: "€95", category: "Vessels", description: "Hand-shaved solid Swedish cherrywood platter with organic edge grain.", number: "03" }
    ]
  },
  {
    id: "tpl-43",
    name: "COPENHAGEN_L_UNIT",
    category: "Design Space",
    platform: "Shopify",
    style: "brutalist_copenhagen",
    tagline: "Raw Concrete Modular L-Blocks",
    price: "€110",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#2E2F30", text: "#EDEDEF", accent: "#E0E0E0" },
    philosophy: "Modular home building elements focusing on heavy interlocking cement blocks.",
    items: [
      { name: "CEM_L_UNIT_DISPLAY", price: "€320", category: "Benches", description: "Interlocking aggregate concrete corner block serving as stool or shelving element.", number: "01" },
      { name: "CEM_SQUARE_BRUT_VOTIV", price: "€60", category: "Votive", description: "Stark heavy cube container for solid candle wax frames.", number: "02" },
      { name: "CEM_LOCK_TENSION_CORD", price: "€40", category: "Hardware", description: "Heavy-duty wire rope lock with aluminum metric sleeve.", number: "03" }
    ]
  },
  {
    id: "tpl-44",
    name: "VISBY KNITWEAR",
    category: "Fashion",
    platform: "WooCommerce",
    style: "warm_scandinavian",
    tagline: "Finnish Sheep Fleeces & Undyed Linen Throws",
    price: "€119",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#FAF9F5", text: "#2E2C29", accent: "#CABAA5" },
    philosophy: "Sourcing wool from hereditary Visby sheep. Hand-knitted sweeps that resist polar wind currents.",
    items: [
      { name: "VISBY Frost Cardigan", price: "€380", category: "Knitwear", description: "Heavy ribbed knit jacket featuring beautiful organic horn toggle loops.", number: "01" },
      { name: "HEMP Worker Sweatpants", price: "€170", category: "Apparel", description: "Relaxed-fit lounge pants woven from unrefined Visby raw canvas fibers.", number: "02" },
      { name: "VISB Herb Aroma Wax block", price: "€30", category: "Aroma", description: "Sall-water moss scent tablet designed to secure heirloom wardrobes.", number: "03" }
    ]
  },
  {
    id: "tpl-45",
    name: "OXIDE_METAL_LAB",
    category: "Jewelry",
    platform: "Shopify",
    style: "brutalist_copenhagen",
    tagline: "Acid-Etched Copper & Stamped Rims",
    price: "€99",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#131415", text: "#EBEFF2", accent: "#00E676" },
    philosophy: "Embracing natural sulfur oxide and industrial copper chemistry. Stamped layout tags.",
    items: [
      { name: "OX_SULFUR_SLAB_BAND", price: "€210", category: "Rings", description: "Thick beaten copper block band treated with acid sulfide for volcanic black rims.", number: "01" },
      { name: "OX_WIRE_HARNESS_LOCK", price: "€390", category: "Necklaces", description: "Hammered copper loop hanging from double industrial insulated cord.", number: "02" },
      { name: "OX_HEX_COUPLING_STUDS", price: "€85", category: "Earrings", description: "Milled heavy couplings which turn to oxidized green post ocean breeze interaction.", number: "03" }
    ]
  },
  {
    id: "tpl-46",
    name: "SILENT WEAVE LAB",
    category: "Fashion",
    platform: "Webflow",
    style: "warm_scandinavian",
    tagline: "Finnish Nettle Fibers & Grey Linen Gowns",
    price: "€95",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#FAF5F1", text: "#34302B", accent: "#A5947F" },
    philosophy: "We weave garments using ancient stinging nettle fibers. Beautiful raw gray textures with structural details.",
    items: [
      { name: "NETTLE Organic Trench", price: "€450", category: "Apparel", description: "Long overcoat crafted with wild Baltic nettle fibers and unbleached flax threads.", number: "01" },
      { name: "ÖSTER Simple Linen Scarf", price: "€110", category: "Apparel", description: "Lightweight coarse open-weave scarf finished with organic fray borders.", number: "02" },
      { name: "HEMP Knot Utility Belt", price: "€50", category: "Accessories", description: "Sturdy braided rope belt that loops around tailoring layers.", number: "03" }
    ]
  },
  {
    id: "tpl-47",
    name: "ANODIZED_STEEL_SYS",
    category: "Furniture",
    platform: "Shopify",
    style: "brutalist_copenhagen",
    tagline: "Extruded Square Tubes & Rigid Bolt Couplers",
    price: "€139",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#1F2021", text: "#EEF2F5", accent: "#90A4AE" },
    philosophy: "Bore furniture system constructed with standard extruded steel tubes and high-pressure bolts.",
    items: [
      { name: "AN_01_HEX_BOLT_TABLE", price: "€1,350", category: "Tables", description: "Rigid modular desk constructed with black galvanized structural pipes.", number: "01" },
      { name: "AN_02_WALL_GRID_PROFILES", price: "€420", category: "Shelving", description: "Laser-cut vertical layout grids designed to anchor high-tensile cement trays.", number: "02" },
      { name: "AN_03_COUPLER_ADJUSTER", price: "€50", category: "Tools", description: "Threaded high-friction industrial bracket designed to link custom steel elements.", number: "03" }
    ]
  },
  {
    id: "tpl-48",
    name: "MOSS APOTHECARY",
    category: "Apothecary",
    platform: "WooCommerce",
    style: "warm_scandinavian",
    tagline: "Volcanic Mineral Powders & Lichen Creams",
    price: "€59",
    fonts: { display: "Playfair Display", body: "Inter" },
    colors: { bg: "#F8F7F3", text: "#222521", accent: "#718E66" },
    philosophy: "Healing facial creams extracted under clean guidelines from Arctic lichens and soil extracts.",
    items: [
      { name: "MOSS Cold-Heated Cream", price: "€85", category: "Skincare", description: "Hydrating ointment formulated from wild Lapland moss and cloudberry oils.", number: "01" },
      { name: "VOLCAN Volcanic Sand Wash", price: "€32", category: "Bath", description: "Body scrubbing bar packed with fine-milled volcanic sand minerals.", number: "02" },
      { name: "AROMA Polar Spruce Drops", price: "€45", category: "Aroma", description: "Warm timber and frozen rain droplet scent for therapeutic room vaporizers.", number: "03" }
    ]
  },
  {
    id: "tpl-49",
    name: "DOCK_CPH_SHELVING",
    category: "Furniture",
    platform: "Shopify",
    style: "brutalist_copenhagen",
    tagline: "Galvanized Steel Shelves & Expanding Sleeve Anchors",
    price: "€125",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#161719", text: "#F3F4F6", accent: "#00FF66" },
    philosophy: "Brutalist industrial steel shelves based on Copenhagen dockyard container warehouses.",
    items: [
      { name: "DK_01_HEAVY_ZINC_SHELF", price: "€490", category: "Furniture", description: "Heavy-gauge galvanized steel shelf block featuring expanding chemical anchor couplers.", number: "01" },
      { name: "DK_02_BOLU_PLATE_CLAMP", price: "€85", category: "Shelving", description: "Galvanized iron plate bracket to anchor shelves directly to masonry walls.", number: "02" },
      { name: "DK_03_WIRE_SORTING_CRATE", price: "€60", category: "Storage", description: "Foldable steel cable organizer basket finished in bright chrome enamel.", number: "03" }
    ]
  },
  {
    id: "tpl-50",
    name: "REYKJAVÍK BRUT",
    category: "Luxury",
    platform: "Webflow",
    style: "brutalist_copenhagen",
    tagline: "Interlocking Cast Concrete Sculptures",
    price: "€210",
    fonts: { display: "Space Grotesk", body: "JetBrains Mono" },
    colors: { bg: "#1F1F1F", text: "#F5F5F5", accent: "#FF2E00" },
    philosophy: "Abstract sculptures cast in unwashed dark volcanic sands. Rigidity that honors cold Atlantic coasts.",
    items: [
      { name: "BRUT_01_VOLCAN_BLOCK", price: "€620", category: "Art", description: "Geometric dark concrete block displaying chiseled metric alignment numbers.", number: "01" },
      { name: "BRUT_02_IRON_PIN_BASE", price: "€120", category: "Metals", description: "Thick raw iron pins designed to lock sliding geometric plates.", number: "03" },
      { name: "BRUT_03_PULP_FOLIO", price: "€95", category: "Design", description: "Heavy grey cardboard binder recording coordinates of volcanic formations.", number: "03" }
    ]
  }
];
