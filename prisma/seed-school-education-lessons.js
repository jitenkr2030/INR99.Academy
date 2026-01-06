const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('📖 Creating comprehensive School Education lessons...\n');

  const courseId = 'school_education';
  let lessonOrder = 1;
  let assessmentOrder = 1;

  // Helper function to create a lesson
  async function createLesson(title, description, duration, order, moduleName) {
    await prisma.lesson.create({
      data: {
        id: `${courseId}_lesson_${order}`,
        title: title,
        content: description || `Learn about ${title} in ${moduleName}`,
        duration: duration,
        order: order,
        courseId: courseId,
        isActive: true,
      }
    });
  }

  // Helper function to create an assessment
  async function createAssessment(title, description, order, moduleName, questionCount = 10) {
    await prisma.assessment.create({
      data: {
        id: `${courseId}_assessment_${order}`,
        title: title,
        type: 'QUIZ',
        courseId: courseId,
        isActive: true,
      }
    });
  }

  // ==================== PRIMARY & MIDDLE SCHOOL (Class 1-5) ====================
  console.log('📘 Creating Primary & Middle School (Class 1-5) lessons...');

  const primaryModules = [
    {
      name: 'Mathematics - Class 1-5',
      topics: [
        { title: 'Numbers 1 to 100', desc: 'Learning counting and number recognition', duration: 25 },
        { title: 'Addition Basics', desc: 'Simple addition for young learners', duration: 25 },
        { title: 'Subtraction Basics', desc: 'Simple subtraction concepts', duration: 25 },
        { title: 'Multiplication Tables 1-10', desc: 'Memorizing multiplication tables', duration: 35 },
        { title: 'Simple Division', desc: 'Basic division understanding', duration: 25 },
        { title: 'Shapes and Patterns', desc: 'Identifying geometric shapes', duration: 25 },
        { title: 'Measurement Basics', desc: 'Length, weight, and volume', duration: 25 },
        { title: 'Time and Clock', desc: 'Reading time and understanding hours', duration: 25 },
        { title: 'Money and Currency', desc: 'Indian currency and basic transactions', duration: 25 },
        { title: 'Fractions Introduction', desc: 'Simple fractions (half, quarter)', duration: 25 },
      ]
    },
    {
      name: 'English Reading & Writing - Class 1-5',
      topics: [
        { title: 'Alphabet Recognition', desc: 'Learning A to Z with sounds', duration: 25 },
        { title: 'Cursive Writing Basics', desc: 'Introduction to cursive letters', duration: 30 },
        { title: 'Sight Words', desc: 'Commonly used words', duration: 25 },
        { title: 'Reading Comprehension', desc: 'Understanding short paragraphs', duration: 30 },
        { title: 'Sentence Formation', desc: 'Building proper sentences', duration: 25 },
        { title: 'Nouns and Verbs', desc: 'Basic parts of speech', duration: 25 },
        { title: 'Punctuation Marks', desc: 'Period, comma, question mark', duration: 20 },
        { title: 'Creative Writing', desc: 'Short stories and paragraphs', duration: 35 },
        { title: 'Grammar Essentials', desc: 'Subject-verb agreement', duration: 25 },
        { title: 'Letter Writing', desc: 'Formal and informal letters', duration: 30 },
      ]
    },
    {
      name: 'EVS (Environmental Studies) - Class 1-5',
      topics: [
        { title: 'Living and Non-Living Things', desc: 'Basic characteristics of life', duration: 25 },
        { title: 'Plants and Their Parts', desc: 'Roots, stems, leaves, flowers', duration: 25 },
        { title: 'Animals and Their Habitats', desc: 'Different animal homes', duration: 25 },
        { title: 'Human Body Basics', desc: 'Body parts and senses', duration: 25 },
        { title: 'Food and Nutrition', desc: 'Healthy eating habits', duration: 25 },
        { title: 'Weather and Seasons', desc: 'Understanding climate', duration: 25 },
        { title: 'Our Surroundings', desc: 'Neighborhood and community', duration: 25 },
        { title: 'Water and Air', desc: 'Importance of natural resources', duration: 25 },
        { title: 'Safety Rules', desc: 'Road safety and home safety', duration: 25 },
        { title: 'India - Our Country', desc: 'Introduction to Indian geography', duration: 30 },
      ]
    },
    {
      name: 'Hindi / Regional Language - Class 1-5',
      topics: [
        { title: 'Hindi Swar (Vowels)', desc: 'Learning Hindi vowels', duration: 25 },
        { title: 'Hindi Vyanjan (Consonants)', desc: 'Learning Hindi consonants', duration: 25 },
        { title: 'Hindi Matra', desc: 'Matra (dependent signs) introduction', duration: 30 },
        { title: 'Hindi Shabd Banaye', desc: 'Forming words in Hindi', duration: 25 },
        { title: 'Hindi Pad (Poems)', desc: 'Memorizing Hindi poems', duration: 25 },
        { title: 'Hindi Story Reading', desc: 'Simple Hindi stories', duration: 30 },
        { title: 'Hindi Grammar Basics', desc: 'Sangya (Nouns) and Kriya (Verbs)', duration: 25 },
        { title: 'Hindi Composition', desc: 'Small paragraphs in Hindi', duration: 30 },
        { title: 'Letter Writing in Hindi', desc: 'Formal letters in Hindi', duration: 25 },
        { title: 'Hindi Revision', desc: 'Complete revision of Class 1-5 Hindi', duration: 40 },
      ]
    },
    {
      name: 'Concept Building (Foundations) - Class 1-5',
      topics: [
        { title: 'Logical Reasoning', desc: 'Pattern recognition and sequences', duration: 25 },
        { title: 'Observation Skills', desc: 'Visual discrimination', duration: 20 },
        { title: 'Memory Techniques', desc: 'Memory games for kids', duration: 25 },
        { title: 'Critical Thinking', desc: 'Simple problem solving', duration: 25 },
        { title: 'Study Habits', desc: 'Effective learning techniques', duration: 25 },
        { title: 'Time Management for Kids', desc: 'Planning daily activities', duration: 20 },
        { title: 'Goal Setting', desc: 'Setting simple learning goals', duration: 20 },
        { title: 'Self-Assessment', desc: 'Understanding personal progress', duration: 20 },
        { title: 'Collaboration Skills', desc: 'Working in groups', duration: 25 },
        { title: 'Digital Basics', desc: 'Introduction to computers', duration: 30 },
      ]
    }
  ];

  for (const module of primaryModules) {
    console.log(`  Creating: ${module.name}`);
    for (const topic of module.topics) {
      await createLesson(topic.title, topic.desc, topic.duration, lessonOrder++, module.name);
    }
  }

  await createAssessment('Primary School Assessment (Class 1-5)', 'Comprehensive assessment covering all Class 1-5 subjects', assessmentOrder++, 'Primary School', 25);

  // ==================== PRIMARY & MIDDLE SCHOOL (Class 6-8) ====================
  console.log('\n📘 Creating Primary & Middle School (Class 6-8) lessons...');

  const middleModules = [
    {
      name: 'Mathematics - Class 6-8',
      topics: [
        { title: 'Integers and Number System', desc: 'Understanding positive and negative numbers', duration: 35 },
        { title: 'Fractions and Decimals', desc: 'Operations with fractions and decimals', duration: 40 },
        { title: 'Algebra Introduction', desc: 'Variables and simple equations', duration: 40 },
        { title: 'Ratio and Proportion', desc: 'Understanding ratios and proportions', duration: 35 },
        { title: 'Percentage and Its Applications', desc: 'Percentage calculations', duration: 40 },
        { title: 'Geometry Basics', desc: 'Lines, angles, and triangles', duration: 40 },
        { title: 'Perimeter and Area', desc: 'Calculating area of shapes', duration: 35 },
        { title: 'Data Handling', desc: 'Collecting and organizing data', duration: 35 },
        { title: 'Exponents and Powers', desc: 'Understanding exponents', duration: 35 },
        { title: 'Practical Geometry', desc: 'Constructing geometric figures', duration: 40 },
        { title: 'Symmetry', desc: 'Line symmetry and rotational symmetry', duration: 30 },
        { title: 'Mensuration', desc: 'Volume and surface area', duration: 40 },
      ]
    },
    {
      name: 'Science - Class 6-8',
      topics: [
        { title: 'Matter - States and Properties', desc: 'Solid, liquid, gas properties', duration: 40 },
        { title: 'Acids, Bases and Salts', desc: 'pH scale and neutralization', duration: 40 },
        { title: 'Nutrition in Plants and Animals', desc: 'Food chains and webs', duration: 40 },
        { title: 'Respiration and Excretion', desc: 'Breathing and waste removal', duration: 40 },
        { title: 'Motion and Measurement', desc: 'Types of motion and units', duration: 40 },
        { title: 'Force and Pressure', desc: 'Understanding forces', duration: 40 },
        { title: 'Light and Shadows', desc: 'Reflection and refraction', duration: 40 },
        { title: 'Electricity and Circuits', desc: 'Series and parallel circuits', duration: 45 },
        { title: 'Metals and Non-Metals', desc: 'Properties of elements', duration: 40 },
        { title: 'Synthetic Fibres and Plastics', desc: 'Modern materials', duration: 35 },
        { title: 'Chemical Effects of Current', desc: 'Electrolytes and electrolysis', duration: 40 },
        { title: 'Natural Resources', desc: 'Conservation of resources', duration: 40 },
      ]
    },
    {
      name: 'Social Science - Class 6-8',
      topics: [
        { title: 'Ancient Civilizations', desc: 'Indus Valley and Vedic Period', duration: 40 },
        { title: 'Medieval India', desc: 'Delhi Sultanate and Mughals', duration: 40 },
        { title: 'Modern India', desc: 'British Raj and Independence', duration: 45 },
        { title: 'Geography - India', desc: 'Physical features of India', duration: 40 },
        { title: 'Geography - World', desc: 'Continents and oceans', duration: 40 },
        { title: 'Climate and Weather', desc: 'Understanding climate patterns', duration: 35 },
        { title: 'Democracy and Governance', desc: 'Indian Constitution basics', duration: 40 },
        { title: 'Economic Systems', desc: 'Types of economies', duration: 35 },
        { title: 'Cultural Diversity', desc: 'India\'s rich culture', duration: 35 },
        { title: 'Population and Settlement', desc: 'Urban and rural patterns', duration: 35 },
        { title: 'Disaster Management', desc: 'Natural disasters and safety', duration: 35 },
        { title: 'Rights and Responsibilities', desc: 'Duties of citizens', duration: 35 },
      ]
    },
    {
      name: 'English Grammar - Class 6-8',
      topics: [
        { title: 'Tenses Deep Dive', desc: 'All 12 English tenses', duration: 45 },
        { title: 'Active and Passive Voice', desc: 'Voice transformation', duration: 40 },
        { title: 'Direct and Indirect Speech', desc: 'Reporting speech', duration: 40 },
        { title: 'Subject-Verb Agreement', desc: 'Grammar rules and practice', duration: 35 },
        { title: 'Modals and Auxiliaries', desc: 'Modal verbs usage', duration: 35 },
        { title: 'Relative Clauses', desc: 'Defining and non-defining clauses', duration: 35 },
        { title: 'Prepositions Advanced', desc: 'Complex preposition usage', duration: 35 },
        { title: 'Conjunctions and Interjections', desc: 'Joining words', duration: 30 },
        { title: 'Articles and Determiners', desc: 'A, An, The usage', duration: 30 },
        { title: 'Error Correction', desc: 'Finding and fixing errors', duration: 40 },
        { title: 'Vocabulary Building', desc: 'Word formation and synonyms', duration: 35 },
        { title: 'Comprehension Skills', desc: 'Advanced reading techniques', duration: 40 },
      ]
    },
    {
      name: 'Hindi / Regional Language - Class 6-8',
      topics: [
        { title: 'Hindi Varnamala', desc: 'Complete Hindi alphabet review', duration: 25 },
        { title: 'Hindi Grammar - Sangya', desc: 'Nouns in detail', duration: 30 },
        { title: 'Hindi Grammar - Kriya', desc: 'Verbs and their types', duration: 30 },
        { title: 'Hindi Grammar - Visheshan', desc: 'Adjectives in Hindi', duration: 30 },
        { title: 'Hindi Sarvanam', desc: 'Pronouns in Hindi', duration: 30 },
        { title: 'Hindi Kriya Vishesh', desc: 'Verb forms and tenses', duration: 35 },
        { title: 'Hindi Alankar', desc: 'Poetic devices in Hindi', duration: 30 },
        { title: 'Hindi Pathya Pustak', desc: 'Prose and poetry analysis', duration: 35 },
        { title: 'Hindi Essay Writing', desc: 'Essay formats in Hindi', duration: 35 },
        { title: 'Hindi Letter Writing', desc: 'Official letters in Hindi', duration: 30 },
        { title: 'Hindi Unseen Passage', desc: 'Reading comprehension in Hindi', duration: 35 },
        { title: 'Hindi Revision Class 6-8', desc: 'Complete revision course', duration: 50 },
      ]
    }
  ];

  for (const module of middleModules) {
    console.log(`  Creating: ${module.name}`);
    for (const topic of module.topics) {
      await createLesson(topic.title, topic.desc, topic.duration, lessonOrder++, module.name);
    }
  }

  await createAssessment('Middle School Assessment (Class 6-8)', 'Comprehensive assessment for Class 6-8 students', assessmentOrder++, 'Middle School', 30);

  // ==================== SECONDARY SCHOOL (Class 9-10) ====================
  console.log('\n📗 Creating Secondary School (Class 9-10) lessons...');

  const secondaryModules = [
    {
      name: 'Mathematics - Class 9-10',
      topics: [
        { title: 'Number System Real Numbers', desc: 'Irrational numbers and properties', duration: 45 },
        { title: 'Polynomials Basics', desc: 'Types and degrees of polynomials', duration: 45 },
        { title: 'Coordinate Geometry', desc: 'Cartesian plane and distance formula', duration: 45 },
        { title: 'Linear Equations Two Variables', desc: 'Graphs and solutions', duration: 50 },
        { title: 'Euclidean Geometry', desc: 'Axioms and theorems', duration: 45 },
        { title: 'Lines and Angles', desc: 'Angle properties and theorems', duration: 40 },
        { title: 'Triangles Congruence', desc: 'Congruence rules (SSS, SAS, ASA)', duration: 50 },
        { title: 'Quadrilaterals', desc: 'Properties of quadrilaterals', duration: 45 },
        { title: 'Circles', desc: 'Circle theorems and properties', duration: 50 },
        { title: 'Heron\'s Formula', desc: 'Area of triangles using sides', duration: 40 },
        { title: 'Surface Areas and Volumes', desc: '3D shapes surface area', duration: 50 },
        { title: 'Statistics', desc: 'Mean, median, mode', duration: 45 },
        { title: 'Probability', desc: 'Basic probability concepts', duration: 40 },
        { title: 'Pair of Linear Equations', desc: 'Solving systems of equations', duration: 50 },
        { title: 'Quadratic Equations', desc: 'Roots and solutions', duration: 50 },
      ]
    },
    {
      name: 'Science - Class 9-10',
      topics: [
        { title: 'Matter - States', desc: 'Solid, liquid, gas states of matter', duration: 40 },
        { title: 'Atoms and Molecules', desc: 'Atomic structure basics', duration: 45 },
        { title: 'Structure of Atom', desc: 'Electrons, protons, neutrons', duration: 50 },
        { title: 'Cell - The Fundamental Unit', desc: 'Cell structure and functions', duration: 45 },
        { title: 'Tissues - Plant and Animal', desc: 'Different types of tissues', duration: 45 },
        { title: 'Diversity in Living Organisms', desc: 'Classification systems', duration: 45 },
        { title: 'Motion - Kinematics', desc: 'Laws of motion', duration: 50 },
        { title: 'Force and Laws of Motion', desc: 'Newton\'s laws application', duration: 50 },
        { title: 'Gravitation', desc: 'Universal gravitation', duration: 50 },
        { title: 'Work and Energy', desc: 'Kinetic and potential energy', duration: 45 },
        { title: 'Sound', desc: 'Sound waves and properties', duration: 45 },
        { title: 'Chemical Reactions', desc: 'Types of chemical reactions', duration: 45 },
        { title: 'Acids, Bases and Salts', desc: 'pH scale, indicators', duration: 45 },
        { title: 'Metals and Non-Metals', desc: 'Reactivity series', duration: 45 },
        { title: 'Carbon and Its Compounds', desc: 'Organic chemistry basics', duration: 50 },
      ]
    },
    {
      name: 'Social Science - Class 9-10',
      topics: [
        { title: 'India - Size and Location', desc: 'Geographical features', duration: 35 },
        { title: 'Physical Features of India', desc: 'Mountains, plateaus, plains', duration: 40 },
        { title: 'Drainage Systems', desc: 'Rivers and water bodies', duration: 40 },
        { title: 'Climate of India', desc: 'Monsoon and seasons', duration: 40 },
        { title: 'Natural Vegetation', desc: 'Forest types in India', duration: 35 },
        { title: 'The French Revolution', desc: 'Causes and effects', duration: 40 },
        { title: 'Socialism in Europe', desc: 'Rise of socialism', duration: 35 },
        { title: 'Nazism and Rise of Hitler', desc: 'World War II context', duration: 40 },
        { title: 'Forest and Wildlife Resources', desc: 'Conservation importance', duration: 35 },
        { title: 'Water Resources', desc: 'Water management', duration: 35 },
        { title: 'Agriculture', desc: 'Farming in India', duration: 35 },
        { title: 'Minerals and Energy Resources', desc: 'Natural resources', duration: 40 },
        { title: 'Manufacturing Industries', desc: 'Industrial growth', duration: 35 },
        { title: 'Lifelines of Indian Economy', desc: 'Transportation and communication', duration: 35 },
        { title: 'Democratic Politics', desc: 'Democracy concepts', duration: 40 },
      ]
    },
    {
      name: 'English - Class 9-10',
      topics: [
        { title: 'Beehive - Chapter Analysis', desc: 'Detailed analysis of chapters', duration: 45 },
        { title: 'Moments - Chapter Analysis', desc: 'Story analysis', duration: 45 },
        { title: 'Grammar - Tenses', desc: 'All tenses in detail', duration: 40 },
        { title: 'Grammar - Reported Speech', desc: 'Narration change', duration: 40 },
        { title: 'Grammar - Modals', desc: 'Modal verbs usage', duration: 35 },
        { title: 'Writing - Notice Writing', desc: 'Format and examples', duration: 30 },
        { title: 'Writing - Letter Writing', desc: 'Formal and informal letters', duration: 35 },
        { title: 'Writing - Essay Writing', desc: 'Essay types and structure', duration: 40 },
        { title: 'Writing - Story Writing', desc: 'Creative storytelling', duration: 35 },
        { title: 'Poetry - Detailed Analysis', desc: 'Poem explanations', duration: 40 },
        { title: 'Reading Comprehension', desc: 'Passage solving techniques', duration: 40 },
        { title: 'Short Answer Questions', desc: 'Chapter-based questions', duration: 35 },
        { title: 'Long Answer Questions', desc: 'Descriptive answers', duration: 40 },
        { title: 'Sample Paper - English', desc: 'Practice paper solving', duration: 60 },
        { title: 'Previous Year Papers', desc: 'CBSE board questions', duration: 60 },
      ]
    },
    {
      name: 'Hindi - Class 9-10',
      topics: [
        { title: 'Kshitij - Chapter Summary', desc: 'Prose chapter analysis', duration: 40 },
        { title: 'Kritika - Chapter Summary', desc: 'Poetry analysis', duration: 40 },
        { title: 'Sparsh - Chapter Summary', desc: 'Literature chapters', duration: 40 },
        { title: 'Maalap - Writing Skills', desc: 'Essay and letter writing', duration: 35 },
        { title: 'Hindi Grammar - Varnvichhed', desc: 'Paragraph writing', duration: 30 },
        { title: 'Hindi Grammar - Chhand', desc: 'Meter and poetry', duration: 35 },
        { title: 'Unseen Passage Hindi', desc: 'Reading comprehension', duration: 35 },
        { title: 'Previous Year Questions', desc: 'Board exam questions', duration: 40 },
        { title: 'Sample Paper Hindi', desc: 'Practice paper', duration: 60 },
      ]
    },
    {
      name: 'Board-Oriented Practice (CBSE/ICSE/State)',
      topics: [
        { title: 'CBSE Board Exam Pattern', desc: 'Understanding question structure', duration: 30 },
        { title: 'ICSE Board Overview', desc: 'ICSE specific requirements', duration: 30 },
        { title: 'State Board Differences', desc: 'State board preparation', duration: 25 },
        { title: 'Time Management Strategy', desc: 'Exam time allocation', duration: 35 },
        { title: 'Important Questions Bank', desc: 'High-weightage topics', duration: 45 },
        { title: 'Previous Year Papers Analysis', desc: 'Pattern identification', duration: 45 },
        { title: 'Sample Paper 1', desc: 'Practice exam paper', duration: 60 },
        { title: 'Sample Paper 2', desc: 'Practice exam paper', duration: 60 },
        { title: 'Sample Paper 3', desc: 'Practice exam paper', duration: 60 },
        { title: 'Common Mistakes to Avoid', desc: 'Exam error prevention', duration: 35 },
        { title: 'Answer Writing Techniques', desc: 'Scoring techniques', duration: 40 },
        { title: 'Revision Strategy', desc: 'Last minute revision tips', duration: 35 },
      ]
    }
  ];

  for (const module of secondaryModules) {
    console.log(`  Creating: ${module.name}`);
    for (const topic of module.topics) {
      await createLesson(topic.title, topic.desc, topic.duration, lessonOrder++, module.name);
    }
  }

  await createAssessment('Secondary School Assessment (Class 9-10)', 'Board exam style assessment for Class 10 students', assessmentOrder++, 'Secondary School', 35);

  // ==================== SENIOR SECONDARY (Class 11-12) ====================
  console.log('\n🔬 Creating Senior Secondary (Class 11-12) lessons...');

  const seniorModules = [
    // Science Stream
    {
      name: 'Physics - Class 11-12',
      topics: [
        { title: 'Physical World and Measurement', desc: 'Scope and nature of physics', duration: 45 },
        { title: 'Kinematics', desc: 'Motion in straight line', duration: 50 },
        { title: 'Laws of Motion', desc: 'Newton\'s laws application', duration: 50 },
        { title: 'Work, Energy and Power', desc: 'Conservation laws', duration: 50 },
        { title: 'Motion of System of Particles', desc: 'Rotational dynamics', duration: 50 },
        { title: 'Gravitation', desc: 'Universal gravitation', duration: 50 },
        { title: 'Properties of Bulk Matter', desc: 'Elasticity, fluid mechanics', duration: 50 },
        { title: 'Thermodynamics', desc: 'Heat and temperature', duration: 50 },
        { title: 'Kinetic Theory of Gases', desc: 'Gas behavior', duration: 45 },
        { title: 'Oscillations and Waves', desc: 'SHM and wave properties', duration: 50 },
        { title: 'Electrostatics', desc: 'Electric charges and fields', duration: 55 },
        { title: 'Current Electricity', desc: 'Circuit analysis', duration: 55 },
        { title: 'Magnetic Effects of Current', desc: 'Electromagnetism', duration: 55 },
        { title: 'Electromagnetic Induction', desc: 'Faraday\'s laws', duration: 55 },
        { title: 'Alternating Current', desc: 'AC circuits', duration: 55 },
        { title: 'Electromagnetic Waves', desc: 'EM spectrum', duration: 50 },
        { title: 'Optics - Ray Optics', desc: 'Reflection and refraction', duration: 55 },
        { title: 'Optics - Wave Optics', desc: 'Interference and diffraction', duration: 55 },
        { title: 'Dual Nature of Matter', desc: 'Photoelectric effect', duration: 50 },
        { title: 'Atoms and Nuclei', desc: 'Atomic structure', duration: 55 },
        { title: 'Electronic Devices', desc: 'Semiconductors', duration: 50 },
        { title: 'Communication Systems', desc: 'Communication technology', duration: 45 },
      ]
    },
    {
      name: 'Chemistry - Class 11-12',
      topics: [
        { title: 'Some Basic Concepts of Chemistry', desc: 'Matter and its composition', duration: 45 },
        { title: 'Structure of Atom', desc: 'Atomic models', duration: 50 },
        { title: 'Classification of Elements', desc: 'Periodic table trends', duration: 50 },
        { title: 'Chemical Bonding', desc: 'Ionic and covalent bonds', duration: 55 },
        { title: 'States of Matter', desc: 'Gas laws and liquids', duration: 50 },
        { title: 'Thermodynamics', desc: 'Enthalpy and entropy', duration: 55 },
        { title: 'Equilibrium', desc: 'Chemical equilibrium', duration: 55 },
        { title: 'Redox Reactions', desc: 'Oxidation and reduction', duration: 45 },
        { title: 'Hydrogen', desc: 'Properties and compounds', duration: 40 },
        { title: 's-Block Elements', desc: 'Alkali and alkaline earth metals', duration: 50 },
        { title: 'p-Block Elements', desc: 'Boron and carbon family', duration: 55 },
        { title: 'Organic Chemistry Basics', desc: 'Hydrocarbons', duration: 55 },
        { title: 'Hydrocarbons - Alkanes', desc: 'Saturated hydrocarbons', duration: 50 },
        { title: 'Hydrocarbons - Alkenes', desc: 'Unsaturated hydrocarbons', duration: 50 },
        { title: 'Hydrocarbons - Alkynes', desc: 'Triple bond compounds', duration: 50 },
        { title: 'Environmental Chemistry', desc: 'Pollution and green chemistry', duration: 45 },
        { title: 'Solid State', desc: 'Crystal structures', duration: 55 },
        { title: 'Solutions', desc: 'Concentration terms', duration: 55 },
        { title: 'Electrochemistry', desc: 'Redox in solutions', duration: 55 },
        { title: 'Chemical Kinetics', desc: 'Reaction rates', duration: 55 },
        { title: 'Surface Chemistry', desc: 'Adsorption and catalysis', duration: 50 },
        { title: 'p-Block Elements Advanced', desc: 'Noble gases and halogens', duration: 55 },
        { title: 'd and f Block Elements', desc: 'Transition metals', duration: 55 },
        { title: 'Coordination Compounds', desc: 'Complex compounds', duration: 55 },
        { title: 'Haloalkanes and Haloarenes', desc: 'Organohalogen compounds', duration: 55 },
        { title: 'Alcohols, Phenols and Ethers', desc: 'Oxygen-containing compounds', duration: 55 },
        { title: 'Aldehydes, Ketones and Carboxylic Acids', desc: 'Carbonyl compounds', duration: 55 },
        { title: 'Amines', desc: 'Nitrogen-containing compounds', duration: 55 },
        { title: 'Biomolecules', desc: 'Carbohydrates, proteins, nucleic acids', duration: 55 },
        { title: 'Polymers', desc: 'Synthetic and natural polymers', duration: 50 },
        { title: 'Chemistry in Everyday Life', desc: 'Applied chemistry', duration: 45 },
      ]
    },
    {
      name: 'Mathematics - Class 11-12',
      topics: [
        { title: 'Sets and Functions', desc: 'Set theory and relations', duration: 50 },
        { title: 'Trigonometric Functions', desc: 'Trigonometric ratios and identities', duration: 55 },
        { title: 'Principle of Mathematical Induction', desc: 'Proof techniques', duration: 40 },
        { title: 'Complex Numbers', desc: 'Algebra of complex numbers', duration: 50 },
        { title: 'Linear Inequalities', desc: 'Inequality solving', duration: 45 },
        { title: 'Permutations and Combinations', desc: 'Counting principles', duration: 55 },
        { title: 'Binomial Theorem', desc: 'Expansion of binomials', duration: 50 },
        { title: 'Sequences and Series', desc: 'AP, GP, HP', duration: 55 },
        { title: 'Straight Lines', desc: 'Coordinate geometry 2D', duration: 50 },
        { title: 'Conic Sections', desc: 'Parabola, ellipse, hyperbola', duration: 60 },
        { title: 'Three Dimensional Geometry', desc: '3D coordinate geometry', duration: 55 },
        { title: 'Limits and Derivatives', desc: 'Introduction to calculus', duration: 60 },
        { title: 'Statistics', desc: 'Variance and standard deviation', duration: 50 },
        { title: 'Probability', desc: 'Advanced probability concepts', duration: 55 },
        { title: 'Relations and Functions', desc: 'Types of functions', duration: 50 },
        { title: 'Inverse Trigonometric Functions', desc: 'Arc functions', duration: 50 },
        { title: 'Matrices', desc: 'Matrix operations', duration: 55 },
        { title: 'Determinants', desc: 'Matrix determinants', duration: 55 },
        { title: 'Continuity and Differentiability', desc: 'Calculus fundamentals', duration: 60 },
        { title: 'Application of Derivatives', desc: 'Rate of change, maxima/minima', duration: 60 },
        { title: 'Integrals', desc: 'Indefinite and definite integrals', duration: 65 },
        { title: 'Application of Integrals', desc: 'Area under curves', duration: 55 },
        { title: 'Differential Equations', desc: 'Solving DEs', duration: 60 },
        { title: 'Vector Algebra', desc: 'Vector operations', duration: 55 },
        { title: 'Three Dimensional Geometry Advanced', desc: 'Lines and planes', duration: 60 },
        { title: 'Linear Programming', desc: 'Optimization problems', duration: 50 },
        { title: 'Probability Advanced', desc: 'Bayes theorem, distributions', duration: 60 },
      ]
    },
    {
      name: 'Biology - Class 11-12',
      topics: [
        { title: 'Diversity of Living Organisms', desc: 'Classification systems', duration: 50 },
        { title: 'Structural Organization in Plants', desc: 'Plant anatomy', duration: 50 },
        { title: 'Structural Organization in Animals', desc: 'Animal tissues', duration: 50 },
        { title: 'Cell Structure and Function', desc: 'Cell organelles', duration: 55 },
        { title: 'Biomolecules', desc: 'Carbohydrates, proteins, lipids', duration: 55 },
        { title: 'Cell Cycle and Division', desc: 'Mitosis and meiosis', duration: 50 },
        { title: 'Transport in Plants', desc: 'Transpiration and absorption', duration: 50 },
        { title: 'Transport in Animals', desc: 'Circulatory system', duration: 50 },
        { title: 'Excretory System', desc: 'Kidney function', duration: 50 },
        { title: 'Locomotion and Movement', desc: 'Muscular and skeletal system', duration: 50 },
        { title: 'Neural Control and Coordination', desc: 'Nervous system', duration: 50 },
        { title: 'Chemical Coordination', desc: 'Endocrine system', duration: 50 },
        { title: 'Reproduction in Plants', desc: 'Pollination and fertilization', duration: 50 },
        { title: 'Reproduction in Animals', desc: 'Human reproductive system', duration: 50 },
        { title: 'Inheritance and Variation', desc: 'Mendelian genetics', duration: 55 },
        { title: 'Molecular Basis of Inheritance', desc: 'DNA and RNA', duration: 60 },
        { title: 'Evolution', desc: 'Theories of evolution', duration: 55 },
        { title: 'Human Health and Disease', desc: 'Pathogens and immunity', duration: 55 },
        { title: 'Strategies for Enhancement', desc: 'Animal husbandry', duration: 50 },
        { title: 'Biotechnology - Principles', desc: 'Genetic engineering', duration: 55 },
        { title: 'Biotechnology - Applications', desc: 'Biotech in agriculture/medicine', duration: 55 },
        { title: 'Ecosystem', desc: 'Ecological relationships', duration: 50 },
        { title: 'Environmental Issues', desc: 'Pollution and conservation', duration: 55 },
        { title: 'Organisms and Populations', desc: 'Ecology basics', duration: 50 },
        { title: 'Biodiversity and Conservation', desc: 'Wildlife protection', duration: 50 },
      ]
    },
    // Commerce Stream
    {
      name: 'Accountancy - Class 11-12',
      topics: [
        { title: 'Introduction to Accounting', desc: 'Basic accounting principles', duration: 45 },
        { title: 'Theory Base of Accounting', desc: 'GAAP and assumptions', duration: 40 },
        { title: 'Recording of Transactions', desc: 'Journal and ledger', duration: 55 },
        { title: 'Bank Reconciliation Statement', desc: 'Reconciliation process', duration: 45 },
        { title: 'Depreciation Provisions', desc: 'Depreciation methods', duration: 50 },
        { title: 'Accounting for Bills', desc: 'Bills of exchange', duration: 45 },
        { title: 'Trial Balance and Rectification', desc: 'Error detection', duration: 50 },
        { title: 'Financial Statements', desc: 'Trading and profit account', duration: 55 },
        { title: 'Accounts from Incomplete Records', desc: 'Single entry system', duration: 50 },
        { title: 'Not-for-Profit Organizations', desc: 'NGO accounting', duration: 50 },
        { title: 'Partnership Fundamentals', desc: 'Partnership deed', duration: 50 },
        { title: 'Partnership - Admission', desc: 'Admission of partner', duration: 55 },
        { title: 'Partnership - Retirement', desc: 'Retirement of partner', duration: 55 },
        { title: 'Partnership - Death', desc: 'Death of partner', duration: 50 },
        { title: 'Company Accounts', desc: 'Share and debenture issuance', duration: 60 },
        { title: 'Financial Statement Analysis', desc: 'Ratio analysis', duration: 60 },
        { title: 'Cash Flow Statement', desc: 'Cash flow classification', duration: 55 },
        { title: 'Accounting Ratios', desc: 'Liquidity and solvency ratios', duration: 55 },
        { title: 'Issue of Debentures', desc: 'Debenture accounting', duration: 50 },
        { title: 'Redemption of Debentures', desc: 'Debenture redemption', duration: 50 },
      ]
    },
    {
      name: 'Business Studies - Class 11-12',
      topics: [
        { title: 'Nature and Significance of Management', desc: 'Management concepts', duration: 45 },
        { title: 'Principles of Management', desc: 'Fayol\'s principles', duration: 50 },
        { title: 'Business Environment', desc: 'Internal and external factors', duration: 45 },
        { title: 'Planning', desc: 'Types of planning', duration: 45 },
        { title: 'Organizing', desc: 'Organizational structures', duration: 50 },
        { title: 'Staffing', desc: 'Human resource management', duration: 50 },
        { title: 'Directing', desc: 'Motivation and leadership', duration: 55 },
        { title: 'Controlling', desc: 'Management control', duration: 45 },
        { title: 'Financial Management', desc: 'Capital structure', duration: 55 },
        { title: 'Financial Markets', desc: 'Stock exchange and money market', duration: 55 },
        { title: 'Marketing Management', desc: 'Marketing mix', duration: 55 },
        { title: 'Consumer Protection', desc: 'Consumer rights', duration: 45 },
        { title: 'Entrepreneurship Development', desc: 'Startup concepts', duration: 50 },
        { title: 'Business Finance', desc: 'Sources of finance', duration: 50 },
        { title: 'Organising Staffing', desc: 'HR planning', duration: 50 },
        { title: 'Communication', desc: 'Business communication', duration: 45 },
        { title: 'Controlling Business', desc: 'Budgetary control', duration: 45 },
        { title: 'Financial Markets Advanced', desc: 'SEBI regulations', duration: 50 },
        { title: 'Marketing Segmentation', desc: 'Target marketing', duration: 50 },
        { title: 'Product and Pricing', desc: 'Product life cycle', duration: 50 },
      ]
    },
    {
      name: 'Economics - Class 11-12',
      topics: [
        { title: 'Introduction to Microeconomics', desc: 'Scarcity and allocation', duration: 45 },
        { title: 'Theory of Consumer Behavior', desc: 'Utility analysis', duration: 50 },
        { title: 'Demand Analysis', desc: 'Law of demand', duration: 50 },
        { title: 'Elasticity of Demand', desc: 'Price, income, cross elasticity', duration: 50 },
        { title: 'Supply Analysis', desc: 'Law of supply', duration: 45 },
        { title: 'Market Equilibrium', desc: 'Price determination', duration: 50 },
        { title: 'Production Function', desc: 'Law of returns', duration: 50 },
        { title: 'Cost and Revenue', desc: 'Cost curves', duration: 50 },
        { title: 'Perfect Competition', desc: 'Market structure', duration: 55 },
        { title: 'Imperfect Competition', desc: 'Monopoly and oligopoly', duration: 55 },
        { title: 'Introduction to Macroeconomics', desc: 'National income concepts', duration: 50 },
        { title: 'National Income Accounting', desc: 'GDP calculation', duration: 55 },
        { title: 'Money and Banking', desc: 'Monetary policy', duration: 55 },
        { title: 'Aggregate Demand and Supply', desc: 'AD-AS model', duration: 55 },
        { title: 'Government Budget', desc: 'Fiscal policy', duration: 50 },
        { title: 'Income Determination', desc: 'Multiplier effect', duration: 55 },
        { title: 'Foreign Exchange Rate', desc: 'Balance of payments', duration: 50 },
        { title: 'Open Economy Macroeconomics', desc: 'Trade and economy', duration: 55 },
        { title: 'Indian Economic Development', desc: 'Post-independence economy', duration: 50 },
        { title: 'Economic Reforms', desc: 'Liberalization', duration: 50 },
        { title: 'Poverty', desc: 'Poverty lines and programs', duration: 50 },
        { title: 'Human Capital Formation', desc: 'Education and health', duration: 45 },
        { title: 'Employment', desc: 'Unemployment types', duration: 50 },
        { title: 'Inflation', desc: 'Types and effects', duration: 45 },
        { title: 'Sustainable Development', desc: 'Environmental economics', duration: 45 },
      ]
    },
    // Arts / Humanities Stream
    {
      name: 'History - Class 11-12',
      topics: [
        { title: 'Early Societies', desc: 'Prehistoric civilizations', duration: 50 },
        { title: 'Empires and Kingdoms', desc: 'Ancient empires', duration: 55 },
        { title: 'Religious Systems', desc: 'World religions', duration: 50 },
        { title: 'Medieval World', desc: 'Feudalism and crusades', duration: 55 },
        { title: 'Revolutions', desc: 'Industrial and political revolutions', duration: 55 },
        { title: 'Colonialism', desc: 'European colonialism', duration: 55 },
        { title: 'Nationalism', desc: 'Rise of nations', duration: 50 },
        { title: 'World Wars', desc: 'WWI and WWII', duration: 60 },
        { title: 'Cold War Era', desc: 'Post-war politics', duration: 55 },
        { title: 'Contemporary World', desc: 'Modern era', duration: 50 },
      ]
    },
    {
      name: 'Political Science - Class 11-12',
      topics: [
        { title: 'Political Theory Concepts', desc: 'Freedom, equality, justice', duration: 50 },
        { title: 'Rights and Duties', desc: 'Fundamental rights', duration: 50 },
        { title: 'Concept of Citizenship', desc: 'Citizenship and nationality', duration: 45 },
        { title: 'Electoral Politics', desc: 'Elections and voting', duration: 50 },
        { title: 'Executive and Legislature', desc: 'Government branches', duration: 55 },
        { title: 'Judiciary', desc: 'Supreme Court and justice', duration: 55 },
        { title: 'Constitutional Design', desc: 'Indian Constitution', duration: 60 },
        { title: 'Federalism', desc: 'Center-state relations', duration: 55 },
        { title: 'Democracy and Diversity', desc: 'Social diversity', duration: 50 },
        { title: 'Gender, Religion, Caste', desc: 'Social categories', duration: 55 },
        { title: 'Popular Struggles', desc: 'Social movements', duration: 50 },
        { title: 'International Organizations', desc: 'UN and global bodies', duration: 55 },
        { title: 'Globalization', desc: 'Global politics', duration: 50 },
      ]
    },
    {
      name: 'Geography - Class 11-12',
      topics: [
        { title: 'Geography as a Discipline', desc: 'Physical geography basics', duration: 50 },
        { title: 'The Earth', desc: 'Interior and structure', duration: 55 },
        { title: 'Landforms', desc: 'Mountains, plateaus, plains', duration: 55 },
        { title: 'Climate and Weather', desc: 'Atmospheric circulation', duration: 55 },
        { title: 'Water Resources', desc: 'Oceans and rivers', duration: 55 },
        { title: 'Natural Vegetation', desc: 'Biomes and ecosystems', duration: 50 },
        { title: 'Soils and Agriculture', desc: 'Soil types and farming', duration: 55 },
        { title: 'Human Geography', desc: 'Population and settlements', duration: 55 },
        { title: 'Economic Activities', desc: 'Primary, secondary, tertiary', duration: 55 },
        { title: 'Resources and Development', desc: 'Resource management', duration: 55 },
        { title: 'India - Physical Environment', desc: 'Indian geography', duration: 60 },
        { title: 'India - Economic Geography', desc: 'Indian resources', duration: 55 },
        { title: 'India - Population', desc: 'Demographic patterns', duration: 50 },
      ]
    },
    {
      name: 'Sociology - Class 11-12',
      topics: [
        { title: 'Sociology - Introduction', desc: 'Society and social interaction', duration: 50 },
        { title: 'Social Institutions', desc: 'Family, religion, education', duration: 55 },
        { title: 'Social Stratification', desc: 'Class and caste', duration: 55 },
        { title: 'Social Change', desc: 'Modernization', duration: 50 },
        { title: 'Environment and Society', desc: 'Environmental sociology', duration: 50 },
        { title: 'Western Social Thinkers', desc: 'Durkheim, Weber, Marx', duration: 55 },
        { title: 'Indian Thinkers', desc: 'Gandhi, Ambedkar', duration: 55 },
        { title: 'Research Methods', desc: 'Sociological research', duration: 55 },
        { title: 'Practical in Sociology', desc: 'Fieldwork methods', duration: 50 },
      ]
    },
    {
      name: 'Psychology - Class 11-12',
      topics: [
        { title: 'Introduction to Psychology', desc: 'Science of mind and behavior', duration: 50 },
        { title: 'Methods of Psychology', desc: 'Research methods', duration: 50 },
        { title: 'Sensation and Perception', desc: 'Sensory processes', duration: 55 },
        { title: 'Learning', desc: 'Learning theories', duration: 55 },
        { title: 'Memory', desc: 'Memory processes', duration: 55 },
        { title: 'Thinking', desc: 'Cognitive processes', duration: 55 },
        { title: 'Intelligence', desc: 'IQ and types of intelligence', duration: 55 },
        { title: 'Personality', desc: 'Personality theories', duration: 60 },
        { title: 'Development', desc: 'Life span development', duration: 55 },
        { title: 'Psychological Disorders', desc: 'Mental health conditions', duration: 60 },
        { title: 'Therapeutic Approaches', desc: 'Therapy types', duration: 55 },
        { title: 'Social Psychology', desc: 'Group behavior', duration: 55 },
      ]
    }
  ];

  for (const module of seniorModules) {
    console.log(`  Creating: ${module.name}`);
    for (const topic of module.topics) {
      await createLesson(topic.title, topic.desc, topic.duration, lessonOrder++, module.name);
    }
  }

  await createAssessment('Senior Secondary Science Assessment', 'Comprehensive physics, chemistry, math/biology assessment', assessmentOrder++, 'Senior Secondary Science', 40);
  await createAssessment('Senior Secondary Commerce Assessment', 'Accountancy, business studies, economics assessment', assessmentOrder++, 'Senior Secondary Commerce', 35);
  await createAssessment('Senior Secondary Arts Assessment', 'History, political science, geography assessment', assessmentOrder++, 'Senior Secondary Arts', 30);

  // ==================== EXAM-FOCUSED SECTIONS ====================
  console.log('\n📝 Creating Exam-Focused Sections lessons...');

  const examModules = [
    {
      name: 'Board Exam Crash Prep',
      topics: [
        { title: '30-Day Board Strategy', desc: 'Daily study plan for board exams', duration: 45 },
        { title: '60-Day Board Strategy', desc: 'Extended preparation plan', duration: 45 },
        { title: 'Important Questions - Mathematics', desc: 'High-weightage math topics', duration: 60 },
        { title: 'Important Questions - Science', desc: 'High-weightage science topics', duration: 60 },
        { title: 'Important Questions - English', desc: 'Important English questions', duration: 50 },
        { title: 'Previous Year Questions Analysis', desc: 'Analyzing CBSE PYQs', duration: 55 },
        { title: 'Revision Notes - Mathematics', desc: 'Quick math revision', duration: 60 },
        { title: 'Revision Notes - Physics', desc: 'Physics formula sheet', duration: 55 },
        { title: 'Revision Notes - Chemistry', desc: 'Chemistry equations', duration: 55 },
        { title: 'Revision Notes - Biology', desc: 'Biology diagrams', duration: 55 },
        { title: 'Sample Paper 1 - Full', desc: 'Complete practice paper', duration: 90 },
        { title: 'Sample Paper 2 - Full', desc: 'Complete practice paper', duration: 90 },
        { title: 'Sample Paper 3 - Full', desc: 'Complete practice paper', duration: 90 },
        { title: 'Time Management in Exams', desc: 'Exam timing strategies', duration: 40 },
        { title: 'Answer Sheet Presentation', desc: 'How to present answers', duration: 35 },
        { title: 'CBSE Marking Scheme', desc: 'Understanding CBSE evaluation', duration: 40 },
        { title: 'Common Errors in Exams', desc: 'Mistakes to avoid', duration: 35 },
        { title: 'Last Week Strategy', desc: 'Final week preparation', duration: 45 },
      ]
    },
    {
      name: 'Concept Clarity & Doubt Solving',
      topics: [
        { title: 'Identifying Weak Topics', desc: 'Self-assessment techniques', duration: 30 },
        { title: 'Simplifying Complex Topics', desc: 'Breaking down difficult concepts', duration: 40 },
        { title: 'One-Shot - Algebra', desc: 'Complete algebra in one video', duration: 75 },
        { title: 'One-Shot - Trigonometry', desc: 'Complete trig in one video', duration: 75 },
        { title: 'One-Shot - Calculus', desc: 'Calculus basics in one video', duration: 90 },
        { title: 'One-Shot - Physics Mechanics', desc: 'Complete mechanics in one video', duration: 90 },
        { title: 'One-Shot - Chemical Bonding', desc: 'Bonding concepts simplified', duration: 60 },
        { title: 'Formula Memorization Tricks', desc: 'Remember formulas easily', duration: 40 },
        { title: 'Theory Breakdown - Chemistry', desc: 'Organic chemistry simplified', duration: 70 },
        { title: 'Theory Breakdown - Biology', desc: 'Biology concepts explained', duration: 70 },
        { title: 'Common Student Mistakes - Math', desc: 'Math errors and fixes', duration: 45 },
        { title: 'Common Student Mistakes - Science', desc: 'Science errors and fixes', duration: 45 },
        { title: 'Why This Happens - Physics', desc: 'Physics intuition building', duration: 55 },
        { title: 'Why This Happens - Chemistry', desc: 'Chemistry reasoning', duration: 55 },
        { title: 'Doubt Clearing Session 1', desc: 'Live doubt session recording', duration: 60 },
        { title: 'Doubt Clearing Session 2', desc: 'Live doubt session recording', duration: 60 },
        { title: 'Doubt Clearing Session 3', desc: 'Live doubt session recording', duration: 60 },
        { title: 'NCERT Concept Check', desc: 'NCERT important concepts', duration: 50 },
      ]
    }
  ];

  for (const module of examModules) {
    console.log(`  Creating: ${module.name}`);
    for (const topic of module.topics) {
      await createLesson(topic.title, topic.desc, topic.duration, lessonOrder++, module.name);
    }
  }

  await createAssessment('Exam Preparation Assessment', 'Test your exam readiness', assessmentOrder++, 'Exam Prep', 25);

  // ==================== SKILL ADD-ONS ====================
  console.log('\n🌟 Creating Skill Add-ons lessons...');

  const skillModules = [
    {
      name: 'English Speaking (School Level)',
      topics: [
        { title: 'Pronunciation Basics', desc: 'Correct pronunciation of sounds', duration: 30 },
        { title: 'Fluency Development', desc: 'Speaking without hesitation', duration: 35 },
        { title: 'Vocabulary for Daily Use', desc: 'Common English words', duration: 30 },
        { title: 'Sentence Formation', desc: 'Speaking in complete sentences', duration: 30 },
        { title: 'Conversation Practice', desc: 'Daily conversation scenarios', duration: 40 },
        { title: 'Public Speaking Intro', desc: 'Speaking in front of others', duration: 35 },
        { title: 'Presentation Skills', desc: 'School presentation tips', duration: 40 },
        { title: 'Debate Basics', desc: 'How to participate in debates', duration: 35 },
        { title: 'Extempore Speaking', desc: 'Speaking without preparation', duration: 30 },
        { title: 'Interview Preparation', desc: 'School interview tips', duration: 35 },
      ]
    },
    {
      name: 'Handwriting Improvement',
      topics: [
        { title: 'Grip and Posture', desc: 'Correct holding of pen', duration: 20 },
        { title: 'Letter Formation Basics', desc: 'Proper letter shapes', duration: 30 },
        { title: 'Cursive Writing', desc: 'Connecting letters smoothly', duration: 35 },
        { title: 'Speed Writing', desc: 'Writing faster legibly', duration: 30 },
        { title: 'Neatness Tips', desc: 'Making writing look professional', duration: 25 },
        { title: 'Legibility Exercises', desc: 'Improving readability', duration: 25 },
        { title: 'Practice Sheets Guide', desc: 'Using practice sheets effectively', duration: 20 },
        { title: 'Exam Handwriting Strategy', desc: 'Writing fast in exams', duration: 30 },
      ]
    },
    {
      name: 'Mental Math',
      topics: [
        { title: 'Addition Tricks', desc: 'Fast addition methods', duration: 25 },
        { title: 'Subtraction Tricks', desc: 'Fast subtraction methods', duration: 25 },
        { title: 'Multiplication Shortcuts', desc: 'Vedic math multiplication', duration: 35 },
        { title: 'Division Techniques', desc: 'Fast division methods', duration: 30 },
        { title: 'Percentage Calculations', desc: 'Quick percentage tricks', duration: 30 },
        { title: 'Square and Cube Roots', desc: 'Finding roots mentally', duration: 35 },
        { title: 'Calendar Calculations', desc: 'Day of week calculations', duration: 30 },
        { title: 'Square Numbers', desc: 'Memorizing squares up to 30', duration: 25 },
        { title: 'Cube Numbers', desc: 'Memorizing cubes', duration: 25 },
        { title: 'Mixed Operations', desc: 'Combined calculations', duration: 35 },
      ]
    },
    {
      name: 'Study Techniques',
      topics: [
        { title: 'Active Reading', desc: 'How to read effectively', duration: 30 },
        { title: 'Note-Taking Methods', desc: 'Cornell method and more', duration: 35 },
        { title: 'Mind Mapping', desc: 'Visual note organization', duration: 35 },
        { title: 'Spaced Repetition', desc: 'Memory technique', duration: 30 },
        { title: 'Pomodoro Technique', desc: 'Focused study sessions', duration: 25 },
        { title: 'Chunking Method', desc: 'Breaking down information', duration: 30 },
        { title: 'Active Recall', desc: 'Testing yourself', duration: 30 },
        { title: 'Interleaving Practice', desc: 'Mixing subjects', duration: 30 },
        { title: 'Study Environment', desc: 'Optimizing study space', duration: 25 },
        { title: 'Digital Tools for Study', desc: 'Apps and resources', duration: 35 },
      ]
    },
    {
      name: 'Memory & Focus Training',
      topics: [
        { title: 'Memory Palace Technique', desc: 'Ancient memory method', duration: 35 },
        { title: 'Visual Memory', desc: 'Improving visual recall', duration: 30 },
        { title: 'Auditory Memory', desc: 'Remembering what you hear', duration: 25 },
        { title: 'Focus Exercises', desc: 'Concentration building', duration: 30 },
        { title: 'Meditation for Students', desc: 'Simple meditation techniques', duration: 35 },
        { title: 'Attention Span Building', desc: 'Increasing focus duration', duration: 30 },
        { title: 'Mnemonics', desc: 'Memory aids and tricks', duration: 35 },
        { title: 'Association Techniques', desc: 'Linking information', duration: 30 },
        { title: 'Sleep and Memory', desc: 'Sleep for better retention', duration: 25 },
        { title: 'Brain Foods', desc: 'Nutrition for brain power', duration: 25 },
      ]
    },
    {
      name: 'Exam Fear Reduction',
      topics: [
        { title: 'Understanding Exam Anxiety', desc: 'Why fear happens', duration: 25 },
        { title: 'Breathing Techniques', desc: 'Calming exercises', duration: 30 },
        { title: 'Positive Self-Talk', desc: 'Building confidence', duration: 30 },
        { title: 'Visualization', desc: 'Mental rehearsal', duration: 30 },
        { title: 'Preparation Strategies', desc: 'Reducing fear through prep', duration: 35 },
        { title: 'Day Before Exam', desc: 'Optimal preparation', duration: 30 },
        { title: 'Morning of Exam', desc: 'Exam day routine', duration: 25 },
        { title: 'During Exam Tips', desc: 'Staying calm while solving', duration: 30 },
        { title: 'Handling Difficult Questions', desc: 'What to do when stuck', duration: 25 },
        { title: 'Post-Exam Recovery', desc: 'Dealing with results', duration: 25 },
      ]
    }
  ];

  for (const module of skillModules) {
    console.log(`  Creating: ${module.name}`);
    for (const topic of module.topics) {
      await createLesson(topic.title, topic.desc, topic.duration, lessonOrder++, module.name);
    }
  }

  await createAssessment('Skill Assessment', 'Test your newly learned skills', assessmentOrder++, 'Skills', 15);

  console.log('\n✨ School Education course creation complete!');
  console.log(`📊 Total lessons created: ${lessonOrder - 1}`);
  console.log(`📝 Total assessments created: ${assessmentOrder - 1}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
