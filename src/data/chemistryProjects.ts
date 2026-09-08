// Chemistry Projects Data with full details, steps, and 3D animation info

export type ProjectLevel = 'beginner' | 'intermediate' | 'advanced';
export type ProjectCategory = 'electrochemistry' | 'organic' | 'materials' | 'green-chemistry' | 'local-materials' | 'biochemistry';

// Level translations for display
export const projectLevels: Record<ProjectLevel, { en: string; am: string; or: string }> = {
  beginner: { en: 'Beginner', am: 'ጀማሪ', or: 'Jalqabaa' },
  intermediate: { en: 'Intermediate', am: 'መካከለኛ', or: 'Giddugaleessa' },
  advanced: { en: 'Advanced', am: 'ከፍተኛ', or: "Ol'aanaa" }
};

// Category translations and icons for display
export const projectCategories: Record<ProjectCategory, { en: string; am: string; or: string; icon: string }> = {
  electrochemistry: { en: 'Electrochemistry', am: 'ኤሌክትሮ ኬሚስትሪ', or: 'Elektiroo-keemistririi', icon: '⚡' },
  organic: { en: 'Organic Chemistry', am: 'ኦርጋኒክ ኬሚስትሪ', or: 'Keemistririi Orgaanikii', icon: '🧪' },
  materials: { en: 'Materials Science', am: 'የቁሳቁስ ሳይንስ', or: 'Saayinsii Meeshaalee', icon: '🔬' },
  'green-chemistry': { en: 'Green Chemistry', am: 'አረንጓዴ ኬሚስትሪ', or: 'Keemistririi Magariisa', icon: '🌿' },
  'local-materials': { en: 'Local Materials', am: 'የአካባቢ ቁሳቁሶች', or: 'Meeshaalee Naannoo', icon: '🏠' },
  biochemistry: { en: 'Biochemistry', am: 'ባዮኬሚስትሪ', or: 'Bayoo-keemistririi', icon: '🧬' }
};

export interface ProjectStep {
  stepNumber: number;
  titleEn: string;
  titleAm: string;
  titleOr: string;
  descriptionEn: string;
  descriptionAm: string;
  descriptionOr: string;
  safetyNote?: string;
  duration?: string;
  equipment3D?: string;
}

export interface ChemistryProject {
  id: string;
  titleEn: string;
  titleAm: string;
  titleOr: string;
  descriptionEn: string;
  descriptionAm: string;
  descriptionOr: string;
  level: ProjectLevel;
  category: ProjectCategory;
  chemistryTopics: string[];
  duration: string;
  difficulty: number;
  safetyLevel: 'low' | 'medium' | 'high';
  requiredEquipment: string[];
  requiredChemicals: string[];
  steps: ProjectStep[];
  variations: string[];
  expectedResults: string;
  scienceExplanation: string;
  icon: string;
  animation3D: string;
}

export const chemistryProjects: ChemistryProject[] = [
  // ============ BEGINNER LEVEL ============
  {
    id: 'electroplating',
    titleEn: 'Electroplating (Copper-Plating)',
    titleAm: 'ኤሌክትሮፕሌቲንግ (በመዳብ መለበስ)',
    titleOr: "Elektiroopileeting (Koopparii dibachuu)",
    descriptionEn: 'Set up a simple electrolytic cell to copper-plate a key or coin using electrochemistry principles.',
    descriptionAm: 'ቀላል የኤሌክትሮላይቲክ ሴል በመጠቀም ቁልፍ ወይም ሳንቲም በመዳብ ማለበስ።',
    descriptionOr: "Seelii elektiroolayitikii salphaa fayyadamuun furicha yookiin meetii kooppariitiin dibachuu.",
    level: 'beginner',
    category: 'electrochemistry',
    chemistryTopics: ['Electrochemistry', 'Redox Reactions', 'Ion Migration'],
    duration: '2-3 hours',
    difficulty: 2,
    safetyLevel: 'medium',
    requiredEquipment: ['Power supply (6-12V)', 'Beakers', 'Wires with clips', 'Copper plate (anode)', 'Steel key or coin (cathode)'],
    requiredChemicals: ['Copper sulfate (CuSO₄)', 'Sulfuric acid (dilute)', 'Distilled water'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Prepare the Electrolyte Solution',
        titleAm: 'የኤሌክትሮላይት መፍትሄ አዘጋጅ',
        titleOr: "Furmaata elektiroolayitii qopheessi",
        descriptionEn: 'Dissolve 50g of copper sulfate in 250ml of distilled water. Add 10ml of dilute sulfuric acid to increase conductivity.',
        descriptionAm: '50 ግራም መዳብ ሰልፌት በ250 ሚሊ ውሃ ውስጥ ማሟሟት። 10 ሚሊ ቀጭን ሰልፈሪክ አሲድ ማከል።',
        descriptionOr: "Koopparii salfeetii giraama 50 bishaan qulqulluu milii 250 keessatti bulbuli. Asidii salfuurikii diluted milii 10 itti dabali.",
        safetyNote: 'Wear gloves and goggles when handling acids!',
        duration: '15 minutes',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 2,
        titleEn: 'Clean the Cathode (Key/Coin)',
        titleAm: 'ካቶድ (ቁልፍ/ሳንቲም) ማፅዳት',
        titleOr: "Kaatooda (furiicha/meetii) qulqulleessi",
        descriptionEn: 'Clean the key or coin thoroughly with sandpaper and soap to remove oils and oxides. Rinse with distilled water.',
        descriptionAm: 'ቁልፉን ወይም ሳንቲሙን በአሸዋ ወረቀትና ሳሙና በደንብ አፅዳ። በንፁህ ውሃ አጠብ።',
        descriptionOr: "Furicha ykn meetii waraqaa cirraachaa fi saamunaan gaariitti qulqulleessi. Bishaan qulqulluudhaan dhiqadhu.",
        duration: '10 minutes',
        equipment3D: 'key'
      },
      {
        stepNumber: 3,
        titleEn: 'Set Up the Electrolytic Cell',
        titleAm: 'ኤሌክትሮላይቲክ ሴል መትከል',
        titleOr: "Seelii elektiroolayitikii ijaarsa",
        descriptionEn: 'Connect the copper plate to the positive terminal (anode) and the key/coin to the negative terminal (cathode). Submerge both in the solution.',
        descriptionAm: 'የመዳብ ሰሌዳውን ወደ አወንታዊ ተርሚናል (አኖድ) እና ቁልፉን/ሳንቲሙን ወደ አሉታዊ ተርሚናል (ካቶድ) ማገናኘት።',
        descriptionOr: "Gabatee koopparii gara tarminaalii poozatiivii (anooda) fi furicha/meetii gara tarminaalii negaatiivii (kaatooda) walqunnamsiisi.",
        duration: '15 minutes',
        equipment3D: 'electrolytic-cell'
      },
      {
        stepNumber: 4,
        titleEn: 'Apply Current and Observe',
        titleAm: 'ሃይል መልቀቅ እና መመልከት',
        titleOr: "Humna elektirikii dabarsi fi ilaalii",
        descriptionEn: 'Turn on the power supply at 3-6V. Observe bubbles at cathode. After 20-30 minutes, the key will have a copper coating.',
        descriptionAm: 'የኃይል አቅርቦቱን በ3-6 ቮልት መክፈት። በካቶድ ላይ ያሉ አረፋዎችን መመልከት። ከ20-30 ደቂቃዎች በኋላ ቁልፉ የመዳብ ሽፋን ይኖረዋል።',
        descriptionOr: "Elektirikii volcii 3-6 irratti banaa. Huubiiwwan kaatooda irratti argamu ilaalii. Daqiiqaa 20-30 booda furichii haguuggii koopparii qaba.",
        duration: '30 minutes',
        equipment3D: 'power-supply'
      },
      {
        stepNumber: 5,
        titleEn: 'Examine and Polish',
        titleAm: 'መመርመር እና መፋቅ',
        titleOr: "Qoradhu fi qulqulleessi",
        descriptionEn: 'Remove the plated key, rinse with water, dry, and polish gently. Measure the thickness if possible.',
        descriptionAm: 'የተለበሰውን ቁልፍ ማውጣት፣ በውሃ ማጠብ፣ ማድረቅ፣ እና በቀስታ ማሸት።',
        descriptionOr: "Furicha haguugame baasii, bishaaniin dhiqadhu, gogsi, fi suuta suuta ifa godhi.",
        duration: '10 minutes',
        equipment3D: 'key'
      }
    ],
    variations: ['Try plating with nickel sulfate for silver-like finish', 'Vary voltage to see effect on coating quality', 'Compare plating on different metals'],
    expectedResults: 'A shiny copper coating on the previously dull key/coin. Thicker coatings with longer time and higher current.',
    scienceExplanation: 'Cu²⁺ ions in solution are reduced at the cathode: Cu²⁺ + 2e⁻ → Cu. Copper from the anode dissolves to replace them.',
    icon: '🔌',
    animation3D: 'electrolytic-cell'
  },
  {
    id: 'ph-indicator',
    titleEn: 'Natural pH Indicator from Red Cabbage',
    titleAm: 'ከቀይ ጎመን የተፈጥሮ pH ጠቋሚ',
    titleOr: "Raafuu diimaa irraa agarsiistuu pH uumamaa",
    descriptionEn: 'Extract anthocyanin pigments from red cabbage to create a natural pH indicator that changes color across the pH scale.',
    descriptionAm: 'ከቀይ ጎመን አንቶሲያኒን ቀለሞችን በማውጣት ቀለሙ በpH መጠን ላይ የሚቀየር የተፈጥሮ pH ጠቋሚ መፍጠር።',
    descriptionOr: "Raafuu diimaa irraa pigmentiiwwan anthoocayaanii baasuudhaan agarsiistuu pH uumamaa kan halluu jijjiiru uumuu.",
    level: 'beginner',
    category: 'organic',
    chemistryTopics: ['Acid-Base Chemistry', 'Anthocyanins', 'pH Scale'],
    duration: '1-2 hours',
    difficulty: 1,
    safetyLevel: 'low',
    requiredEquipment: ['Pot', 'Strainer', 'Glass jars', 'Knife', 'Stove'],
    requiredChemicals: ['Red cabbage', 'Water', 'Household acids (vinegar, lemon)', 'Household bases (baking soda, soap)'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Prepare the Cabbage',
        titleAm: 'ጎመኑን ማዘጋጀት',
        titleOr: "Raafuu qopheessi",
        descriptionEn: 'Chop half a red cabbage into small pieces. The more surface area, the better extraction.',
        descriptionAm: 'ግማሽ ቀይ ጎመን ወደ ትንንሽ ቁርጥራጭ መቁረጥ።',
        descriptionOr: "Raafuu diimaa walakkaa gara cicciitaa xixiqqootti muri.",
        duration: '10 minutes',
        equipment3D: 'knife'
      },
      {
        stepNumber: 2,
        titleEn: 'Boil and Extract',
        titleAm: 'መፍላት እና ማውጣት',
        titleOr: "Danfisi fi baasi",
        descriptionEn: 'Place cabbage in a pot with water covering it. Boil for 20-30 minutes until water turns deep purple.',
        descriptionAm: 'ጎመኑን በድስት ውስጥ ውሃ እስከሚሸፍነው ድረስ ማስቀመጥ። ውሃው ወደ ጥቁር ሐምራዊ እስኪቀየር ድረስ ለ20-30 ደቂቃዎች ማፍላት።',
        descriptionOr: "Raafuu iddoo bishaan haguugu keessa kaa'i. Hanga bishaan gurraacha-diimaa ta'utti daqiiqaa 20-30 danfisi.",
        duration: '30 minutes',
        equipment3D: 'pot'
      },
      {
        stepNumber: 3,
        titleEn: 'Strain and Cool',
        titleAm: 'ማጣራት እና ማቀዝቀዝ',
        titleOr: "Calalii fi qabbaneessi",
        descriptionEn: 'Strain out the cabbage pieces. Keep the purple liquid - this is your indicator!',
        descriptionAm: 'የጎመን ቁርጥራጮችን ማጣራት። ሐምራዊውን ፈሳሽ ማስቀመጥ - ይህ ጠቋሚህ ነው!',
        descriptionOr: "Cicciitaa raafuu calali. Dhangala'aa burtukaanaa sana tursadhu - kun agarsiistuu kee ti!",
        duration: '15 minutes',
        equipment3D: 'strainer'
      },
      {
        stepNumber: 4,
        titleEn: 'Test with Acids and Bases',
        titleAm: 'በአሲዶች እና ቤዞች መሞከር',
        titleOr: "Asidoota fi beesota fayyadamuun qori",
        descriptionEn: 'Add indicator to small amounts of: vinegar (turns pink), baking soda solution (turns blue/green), soap water (turns green).',
        descriptionAm: 'ጠቋሚውን ወደ ትንሽ መጠን ማከል፡ ኮምጣጤ (ሮዝ ይሆናል)፣ የዳቦ ሶዳ መፍትሄ (ሰማያዊ/አረንጓዴ ይሆናል)።',
        descriptionOr: "Agarsiistuu gara hamma xiqqaa itti dabali: asinbiiba (buunii ta'a), furmaata soodaa daabboo (cuquliisa/magariisa ta'a).",
        duration: '20 minutes',
        equipment3D: 'test-tubes'
      },
      {
        stepNumber: 5,
        titleEn: 'Create a pH Color Chart',
        titleAm: 'የpH ቀለም ሰንጠረዥ መፍጠር',
        titleOr: "Chaartii halluu pH uumi",
        descriptionEn: 'Arrange test solutions from most acidic to most basic. Document colors for each pH level.',
        descriptionAm: 'የሙከራ መፍትሄዎችን ከበጣም አሲዳዊ እስከ በጣም ቤዚክ ማቀናጀት።',
        descriptionOr: "Furmaata qorannoo irra caalu asidawaa hanga irra caalu beesikawaa qindeessi.",
        duration: '15 minutes',
        equipment3D: 'beaker'
      }
    ],
    variations: ['Try turmeric (yellow in acid, red-brown in base)', 'Make indicator paper by soaking filter paper', 'Test different plant sources'],
    expectedResults: 'Red/pink in acids, purple/neutral, blue/green in bases. Beautiful color gradient across pH scale.',
    scienceExplanation: 'Anthocyanins change structure with pH, affecting which wavelengths of light they absorb and reflect.',
    icon: '🧪',
    animation3D: 'test-tubes'
  },
  {
    id: 'biodiesel',
    titleEn: 'Making Biodiesel from Waste Cooking Oil',
    titleAm: 'ከቆሻሻ ማብሰያ ዘይት ባዮዲዝል መስራት',
    titleOr: "Zayita nyaataa balfamaa irraa baayoodiizelii hojjachuu",
    descriptionEn: 'Convert waste vegetable oil into biodiesel fuel through transesterification reaction.',
    descriptionAm: 'የቆሻሻ አትክልት ዘይትን በትራንስስተሪፊኬሽን ምላሽ ወደ ባዮዲዝል ነዳጅ መቀየር።',
    descriptionOr: "Zayita muduraa balfamaa gara boba'aa baayoodiizelii response transesterification tiin jijjiiruu.",
    level: 'beginner',
    category: 'green-chemistry',
    chemistryTopics: ['Transesterification', 'Organic Synthesis', 'Renewable Energy'],
    duration: '3-4 hours',
    difficulty: 3,
    safetyLevel: 'high',
    requiredEquipment: ['Blender or mixer', 'Glass containers', 'Funnel', 'Safety goggles', 'Gloves', 'Thermometer'],
    requiredChemicals: ['Waste cooking oil (filtered)', 'Methanol', 'Sodium hydroxide (NaOH)', 'Litmus paper'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Filter and Heat the Oil',
        titleAm: 'ዘይቱን ማጣራትና ማሞቅ',
        titleOr: "Zayita calalii fi ho'isi",
        descriptionEn: 'Filter waste cooking oil through cloth to remove food particles. Heat to 55°C to remove water.',
        descriptionAm: 'የቆሻሻ ማብሰያ ዘይትን በጨርቅ ማጣራት የምግብ ቅንጣቶችን ለማስወገድ። ውሃን ለማስወገድ ወደ 55 ዲግሪ ሴልሺየስ ማሞቅ።',
        descriptionOr: "Zayita nyaataa balfamaa huccuudhaan calali ciccitaa nyaataa baasuuf. Bishaan baasuuf hanga 55°C ho'isi.",
        safetyNote: 'Do not overheat - methanol is very flammable!',
        duration: '30 minutes',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 2,
        titleEn: 'Prepare Sodium Methoxide',
        titleAm: 'ሶዲየም ሜቶክሳይድ ማዘጋጀት',
        titleOr: "Soodiyeem methoksaayidii qopheessi",
        descriptionEn: 'CAREFULLY dissolve 3.5g NaOH in 200ml methanol in a sealed container. This is sodium methoxide catalyst.',
        descriptionAm: 'በጥንቃቄ 3.5 ግራም NaOH በ200 ሚሊ ሜታኖል ውስጥ በታሸገ መያዣ ማሟሟት።',
        descriptionOr: "OF'EEGGANNOODHAAN NaOH g 3.5 meethaanal ml 200 keessatti meeshaa cufame keessatti bulbuli.",
        safetyNote: 'Methanol is TOXIC - work in well-ventilated area with full PPE!',
        duration: '15 minutes',
        equipment3D: 'flask'
      },
      {
        stepNumber: 3,
        titleEn: 'Mix and React',
        titleAm: 'መቀላቀል እና መድረስ',
        titleOr: "Waliin makii fi walitti fidi",
        descriptionEn: 'Slowly add sodium methoxide to warm oil while stirring. Mix for 1 hour at 55°C.',
        descriptionAm: 'ሶዲየም ሜቶክሳይድን ወደ ሞቃት ዘይት በቀስታ ማከል። ለ1 ሰዓት በ55 ዲግሪ ሴልሺየስ መቀላቀል።',
        descriptionOr: "Soodiyeem methoksaayidii suuta gara zayita ho'aa itti dabalaa jirta. Sa'aatii 1f 55°C irratti makii.",
        duration: '1 hour',
        equipment3D: 'mixer'
      },
      {
        stepNumber: 4,
        titleEn: 'Separate Layers',
        titleAm: 'ንብርብሮችን መለየት',
        titleOr: "Guutuuwwan adda baasi",
        descriptionEn: 'Let mixture settle for 8+ hours. Bottom layer is glycerol (byproduct), top layer is crude biodiesel.',
        descriptionAm: 'ድብልቁ ለ8+ ሰዓታት እንዲረጋጋ ማድረግ። የታችኛው ንብርብር ግሊሰሮል ነው፣ የላይኛው ንብርብር ጥሬ ባዮዲዝል ነው።',
        descriptionOr: "Makaa sa'aatii 8+ akka qabbanaawuuf dhiisi. Guutuu jalaa giilisaroolii, guutuu gubbaa baayoodiizelii dheedhii dha.",
        duration: '8 hours (waiting)',
        equipment3D: 'separating-funnel'
      },
      {
        stepNumber: 5,
        titleEn: 'Wash and Dry',
        titleAm: 'ማጠብ እና ማድረቅ',
        titleOr: "Dhiqi fi gogsii",
        descriptionEn: 'Gently wash biodiesel with warm water 3 times. Let water settle and drain. Heat to remove remaining water.',
        descriptionAm: 'ባዮዲዝልን በሙቅ ውሃ 3 ጊዜ በጥንቃቄ ማጠብ። ውሃ እንዲረጋጋና እንዲወጣ ማድረግ።',
        descriptionOr: "Baayoodiizelii bishaan ho'aan yeroo 3 suuta dhiqi. Bishaan akka qabbanaawuuf fi akka bahu godhi.",
        duration: '30 minutes',
        equipment3D: 'beaker'
      }
    ],
    variations: ['Compare biodiesel from different oil sources', 'Test viscosity compared to petroleum diesel', 'Try potassium hydroxide as catalyst'],
    expectedResults: 'Clear, amber-colored biodiesel that can power diesel engines. Glycerol byproduct can be used for soap making.',
    scienceExplanation: 'Transesterification: Triglycerides + 3 Methanol → 3 Fatty Acid Methyl Esters (biodiesel) + Glycerol',
    icon: '⛽',
    animation3D: 'separating-funnel'
  },
  {
    id: 'aspirin-synthesis',
    titleEn: 'Synthesis of Aspirin (Acetylsalicylic Acid)',
    titleAm: 'አስፕሪን (አሴቲልሳሊሲሊክ አሲድ) ማዋሃድ',
    titleOr: "Aspiiriinii (Asiidii Aseetaayilsaalisiilikii) walitti makuu",
    descriptionEn: 'Classic organic synthesis lab: create aspirin through esterification and purify by recrystallization.',
    descriptionAm: 'ክላሲክ ኦርጋኒክ ውህደት ላብ፡ አስፕሪንን በኤስተሪፊኬሽን መፍጠር እና በድጋሚ ክሪስታላይዜሽን ማጣራት።',
    descriptionOr: "Laabii walitti makuu orgaanikii kilaasiikii: aspiiriinii esterification tiin uumuufi recrystallization tiin qulqulleessuu.",
    level: 'beginner',
    category: 'organic',
    chemistryTopics: ['Esterification', 'Organic Synthesis', 'Purification', 'Recrystallization'],
    duration: '2-3 hours',
    difficulty: 3,
    safetyLevel: 'medium',
    requiredEquipment: ['Erlenmeyer flask', 'Hot water bath', 'Ice bath', 'Buchner funnel', 'Filter paper', 'Thermometer'],
    requiredChemicals: ['Salicylic acid', 'Acetic anhydride', 'Phosphoric acid (catalyst)', 'Distilled water', 'Ethanol'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Weigh Reactants',
        titleAm: 'ምላሽ ሰጪዎችን መመዘን',
        titleOr: "Wantoota deebii kennan madaali",
        descriptionEn: 'Weigh 2g salicylic acid into a dry Erlenmeyer flask.',
        descriptionAm: '2 ግራም ሳሊሲሊክ አሲድ ወደ ደረቅ ኤርለንሜየር ፍላስክ መመዘን።',
        descriptionOr: "Asiidii saalisiilikii g 2 gara falaaskii Erlenmeyer gogaa keessatti madaali.",
        duration: '5 minutes',
        equipment3D: 'balance'
      },
      {
        stepNumber: 2,
        titleEn: 'Add Acetic Anhydride',
        titleAm: 'አሴቲክ አንሃይድራይድ ማከል',
        titleOr: "Asiidii aseetikii anhaaydiraayidii itti dabali",
        descriptionEn: 'Add 3ml of acetic anhydride and 5 drops of phosphoric acid catalyst.',
        descriptionAm: '3 ሚሊ አሴቲክ አንሃይድራይድ እና 5 ነጠብጣቦች ፎስፎሪክ አሲድ ካታሊስት ማከል።',
        descriptionOr: "Asiidii aseetikii anhaaydiraayidii ml 3 fi kaataalayizara asiidii foosforikii copha 5 itti dabali.",
        safetyNote: 'Acetic anhydride causes burns and irritation!',
        duration: '5 minutes',
        equipment3D: 'flask'
      },
      {
        stepNumber: 3,
        titleEn: 'Heat in Water Bath',
        titleAm: 'በውሃ መታጠቢያ ውስጥ ማሞቅ',
        titleOr: "Bishaan daakuu keessatti ho'isi",
        descriptionEn: 'Heat the flask in a water bath at 85°C for 15 minutes with occasional swirling.',
        descriptionAm: 'ፍላስኩን በ85 ዲግሪ ሴልሺየስ ለ15 ደቂቃዎች በውሃ መታጠቢያ ውስጥ ማሞቅ።',
        descriptionOr: "Falaaskii bishaan daakuu keessatti 85°C irratti daqiiqaa 15f ho'isi yeroo yeroon naannessi.",
        duration: '15 minutes',
        equipment3D: 'water-bath'
      },
      {
        stepNumber: 4,
        titleEn: 'Precipitate Crystals',
        titleAm: 'ክሪስታሎችን ማስቀረት',
        titleOr: "Kiristaalota kuusii",
        descriptionEn: 'Add 20ml cold water. Place in ice bath. Aspirin crystals will form.',
        descriptionAm: '20 ሚሊ ቀዝቃዛ ውሃ ማከል። በበረዶ መታጠቢያ ውስጥ ማስቀመጥ። የአስፕሪን ክሪስታሎች ይፈጠራሉ።',
        descriptionOr: "Bishaan qorraa ml 20 itti dabali. Daakuu cabbii keessa kaa'i. Kiristaaloonni aspiiriinii uumamu.",
        duration: '10 minutes',
        equipment3D: 'ice-bath'
      },
      {
        stepNumber: 5,
        titleEn: 'Filter and Dry',
        titleAm: 'ማጣራት እና ማድረቅ',
        titleOr: "Calali fi gogsii",
        descriptionEn: 'Filter crystals using Buchner funnel. Wash with cold water. Let dry and weigh your product.',
        descriptionAm: 'ክሪስታሎችን በቡክነር ፈንጠል ማጣራት። በቀዝቃዛ ውሃ ማጠብ። ማድረቅ እና ምርትዎን መመዘን።',
        descriptionOr: "Kiristaalota funnelii Buchner fayyadamuun calali. Bishaan qorraatiin dhiqi. Gogsi fi oomisha kee madaali.",
        duration: '20 minutes',
        equipment3D: 'buchner-funnel'
      }
    ],
    variations: ['Test purity by melting point determination', 'Perform TLC analysis', 'Compare to commercial aspirin'],
    expectedResults: 'White crystalline powder with melting point around 135-136°C. Typical yield: 70-80%.',
    scienceExplanation: 'Esterification reaction: Salicylic acid + Acetic anhydride → Acetylsalicylic acid + Acetic acid',
    icon: '💊',
    animation3D: 'flask'
  },
  {
    id: 'wood-ash-soap',
    titleEn: 'Traditional Soap from Wood Ash',
    titleAm: 'ከእንጨት አመድ ባህላዊ ሳሙና',
    titleOr: "Daaraa mukaa irraa saamunaa aadaa",
    descriptionEn: 'Extract lye from wood ash and use it to make traditional soap through saponification.',
    descriptionAm: 'ከእንጨት አመድ ላይ ማውጣት እና በሳፖኒፊኬሽን ባህላዊ ሳሙና ለመስራት መጠቀም።',
    descriptionOr: "Daaraa mukaa irraa lii baasuufi saponification tiin saamunaa aadaa hojjechuuf itti fayyadamuu.",
    level: 'beginner',
    category: 'local-materials',
    chemistryTopics: ['Base Extraction', 'Saponification', 'Traditional Chemistry'],
    duration: '2-3 days',
    difficulty: 2,
    safetyLevel: 'medium',
    requiredEquipment: ['Large bucket', 'Strainer/cloth', 'Pot', 'Wooden spoon', 'Mold'],
    requiredChemicals: ['Hardwood ash', 'Rainwater/soft water', 'Animal fat or vegetable oil'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Collect and Prepare Ash',
        titleAm: 'አመድ መሰብሰብ እና ማዘጋጀት',
        titleOr: "Daaraa walitti qabii fi qopheessi",
        descriptionEn: 'Collect ash from hardwood (not softwood or charcoal). You need about 5kg of ash.',
        descriptionAm: 'ከጠንካራ እንጨት አመድ መሰብሰብ (ለስላሳ እንጨት ወይም ከሰል አይደለም)። ወደ 5 ኪሎ ግራም አመድ ያስፈልጋል።',
        descriptionOr: "Daaraa mukaa jabaataa irraa walitti qabi (muka lallaafaa yookiin kasala miti). Daaraa kg 5 tahu siif barbaachisa.",
        duration: '30 minutes',
        equipment3D: 'bucket'
      },
      {
        stepNumber: 2,
        titleEn: 'Create Lye Water',
        titleAm: 'የላይ ውሃ መፍጠር',
        titleOr: "Bishaan lii uumi",
        descriptionEn: 'Pour rainwater through ash layers. Collect the brown liquid (lye). Test strength: a feather or potato should float.',
        descriptionAm: 'በአመድ ንብርብሮች ውስጥ የዝናብ ውሃ ማፍሰስ። ቡናማውን ፈሳሽ (ላይ) መሰብሰብ። ጥንካሬን መሞከር፡ ላባ ወይም ድንች መንሳፈፍ አለበት።',
        descriptionOr: "Bishaan roobaa guutuu daaraa keessa dhangalaasi. Dhangala'aa magaalaa (lii) walitti qabi. Cimina qori: baallee yookiin dinnicha irra bololi.",
        duration: '24 hours',
        equipment3D: 'bucket'
      },
      {
        stepNumber: 3,
        titleEn: 'Concentrate the Lye',
        titleAm: 'ላይውን ማጠናከር',
        titleOr: "Lii sana jabeessi",
        descriptionEn: 'Boil lye water to evaporate and concentrate. Continue until an egg floats.',
        descriptionAm: 'ውሃውን ለማትነን እና ለማጠናከር የላይ ውሃ ማፍላት። እንቁላል እስኪንሳፈፍ ድረስ መቀጠል።',
        descriptionOr: "Bishaan lii danfisuun akka urgooftuuf fi akka jabaatu godhi. Hanga hanqaaquun bololu'utti itti fufi.",
        safetyNote: 'Lye is caustic! Wear gloves and avoid skin contact.',
        duration: '2 hours',
        equipment3D: 'pot'
      },
      {
        stepNumber: 4,
        titleEn: 'Saponification',
        titleAm: 'ሳፖኒፊኬሽን',
        titleOr: "Saponification",
        descriptionEn: 'Heat fat/oil. Slowly add concentrated lye while stirring. Continue until mixture thickens (trace).',
        descriptionAm: 'ስብ/ዘይት ማሞቅ። የተጠናከረ ላይ በቀስታ በማነሳሳት ማከል። ድብልቁ እስኪወፍር ድረስ መቀጠል።',
        descriptionOr: "Cooma/zayita ho'isi. Lii jabaate suuta dabalaa jirtaa itti dabali. Hanga makaan sun furdatutti (turace) itti fufi.",
        duration: '1-2 hours',
        equipment3D: 'pot'
      },
      {
        stepNumber: 5,
        titleEn: 'Mold and Cure',
        titleAm: 'ቅርፅ እና መፈወስ',
        titleOr: "Mooldii fi fayyisi",
        descriptionEn: 'Pour into molds. Let cure for 4-6 weeks. The soap will harden and become mild.',
        descriptionAm: 'ወደ ቅርጾች ማፍሰስ። ለ4-6 ሳምንታት እንዲድን ማድረግ። ሳሙናው ይጠነክርና ቀላል ይሆናል።',
        descriptionOr: "Gara mooldii keessatti dhangalaasi. Torban 4-6f akka fayyuuf dhiisi. Saamunaan jabaatee lallaafaa ta'a.",
        duration: '4-6 weeks',
        equipment3D: 'mold'
      }
    ],
    variations: ['Add essential oils for scent', 'Try different types of wood ash', 'Compare animal fat vs vegetable oil soaps'],
    expectedResults: 'Rustic, brownish soap that lathers well. May be soft initially but hardens with curing.',
    scienceExplanation: 'Potassium hydroxide (from ash) reacts with fatty acids in oil/fat to form potassium soap (soft soap) + glycerol.',
    icon: '🧼',
    animation3D: 'pot'
  },
  {
    id: 'casein-plastic',
    titleEn: 'Casein Plastic from Milk',
    titleAm: 'ከወተት የካዜይን ፕላስቲክ',
    titleOr: "Aannan irraa pilaastikii kaaseyiinii",
    descriptionEn: 'Create biodegradable plastic from milk protein (casein) through denaturation.',
    descriptionAm: 'ከወተት ፕሮቲን (ካዜይን) በማበላሸት ሊበሰብስ የሚችል ፕላስቲክ መፍጠር።',
    descriptionOr: "Pirootiinii aannan (kaaseyiinii) irraa denaturation tiin pilaastikii biodegradable ta'e uumuu.",
    level: 'beginner',
    category: 'materials',
    chemistryTopics: ['Protein Denaturation', 'Polymerization', 'Biodegradable Materials'],
    duration: '1-2 hours + drying',
    difficulty: 1,
    safetyLevel: 'low',
    requiredEquipment: ['Pot', 'Strainer', 'Bowl', 'Molds', 'Paper towels'],
    requiredChemicals: ['Full-fat milk', 'Vinegar or lemon juice'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Heat the Milk',
        titleAm: 'ወተቱን ማሞቅ',
        titleOr: "Aannan ho'isi",
        descriptionEn: 'Heat 500ml of full-fat milk until hot but not boiling (about 80°C).',
        descriptionAm: '500 ሚሊ ሙሉ ስብ ወተት እስኪሞቅ ድረስ ማሞቅ ነገር ግን እስከማፍላት አይደለም (ወደ 80 ዲግሪ ሴልሺየስ)።',
        descriptionOr: "Aannan cooma guutuu ml 500 hanga ho'utti ho'isi garuu danfu hin ta'in (naannoo 80°C).",
        duration: '10 minutes',
        equipment3D: 'pot'
      },
      {
        stepNumber: 2,
        titleEn: 'Add Acid',
        titleAm: 'አሲድ ማከል',
        titleOr: "Asiidii itti dabali",
        descriptionEn: 'Remove from heat. Add 3-4 tablespoons of vinegar. Stir gently. Watch curds form.',
        descriptionAm: 'ከእሳት ማውጣት። 3-4 የሾርባ ማንኪያ ኮምጣጤ ማከል። በቀስታ ማነሳሳት። ቅንጫቢዎች ሲፈጠሩ ማየት።',
        descriptionOr: "Abidda irraa baasi. Asinbiiba manee soorataa 3-4 itti dabali. Suuta naannessi. Qaama uumamuu ilaali.",
        duration: '5 minutes',
        equipment3D: 'pot'
      },
      {
        stepNumber: 3,
        titleEn: 'Strain the Curds',
        titleAm: 'ቅንጫቢዎችን ማጣራት',
        titleOr: "Qaama sana calali",
        descriptionEn: 'Strain through cloth or fine strainer. Keep the solid curds, discard the liquid (whey).',
        descriptionAm: 'በጨርቅ ወይም በቀጭን ማጣሪያ ማጣራት። ጠንካራ ቅንጫቢዎችን ማስቀመጥ፣ ፈሳሹን (ጨበላ) መጣል።',
        descriptionOr: "Huccuu yookiin calalee qal'aa keessa calali. Qaama gogaa sana tursi, dhangala'aa (whey) gati.",
        duration: '5 minutes',
        equipment3D: 'strainer'
      },
      {
        stepNumber: 4,
        titleEn: 'Knead and Shape',
        titleAm: 'መቦካትና ቅርፅ መስጠት',
        titleOr: "Daadhi fi boca",
        descriptionEn: 'Knead the curds like dough. Add food coloring if desired. Shape into buttons, beads, or ornaments.',
        descriptionAm: 'ቅንጫቢዎችን እንደ ሊጥ መቦካት። የምግብ ቀለም ከፈለጉ ማከል። ወደ አዝራሮች፣ ዶቃዎች ወይም ጌጣጌጦች ቅርፅ መስጠት።',
        descriptionOr: "Qaama akka daabboo daadhi. Yoo barbaadde halluu nyaataa itti dabali. Gara batoonota, kuula, yookiin miidhagsuutti boca.",
        duration: '15 minutes',
        equipment3D: 'mold'
      },
      {
        stepNumber: 5,
        titleEn: 'Dry and Harden',
        titleAm: 'ማድረቅ እና ማጠንከር',
        titleOr: "Gogsii fi jabeessi",
        descriptionEn: 'Let pieces dry for 2-3 days. They will harden into a plastic-like material.',
        descriptionAm: 'ቁርጥራጮች ለ2-3 ቀናት እንዲደርቁ ማድረግ። እንደ ፕላስቲክ ይጠነክራሉ።',
        descriptionOr: "Cicciitaan guyyaa 2-3f akka gogu godhi. Gara meeshaa pilaastikii fakkaatu jabaatu.",
        duration: '2-3 days',
        equipment3D: 'tray'
      }
    ],
    variations: ['Sand and polish for smooth finish', 'Add natural dyes from plants', 'Create jewelry or buttons'],
    expectedResults: 'Hard, ivory-colored material that can be shaped and polished. Biodegradable unlike petroleum plastic.',
    scienceExplanation: 'Acid denatures casein proteins, causing them to coagulate and form cross-linked polymer chains.',
    icon: '🥛',
    animation3D: 'pot'
  },
  {
    id: 'starch-bioplastic',
    titleEn: 'Biodegradable Film from Starch',
    titleAm: 'ከስታርች ሊበሰብስ የሚችል ፊልም',
    titleOr: "Istaarchirraa fiilmii biodegradable",
    descriptionEn: 'Create flexible biodegradable packaging film from cassava, potato, or corn starch.',
    descriptionAm: 'ከካሳቫ፣ ድንች ወይም የበቆሎ ስታርች ተለዋዋጭ ሊበሰብስ የሚችል ማሸጊያ ፊልም መፍጠር።',
    descriptionOr: "Istaarchii kaassaavaa, dinnicha, yookiin boqqolloo irraa fiilmii maxxansaa biodegradable jal'ifamuu danda'u uumuu.",
    level: 'beginner',
    category: 'materials',
    chemistryTopics: ['Polymer Chemistry', 'Plasticizers', 'Biodegradable Materials'],
    duration: '2-3 hours + drying',
    difficulty: 2,
    safetyLevel: 'low',
    requiredEquipment: ['Pot', 'Flat tray or glass', 'Stirring rod', 'Measuring cups'],
    requiredChemicals: ['Starch (cassava/potato/corn)', 'Glycerol', 'Vinegar', 'Water'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Make Starch Slurry',
        titleAm: 'የስታርች ድብልቅ መስራት',
        titleOr: "Walitti makaa istaarchii hojjedhu",
        descriptionEn: 'Mix 10g starch with 100ml cold water until smooth slurry forms.',
        descriptionAm: '10 ግራም ስታርች ከ100 ሚሊ ቀዝቃዛ ውሃ ጋር መቀላቀል ለስላሳ ድብልቅ እስኪሆን ድረስ።',
        descriptionOr: "Istaarchii g 10 bishaan qorraa ml 100 wajjin makii hanga walitti makaa lallaafaa ta'utti.",
        duration: '5 minutes',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 2,
        titleEn: 'Add Plasticizer',
        titleAm: 'ፕላስቲሳይዘር ማከል',
        titleOr: "Plasticizer itti dabali",
        descriptionEn: 'Add 5ml glycerol (plasticizer) and 5ml vinegar (to modify properties).',
        descriptionAm: '5 ሚሊ ግሊሰሮል (ፕላስቲሳይዘር) እና 5 ሚሊ ኮምጣጤ (ባህሪያትን ለመቀየር) ማከል።',
        descriptionOr: "Giilisaroolii (plasticizer) ml 5 fi asinbiiba (amala jijjiiruuf) ml 5 itti dabali.",
        duration: '2 minutes',
        equipment3D: 'flask'
      },
      {
        stepNumber: 3,
        titleEn: 'Heat and Gelatinize',
        titleAm: 'ማሞቅ እና ማጀላቲናይዝ',
        titleOr: "Ho'isi fi gelatinize godhi",
        descriptionEn: 'Heat mixture while stirring constantly. It will thicken and become translucent.',
        descriptionAm: 'ድብልቁን በየጊዜው በማነሳሳት ማሞቅ። ይወፍርና ግልጽ ይሆናል።',
        descriptionOr: "Makaa yeroo hunda naannessuun ho'isi. Furdaatee ifa ta'a.",
        duration: '10 minutes',
        equipment3D: 'pot'
      },
      {
        stepNumber: 4,
        titleEn: 'Pour and Spread',
        titleAm: 'ማፍሰስ እና መዘርጋት',
        titleOr: "Dhangalaasi fi babal'isi",
        descriptionEn: 'Pour onto flat tray or glass. Spread evenly with spatula to about 1-2mm thickness.',
        descriptionAm: 'ወደ ጠፍጣፋ ትሪ ወይም መስታወት ማፍሰስ። በስፓቱላ በእኩል ወደ 1-2 ሚሜ ውፍረት መዘርጋት።',
        descriptionOr: "Gara tareey yookiin biilchaa diriiraa irratti dhangalaasi. Ispaatulaadhaan walqixa hanga furdina mm 1-2 babal'isi.",
        duration: '5 minutes',
        equipment3D: 'tray'
      },
      {
        stepNumber: 5,
        titleEn: 'Dry Film',
        titleAm: 'ፊልም ማድረቅ',
        titleOr: "Fiilmii gogsii",
        descriptionEn: 'Let dry for 24-48 hours. Peel off the transparent, flexible bioplastic film.',
        descriptionAm: 'ለ24-48 ሰዓታት እንዲደርቅ ማድረግ። ግልጽ፣ ተለዋዋጭ ባዮፕላስቲክ ፊልም መላቀቅ።',
        descriptionOr: "Sa'aatii 24-48f akka gogu godhi. Fiilmii baayoopilaastikii ifa, jal'ifamuu danda'u sana qaqqabi.",
        duration: '24-48 hours',
        equipment3D: 'film'
      }
    ],
    variations: ['Compare different starch sources', 'Add natural colorants', 'Test biodegradation rate in soil'],
    expectedResults: 'Flexible, translucent film similar to plastic wrap. Biodegrades in weeks to months.',
    scienceExplanation: 'Heat gelatinizes starch (disrupts crystalline regions). Glycerol plasticizes by inserting between polymer chains, increasing flexibility.',
    icon: '🌱',
    animation3D: 'pot'
  },
  {
    id: 'bioethanol',
    titleEn: 'Bioethanol from Fermented Fruit',
    titleAm: 'ከተፈላ ፍራፍሬ ባዮኢታኖል',
    titleOr: "Fuduraa danfifame irraa Baayoo-iitaanoolii",
    descriptionEn: 'Produce ethanol through yeast fermentation of fruit sugars.',
    descriptionAm: 'በእርሾ መፍላት የፍራፍሬ ስኳሮች ኢታኖል ማምረት።',
    descriptionOr: "Sokorota fuduraa danfachuu raammoodhaan iitaanoolii oomishuu.",
    level: 'beginner',
    category: 'biochemistry',
    chemistryTopics: ['Biochemistry', 'Fermentation', 'Oxidation'],
    duration: '5-7 days',
    difficulty: 2,
    safetyLevel: 'low',
    requiredEquipment: ['Large jar/bottle', 'Airlock or balloon', 'Strainer', 'Thermometer'],
    requiredChemicals: ['Overripe fruits (pineapple, mango)', 'Sugar', "Yeast (baker's yeast)", 'Water'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Prepare Fruit Mash',
        titleAm: 'የፍራፍሬ ድብልቅ ማዘጋጀት',
        titleOr: "Dheedhii fuduraa qopheessi",
        descriptionEn: 'Mash 500g overripe fruit with 500ml water. Add 100g sugar to boost fermentable sugars.',
        descriptionAm: '500 ግራም የበሰበሰ ፍራፍሬ ከ500 ሚሊ ውሃ ጋር መደቆስ። ሊፈላ የሚችሉ ስኳሮችን ለመጨመር 100 ግራም ስኳር ማከል።',
        descriptionOr: "Fuduraa bilchaate g 500 bishaan ml 500 wajjin tuqi. Sokorota danfamuu danda'an dabaluuf sukkaara g 100 itti dabali.",
        duration: '20 minutes',
        equipment3D: 'pot'
      },
      {
        stepNumber: 2,
        titleEn: 'Add Yeast',
        titleAm: 'እርሾ ማከል',
        titleOr: "Raammoo itti dabali",
        descriptionEn: 'Cool mash to 25-30°C. Add 1 packet (7g) of yeast. Stir well.',
        descriptionAm: 'ድብልቁን ወደ 25-30 ዲግሪ ሴልሺየስ ማቀዝቀዝ። 1 ፓኬት (7 ግራም) እርሾ ማከል። በደንብ ማነሳሳት።',
        descriptionOr: "Dheedhii gara 25-30°C qabbaneessi. Raammoo paakeetii 1 (g 7) itti dabali. Gaariitti naannessi.",
        duration: '10 minutes',
        equipment3D: 'flask'
      },
      {
        stepNumber: 3,
        titleEn: 'Set Up Fermentation',
        titleAm: 'የመፍላት ሂደት መትከል',
        titleOr: "Adeemsa danfachuu ijaarsa",
        descriptionEn: 'Transfer to jar. Attach airlock (or balloon with pinhole). Keep at 25-30°C.',
        descriptionAm: 'ወደ ማሰሮ ማስተላለፍ። ኤርሎክ (ወይም ቀዳዳ ያለው ፊኛ) ማያያዝ። በ25-30 ዲግሪ ሴልሺየስ ማቆየት።',
        descriptionOr: "Gara jaarii dabarsi. Airlok (yookiin baalonii meesha qabu) hidhi. 25-30°C irratti tursi.",
        duration: '5-7 days',
        equipment3D: 'fermentation-vessel'
      },
      {
        stepNumber: 4,
        titleEn: 'Monitor Fermentation',
        titleAm: 'የመፍላት ሂደት መከታተል',
        titleOr: "Adeemsa danfachuu hordofi",
        descriptionEn: 'Watch for bubbles in airlock. Fermentation complete when bubbling stops (5-7 days).',
        descriptionAm: 'በኤርሎክ ውስጥ አረፋዎችን መከታተል። አረፋ ሲቆም መፍላት ተጠናቀቀ (5-7 ቀናት)።',
        descriptionOr: "Huubiiwwan airlok keessatti ilaali. Yeroo huubiin dhaabbatu danfachuun xumurame (guyyaa 5-7).",
        duration: '5-7 days',
        equipment3D: 'fermentation-vessel'
      },
      {
        stepNumber: 5,
        titleEn: 'Test for Alcohol',
        titleAm: 'ለአልኮል መሞከር',
        titleOr: "Alkoolii qori",
        descriptionEn: 'Strain liquid. Test for alcohol using hydrometer or simple evaporation test.',
        descriptionAm: 'ፈሳሹን ማጣራት። በሃይድሮሜትር ወይም ቀላል የትነት ሙከራ አልኮልን መሞከር።',
        descriptionOr: "Dhangala'aa calali. Haaydiroomeetarii yookiin qorannoo urgooftuu salphaa fayyadamuun alkoolii qori.",
        duration: '30 minutes',
        equipment3D: 'hydrometer'
      }
    ],
    variations: ['Make vinegar by further oxidation', 'Try different fruit sources', 'Measure alcohol content precisely'],
    expectedResults: 'Cloudy liquid with ~5-10% alcohol content. Sweet smell with slight alcohol aroma.',
    scienceExplanation: 'Yeast converts glucose to ethanol + CO₂ through anaerobic respiration: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂',
    icon: '🍷',
    animation3D: 'fermentation-vessel'
  },
  {
    id: 'water-filter',
    titleEn: 'Water Filtration from Clay & Charcoal',
    titleAm: 'ከሸክላ እና ከሰል ውሃ ማጣሪያ',
    titleOr: "Suphee fi kasala irraa bishaan calaluu",
    descriptionEn: 'Build a multi-layer water filter using local materials for removing contaminants.',
    descriptionAm: 'ብክለቶችን ለማስወገድ የአካባቢ ቁሳቁሶችን በመጠቀም ባለብዙ ንብርብር ውሃ ማጣሪያ መገንባት።',
    descriptionOr: "Meeshaalee naannoo fayyadamuun faalama baasuuf bishaan calalaa caasaa hedduu ijaaruu.",
    level: 'beginner',
    category: 'local-materials',
    chemistryTopics: ['Adsorption', 'Filtration', 'Porosity'],
    duration: '2-3 hours',
    difficulty: 2,
    safetyLevel: 'low',
    requiredEquipment: ['Large bottles/containers', 'Clay pot or bucket', 'Screen/cloth'],
    requiredChemicals: ['Local clay', 'Sawdust/rice husks', 'Sand (various grades)', 'Gravel', 'Charcoal'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Prepare Charcoal',
        titleAm: 'ከሰል ማዘጋጀት',
        titleOr: "Kasala qopheessi",
        descriptionEn: 'Crush charcoal into small pieces and powder. Wash to remove dust.',
        descriptionAm: 'ከሰልን ወደ ትንንሽ ቁርጥራጮች እና ዱቄት መደቆስ። አቧራ ለማስወገድ ማጠብ።',
        descriptionOr: "Kasala gara cicciitaa xixiqqoo fi daakuutti tuqi. Awwaara baasuuf dhiqi.",
        duration: '30 minutes',
        equipment3D: 'mortar'
      },
      {
        stepNumber: 2,
        titleEn: 'Build Layer System',
        titleAm: 'የንብርብር ስርዓት መገንባት',
        titleOr: "Sirna guutuu ijaari",
        descriptionEn: 'In container from bottom: gravel layer, coarse sand, fine sand, charcoal, fine sand on top.',
        descriptionAm: 'በመያዣ ውስጥ ከታች፡ የጠጠር ንብርብር፣ ሻካራ አሸዋ፣ ቀጭን አሸዋ፣ ከሰል፣ በላይ ቀጭን አሸዋ።',
        descriptionOr: "Meeshaa keessatti jalaa: guutuu cirraachaa, cirraachaa guddaa, cirraachaa qal'aa, kasala, cirraachaa qal'aa irra.",
        duration: '30 minutes',
        equipment3D: 'container'
      },
      {
        stepNumber: 3,
        titleEn: 'Make Porous Clay Filter (Optional)',
        titleAm: 'ቀዳዳ ሸክላ ማጣሪያ መስራት (አማራጭ)',
        titleOr: "Calalee suphee meesha qabu hojjedhu (Filannoo)",
        descriptionEn: 'Mix clay with sawdust. Form pot shape. Fire it - sawdust burns leaving pores.',
        descriptionAm: 'ሸክላን ከመሰንጠቂያ ጋር መቀላቀል። የድስት ቅርፅ መስጠት። ማቃጠል - መሰንጠቂያ ተቃጥሎ ቀዳዳዎች ይተዋል።',
        descriptionOr: "Suphee sawdust wajjin makii. Boca okotee boci. Gubii - sawdust gubatee meesha dhiisa.",
        duration: '1 hour + firing',
        equipment3D: 'clay-pot'
      },
      {
        stepNumber: 4,
        titleEn: 'Test the Filter',
        titleAm: 'ማጣሪያውን መሞከር',
        titleOr: "Calalee qori",
        descriptionEn: 'Pour muddy water through. Compare input and output clarity. Measure time for filtering.',
        descriptionAm: 'ጭቃማ ውሃ በማጣሪያው ውስጥ ማፍሰስ። ግብዓት እና ውጤት ግልጽነትን ማነፃፀር።',
        descriptionOr: "Bishaan dhoqqee keessa dhangalaasi. Galii fi bu'aa ifaa walbira qabi. Yeroo calaluu safari.",
        duration: '30 minutes',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 5,
        titleEn: 'Analyze Results',
        titleAm: 'ውጤቶችን መተንተን',
        titleOr: "Bu'aawwan xiinxali",
        descriptionEn: 'Document turbidity before/after. Test with food coloring to see adsorption.',
        descriptionAm: 'ከማጣራት በፊት/በኋላ ግልጽነትን መመዝገብ። አድሶርፕሽን ለማየት በምግብ ቀለም መሞከር።',
        descriptionOr: "Turbidity dura/booda galmeessi. Adsorption ilaaluuf halluu nyaataan qori.",
        duration: '20 minutes',
        equipment3D: 'test-tubes'
      }
    ],
    variations: ['Compare different charcoal sources', 'Test removal of food coloring', 'Build solar disinfection system'],
    expectedResults: 'Clear water from muddy input. Charcoal removes color and some chemicals through adsorption.',
    scienceExplanation: 'Physical filtration removes particles; activated charcoal adsorbs organic molecules through van der Waals forces.',
    icon: '💧',
    animation3D: 'filter-system'
  },
  {
    id: 'neem-pesticide',
    titleEn: 'Natural Pesticide from Neem',
    titleAm: 'ከኒም የተፈጥሮ ፀረ-ተባይ',
    titleOr: "Niimii irraa farra ilbiisota uumamaa",
    descriptionEn: 'Extract bioactive compounds from neem leaves to create natural insect repellent.',
    descriptionAm: 'የተፈጥሮ ነፍሳት መከላከያ ለመፍጠር ከኒም ቅጠሎች ባዮአክቲቭ ውህዶችን ማውጣት።',
    descriptionOr: "Farra ilbiisota uumamaa uumuuf baala niimii irraa kompaawoondoota baayooaktive baasuu.",
    level: 'beginner',
    category: 'local-materials',
    chemistryTopics: ['Extraction', 'Bioactive Compounds', 'Natural Products'],
    duration: '2-3 hours',
    difficulty: 1,
    safetyLevel: 'low',
    requiredEquipment: ['Blender/mortar', 'Strainer', 'Spray bottle', 'Container'],
    requiredChemicals: ['Neem leaves', 'Water', 'Liquid soap', 'Garlic (optional)', 'Chili (optional)'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Collect Fresh Neem Leaves',
        titleAm: 'ትኩስ የኒም ቅጠሎች መሰብሰብ',
        titleOr: "Baala niimii qulqulluu walitti qabi",
        descriptionEn: 'Gather 100g of fresh, green neem leaves. Wash to remove dirt.',
        descriptionAm: '100 ግራም ትኩስ፣ አረንጓዴ የኒም ቅጠሎች መሰብሰብ። ቆሻሻ ለማስወገድ ማጠብ።',
        descriptionOr: "Baala niimii qulqulluu, magariisaa g 100 walitti qabi. Xurii baasuuf dhiqi.",
        duration: '15 minutes',
        equipment3D: 'leaves'
      },
      {
        stepNumber: 2,
        titleEn: 'Blend with Water',
        titleAm: 'ከውሃ ጋር መደባለቅ',
        titleOr: "Bishaan wajjin maki",
        descriptionEn: 'Blend leaves with 500ml water until you get a green paste. Let soak overnight.',
        descriptionAm: 'ቅጠሎችን ከ500 ሚሊ ውሃ ጋር አረንጓዴ ፔስት እስኪያገኙ ድረስ መደባለቅ። ሌሊቱን ማስጠጣት።',
        descriptionOr: "Baala bishaan ml 500 wajjin hanga dheedhii magariisaa argattutti maki. Halkan guutuu cuunfi.",
        duration: '15 minutes + overnight',
        equipment3D: 'blender'
      },
      {
        stepNumber: 3,
        titleEn: 'Strain the Extract',
        titleAm: 'ምርቱን ማጣራት',
        titleOr: "Bu'aa sana calali",
        descriptionEn: 'Strain through cloth to remove solid material. Collect the greenish-yellow liquid.',
        descriptionAm: 'ጠንካራ ቁሳቁስ ለማስወገድ በጨርቅ ማጣራት። አረንጓዴ-ቢጫ ፈሳሹን መሰብሰብ።',
        descriptionOr: "Meeshaa gogaa baasuuf huccuudhaan calali. Dhangala'aa magariisa-keelloo walitti qabi.",
        duration: '15 minutes',
        equipment3D: 'strainer'
      },
      {
        stepNumber: 4,
        titleEn: 'Add Emulsifier',
        titleAm: 'ኢሙልሲፋየር ማከል',
        titleOr: "Emulsifier itti dabali",
        descriptionEn: 'Add 1 teaspoon liquid soap to help solution stick to leaves.',
        descriptionAm: '1 የሻይ ማንኪያ ፈሳሽ ሳሙና መፍትሄው በቅጠሎች ላይ እንዲጣበቅ ለማገዝ ማከል።',
        descriptionOr: "Furmaati baala irratti akka maxxantuuf gargaaruuf saamunaa dhangala'aa manee shaayii 1 itti dabali.",
        duration: '5 minutes',
        equipment3D: 'flask'
      },
      {
        stepNumber: 5,
        titleEn: 'Test on Plants',
        titleAm: 'በእፅዋት ላይ መሞከር',
        titleOr: "Biqiltoota irratti qori",
        descriptionEn: 'Spray on affected plants. Compare treated vs untreated plants over days.',
        descriptionAm: 'በተጎዱ ዕፅዋት ላይ መርጨት። በቀናት ውስጥ የታከሙ እና ያልታከሙ ዕፅዋትን ማነፃፀር።',
        descriptionOr: "Biqiltoota miidhaman irratti biifadhu. Guyyoota keessatti biqiltoota yaalamanii fi hin yaalamne walbira qabi.",
        duration: '1+ weeks observation',
        equipment3D: 'spray-bottle'
      }
    ],
    variations: ['Add garlic for enhanced effect', 'Try tulsi/basil extract', 'Test against different pests'],
    expectedResults: 'Natural insect repellent effective against aphids, mites, and many common pests.',
    scienceExplanation: 'Azadirachtin in neem disrupts insect hormones, preventing feeding, molting, and reproduction.',
    icon: '🌿',
    animation3D: 'spray-bottle'
  },
  // ============ INTERMEDIATE LEVEL ============
  {
    id: 'schiff-base',
    titleEn: 'Schiff Base Ligand & Metal Complex',
    titleAm: 'ሺፍ ቤዝ ሊጋንድ እና የብረት ኮምፕሌክስ',
    titleOr: "Liigaandii Schiff Base fi Kompleksii Sibiilaa",
    descriptionEn: 'Synthesize a Schiff base ligand and coordinate it with metal ions to form colored complexes.',
    descriptionAm: 'ሺፍ ቤዝ ሊጋንድ ማዋሃድ እና ቀለም ያላቸው ኮምፕሌክሶችን ለመፍጠር ከብረት ions ጋር ማስተባበር።',
    descriptionOr: "Liigaandii Schiff base walitti makuufi kompleksota halluu qaban uumuuf ayonoota sibiilaa wajjin qindeessuu.",
    level: 'intermediate',
    category: 'materials',
    chemistryTopics: ['Coordination Chemistry', 'Organic Synthesis', 'Spectroscopy'],
    duration: '3-4 hours',
    difficulty: 4,
    safetyLevel: 'medium',
    requiredEquipment: ['Round bottom flask', 'Reflux condenser', 'Hot plate', 'UV-Vis spectrophotometer (optional)'],
    requiredChemicals: ['Salicylaldehyde', 'Aniline', 'Ethanol', 'Copper(II) acetate', 'Nickel chloride'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Prepare Reactants',
        titleAm: 'ምላሽ ሰጪዎችን ማዘጋጀት',
        titleOr: "Wantoota deebii kennan qopheessi",
        descriptionEn: 'Dissolve 1.22g salicylaldehyde in 20ml ethanol. In another flask, dissolve 0.93g aniline in 20ml ethanol.',
        descriptionAm: '1.22 ግራም ሳሊሲላልዲሃይድ በ20 ሚሊ ኢታኖል ማሟሟት። በሌላ ፍላስክ 0.93 ግራም አኒሊን በ20 ሚሊ ኢታኖል ማሟሟት።',
        descriptionOr: "Saalisiilaaldiihaayidii g 1.22 iitaanoolii ml 20 keessatti bulbuli. Falaaskii biraa keessatti aniliinii g 0.93 iitaanoolii ml 20 keessatti bulbuli.",
        safetyNote: 'Aniline is toxic - work in fume hood!',
        duration: '15 minutes',
        equipment3D: 'flask'
      },
      {
        stepNumber: 2,
        titleEn: 'Condensation Reaction',
        titleAm: 'የኮንደንሴሽን ምላሽ',
        titleOr: "Response kondenseeshinii",
        descriptionEn: 'Mix solutions and reflux for 2 hours. Yellow Schiff base precipitates on cooling.',
        descriptionAm: 'መፍትሄዎችን መቀላቀል እና ለ2 ሰዓታት ማስተላለፍ። ቢጫ ሺፍ ቤዝ ሲቀዘቅዝ ይቀመጣል።',
        descriptionOr: "Furmaatota makii sa'aatii 2f reflux godhi. Schiff base keelloo yeroo qabbanaawu bu'a.",
        duration: '2 hours',
        equipment3D: 'reflux-condenser'
      },
      {
        stepNumber: 3,
        titleEn: 'Filter and Purify',
        titleAm: 'ማጣራት እና ማፅዳት',
        titleOr: "Calali fi qulqulleessi",
        descriptionEn: 'Filter the yellow crystals. Recrystallize from ethanol for purity.',
        descriptionAm: 'ቢጫ ክሪስታሎችን ማጣራት። ለንፁህነት ከኢታኖል እንደገና ማክሪስታላይዝ።',
        descriptionOr: "Kiristaalota keelloo calali. Qulqulluudhaaf iitaanoolii irraa irra deebi'ii kiristaalizi.",
        duration: '30 minutes',
        equipment3D: 'buchner-funnel'
      },
      {
        stepNumber: 4,
        titleEn: 'Prepare Metal Complex',
        titleAm: 'የብረት ኮምፕሌክስ ማዘጋጀት',
        titleOr: "Kompleksii sibiilaa qopheessi",
        descriptionEn: 'Dissolve Schiff base in ethanol. Add copper(II) acetate solution. Observe color change to deep green.',
        descriptionAm: 'ሺፍ ቤዝን በኢታኖል ማሟሟት። የመዳብ(II) አሴቴት መፍትሄ ማከል። ወደ ጥልቅ አረንጓዴ የቀለም ለውጥ መመልከት።',
        descriptionOr: "Schiff base iitaanoolii keessatti bulbuli. Furmaata koopparii(II) aseeteetii itti dabali. Jijjiirama halluu gara magariisa gadi fagoo ilaali.",
        duration: '30 minutes',
        equipment3D: 'flask'
      },
      {
        stepNumber: 5,
        titleEn: 'Characterize Complex',
        titleAm: 'ኮምፕሌክሱን መግለፅ',
        titleOr: "Kompleksii ibsi",
        descriptionEn: 'Record UV-Vis spectrum. Measure melting point. Compare to literature values.',
        descriptionAm: 'UV-Vis ስፔክትረም መመዝገብ። የማቅለጫ ነጥብ መለካት። ከሥነ-ጽሑፍ ዋጋዎች ጋር ማነፃፀር።',
        descriptionOr: "Ispeektiramii UV-Vis galmeessi. Qaphii baqinaa safari. Gatii barreeffamoota wajjin walbira qabi.",
        duration: '30 minutes',
        equipment3D: 'spectrophotometer'
      }
    ],
    variations: ['Try different aldehydes (vanillin, benzaldehyde)', 'Compare Cu, Ni, Co, Zn complexes', 'Test antimicrobial activity'],
    expectedResults: 'Yellow Schiff base; colored metal complexes (Cu=green, Ni=brown, Co=orange).',
    scienceExplanation: 'Condensation: R-CHO + H₂N-R → R-CH=N-R + H₂O. Metal coordinates through N and O donor atoms.',
    icon: '🔬',
    animation3D: 'spectrophotometer'
  },
  {
    id: 'hydrogel',
    titleEn: 'Superabsorbent Hydrogel',
    titleAm: 'ሱፐር አብዞርበንት ሃይድሮጀል',
    titleOr: "Haayidiroojelii super absorbent",
    descriptionEn: 'Synthesize a water-absorbing polymer hydrogel for agricultural or medical applications.',
    descriptionAm: 'ለግብርና ወይም የሕክምና መተግበሪያዎች ውሃ የሚስብ ፖሊመር ሃይድሮጀል ማዋሃድ።',
    descriptionOr: "Qonnaa yookiin itti fayyadama yaalaa tiif haayidiroojelii polimeraa bishaan xuuxu walitti makuu.",
    level: 'intermediate',
    category: 'materials',
    chemistryTopics: ['Polymer Chemistry', 'Cross-linking', 'Absorption Kinetics'],
    duration: '4-5 hours',
    difficulty: 4,
    safetyLevel: 'medium',
    requiredEquipment: ['Beakers', 'Hot plate', 'Stirrer', 'Balance', 'Molds'],
    requiredChemicals: ['Acrylic acid (or use diaper crystals)', 'Sodium hydroxide', 'Potassium persulfate', 'N,N-methylenebisacrylamide'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Neutralize Acrylic Acid',
        titleAm: 'አክሪሊክ አሲድ ማስገራት',
        titleOr: "Asiidii akriliki neutralize godhi",
        descriptionEn: 'Carefully neutralize acrylic acid with NaOH to form sodium acrylate. Exothermic - cool in ice bath.',
        descriptionAm: 'ሶዲየም አክሪሌት ለመፍጠር አክሪሊክ አሲድን በNaOH በጥንቃቄ ማስገራት። Exothermic - በበረዶ መታጠቢያ ማቀዝቀዝ።',
        descriptionOr: "Soodiyeem akrilaatii uumuuf asiidii akriliki NaOH tiin of'eeggannoodhaan neutralize godhi. Exothermic - daakuu cabbii keessatti qabbaneessi.",
        safetyNote: 'Acrylic acid is corrosive! Work in fume hood with full PPE.',
        duration: '30 minutes',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 2,
        titleEn: 'Add Cross-linker',
        titleAm: 'መስቀለኛ-ማገናኛ ማከል',
        titleOr: "Cross-linker itti dabali",
        descriptionEn: 'Add 0.1% N,N-methylenebisacrylamide as cross-linking agent.',
        descriptionAm: '0.1% N,N-ሜቲሌንቢሳክሪላሚድ እንደ መስቀለኛ ማገናኛ ወኪል ማከል።',
        descriptionOr: "N,N-methylenebisacrylamide 0.1% akka ajeentii cross-linking itti dabali.",
        duration: '10 minutes',
        equipment3D: 'flask'
      },
      {
        stepNumber: 3,
        titleEn: 'Initiate Polymerization',
        titleAm: 'ፖሊመራይዜሽን መጀመር',
        titleOr: "Poliimerization jalqabi",
        descriptionEn: 'Heat to 60°C and add potassium persulfate initiator. Gel forms within minutes.',
        descriptionAm: 'ወደ 60 ዲግሪ ሴልሺየስ ማሞቅ እና ፖታሲየም ፐርሰልፌት ጀማሪ ማከል። ጀል በደቂቃዎች ውስጥ ይፈጠራል።',
        descriptionOr: "Gara 60°C ho'isi fi potaasiyeem persulfate initiator itti dabali. Jelii daqiiqaa keessatti uumama.",
        duration: '30 minutes',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 4,
        titleEn: 'Dry and Process',
        titleAm: 'ማድረቅ እና ማቀናበር',
        titleOr: "Gogsii fi qindeessi",
        descriptionEn: 'Dry gel at 60°C. Grind into powder or cut into pieces.',
        descriptionAm: 'ጀልን በ60 ዲግሪ ሴልሺየስ ማድረቅ። ወደ ዱቄት መፍጨት ወይም ወደ ቁርጥራጮች መቁረጥ።',
        descriptionOr: "Jelii 60°C irratti gogsii. Gara daakuutti dabri yookiin gara cicciitaatti muri.",
        duration: '2 hours',
        equipment3D: 'oven'
      },
      {
        stepNumber: 5,
        titleEn: 'Test Absorption',
        titleAm: 'አብዞርፕሽን መሞከር',
        titleOr: "Absorption qori",
        descriptionEn: 'Weigh dry hydrogel. Add to water and measure swelling. Calculate absorption ratio.',
        descriptionAm: 'ደረቅ ሃይድሮጀል መመዘን። ወደ ውሃ ማከል እና መነፋት መለካት። የአብዞርፕሽን ሬሾ ማስላት።',
        descriptionOr: "Haayidiroojelii gogaa madaali. Gara bishaanii itti dabali fi dhiitoo safari. Reeshiyoo absorption lakka'i.",
        duration: '1 hour',
        equipment3D: 'balance'
      }
    ],
    variations: ['Test with salt water vs fresh water', 'Add to soil and test plant growth', 'Compare homemade to commercial diaper crystals'],
    expectedResults: 'Powder that absorbs 100-500x its weight in water. Swells into gel.',
    scienceExplanation: 'Cross-linked polyacrylate network creates osmotic pressure difference, drawing water into the polymer matrix.',
    icon: '💦',
    animation3D: 'beaker'
  },
  {
    id: 'green-nanoparticles',
    titleEn: 'Green Synthesis of Silver Nanoparticles',
    titleAm: 'የብር ናኖፓርቲክሎች አረንጓዴ ውህደት',
    titleOr: "Walitti makuu magariisa naanoopaartikaloota meetii",
    descriptionEn: 'Synthesize silver nanoparticles using plant extracts as reducing and capping agents.',
    descriptionAm: 'የዕፅዋት ምርቶችን እንደ ማቀነሻ እና ካፒንግ ወኪሎች በመጠቀም የብር ናኖፓርቲክሎችን ማዋሃድ።',
    descriptionOr: "Bu'aawwan biqilaa akka ajeentii hir'isuu fi kaappingii fayyadamuun naanoopaartikaloota meetii walitti makuu.",
    level: 'intermediate',
    category: 'green-chemistry',
    chemistryTopics: ['Nanochemistry', 'Green Chemistry', 'Reduction Reactions'],
    duration: '3-4 hours',
    difficulty: 3,
    safetyLevel: 'low',
    requiredEquipment: ['Beakers', 'Hot plate', 'Stirrer', 'UV-Vis spectrophotometer', 'Centrifuge (optional)'],
    requiredChemicals: ['Silver nitrate', 'Fresh plant material (aloe, turmeric, neem)', 'Distilled water'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Prepare Plant Extract',
        titleAm: 'የዕፅዋት ምርት ማዘጋጀት',
        titleOr: "Bu'aa biqilaa qopheessi",
        descriptionEn: 'Wash and chop 20g fresh aloe vera. Boil in 100ml water for 15 min. Filter.',
        descriptionAm: '20 ግራም ትኩስ አሎ ቬራ ማጠብና መቁረጥ። በ100 ሚሊ ውሃ ውስጥ ለ15 ደቂቃ ማፍላት። ማጣራት።',
        descriptionOr: "Aloo veeraa qulqulluu g 20 dhiqii fi muri. Bishaan ml 100 keessatti daqiiqaa 15f danfisi. Calali.",
        duration: '30 minutes',
        equipment3D: 'pot'
      },
      {
        stepNumber: 2,
        titleEn: 'Prepare Silver Nitrate',
        titleAm: 'ሲልቨር ናይትሬት ማዘጋጀት',
        titleOr: "Silvarii naayitreetii qopheessi",
        descriptionEn: 'Dissolve 0.1g silver nitrate in 100ml distilled water (1mM solution).',
        descriptionAm: '0.1 ግራም ሲልቨር ናይትሬት በ100 ሚሊ ንጹህ ውሃ ውስጥ ማሟሟት (1mM መፍትሄ)።',
        descriptionOr: "Silvarii naayitreetii g 0.1 bishaan qulqulluu ml 100 keessatti bulbuli (furmaata 1mM).",
        duration: '10 minutes',
        equipment3D: 'flask'
      },
      {
        stepNumber: 3,
        titleEn: 'Synthesis Reaction',
        titleAm: 'የውህደት ምላሽ',
        titleOr: "Response walitti makuu",
        descriptionEn: 'Add 10ml plant extract to 90ml AgNO₃ solution. Stir and heat to 60°C. Watch for color change.',
        descriptionAm: '10 ሚሊ የዕፅዋት ምርት ወደ 90 ሚሊ AgNO₃ መፍትሄ ማከል። ማነሳሳት እና ወደ 60 ዲግሪ ሴልሺየስ ማሞቅ። የቀለም ለውጥ መከታተል።',
        descriptionOr: "Bu'aa biqilaa ml 10 gara furmaata AgNO₃ ml 90 itti dabali. Naannessi fi gara 60°C ho'isi. Jijjiirama halluu ilaali.",
        duration: '1-2 hours',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 4,
        titleEn: 'Monitor Color Change',
        titleAm: 'የቀለም ለውጥ መከታተል',
        titleOr: "Jijjiirama halluu hordofi",
        descriptionEn: 'Colorless to yellow to brown indicates nanoparticle formation. Different sizes = different colors.',
        descriptionAm: 'ቀለም የሌለው ወደ ቢጫ ወደ ቡናማ ናኖፓርቲክል መፈጠርን ያሳያል። የተለያዩ መጠኖች = የተለያዩ ቀለሞች።',
        descriptionOr: "Halluu malee gara keelloo gara magaalaa uumamuu naanoopaartikala agarsiisa. Hammawwan adda addaa = halluuwwan adda addaa.",
        duration: '1 hour',
        equipment3D: 'test-tubes'
      },
      {
        stepNumber: 5,
        titleEn: 'UV-Vis Analysis',
        titleAm: 'UV-Vis ትንተና',
        titleOr: "Xiinxala UV-Vis",
        descriptionEn: 'Measure UV-Vis spectrum. Peak around 420-450nm confirms silver nanoparticles.',
        descriptionAm: 'UV-Vis ስፔክትረም መለካት። በ420-450nm አካባቢ ያለው ጫፍ የብር ናኖፓርቲክሎችን ያረጋግጣል።',
        descriptionOr: "Ispeektiramii UV-Vis safari. Tuullaan naannoo 420-450nm naanoopaartikaloota meetii mirkaneessa.",
        duration: '30 minutes',
        equipment3D: 'spectrophotometer'
      }
    ],
    variations: ['Compare different plant sources', 'Vary pH and see size changes', 'Test antimicrobial activity'],
    expectedResults: 'Yellow to brown colloidal solution with UV-Vis peak at 420-450nm (surface plasmon resonance).',
    scienceExplanation: 'Plant polyphenols reduce Ag⁺ to Ag⁰. Biomolecules cap nanoparticles, preventing aggregation.',
    icon: '🧬',
    animation3D: 'spectrophotometer'
  },
  // ============ ADVANCED LEVEL ============
  {
    id: 'fuel-cell',
    titleEn: 'Simple PEM Fuel Cell',
    titleAm: 'ቀላል PEM ነዳጅ ሴል',
    titleOr: "Seelii boba'aa PEM salphaa",
    descriptionEn: 'Build a proton exchange membrane fuel cell to generate electricity from hydrogen.',
    descriptionAm: 'ከሃይድሮጅን ኤሌክትሪክ ለማመንጨት ፕሮቶን ኤክስቼንጅ ሜምብሬን ነዳጅ ሴል መገንባት።',
    descriptionOr: "Haayidiroojinii irraa elektirikii uumuuf seelii boba'aa meembireenii jijjiirraa pirootoonii ijaaruu.",
    level: 'advanced',
    category: 'electrochemistry',
    chemistryTopics: ['Electrochemistry', 'Catalysis', 'Energy Conversion'],
    duration: '1-2 days',
    difficulty: 5,
    safetyLevel: 'high',
    requiredEquipment: ['Nafion membrane', 'Carbon cloth electrodes', 'Platinum catalyst', 'Gas flow plates', 'Multimeter'],
    requiredChemicals: ['Hydrogen gas', 'Oxygen (or air)', 'Nafion solution', 'Platinum on carbon'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Prepare Catalyst Ink',
        titleAm: 'የካታሊስት ቀለም ማዘጋጀት',
        titleOr: "Qalama kaataalayizaraa qopheessi",
        descriptionEn: 'Mix Pt/C catalyst with Nafion solution and isopropanol. Sonicate to disperse.',
        descriptionAm: 'Pt/C ካታሊስትን ከናፊዮን መፍትሄ እና ከ isopropanol ጋር መቀላቀል። ለማሰራጨት sonicate ማድረግ።',
        descriptionOr: "Kaataalayizara Pt/C furmaata Nafion fi isopropanol wajjin makii. Facaasuuf sonicate godhi.",
        safetyNote: 'Work in well-ventilated area. Hydrogen is flammable!',
        duration: '1 hour',
        equipment3D: 'flask'
      },
      {
        stepNumber: 2,
        titleEn: 'Coat Electrodes',
        titleAm: 'ኤሌክትሮዶችን መሸፈን',
        titleOr: "Elektiroodota uwwisi",
        descriptionEn: 'Spray or brush catalyst ink onto carbon cloth. Dry at 80°C. This creates the MEA.',
        descriptionAm: 'የካታሊስት ቀለም በካርቦን ጨርቅ ላይ መርጨት ወይም መቀባት። በ80 ዲግሪ ሴልሺየስ ማድረቅ። ይህ MEA ይፈጥራል።',
        descriptionOr: "Qalama kaataalayizaraa huccuu kaarbonii irratti biifi yookiin dibii. 80°C irratti gogsii. Kun MEA uuma.",
        duration: '2 hours',
        equipment3D: 'carbon-cloth'
      },
      {
        stepNumber: 3,
        titleEn: 'Hot Press MEA',
        titleAm: 'ሞቃት ፕሬስ MEA',
        titleOr: "MEA amma ho'aa dhiibi",
        descriptionEn: 'Hot press electrodes onto Nafion membrane at 130°C for 3 minutes.',
        descriptionAm: 'ኤሌክትሮዶችን በ130 ዲግሪ ሴልሺየስ ለ3 ደቂቃዎች ወደ ናፊዮን ሜምብሬን ሞቃት ፕሬስ ማድረግ።',
        descriptionOr: "Elektiroodota gara meembireenii Nafion 130°C irratti daqiiqaa 3f ho'aa dhiibi.",
        duration: '30 minutes',
        equipment3D: 'hot-press'
      },
      {
        stepNumber: 4,
        titleEn: 'Assemble Cell',
        titleAm: 'ሴል ማጠናቀቅ',
        titleOr: "Seelii walitti qabi",
        descriptionEn: 'Place MEA between flow field plates. Add gaskets. Tighten bolts evenly.',
        descriptionAm: 'MEA በፍሰት መስክ ሰሌዳዎች መካከል ማስቀመጥ። ጋስኬቶች ማከል። ቦልቶችን በእኩል ማጠንከር።',
        descriptionOr: "MEA gabateewwan dirree yaa'insaa gidduutti kaa'i. Gaaskeetoota itti dabali. Boltoota walqixa jabeessi.",
        duration: '30 minutes',
        equipment3D: 'fuel-cell'
      },
      {
        stepNumber: 5,
        titleEn: 'Test Performance',
        titleAm: 'አፈፃፀም መሞከር',
        titleOr: "Raawwii qori",
        descriptionEn: 'Supply hydrogen to anode, oxygen to cathode. Measure voltage and current output.',
        descriptionAm: 'ሃይድሮጅን ወደ አኖድ፣ ኦክስጅን ወደ ካቶድ ማቅረብ። ቮልቴጅ እና የወቅት ውጤት መለካት።',
        descriptionOr: "Haayidiroojinii gara anooda, oksijinii gara kaatooda dhiyeessi. Volteejii fi bu'aa yeroo safari.",
        safetyNote: 'Never mix hydrogen with air/oxygen outside the cell - explosive!',
        duration: '1 hour',
        equipment3D: 'multimeter'
      }
    ],
    variations: ['Test different catalyst loadings', 'Compare air vs pure oxygen', 'Build multi-cell stack'],
    expectedResults: 'Open circuit voltage ~1V per cell. Power output depends on catalyst loading and membrane quality.',
    scienceExplanation: 'Anode: H₂ → 2H⁺ + 2e⁻. Protons pass through membrane. Cathode: O₂ + 4H⁺ + 4e⁻ → 2H₂O. Electrons flow through external circuit.',
    icon: '⚡',
    animation3D: 'fuel-cell'
  },
  {
    id: 'aerogel',
    titleEn: 'Sol-Gel Synthesis of Aerogel-like Materials',
    titleAm: 'ኤሮጀል መሰል ቁሳቁሶች ሶል-ጀል ውህደት',
    titleOr: "Walitti makuu Sol-Gel meeshaalee aerogel fakkaatan",
    descriptionEn: 'Create lightweight, porous silica materials through sol-gel chemistry.',
    descriptionAm: 'በሶል-ጀል ኬሚስትሪ በኩል ቀላል ክብደት ያላቸው ፈሳሽ ሲሊካ ቁሳቁሶችን መፍጠር።',
    descriptionOr: "Keemistiriin sol-gel karaa meeshaalee siilicaa ulfaatina salphaa, meesha qaban uumuu.",
    level: 'advanced',
    category: 'materials',
    chemistryTopics: ['Materials Science', 'Nanotechnology', 'Sol-Gel Process'],
    duration: '1-2 weeks',
    difficulty: 5,
    safetyLevel: 'medium',
    requiredEquipment: ['Beakers', 'Furnace (optional)', 'Drying oven', 'pH meter'],
    requiredChemicals: ['Sodium silicate (water glass)', 'Hydrochloric acid', 'Isopropanol', 'Hexamethyldisilazane (HMDS)'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Prepare Silica Sol',
        titleAm: 'ሲሊካ ሶል ማዘጋጀት',
        titleOr: "Sol siilicaa qopheessi",
        descriptionEn: 'Dilute sodium silicate with water (1:3). Slowly add acid while stirring until pH 5-6.',
        descriptionAm: 'ሶዲየም ሲሊኬትን በውሃ ማቅረፍ (1:3)። pH 5-6 እስኪሆን ድረስ አሲድ በቀስታ በማነሳሳት ማከል።',
        descriptionOr: "Soodiyeem siilikaatii bishaaniin diiluti godhi (1:3). Hanga pH 5-6 ta'utti naannessuun suuta asidii itti dabali.",
        safetyNote: 'Acid is corrosive. Work carefully.',
        duration: '30 minutes',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 2,
        titleEn: 'Gelation',
        titleAm: 'ጀሌሽን',
        titleOr: "Gelation",
        descriptionEn: 'Let sol sit undisturbed. Gelation occurs in hours to days depending on pH.',
        descriptionAm: 'ሶል ሳይናወጥ እንዲቀመጥ ማድረግ። በpH ላይ በመመርኮዝ ጀሌሽን በሰዓታት እስከ ቀናት ይከሰታል።',
        descriptionOr: "Sol osoo hin jeeqamiin akka taa'u godhi. Gelation pH irratti hundaa'uun sa'aatii hanga guyyaatti ni raawwata.",
        duration: '1-3 days',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 3,
        titleEn: 'Solvent Exchange',
        titleAm: 'የመፍትሄ ልውውጥ',
        titleOr: "Jijjiirraa furmaataa",
        descriptionEn: 'Replace water in gel with isopropanol through multiple washes.',
        descriptionAm: 'በተደጋጋሚ ማጠብ በኩል በጀል ውስጥ ያለውን ውሃ በ isopropanol መተካት።',
        descriptionOr: "Dhiqannaa hedduu karaa bishaaniin jelii keessa jiru isopropanol dhaan bakka buusi.",
        duration: '2-3 days',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 4,
        titleEn: 'Surface Modification',
        titleAm: 'የወለል ማሻሻያ',
        titleOr: "Fooyyessa gubbaa",
        descriptionEn: 'Treat gel with HMDS in isopropanol to make it hydrophobic.',
        descriptionAm: 'ሃይድሮፎቢክ ለማድረግ ጀልን በ isopropanol ውስጥ በHMDS ማከም።',
        descriptionOr: "Akka hydrophobic ta'uuf jelii HMDS isopropanol keessaan yaali.",
        duration: '1 day',
        equipment3D: 'flask'
      },
      {
        stepNumber: 5,
        titleEn: 'Ambient Pressure Drying',
        titleAm: 'በዙሪያው ግፊት ማድረቅ',
        titleOr: "Dhiibbaa naannoo gogsuu",
        descriptionEn: 'Dry slowly at 60-80°C. The HMDS prevents pore collapse during drying.',
        descriptionAm: 'በ60-80 ዲግሪ ሴልሺየስ ቀስ ብሎ ማድረቅ። HMDS በማድረቅ ጊዜ ቀዳዳ መውደቅን ይከላከላል።',
        descriptionOr: "60-80°C irratti suuta suuta gogsii. HMDS yeroo gogsuu meesha kufaatii irraa ittisa.",
        duration: '1-2 days',
        equipment3D: 'oven'
      }
    ],
    variations: ['Test insulation properties', 'Try oil absorption', 'Make colored aerogels'],
    expectedResults: 'Lightweight, porous, hydrophobic material. May not be as low-density as supercritical-dried aerogel.',
    scienceExplanation: 'Hydrolysis and condensation of silicates form 3D network. Surface modification prevents capillary stress during drying.',
    icon: '☁️',
    animation3D: 'aerogel'
  }
];

// Import and merge local materials projects
import { localMaterialsProjects } from './localMaterialsProjects';

// Combined projects array with all projects
export const allChemistryProjects: ChemistryProject[] = [
  ...chemistryProjects,
  ...localMaterialsProjects
];

export const getProjectsByLevel = (level: ProjectLevel) => 
  allChemistryProjects.filter(p => p.level === level);

export const getProjectsByCategory = (category: ProjectCategory) => 
  allChemistryProjects.filter(p => p.category === category);

export const getProjectById = (id: string) => 
  allChemistryProjects.find(p => p.id === id);

export const getAllProjects = () => allChemistryProjects;
