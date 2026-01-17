// Chemistry Projects Data with full details, steps, and 3D animation info

export type ProjectLevel = 'beginner' | 'intermediate' | 'advanced';
export type ProjectCategory = 'electrochemistry' | 'organic' | 'materials' | 'green-chemistry' | 'local-materials' | 'biochemistry';

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
  equipment3D?: string; // 3D animation type to show
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
  difficulty: number; // 1-5
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
    variations: [
      'Try plating with nickel sulfate for silver-like finish',
      'Vary voltage to see effect on coating quality',
      'Compare plating on different metals'
    ],
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
    titleOr: "Raafuu diimaa irraa pigmentiiwwan anthoocayaanii baasuudhaan agarsiistuu pH uumamaa kan halluu jijjiiru uumuu.",
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
    variations: [
      'Try turmeric (yellow in acid, red-brown in base)',
      'Make indicator paper by soaking filter paper',
      'Test different plant sources'
    ],
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
    variations: [
      'Compare biodiesel from different oil sources',
      'Test viscosity compared to petroleum diesel',
      'Try potassium hydroxide as catalyst'
    ],
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
        titleOr: "Anhydride aseetikii itti dabali",
        descriptionEn: 'Add 3ml acetic anhydride and 5 drops of phosphoric acid as catalyst.',
        descriptionAm: '3 ሚሊ አሴቲክ አንሃይድራይድ እና 5 ጠብታ ፎስፎሪክ አሲድ እንደ ካታሊስት ማከል።',
        descriptionOr: "Anhydride aseetikii ml 3 fi copha asiidii fosforikii 5 akka kaatalayizaraatti itti dabali.",
        safetyNote: 'Acetic anhydride is corrosive - use fume hood!',
        duration: '5 minutes',
        equipment3D: 'flask'
      },
      {
        stepNumber: 3,
        titleEn: 'Heat in Water Bath',
        titleAm: 'በውሃ መታጠቢያ ማሞቅ',
        titleOr: "Dhiqannaa bishaanii keessatti ho'isi",
        descriptionEn: 'Heat flask in 75°C water bath for 15 minutes with occasional swirling.',
        descriptionAm: 'ፍላስኩን በ75 ዲግሪ ሴልሺየስ ውሃ መታጠቢያ ውስጥ ለ15 ደቂቃዎች ማሞቅ።',
        descriptionOr: "Falaaskii dhiqannaa bishaanii 75°C keessatti daqiiqaa 15f ho'isi.",
        duration: '15 minutes',
        equipment3D: 'water-bath'
      },
      {
        stepNumber: 4,
        titleEn: 'Add Water and Cool',
        titleAm: 'ውሃ ማከል እና ማቀዝቀዝ',
        titleOr: "Bishaan itti dabalii fi qabbaneessi",
        descriptionEn: 'Remove from bath, add 20ml cold water to decompose excess anhydride. Place in ice bath until crystals form.',
        descriptionAm: 'ከመታጠቢያ ማውጣት፣ 20 ሚሊ ቀዝቃዛ ውሃ ማከል። ክሪስታሎች እስኪፈጠሩ ድረስ በበረዶ መታጠቢያ ማስቀመጥ።',
        descriptionOr: "Dhiqannaa keessaa baasi, bishaan qorraa ml 20 itti dabali. Hanga kiristaaliin uumamutti dhiqannaa cabbii keessa kaa'i.",
        duration: '20 minutes',
        equipment3D: 'ice-bath'
      },
      {
        stepNumber: 5,
        titleEn: 'Filter and Dry',
        titleAm: 'ማጣራት እና ማድረቅ',
        titleOr: "Calali fi gogsii",
        descriptionEn: 'Vacuum filter crystals, wash with cold water, and dry. Weigh product to calculate yield.',
        descriptionAm: 'ክሪስታሎችን በቫኪዩም ማጣራት፣ በቀዝቃዛ ውሃ ማጠብ፣ እና ማድረቅ። ምርትን መመዘን ውጤቱን ለማስላት።',
        descriptionOr: "Kiristaalota vaakiyuumii calali, bishaan qorraan dhiqi, fi gogsii. Oomisha madaalii galii herreeguuf.",
        duration: '20 minutes',
        equipment3D: 'vacuum-filter'
      }
    ],
    variations: [
      'Test purity by melting point (pure aspirin: 135-136°C)',
      'Use TLC to check for unreacted salicylic acid',
      'Recrystallize from ethanol for higher purity'
    ],
    expectedResults: 'White crystalline powder (aspirin). Typical yield: 70-90% with melting point close to 135°C.',
    scienceExplanation: 'Salicylic acid + Acetic anhydride → Acetylsalicylic acid (Aspirin) + Acetic acid. Esterification reaction.',
    icon: '💊',
    animation3D: 'flask'
  },
  {
    id: 'photochromic-dyes',
    titleEn: 'Photochromic Dyes (UV-Sensitive Materials)',
    titleAm: 'ፎቶክሮሚክ ቀለሞች (UV-ስሜታዊ ቁሳቁሶች)',
    titleOr: "Halluu fotokiroomikii (meeshaalee UV-miira)",
    descriptionEn: 'Study photochromic dyes that change color under UV light, investigating molecular isomerization.',
    descriptionAm: 'በUV ብርሃን ስር ቀለም የሚቀይሩ ፎቶክሮሚክ ቀለሞችን ማጥናት።',
    descriptionOr: "Halluu fotokiroomikii ifa UV jalatti halluu jijjiiru qo'achuu.",
    level: 'beginner',
    category: 'materials',
    chemistryTopics: ['Photochemistry', 'Molecular Isomerization', 'Light Absorption'],
    duration: '1-2 hours',
    difficulty: 2,
    safetyLevel: 'low',
    requiredEquipment: ['UV light source', 'Petri dishes', 'Brush', 'Clear nail polish', 'White fabric'],
    requiredChemicals: ['Photochromic powder/beads', 'Clear polymer base', 'Ethanol'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Prepare Photochromic Solution',
        titleAm: 'ፎቶክሮሚክ መፍትሄ ማዘጋጀት',
        titleOr: "Furmaata fotokiroomikii qopheessi",
        descriptionEn: 'Mix photochromic powder with clear nail polish or polymer base. Stir well to disperse evenly.',
        descriptionAm: 'ፎቶክሮሚክ ዱቄትን ከግልጽ ጥፍር ቀለም ወይም ፖሊመር መሰረት ጋር መቀላቀል።',
        descriptionOr: "Paawdarii fotokiroomikii polish qeensaa ifa qabu ykn bu'uura poolimarii wajjin makii.",
        duration: '10 minutes',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 2,
        titleEn: 'Apply to Substrate',
        titleAm: 'ወደ ተሸካሚ መሰጠት',
        titleOr: "Gara sabistireetii itti godhi",
        descriptionEn: 'Paint the mixture onto white fabric, paper, or plastic surfaces. Allow to dry completely.',
        descriptionAm: 'ድብልቁን ወደ ነጭ ጨርቅ፣ ወረቀት፣ ወይም ፕላስቲክ ወለል መቀባት። ሙሉ በሙሉ እንዲደርቅ መፍቀድ።',
        descriptionOr: "Makaa huccuu adii, waraqaa, ykn wiirtuu pilaastikii irratti dibi. Guutummaatti akka gogsuuf hayyami.",
        duration: '20 minutes',
        equipment3D: 'brush'
      },
      {
        stepNumber: 3,
        titleEn: 'Expose to UV Light',
        titleAm: 'ለUV ብርሃን ማጋለጥ',
        titleOr: "Ifa UV jalatti saaxili",
        descriptionEn: 'Place samples under UV light or direct sunlight. Observe color change within seconds.',
        descriptionAm: 'ናሙናዎችን በUV ብርሃን ወይም በቀጥታ የፀሐይ ብርሃን ስር ማስቀመጥ። በሰከንዶች ውስጥ የቀለም ለውጥን መመልከት።',
        descriptionOr: "Saampilii ifa UV ykn ifa aduutti kallattii jalatti kaa'i. Sekoondoota keessatti jijjiirama halluu ilaalii.",
        duration: '5 minutes',
        equipment3D: 'uv-lamp'
      },
      {
        stepNumber: 4,
        titleEn: 'Measure Fading Rate',
        titleAm: 'የመበራየት ፍጥነት መለካት',
        titleOr: "Saffisa dhaamuu madaali",
        descriptionEn: 'Remove from UV and time how long the color takes to fade back to original. Record data.',
        descriptionAm: 'ከUV ማስወገድ እና ቀለሙ ወደ መጀመሪያው ለመመለስ ምን ያህል ጊዜ እንደሚወስድ ማስላት።',
        descriptionOr: "UV irraa baasi fi halluun gara jalqabaatti deebi'uuf hammam akka fudhatu herreegi.",
        duration: '15 minutes',
        equipment3D: 'timer'
      },
      {
        stepNumber: 5,
        titleEn: 'Compare Different Conditions',
        titleAm: 'የተለያዩ ሁኔታዎችን ማወዳደር',
        titleOr: "Haala adda addaa wal bira qabi",
        descriptionEn: 'Test with different UV intensities, temperatures, and embedding materials. Document all results.',
        descriptionAm: 'በተለያዩ UV ጥንካሬዎች፣ ሙቀቶች፣ እና የማስገባት ቁሳቁሶች መሞከር።',
        descriptionOr: "Ciimina UV adda addaa, ho'a, fi meeshaalee keessa galchuu fayyadamuun qori.",
        duration: '30 minutes',
        equipment3D: 'test-tubes'
      }
    ],
    variations: [
      'Create UV-sensitive wristbands or stickers',
      'Compare spiropyran vs spirooxazine dyes',
      'Make photochromic slime'
    ],
    expectedResults: 'Colorless/pale materials that turn vibrant colors under UV, then fade back when UV is removed.',
    scienceExplanation: 'UV light causes molecular isomerization (ring opening), creating new conjugated system that absorbs visible light differently.',
    icon: '🌈',
    animation3D: 'uv-lamp'
  },

  // ============ INTERMEDIATE/ADVANCED LEVEL ============
  {
    id: 'schiff-base',
    titleEn: 'Schiff Base Ligand and Metal Complex Synthesis',
    titleAm: 'ሺፍ ቤዝ ሊጋንድ እና የብረት ኮምፕሌክስ ውህደት',
    titleOr: "Walitti makuu Ligaandii fi Kompleeksii Sibiilaa Shiff Base",
    descriptionEn: 'Synthesize a Schiff base ligand from aldehyde and amine, then create colorful metal complexes.',
    descriptionAm: 'ከአልዲሃይድ እና አሚን ሺፍ ቤዝ ሊጋንድ ማዋሃድ፣ ከዚያም ቀለማማ የብረት ኮምፕሌክሶችን መፍጠር።',
    descriptionOr: "Aldehayidii fi amiinii irraa ligaandii Schiff base walitti makuufi, achiis kompleeksoota sibiilaa halluu qaban uumuu.",
    level: 'intermediate',
    category: 'organic',
    chemistryTopics: ['Coordination Chemistry', 'Organic Synthesis', 'Spectroscopy'],
    duration: '4-6 hours',
    difficulty: 4,
    safetyLevel: 'medium',
    requiredEquipment: ['Round-bottom flask', 'Reflux condenser', 'Magnetic stirrer', 'UV-Vis spectrophotometer', 'IR spectrometer'],
    requiredChemicals: ['Salicylaldehyde', 'Aniline or ethylenediamine', 'Ethanol', 'Copper(II) acetate', 'Nickel chloride'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Prepare Schiff Base Ligand',
        titleAm: 'ሺፍ ቤዝ ሊጋንድ ማዘጋጀት',
        titleOr: "Ligaandii Schiff Base qopheessi",
        descriptionEn: 'Dissolve 1 mmol salicylaldehyde in 10ml ethanol. Add 1 mmol aniline dropwise while stirring.',
        descriptionAm: '1 ሚሊሞል ሳሊሲላልዲሃይድ በ10 ሚሊ ኢታኖል ማሟሟት። 1 ሚሊሞል አኒሊን ጠብታ በጠብታ ማከል።',
        descriptionOr: "Saalisaalaldehayidii mmol 1 eethaanal ml 10 keessatti bulbuli. Copha copha aniiliinii mmol 1 dabalaa turi.",
        duration: '15 minutes',
        equipment3D: 'round-bottom-flask'
      },
      {
        stepNumber: 2,
        titleEn: 'Reflux the Mixture',
        titleAm: 'ድብልቁን ማንጸባረቅ',
        titleOr: "Makaa refluksii godhi",
        descriptionEn: 'Attach reflux condenser and heat mixture at reflux for 2 hours. Yellow Schiff base precipitate forms.',
        descriptionAm: 'ሪፍለክስ ኮንደንሰር ማያያዝ እና ድብልቁን በሪፍለክስ ለ2 ሰዓታት ማሞቅ።',
        descriptionOr: "Kondensarii refluuksii qabsiisi fi makaa sa'aatii 2f refluuksii irratti ho'isi.",
        duration: '2 hours',
        equipment3D: 'reflux-condenser'
      },
      {
        stepNumber: 3,
        titleEn: 'Isolate the Ligand',
        titleAm: 'ሊጋንዱን መነጠል',
        titleOr: "Ligaandii addaan baasi",
        descriptionEn: 'Cool, filter yellow crystals, wash with cold ethanol, and dry. This is your Schiff base ligand.',
        descriptionAm: 'ማቀዝቀዝ፣ ቢጫ ክሪስታሎችን ማጣራት፣ በቀዝቃዛ ኢታኖል ማጠብ፣ እና ማድረቅ።',
        descriptionOr: "Qabbaneessi, kiristaalota keelloo calali, eethaanal qorraan dhiqi, fi gogsii.",
        duration: '30 minutes',
        equipment3D: 'vacuum-filter'
      },
      {
        stepNumber: 4,
        titleEn: 'Prepare Metal Complex',
        titleAm: 'የብረት ኮምፕሌክስ ማዘጋጀት',
        titleOr: "Kompleeksii sibiilaa qopheessi",
        descriptionEn: 'Dissolve 1 mmol Schiff base in ethanol. Add 0.5 mmol copper(II) acetate solution. Colored complex precipitates.',
        descriptionAm: '1 ሚሊሞል ሺፍ ቤዝ በኢታኖል ማሟሟት። 0.5 ሚሊሞል መዳብ(II) አሴቴት መፍትሄ ማከል።',
        descriptionOr: "Schiff base mmol 1 eethaanal keessatti bulbuli. Furmaata aaseeteetii koopparii(II) mmol 0.5 itti dabali.",
        duration: '30 minutes',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 5,
        titleEn: 'Characterize Products',
        titleAm: 'ምርቶችን መገለጽ',
        titleOr: "Oomishaalee ibsi",
        descriptionEn: 'Take UV-Vis spectra (metal d-d transitions), IR spectra (C=N stretch), and melting points.',
        descriptionAm: 'UV-Vis ስፔክትራ (የብረት d-d ሽግግሮች)፣ IR ስፔክትራ፣ እና የማቅለጫ ነጥቦችን መውሰድ።',
        descriptionOr: "Ispeektraa UV-Vis (ce'umsa sibiilaa d-d), ispeektraa IR, fi qabxiilee baquu fudhachuu.",
        duration: '1 hour',
        equipment3D: 'spectrophotometer'
      }
    ],
    variations: [
      'Try different metal ions (Ni²⁺, Zn²⁺, Fe³⁺)',
      'Use bidentate vs tetradentate ligands',
      'Test antibacterial properties of complexes'
    ],
    expectedResults: 'Yellow Schiff base crystals and green/blue copper complex. Distinct UV-Vis absorption bands.',
    scienceExplanation: 'Condensation: Aldehyde + Amine → Schiff base (C=N imine). Metal coordination changes electronic structure and color.',
    icon: '⚗️',
    animation3D: 'round-bottom-flask'
  },
  {
    id: 'hydrogels',
    titleEn: 'Superabsorbent Hydrogels for Water Retention',
    titleAm: 'ውሃ ለማቆየት የሚጠቅሙ ሃይድሮጄሎች',
    titleOr: "Bishaan turfachuuf Haayidiroojeeloota bishaan baay'ee xuuxan",
    descriptionEn: 'Synthesize sodium polyacrylate hydrogel and test its water absorption capacity.',
    descriptionAm: 'ሶዲየም ፖሊአክሪሌት ሃይድሮጄል ማዋሃድ እና የውሃ መምጠጥ ችሎታውን መሞከር።',
    descriptionOr: "Haayidiroojeel soodiyeem poolii-aakiriileetii walitti makuufi dandeettii bishaan xuuxuu isaa qoruu.",
    level: 'intermediate',
    category: 'materials',
    chemistryTopics: ['Polymer Chemistry', 'Cross-linking', 'Absorption Kinetics'],
    duration: '3-4 hours',
    difficulty: 4,
    safetyLevel: 'high',
    requiredEquipment: ['Beakers', 'Magnetic stirrer', 'UV lamp (optional)', 'Balance', 'Graduated cylinders'],
    requiredChemicals: ['Acrylic acid', 'Sodium hydroxide', 'Potassium persulfate', 'N,N-methylenebisacrylamide', 'Distilled water'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Neutralize Acrylic Acid',
        titleAm: 'አክሪሊክ አሲድ ገለልተኛ ማድረግ',
        titleOr: "Asiidii aakirilikii giddugaleessa godhi",
        descriptionEn: 'Dissolve 5g NaOH in water. Slowly add 10ml acrylic acid (exothermic!) to make sodium acrylate.',
        descriptionAm: '5 ግራም NaOH በውሃ ማሟሟት። 10 ሚሊ አክሪሊክ አሲድ ቀስ በቀስ ማከል ሶዲየም አክሪሌት ለመስራት።',
        descriptionOr: "NaOH g 5 bishaan keessatti bulbuli. Soodiyeem aakiriileetii hojjechuuf asiidii aakirilikii ml 10 suuta itti dabali (exothermic!).",
        safetyNote: 'Acrylic acid is corrosive and toxic! Use fume hood and full PPE!',
        duration: '20 minutes',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 2,
        titleEn: 'Add Cross-linker',
        titleAm: 'ክሮስ-ሊንከር ማከል',
        titleOr: "Cross-linker itti dabali",
        descriptionEn: 'Add 0.1g N,N-methylenebisacrylamide (MBA) as cross-linking agent. Stir to dissolve.',
        descriptionAm: '0.1 ግራም MBA እንደ ክሮስ-ሊንኪንግ ወኪል ማከል። ለማሟሟት መቀላቀል።',
        descriptionOr: "MBA g 0.1 akka ejentii cross-linking tti itti dabali. Bulbuluuf makii.",
        duration: '10 minutes',
        equipment3D: 'magnetic-stirrer'
      },
      {
        stepNumber: 3,
        titleEn: 'Initiate Polymerization',
        titleAm: 'ፖሊመራይዜሽን መጀመር',
        titleOr: "Pooliimaraayizeeshinii jalqabi",
        descriptionEn: 'Add 0.2g potassium persulfate initiator. Heat to 60°C or expose to UV to start polymerization.',
        descriptionAm: '0.2 ግራም ፖታሲየም ፐርሰልፌት ኢኒሺየተር ማከል። ፖሊመራይዜሽን ለመጀመር ወደ 60°C ማሞቅ ወይም ለUV ማጋለጥ።',
        descriptionOr: "Jalqabsiisaa potaasiyeemii persalfeetii g 0.2 itti dabali. Pooliimaraayizeeshinii jalqabuuf hanga 60°C ho'isi ykn UV saaxili.",
        duration: '30 minutes',
        equipment3D: 'hot-plate'
      },
      {
        stepNumber: 4,
        titleEn: 'Dry the Hydrogel',
        titleAm: 'ሃይድሮጄሉን ማድረቅ',
        titleOr: "Haayidiroojeel gogsii",
        descriptionEn: 'Once gel forms, cut into small pieces and dry completely in oven at 60°C.',
        descriptionAm: 'ጄል ከተፈጠረ በኋላ ወደ ትንንሽ ቁርጥራጮች መቁረጥ እና በኦቨን በ60 ዲግሪ ሴልሺየስ ሙሉ በሙሉ ማድረቅ።',
        descriptionOr: "Erga jeeliin uumamee booda gara cicciitaa xixiqqootti kutii fi oovanii keessatti 60°C irratti guutummaatti gogsii.",
        duration: '2-4 hours',
        equipment3D: 'oven'
      },
      {
        stepNumber: 5,
        titleEn: 'Test Absorption Capacity',
        titleAm: 'የመምጠጥ ችሎታ መሞከር',
        titleOr: "Dandeettii xuuxuu qori",
        descriptionEn: 'Weigh dry gel, add to water, wait 30 min, then weigh swollen gel. Calculate absorption ratio.',
        descriptionAm: 'ደረቅ ጄልን መመዘን፣ ወደ ውሃ ማከል፣ 30 ደቂቃ መጠበቅ፣ ከዚያም የወረጠውን ጄል መመዘን።',
        descriptionOr: "Jeelii gogaa madaali, bishaanitti itti dabali, daqiiqaa 30 eegi, achiis jeelii dhiitessee madaali.",
        duration: '45 minutes',
        equipment3D: 'balance'
      }
    ],
    variations: [
      'Compare absorption in water vs salt water',
      'Add starch for biodegradable version',
      'Test as soil additive for plants'
    ],
    expectedResults: 'Gel absorbs 100-500x its weight in water. Lower absorption in salt solutions due to osmotic effects.',
    scienceExplanation: 'Cross-linked polymer network with ionic groups creates osmotic pressure drawing water into gel structure.',
    icon: '💧',
    animation3D: 'beaker'
  },
  {
    id: 'green-nanoparticles',
    titleEn: 'Green Synthesis of Silver/Gold Nanoparticles',
    titleAm: 'የብርና ወርቅ ናኖ ቅንጣቶች አረንጓዴ ውህደት',
    titleOr: "Walitti makuu magariisa nanoparticles meetii/warqii",
    descriptionEn: 'Synthesize metal nanoparticles using plant extracts as reducing and capping agents.',
    descriptionAm: 'የእፅዋት ይዘቶችን እንደ መቀነሻ እና መሸፈኛ ወኪል በመጠቀም የብረት ናኖ ቅንጣቶችን ማዋሃድ።',
    descriptionOr: "Baasii biqiltootaa akka ejentii hir'isuufi haguuguutti fayyadamuun nanopartikilota sibiilaa walitti makuu.",
    level: 'advanced',
    category: 'green-chemistry',
    chemistryTopics: ['Nanochemistry', 'Green Chemistry', 'Reduction Reactions', 'Surface Plasmon Resonance'],
    duration: '3-4 hours',
    difficulty: 4,
    safetyLevel: 'medium',
    requiredEquipment: ['Hot plate', 'Magnetic stirrer', 'UV-Vis spectrophotometer', 'Centrifuge', 'Beakers'],
    requiredChemicals: ['Silver nitrate (AgNO₃)', 'Plant extract (aloe vera, turmeric, or lemongrass)', 'Distilled water'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Prepare Plant Extract',
        titleAm: 'የእፅዋት ይዘት ማዘጋጀት',
        titleOr: "Baasii biqiltootaa qopheessi",
        descriptionEn: 'Boil 10g fresh plant material in 100ml water for 15 min. Filter and cool the extract.',
        descriptionAm: '10 ግራም ትኩስ የእፅዋት ቁሳቁስ በ100 ሚሊ ውሃ ውስጥ ለ15 ደቂቃዎች ማፍላት። ማጣራት እና ማቀዝቀዝ።',
        descriptionOr: "Meeshaa biqiltuu haaraa g 10 bishaan ml 100 keessatti daqiiqaa 15f danfisi. Baasii calali fi qabbaneessi.",
        duration: '30 minutes',
        equipment3D: 'pot'
      },
      {
        stepNumber: 2,
        titleEn: 'Prepare Silver Nitrate Solution',
        titleAm: 'የብር ናይትሬት መፍትሄ ማዘጋጀት',
        titleOr: "Furmaata siilvarii naayitireetii qopheessi",
        descriptionEn: 'Dissolve 0.1g AgNO₃ in 100ml distilled water to make 1mM solution.',
        descriptionAm: '0.1 ግራም AgNO₃ በ100 ሚሊ ንፁህ ውሃ ማሟሟት 1mM መፍትሄ ለመስራት።',
        descriptionOr: "Furmaata 1mM hojjechuuf AgNO₃ g 0.1 bishaan qulqulluu ml 100 keessatti bulbuli.",
        safetyNote: 'Silver nitrate stains skin - wear gloves!',
        duration: '10 minutes',
        equipment3D: 'flask'
      },
      {
        stepNumber: 3,
        titleEn: 'Mix and Observe Color Change',
        titleAm: 'መቀላቀል እና የቀለም ለውጥ መመልከት',
        titleOr: "Makii fi jijjiirama halluu ilaalii",
        descriptionEn: 'Add plant extract dropwise to AgNO₃ solution with stirring. Observe color change from colorless to yellow/brown.',
        descriptionAm: 'የእፅዋት ይዘትን ጠብታ በጠብታ ወደ AgNO₃ መፍትሄ ማከል። ከቀለም አልባ ወደ ቢጫ/ቡናማ የቀለም ለውጥን መመልከት።',
        descriptionOr: "Baasii biqiltootaa copha copha furmaata AgNO₃ tti dabalaa turi. Jijjiirama halluu halluu-malee irraa gara keelloo/daalacha ilaalii.",
        duration: '30 minutes',
        equipment3D: 'magnetic-stirrer'
      },
      {
        stepNumber: 4,
        titleEn: 'Heat to Complete Reaction',
        titleAm: 'ምላሹን ለማጠናቀቅ ማሞቅ',
        titleOr: "Deebii xumuuruuf ho'isi",
        descriptionEn: 'Heat mixture at 60-80°C for 30-60 min. Color intensifies as more nanoparticles form.',
        descriptionAm: 'ድብልቁን በ60-80°C ለ30-60 ደቂቃዎች ማሞቅ። ተጨማሪ ናኖ ቅንጣቶች ሲፈጠሩ ቀለሙ ይበረታል።',
        descriptionOr: "Makaa 60-80°C irratti daqiiqaa 30-60f ho'isi. Nanopartikilota dabalataa yoo uumaman halluun cimaa.",
        duration: '1 hour',
        equipment3D: 'hot-plate'
      },
      {
        stepNumber: 5,
        titleEn: 'Characterize with UV-Vis',
        titleAm: 'በUV-Vis መገለጽ',
        titleOr: "UV-Vis tiin ibsi",
        descriptionEn: 'Take UV-Vis spectrum. Silver nanoparticles show peak at 400-450nm (surface plasmon resonance).',
        descriptionAm: 'UV-Vis ስፔክትረም መውሰድ። የብር ናኖ ቅንጣቶች በ400-450nm ከፍተኛ ነጥብ ያሳያሉ።',
        descriptionOr: "Ispeektiramii UV-Vis fudhachuu. Nanopartikilotni meetii 400-450nm irratti olka agarsiisu.",
        duration: '30 minutes',
        equipment3D: 'spectrophotometer'
      }
    ],
    variations: [
      'Compare different plant extracts',
      'Vary pH to control nanoparticle size',
      'Try gold nanoparticles (HAuCl₄)'
    ],
    expectedResults: 'Colloidal solution with distinct color (silver: yellow-brown, gold: red-purple). UV-Vis peak confirms nanoparticles.',
    scienceExplanation: 'Plant polyphenols reduce Ag⁺ to Ag⁰ and cap nanoparticles, preventing aggregation. SPR causes characteristic color.',
    icon: '🔬',
    animation3D: 'spectrophotometer'
  },
  {
    id: 'fuel-cell',
    titleEn: 'Simple Hydrogen Fuel Cell',
    titleAm: 'ቀላል የሃይድሮጅን ነዳጅ ሴል',
    titleOr: "Seelii boba'aa haayidiroojinii salphaa",
    descriptionEn: 'Build a proton exchange membrane fuel cell and generate electricity from hydrogen.',
    descriptionAm: 'ፕሮቶን ልውውጥ ሜምብሬን ነዳጅ ሴል መገንባት እና ከሃይድሮጅን ኤሌክትሪክ ማመንጨት።',
    descriptionOr: "Seelii boba'aa membireenii jijjiirraa pirootoonii ijaaruu fi haayidiroojinii irraa elektirikii madisiisuu.",
    level: 'advanced',
    category: 'electrochemistry',
    chemistryTopics: ['Electrochemistry', 'Catalysis', 'Energy Conversion'],
    duration: '4-6 hours',
    difficulty: 5,
    safetyLevel: 'high',
    requiredEquipment: ['PEM membrane', 'Carbon cloth electrodes', 'Platinum catalyst', 'Hydrogen source', 'Multimeter'],
    requiredChemicals: ['Nafion solution', 'Platinum on carbon catalyst', 'Isopropanol', 'Hydrogen gas or electrolyzer'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Prepare Catalyst Ink',
        titleAm: 'የካታሊስት ቀለም ማዘጋጀት',
        titleOr: "Xiinxii kaatalayizaraa qopheessi",
        descriptionEn: 'Mix 50mg Pt/C catalyst with 1ml Nafion solution and 2ml isopropanol. Sonicate to disperse.',
        descriptionAm: '50 ሚግ Pt/C ካታሊስት ከ1 ሚሊ ናፊዮን መፍትሄ እና 2 ሚሊ ኢሶፕሮፓኖል ጋር መቀላቀል።',
        descriptionOr: "Kaatalayizaraa Pt/C mg 50 furmaata Nafion ml 1 fi isopropanol ml 2 wajjin makii.",
        safetyNote: 'Hydrogen is extremely flammable! Work in well-ventilated area!',
        duration: '30 minutes',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 2,
        titleEn: 'Coat Electrodes',
        titleAm: 'ኤሌክትሮዶችን መሸፈን',
        titleOr: "Elektirodoota uwwisi",
        descriptionEn: 'Brush or spray catalyst ink onto carbon cloth electrodes. Dry at 60°C for 1 hour.',
        descriptionAm: 'የካታሊስት ቀለምን በብሩሽ ወይም በስፕሬይ ወደ ካርቦን ጨርቅ ኤሌክትሮዶች መሸፈን። በ60°C ለ1 ሰዓት ማድረቅ።',
        descriptionOr: "Xiinxii kaatalayizaraa buruushii ykn ispireedhaan elektirodoota huccuu kaarbonii irratti dibi. 60°C irratti sa'aatii 1f gogsii.",
        duration: '1.5 hours',
        equipment3D: 'brush'
      },
      {
        stepNumber: 3,
        titleEn: 'Assemble MEA',
        titleAm: 'MEA ማጠናቀቅ',
        titleOr: "MEA walitti qabi",
        descriptionEn: 'Sandwich PEM membrane between two coated electrodes. Hot press at 130°C if possible.',
        descriptionAm: 'PEM ሜምብሬንን በሁለት በተሸፈኑ ኤሌክትሮዶች መካከል ማስቀመጥ። በ130°C ሙቅ መጫን ከተቻለ።',
        descriptionOr: "Membireenii PEM elektirodoota lama uwwifaman gidduu kaa'i. Yoo danda'ame 130°C irratti ho'isii dhiibi.",
        duration: '30 minutes',
        equipment3D: 'hot-press'
      },
      {
        stepNumber: 4,
        titleEn: 'Assemble Cell Hardware',
        titleAm: 'የሴል ሃርድዌር ማጠናቀቅ',
        titleOr: "Haardiweeraa seelii walitti qabi",
        descriptionEn: 'Place MEA in cell housing with flow channels. Connect gas inlets and electrical leads.',
        descriptionAm: 'MEA ን በሴል ቤት ውስጥ ከፍሰት ቻነሎች ጋር ማስቀመጥ። የጋዝ መግቢያዎችን እና የኤሌክትሪክ መስመሮችን ማገናኘት።',
        descriptionOr: "MEA mana seelii keessatti chaanaalota yaa'insaa wajjin kaa'i. Seensa gaazii fi sararoota elektirikii walqunnamsiisi.",
        duration: '30 minutes',
        equipment3D: 'fuel-cell'
      },
      {
        stepNumber: 5,
        titleEn: 'Test and Measure',
        titleAm: 'መሞከር እና መለካት',
        titleOr: "Qori fi madaali",
        descriptionEn: 'Flow hydrogen to anode, air/oxygen to cathode. Measure voltage and current with multimeter.',
        descriptionAm: 'ሃይድሮጅን ወደ አኖድ፣ አየር/ኦክስጅን ወደ ካቶድ ማስፈስ። ቮልቴጅና ካሬንት በማልቲሜትር መለካት።',
        descriptionOr: "Haayidiroojinii gara anooda, qilleensa/oksijinii gara kaatooda yaa'iisi. Volcii fi karantii multiliimataraan madaali.",
        duration: '1 hour',
        equipment3D: 'multimeter'
      }
    ],
    variations: [
      'Compare Pt loading levels',
      'Test with different membranes',
      'Build a small electrolyzer for hydrogen production'
    ],
    expectedResults: 'Single cell produces 0.6-1.0V open circuit. Power output depends on catalyst loading and hydrogen flow.',
    scienceExplanation: 'Anode: H₂ → 2H⁺ + 2e⁻. Cathode: ½O₂ + 2H⁺ + 2e⁻ → H₂O. Protons pass through membrane, electrons flow through external circuit.',
    icon: '⚡',
    animation3D: 'fuel-cell'
  },

  // ============ LOCAL MATERIALS PROJECTS ============
  {
    id: 'lye-soap',
    titleEn: 'Traditional Lye & Soap from Wood Ash',
    titleAm: 'ከእንጨት አመድ ባህላዊ ሻይ እና ሳሙና',
    titleOr: "Daaraa mukaa irraa Shaayii fi saamunaa aadaa",
    descriptionEn: 'Extract potassium hydroxide lye from wood ash and make traditional soap.',
    descriptionAm: 'ከእንጨት አመድ ፖታሲየም ሃይድሮክሳይድ ሻይ ማውጣት እና ባህላዊ ሳሙና መስራት።',
    descriptionOr: "Daaraa mukaa irraa shaayii potaasiyeemii haayidiroksaayidii baasuu fi saamunaa aadaa hojjachuu.",
    level: 'beginner',
    category: 'local-materials',
    chemistryTopics: ['Base Extraction', 'Saponification', 'Traditional Chemistry'],
    duration: '2-3 days',
    difficulty: 2,
    safetyLevel: 'medium',
    requiredEquipment: ['Large container', 'Strainer', 'Pot', 'Wooden spoon', 'Molds'],
    requiredChemicals: ['Wood ash (hardwood preferred)', 'Rainwater', 'Animal fat or vegetable oil'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Collect and Prepare Ash',
        titleAm: 'አመድ መሰብሰብ እና ማዘጋጀት',
        titleOr: "Daaraa walitti qabi fi qopheessi",
        descriptionEn: 'Collect white wood ash (avoid charcoal). Fill container 2/3 with ash.',
        descriptionAm: 'ነጭ የእንጨት አመድ መሰብሰብ (ከሰል ማስወገድ)። መያዣውን 2/3 በአመድ መሙላት።',
        descriptionOr: "Daaraa mukaa adii walitti qabi (kasala ofirraa eegi). Meeshaa 2/3 daadhaan guuti.",
        duration: '30 minutes',
        equipment3D: 'container'
      },
      {
        stepNumber: 2,
        titleEn: 'Leach with Water',
        titleAm: 'በውሃ ማሟሟት',
        titleOr: "Bishaan waliin buuqqisi",
        descriptionEn: 'Pour rainwater over ash. Let it filter through slowly over 24 hours. Collect brown liquid.',
        descriptionAm: 'የዝናብ ውሃ በአመድ ላይ ማፍሰስ። ለ24 ሰዓታት ቀስ ብሎ እንዲወርድ መፍቀድ። ቡናማ ፈሳሽ መሰብሰብ።',
        descriptionOr: "Bishaan roobaa daaraa irratti dhangalaasi. Sa'aatii 24 keessatti suuta akka calalu godhi. Dhangala'aa daalacha walitti qabi.",
        duration: '24 hours',
        equipment3D: 'filter-setup'
      },
      {
        stepNumber: 3,
        titleEn: 'Test Lye Strength',
        titleAm: 'የሻይ ጥንካሬ መሞከር',
        titleOr: "Ciimina shaayii qori",
        descriptionEn: 'Traditional test: if a raw egg or potato floats, lye is strong enough. If not, concentrate by boiling.',
        descriptionAm: 'ባህላዊ ሙከራ፡ ጥሬ እንቁላል ወይም ድንች ከተንሳፈፈ ሻይ በቂ ጥንካሬ አለው። ካልሆነ በማፍላት ማጠንከር።',
        descriptionOr: "Qorannoo aadaa: yoo hanqaaquun dheedhii ykn dinnicha bishaan irra dhaabbate, shaayiin cimaa dha. Yoo hin taane, danfisuudhaan jabeessi.",
        duration: '30 minutes',
        equipment3D: 'pot'
      },
      {
        stepNumber: 4,
        titleEn: 'Heat Fat/Oil',
        titleAm: 'ስብ/ዘይት ማሞቅ',
        titleOr: "Cooma/zayita ho'isi",
        descriptionEn: 'Melt animal fat or heat vegetable oil to 40-50°C.',
        descriptionAm: 'የእንስሳ ስብ ማቅለጥ ወይም አትክልት ዘይት ወደ 40-50°C ማሞቅ።',
        descriptionOr: "Cooma beeladaa baqsi ykn zayita muduraa gara 40-50°C ho'isi.",
        duration: '15 minutes',
        equipment3D: 'pot'
      },
      {
        stepNumber: 5,
        titleEn: 'Combine and Saponify',
        titleAm: 'ማዋሃድ እና ሳፖኒፊኬሽን',
        titleOr: "Walitti makii fi saponify",
        descriptionEn: 'Slowly add lye to fat while stirring constantly. Continue until mixture traces. Pour into molds.',
        descriptionAm: 'ሻይን ወደ ስብ ቀስ ብሎ ማከል ሁልጊዜ እየቀላቀሉ። ድብልቁ ምልክት እስኪሰጥ ድረስ መቀጠል። ወደ ማሰሪያዎች ማፍሰስ።',
        descriptionOr: "Shaayii gara coomaa suuta itti dabali yeroo hunda makaatii jirtu. Makaan hanga mallattoo agarsiisutti itti fufi. Mooldiiwwan keessatti dhangalaasi.",
        safetyNote: 'Lye is caustic - wear gloves and avoid splashes!',
        duration: '1-2 hours',
        equipment3D: 'pot'
      }
    ],
    variations: [
      'Use banana peel ash (higher potassium)',
      'Add essential oils for scent',
      'Compare hardwood vs softwood ash'
    ],
    expectedResults: 'Soft soap that hardens over 4-6 weeks. High cleaning power due to potassium base.',
    scienceExplanation: 'K₂CO₃ + Ca(OH)₂ → KOH (lye). Triglycerides + KOH → Potassium soap + Glycerol (saponification).',
    icon: '🧼',
    animation3D: 'pot'
  },
  {
    id: 'casein-plastic',
    titleEn: 'Casein Plastic (Galalith) from Milk',
    titleAm: 'ከወተት ካሴን ፕላስቲክ',
    titleOr: "Aannan irraa pilaastikii Kaasiinii",
    descriptionEn: 'Precipitate milk protein casein and form it into moldable bioplastic.',
    descriptionAm: 'የወተት ፕሮቲን ካሴንን ማስቆጣት እና ወደ ሊፈጠር የሚችል ባዮፕላስቲክ መቀረጽ።',
    descriptionOr: "Pirootiinii aannan kaasiinii coccobsi fi gara baayoopilaastikii uumamuu danda'uutti bocii.",
    level: 'beginner',
    category: 'local-materials',
    chemistryTopics: ['Protein Chemistry', 'Denaturation', 'Biopolymers'],
    duration: '1-2 hours + drying',
    difficulty: 1,
    safetyLevel: 'low',
    requiredEquipment: ['Pot', 'Strainer', 'Cloth', 'Molds', 'Stove'],
    requiredChemicals: ['Whole milk', 'Vinegar or lemon juice', 'Food coloring (optional)'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Heat the Milk',
        titleAm: 'ወተቱን ማሞቅ',
        titleOr: "Aannan ho'isi",
        descriptionEn: 'Heat 250ml whole milk to about 50°C (warm but not boiling).',
        descriptionAm: '250 ሚሊ ወተት ወደ 50°C ማሞቅ (ሞቃት ግን የማይፈላ)።',
        descriptionOr: "Aannan ml 250 gara 50°C ho'isi (ho'aa garuu hin danfu).",
        duration: '5 minutes',
        equipment3D: 'pot'
      },
      {
        stepNumber: 2,
        titleEn: 'Add Acid to Curdle',
        titleAm: 'ለማቀዝቀዝ አሲድ ማከል',
        titleOr: "Ittissuuf asiidii itti dabali",
        descriptionEn: 'Add 1-2 tablespoons of vinegar while stirring. Milk will curdle, separating curds and whey.',
        descriptionAm: '1-2 የሾርባ ማንኪያ ኮምጣጤ እየቀላቀሉ ማከል። ወተቱ ይቀዝቅዛል፣ ሰቦ እና ወይ ይለያያሉ።',
        descriptionOr: "Maanccaa 1-2 asinbiiba dabalaa makii. Aannan itissa, abuun fi huuziin adda ba'a.",
        duration: '5 minutes',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 3,
        titleEn: 'Strain and Press',
        titleAm: 'ማጣራት እና መጫን',
        titleOr: "Calalii fi dhiibi",
        descriptionEn: 'Strain through cloth, squeeze out excess liquid. You have raw casein.',
        descriptionAm: 'በጨርቅ ማጣራት፣ ተጨማሪ ፈሳሽ ማጭመቅ። ጥሬ ካሴን አለህ።',
        descriptionOr: "Huccuun calali, dhangala'aa dabalataa dhiibi. Amma kaasiinii dheedhii qabda.",
        duration: '10 minutes',
        equipment3D: 'strainer'
      },
      {
        stepNumber: 4,
        titleEn: 'Knead and Mold',
        titleAm: 'መለበጥ እና መቅረጽ',
        titleOr: "Marqi fi boci",
        descriptionEn: 'Knead the casein like dough. Add food coloring if desired. Shape into buttons, beads, or ornaments.',
        descriptionAm: 'ካሴኑን እንደ ሊጥ መለበጥ። ከተፈለገ የምግብ ቀለም ማከል። ወደ ቁልፎች፣ ዶቃዎች፣ ወይም ጌጣጌጦች መቅረጽ።',
        descriptionOr: "Kaasiinii akka daabboo marqi. Yoo barbaadame halluu nyaataa itti dabali. Gara qoflaawwanii, kuula, ykn faayaatti boci.",
        duration: '20 minutes',
        equipment3D: 'hands'
      },
      {
        stepNumber: 5,
        titleEn: 'Dry and Harden',
        titleAm: 'ማድረቅ እና ማጠንከር',
        titleOr: "Gogsii fi jabeessi",
        descriptionEn: 'Let shapes dry for 2-3 days. They harden into durable plastic-like material that can be sanded and polished.',
        descriptionAm: 'ቅርጾች ለ2-3 ቀናት እንዲደርቁ መፍቀድ። ሊሸሸት እና ሊፋቅ የሚችል ዘላቂ ፕላስቲክ የመሰለ ቁሳቁስ ይጠነክራሉ።',
        descriptionOr: "Bocoonni guyyaa 2-3 akka goganif hayyami. Gara meeshaa pilaastikii fakkaatu turaa ta'uu danda'u cimsiifama fi ifa godhamuu danda'utti jabaata.",
        duration: '2-3 days',
        equipment3D: 'mold'
      }
    ],
    variations: [
      'Add glycerin for flexibility',
      'Create decorative beads with natural dyes',
      'Compare casein from different milk types'
    ],
    expectedResults: 'Hard, ivory-colored plastic shapes. Can be drilled, sanded, and polished like bone or ivory.',
    scienceExplanation: 'Acid denatures casein protein, causing it to precipitate. Dried casein cross-links via hydrogen bonds forming rigid structure.',
    icon: '🥛',
    animation3D: 'pot'
  },
  {
    id: 'starch-bioplastic',
    titleEn: 'Biodegradable Packaging Film from Starch',
    titleAm: 'ከስታርች ሊበሰብስ የሚችል ማሸጊያ ፊልም',
    titleOr: "Istaarchii irraa fiilmii paakeejingii tortortuu",
    descriptionEn: 'Create flexible, biodegradable plastic film from cassava, potato, or corn starch.',
    descriptionAm: 'ከካሳቫ፣ ድንች፣ ወይም በቆሎ ስታርች ተለማጭ እና ሊበሰብስ የሚችል ፕላስቲክ ፊልም መፍጠር።',
    descriptionOr: "Istaarchii kaasaavaa, dinnicha, ykn boqqolloo irraa fiilmii pilaastikii laallifamuu fi tortortuu uumuu.",
    level: 'beginner',
    category: 'local-materials',
    chemistryTopics: ['Polymer Chemistry', 'Plasticizers', 'Biodegradation'],
    duration: '2-3 hours + drying',
    difficulty: 2,
    safetyLevel: 'low',
    requiredEquipment: ['Pot', 'Flat surface/tray', 'Stirring rod', 'Stove'],
    requiredChemicals: ['Starch (cassava, potato, corn)', 'Glycerol/glycerin', 'Vinegar', 'Water'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Prepare Starch Slurry',
        titleAm: 'የስታርች ድብልቅ ማዘጋጀት',
        titleOr: "Sluurriii istaarchii qopheessi",
        descriptionEn: 'Mix 2 tablespoons starch with 50ml cold water until smooth.',
        descriptionAm: '2 የሾርባ ማንኪያ ስታርች ከ50 ሚሊ ቀዝቃዛ ውሃ ጋር እስኪለስል ድረስ መቀላቀል።',
        descriptionOr: "Maanccaa 2 istaarchii bishaan qorraa ml 50 wajjin hanga lallaafuutti makii.",
        duration: '5 minutes',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 2,
        titleEn: 'Add Plasticizer',
        titleAm: 'ፕላስቲሳይዘር ማከል',
        titleOr: "Pilaastiisaayizarii itti dabali",
        descriptionEn: 'Add 1 tablespoon glycerol (makes film flexible) and 1 teaspoon vinegar (improves properties).',
        descriptionAm: '1 የሾርባ ማንኪያ ግሊሰሮል (ፊልሙን ተለማጭ ያደርጋል) እና 1 የሻይ ማንኪያ ኮምጣጤ ማከል።',
        descriptionOr: "Maanccaa 1 giilisaroolii (fiilmii laallifamaa godha) fi maanccaa shaayii 1 asinbiiba itti dabali.",
        duration: '2 minutes',
        equipment3D: 'measuring-spoon'
      },
      {
        stepNumber: 3,
        titleEn: 'Heat and Gelatinize',
        titleAm: 'ማሞቅ እና ጄላቲናይዝ',
        titleOr: "Ho'isii fi jeelaatinaayizii",
        descriptionEn: 'Heat while stirring constantly until mixture becomes thick and translucent (gelatinization).',
        descriptionAm: 'ድብልቁ ወፍራም እና ግልጽ እስኪሆን ድረስ ሁልጊዜ እየቀላቀሉ ማሞቅ።',
        descriptionOr: "Makaan hanga furdaa fi ifa ta'utti yeroo hunda makaatii ho'isi (jeelaatinaayizeeshinii).",
        duration: '10 minutes',
        equipment3D: 'pot'
      },
      {
        stepNumber: 4,
        titleEn: 'Pour and Spread',
        titleAm: 'ማፍሰስ እና ማሰራጨት',
        titleOr: "Dhangalaasi fi bittimsi",
        descriptionEn: 'Quickly pour hot mixture onto flat, smooth surface (glass, plastic sheet). Spread evenly and thin.',
        descriptionAm: 'ሙቅ ድብልቁን ወደ ጠፍጣፋ፣ ለስላሳ ወለል (መስታወት፣ ፕላስቲክ ወረቀት) በፍጥነት ማፍሰስ። በእኩል እና ቀጭን ማሰራጨት።',
        descriptionOr: "Makaa ho'aa ariifataan gara wiirtuu diriiraa, lallaafaa (biillaa, waraqaa pilaastikii) dhangalaasi. Walqixa fi qal'aa bittimsi.",
        duration: '5 minutes',
        equipment3D: 'tray'
      },
      {
        stepNumber: 5,
        titleEn: 'Dry and Peel',
        titleAm: 'ማድረቅ እና ማላቀቅ',
        titleOr: "Gogsii fi buqqisi",
        descriptionEn: 'Let dry for 24-48 hours. Peel off flexible film. Test strength and water resistance.',
        descriptionAm: 'ለ24-48 ሰዓታት እንዲደርቅ መፍቀድ። ተለማጭ ፊልሙን ማላቀቅ። ጥንካሬ እና የውሃ መቋቋም መሞከር።',
        descriptionOr: "Sa'aatii 24-48 akka goguuf hayyami. Fiilmii laallifamaa buqqisi. Cimina fi bishaan dura dhaabbachuu qori.",
        duration: '24-48 hours',
        equipment3D: 'film'
      }
    ],
    variations: [
      'Compare different starch sources',
      'Add natural colorants',
      'Test biodegradation rate in soil'
    ],
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
    titleOr: "Sokorota fuduraa danfachuu raammoodhaan iitaanoolii oomishuu.",
    level: 'beginner',
    category: 'biochemistry',
    chemistryTopics: ['Biochemistry', 'Fermentation', 'Oxidation'],
    duration: '5-7 days',
    difficulty: 2,
    safetyLevel: 'low',
    requiredEquipment: ['Large jar/bottle', 'Airlock or balloon', 'Strainer', 'Thermometer'],
    requiredChemicals: ['Overripe fruits (pineapple, mango)', 'Sugar', 'Yeast (baker\'s yeast)', 'Water'],
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
        descriptionEn: 'Cool mash to 30-35°C. Dissolve 7g dry yeast in warm water, add to mash and stir.',
        descriptionAm: 'ድብልቁን ወደ 30-35°C ማቀዝቀዝ። 7 ግራም ደረቅ እርሾ በሞቃት ውሃ ማሟሟት፣ ወደ ድብልቁ ማከል እና መቀላቀል።',
        descriptionOr: "Dheedhii gara 30-35°C qabbaneessi. Raammoo gogaa g 7 bishaan ho'aa keessatti bulbuli, dheedhiitti itti dabalii makii.",
        duration: '15 minutes',
        equipment3D: 'thermometer'
      },
      {
        stepNumber: 3,
        titleEn: 'Set Up Anaerobic Fermentation',
        titleAm: 'አናይሮቢክ መፍላት ማቀናበር',
        titleOr: "Danficha anaerobikii qindeessi",
        descriptionEn: 'Transfer to jar with airlock (or balloon with pinhole). Keep at 25-30°C in dark place.',
        descriptionAm: 'ወደ ማሰሪያ በአየር መቆለፊያ (ወይም በትንሽ ቀዳዳ ያለ ፊኛ) ማዛወር። በ25-30°C ጨለማ ቦታ ማስቀመጥ።',
        descriptionOr: "Gara jaarsaa eerlaakii qabu (ykn baalonii torbee qabuutti) dabarsi. Bakka dukkanaatti 25-30°C irratti turi.",
        duration: '10 minutes',
        equipment3D: 'fermentation-jar'
      },
      {
        stepNumber: 4,
        titleEn: 'Monitor Fermentation',
        titleAm: 'መፍላት መከታተል',
        titleOr: "Danficha hordofi",
        descriptionEn: 'Observe CO₂ bubbles (balloon inflates). Fermentation takes 5-7 days until bubbling stops.',
        descriptionAm: 'CO₂ አረፋዎችን መመልከት (ፊኛ ይነፋል)። መፍላት አረፋ እስኪያቆም ድረስ 5-7 ቀናት ይወስዳል።',
        descriptionOr: "Huubiiwwan CO₂ ilaalii (baaloniin dhiita). Danfichi hanga huubiin dhaabbatu guyyaa 5-7 fudhata.",
        duration: '5-7 days',
        equipment3D: 'fermentation-jar'
      },
      {
        stepNumber: 5,
        titleEn: 'Strain and Test',
        titleAm: 'ማጣራት እና መሞከር',
        titleOr: "Calalii fi qori",
        descriptionEn: 'Strain the liquid. It contains ~10-15% ethanol. Test CO₂ production with limewater.',
        descriptionAm: 'ፈሳሹን ማጣራት። ~10-15% ኢታኖል ይዟል። የCO₂ ምርትን በኖራ ውሃ መሞከር።',
        descriptionOr: "Dhangala'aa calali. ~10-15% iitaanoolii of keessaa qaba. Oomisha CO₂ bishaan nooraan qori.",
        duration: '20 minutes',
        equipment3D: 'strainer'
      }
    ],
    variations: [
      'Distill to increase ethanol concentration',
      'Make vinegar by exposing to air',
      'Compare different fruit sources'
    ],
    expectedResults: 'Alcoholic liquid (~10-15% ethanol) with fruity aroma. CO₂ produced turns limewater milky.',
    scienceExplanation: 'C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂. Yeast enzymes convert glucose to ethanol and carbon dioxide anaerobically.',
    icon: '🍷',
    animation3D: 'fermentation-jar'
  },
  {
    id: 'calcium-citrate',
    titleEn: 'Calcium Citrate from Eggshells',
    titleAm: 'ከእንቁላል ቅርፊት ካልሲየም ሲትሬት',
    titleOr: "Qolfa hanqaaquu irraa Kaalsiyeemii Siitireetii",
    descriptionEn: 'Convert eggshell calcium carbonate to more bioavailable calcium citrate.',
    descriptionAm: 'የእንቁላል ቅርፊት ካልሲየም ካርቦኔትን ወደ በሰውነት ይበልጥ ሊዋጥ ወደሚችል ካልሲየም ሲትሬት መቀየር።',
    descriptionOr: "Kaalsiyeemii kaarbooneetii qolfa hanqaaquu gara kaalsiyeemii siitireetii qaama keessatti caalaatti xuuxamuu danda'uutti jijjiiruu.",
    level: 'beginner',
    category: 'local-materials',
    chemistryTopics: ['Acid-Base Reactions', 'Salt Formation', 'Bioavailability'],
    duration: '2-3 hours',
    difficulty: 1,
    safetyLevel: 'low',
    requiredEquipment: ['Mortar and pestle', 'Beakers', 'Filter', 'Drying surface'],
    requiredChemicals: ['Eggshells', 'Lemon juice or citric acid', 'Water'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Clean and Dry Eggshells',
        titleAm: 'የእንቁላል ቅርፊቶችን ማፅዳት እና ማድረቅ',
        titleOr: "Qolfa hanqaaquu qulqulleessii fi gogsi",
        descriptionEn: 'Wash eggshells, remove membrane, and bake at 100°C for 10 min to dry and sterilize.',
        descriptionAm: 'የእንቁላል ቅርፊቶችን ማጠብ፣ ሽፋኑን ማስወገድ፣ እና ለ10 ደቂቃ በ100°C ማድረቅ እና ማጽዳት።',
        descriptionOr: "Qolfa hanqaaquu dhiqii, membireenii baasi, fi gogsuuf fi qulqullaa gochuuf daqiiqaa 10f 100°C irratti tolchi.",
        duration: '20 minutes',
        equipment3D: 'oven'
      },
      {
        stepNumber: 2,
        titleEn: 'Crush to Fine Powder',
        titleAm: 'ወደ ዱቄት መፍጨት',
        titleOr: "Gara daakuu xixiqqaa daquuqi",
        descriptionEn: 'Grind dried shells to very fine powder using mortar and pestle.',
        descriptionAm: 'የደረቁ ቅርፊቶችን በመጥሪያ እና ሞርታር በጣም ጥሩ ዱቄት ድረስ መፍጨት።',
        descriptionOr: "Qolfoota gogaa mooortarii fi daakuu fayyadamuun hanga daakuu baay'ee xixiqqootti daquuqi.",
        duration: '15 minutes',
        equipment3D: 'mortar'
      },
      {
        stepNumber: 3,
        titleEn: 'React with Citric Acid',
        titleAm: 'ከሲትሪክ አሲድ ጋር ማድረግ',
        titleOr: "Asiidii siitiriikii wajjin deebii kenni",
        descriptionEn: 'Add lemon juice to powder. Observe fizzing (CO₂ release). Add more until fizzing stops.',
        descriptionAm: 'የሎሚ ጭማቂ ወደ ዱቄት ማከል። አረፋ (CO₂ መውጣት) መመልከት። አረፋ እስኪያቆም ድረስ ተጨማሪ ማከል።',
        descriptionOr: "Dhangala'aa loomii daakuu irratti itti dabali. Huubii (CO₂ gad dhiisuu) ilaalii. Hanga huubiin dhaabbatutti dabalataan itti dabali.",
        duration: '15 minutes',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 4,
        titleEn: 'Filter and Dry',
        titleAm: 'ማጣራት እና ማድረቅ',
        titleOr: "Calalii fi gogsii",
        descriptionEn: 'Let mixture settle. Filter or decant clear liquid. Dry the white precipitate - this is calcium citrate.',
        descriptionAm: 'ድብልቁ እንዲረጋጋ መፍቀድ። ግልጽ ፈሳሽ ማጣራት ወይም ማውጣት። ነጭ ደለልን ማድረቅ - ይህ ካልሲየም ሲትሬት ነው።',
        descriptionOr: "Makaan akka qabbanaawuuf hayyami. Dhangala'aa ifa ta'e calali ykn baasi. Coccoba adii gogsii - kun kaalsiyeemii siitireetii dha.",
        duration: '1-2 hours',
        equipment3D: 'filter-setup'
      },
      {
        stepNumber: 5,
        titleEn: 'Store Product',
        titleAm: 'ምርት ማከማቸት',
        titleOr: "Oomisha kuusi",
        descriptionEn: 'Store dried calcium citrate in airtight container. Much more bioavailable than eggshell powder alone.',
        descriptionAm: 'የደረቀ ካልሲየም ሲትሬትን በአየር የማይገባ መያዣ ማከማቸት። ከእንቁላል ቅርፊት ዱቄት ብቻ በጣም ይበልጥ በሰውነት ሊዋጥ ይችላል።',
        descriptionOr: "Kaalsiyeemii siitireetii gogaa meeshaa qilleensi itti hin seenne keessa kuusi. Daakuu qolfa hanqaaquu qofa caalaa qaama keessatti xuuxamuu danda'a.",
        duration: '5 minutes',
        equipment3D: 'container'
      }
    ],
    variations: [
      'Compare absorption rates with different acids',
      'Test with orange juice (citric acid)',
      'Calculate yield and purity'
    ],
    expectedResults: 'White powder of calcium citrate. More soluble than calcium carbonate.',
    scienceExplanation: '3CaCO₃ + 2C₆H₈O₇ → Ca₃(C₆H₅O₇)₂ + 3CO₂ + 3H₂O. Citric acid reacts with carbonate to form soluble citrate salt.',
    icon: '🥚',
    animation3D: 'beaker'
  },
  {
    id: 'charcoal-filter',
    titleEn: 'Water Filtration with Clay & Charcoal',
    titleAm: 'በሸክላ እና ከሰል ውሃ ማጣራት',
    titleOr: "Suphee fi kasalaan bishaan calaluu",
    descriptionEn: 'Build a multi-layer water filter using locally available materials.',
    descriptionAm: 'በአካባቢ በሚገኙ ቁሳቁሶች የብዙ ሽፋን ውሃ ማጣሪያ መገንባት።',
    descriptionOr: "Meeshaalee naannoo jiranitti fayyadamuun calaluu bishaanii guutuu baay'ee ijaaruu.",
    level: 'beginner',
    category: 'local-materials',
    chemistryTopics: ['Adsorption', 'Filtration', 'Porosity', 'Water Treatment'],
    duration: '3-4 hours',
    difficulty: 2,
    safetyLevel: 'low',
    requiredEquipment: ['Large plastic bottles', 'Container for clay', 'Kiln or fire pit', 'Collection vessel'],
    requiredChemicals: ['Local clay', 'Sawdust or rice husks', 'Charcoal', 'Sand', 'Gravel'],
    steps: [
      {
        stepNumber: 1,
        titleEn: 'Prepare Activated Charcoal',
        titleAm: 'የተነቃቃ ከሰል ማዘጋጀት',
        titleOr: "Kasala hojjetame qopheessi",
        descriptionEn: 'Crush charcoal from coconut shells or hardwood into small pieces. Wash to remove ash.',
        descriptionAm: 'ከኮኮናት ቅርፊት ወይም ከጠንካራ እንጨት ከሰል ወደ ትናንሽ ቁርጥራጮች መፍጨት። አመድ ለማስወገድ ማጠብ።',
        descriptionOr: "Kasala qolfa kokkoo ykn mukaa jabaa irraa gara cicciitaa xixiqqootti daqquuqi. Daaraa baasuuf dhiqii.",
        duration: '30 minutes',
        equipment3D: 'mortar'
      },
      {
        stepNumber: 2,
        titleEn: 'Make Porous Clay Pot',
        titleAm: 'ቀዳዳማ የሸክላ ማሰሮ መስራት',
        titleOr: "Ookoo suphee moolaawaa hojjedhu",
        descriptionEn: 'Mix clay with sawdust (20-30%). Form into pot shape. Fire in kiln - sawdust burns away leaving pores.',
        descriptionAm: 'ሸክላ ከእንጨት ዱቄት (20-30%) ጋር መቀላቀል። ወደ ማሰሮ ቅርጽ መቅረጽ። በእሳት ማንደድ - የእንጨት ዱቄት ይቃጠላል ቀዳዳዎች ይተዋል።',
        descriptionOr: "Suphee cirraachaa muka (20-30%) waliin makii. Gara boca ookootti bocii. Kiiliin keessatti ibiddi - cirraachaan gubatee molaawwii dhiisa.",
        duration: '2 hours + firing',
        equipment3D: 'kiln'
      },
      {
        stepNumber: 3,
        titleEn: 'Build Layered Filter',
        titleAm: 'የተደራረበ ማጣሪያ መገንባት',
        titleOr: "Calaltuu guutamte ijaari",
        descriptionEn: 'In large bottle: bottom layer = gravel, middle = sand, top = crushed charcoal. Add porous clay pot on top.',
        descriptionAm: 'በትልቅ ጠርሙስ፡ የታችኛው ንብርብር = ጠጠር፣ መካከለኛ = አሸዋ፣ የላይኛው = የተፈጨ ከሰል። ቀዳዳማ የሸክላ ማሰሮ በላይ ማከል።',
        descriptionOr: "Falaaskii guddaa keessa: guutuu jalaa = cirracha, gidduu = cirracha, gubbaa = kasala daqame. Ookoo suphee moolaawaa gubbaa itti dabali.",
        duration: '30 minutes',
        equipment3D: 'filter-setup'
      },
      {
        stepNumber: 4,
        titleEn: 'Test Filter Effectiveness',
        titleAm: 'የማጣሪያ ውጤታማነት መሞከር',
        titleOr: "Bu'a qabinaa calaltuuu qori",
        descriptionEn: 'Pour muddy or colored water through filter. Compare input and output water clarity.',
        descriptionAm: 'ጭቃማ ወይም ቀለም ያለው ውሃ በማጣሪያው ማሳለፍ። የገቢ እና የወጪ ውሃ ግልጽነት ማወዳደር።',
        descriptionOr: "Bishaan boora'aa ykn halluu qabu calaltuu keessa gadi dhangalaasi. Ifa bishaan galuu fi baahu wal bira qabi.",
        duration: '20 minutes',
        equipment3D: 'beaker'
      },
      {
        stepNumber: 5,
        titleEn: 'Document Results',
        titleAm: 'ውጤቶችን መመዝገብ',
        titleOr: "Bu'aawwan galmeessi",
        descriptionEn: 'Measure turbidity before and after. Test with food coloring to show adsorption by charcoal.',
        descriptionAm: 'ከማጣራት በፊትና በኋላ ጭቃማነትን መለካት። ከሰል የመምጠጥ ችሎታ ለማሳየት በምግብ ቀለም መሞከር።',
        descriptionOr: "Boora'ina calalsuu dura fi booda madaali. Halluu nyaataatiin kasalaan xuuxamuu agarsiisuu qori.",
        duration: '15 minutes',
        equipment3D: 'test-tubes'
      }
    ],
    variations: [
      'Add silver nanoparticles for antimicrobial effect',
      'Compare different charcoal sources',
      'Test pathogen removal (requires lab)'
    ],
    expectedResults: 'Clear, odor-free water. Charcoal removes colors and some chemicals through adsorption.',
    scienceExplanation: 'Gravel/sand physically filter particles. Charcoal adsorbs dissolved organics via van der Waals forces on high surface area.',
    icon: '💧',
    animation3D: 'filter-setup'
  }
];

export const projectLevels: Record<ProjectLevel, { en: string; am: string; or: string }> = {
  beginner: { en: 'Beginner/Student', am: 'ጀማሪ/ተማሪ', or: 'Jalqabaa/Barataaa' },
  intermediate: { en: 'Intermediate', am: 'መካከለኛ', or: 'Giddu-galeessa' },
  advanced: { en: 'Advanced/Research', am: 'የላቀ/ምርምር', or: 'Sadarkaa ol\'aanaa/Qorannoo' }
};

export const projectCategories: Record<ProjectCategory, { en: string; am: string; or: string; icon: string }> = {
  electrochemistry: { en: 'Electrochemistry', am: 'ኤሌክትሮኬሚስትሪ', or: 'Elektirookeemistrii', icon: '⚡' },
  organic: { en: 'Organic Chemistry', am: 'ኦርጋኒክ ኬሚስትሪ', or: 'Keemistrii Orgaanikii', icon: '🧬' },
  materials: { en: 'Materials Science', am: 'የቁሳቁስ ሳይንስ', or: 'Saayinsii Meeshaalee', icon: '🔬' },
  'green-chemistry': { en: 'Green Chemistry', am: 'አረንጓዴ ኬሚስትሪ', or: 'Keemistrii Magariisaa', icon: '🌿' },
  'local-materials': { en: 'Local Materials', am: 'የአካባቢ ቁሳቁሶች', or: 'Meeshaalee Naannoo', icon: '🏠' },
  biochemistry: { en: 'Biochemistry', am: 'ባዮኬሚስትሪ', or: 'Baayookeemistrii', icon: '🧫' }
};
