import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

// Load env
let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^MONGODB_URI=(.*)$/m);
    if (match) MONGODB_URI = match[1].trim();
  }
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for comprehensive seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const Topic = mongoose.models.Topic || mongoose.model('Topic', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  order: { type: Number, required: true },
  theory: {
    syntax: String,
    explanation: String,
    commonMistakes: String,
    importantNotes: String,
  },
}));

const Question = mongoose.models.Question || mongoose.model('Question', new mongoose.Schema({
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  statement: { type: String, required: true },
  constraints: { type: String, required: true },
  inputFormat: { type: String, required: true },
  outputFormat: { type: String, required: true },
  sampleInput: { type: String, required: true },
  sampleOutput: { type: String, required: true },
  explanation: { type: String },
  hints: [String],
  testcases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
  }],
}));

const topics = [
  '1D Array', '2D Array', 'Functions', 'Strings', 'Pointer Arithmetic', 
  'Pointers and Arrays', 'Pointers and Functions', 'Structure Variables', 
  'Arrays of Structure', 'Arrays within Structure', 'Structure within Structures', 
  'Structures and Functions', 'Pointers to Structure', 'Union', 'Files', 
  'Class and Objects', 'Constructors and Destructors', 'Static Data Members', 
  'Inline Functions', 'Call by Reference', 'Functions with Default Arguments', 
  'Friend Functions and Friend Class', 'Single Inheritance', 'Multiple Inheritance', 
  'Multi-level Inheritance', 'Hierarchical Inheritance', 'Multipath Inheritance', 
  'Inheritance and Constructors', 'Function Overloading', 'Operator Overloading', 
  'Virtual Functions', 'Pure Virtual Functions', 'Abstract Classes', 
  'Function Templates', 'Class Templates', 'Standard Template Library'
];

const questionData = [
  // 1D Array
  {
    topic: '1D Array',
    title: 'Find Second Largest',
    difficulty: 'Easy',
    statement: 'Given an array of N integers, find the second largest element. If no such element exists, print -1.',
    constraints: '2 <= N <= 10^5, -10^9 <= A[i] <= 10^9',
    inputFormat: 'N followed by N integers',
    outputFormat: 'The second largest element',
    sampleInput: '5\n10 20 20 5 15',
    sampleOutput: '15',
    testcases: [
      { input: '5\n10 20 20 5 15', expectedOutput: '15' },
      { input: '2\n10 10', expectedOutput: '-1' },
      { input: '3\n1 2 3', expectedOutput: '2' }
    ]
  },
  {
    topic: '1D Array',
    title: 'Rotation Offset',
    difficulty: 'Medium',
    statement: 'Given a sorted array that has been rotated, find the index of the smallest element (the rotation offset).',
    constraints: '1 <= N <= 10^6',
    inputFormat: 'N followed by N integers',
    outputFormat: 'Index of smallest element',
    sampleInput: '5\n4 5 1 2 3',
    sampleOutput: '2',
    testcases: [
      { input: '5\n4 5 1 2 3', expectedOutput: '2' },
      { input: '4\n1 2 3 4', expectedOutput: '0' }
    ]
  },
  {
    topic: '1D Array',
    title: 'Rainwater Trapping',
    difficulty: 'Hard',
    statement: 'Given N non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    constraints: '1 <= N <= 10^5',
    inputFormat: 'N followed by N integers',
    outputFormat: 'Total water trapped',
    sampleInput: '6\n3 0 0 2 0 4',
    sampleOutput: '10',
    testcases: [
      { input: '6\n3 0 0 2 0 4', expectedOutput: '10' },
      { input: '3\n1 2 3', expectedOutput: '0' }
    ]
  },
  // Virtual Functions
  {
    topic: 'Virtual Functions',
    title: 'Dynamic Shape Area',
    difficulty: 'Easy',
    statement: 'Implement a base class Shape with a virtual function getArea(). Create derived classes Rectangle (l, w) and Circle (r). Use a Shape pointer to calculate area.',
    constraints: 'Values are integers. PI = 3',
    inputFormat: 'Type (1 for Rect, 2 for Circle) followed by dimensions',
    outputFormat: 'Area as integer',
    sampleInput: '1 5 4',
    sampleOutput: '20',
    testcases: [
      { input: '1 5 4', expectedOutput: '20' },
      { input: '2 3', expectedOutput: '27' }
    ]
  },
  // Pointers
  {
    topic: 'Pointer Arithmetic',
    title: 'Pointer String length',
    difficulty: 'Easy',
    statement: 'Calculate the length of a string using only pointers (no array indexing or strlen).',
    constraints: 'String length < 100',
    inputFormat: 'A single string',
    outputFormat: 'Length of string',
    sampleInput: 'PointerCode',
    sampleOutput: '11',
    testcases: [
      { input: 'Hello', expectedOutput: '5' },
      { input: 'A', expectedOutput: '1' }
    ]
  },
  // STL
  {
    topic: 'Standard Template Library',
    title: 'Frequency Counter',
    difficulty: 'Medium',
    statement: 'Given N strings, find the frequency of each string using a map and print them in alphabetical order.',
    constraints: '1 <= N <= 10^4',
    inputFormat: 'N followed by N strings',
    outputFormat: 'string frequency (one per line)',
    sampleInput: '5\napple banana apple cherry banana',
    sampleOutput: 'apple 2\nbanana 2\ncherry 1',
    testcases: [
      { input: '5\napple banana apple cherry banana', expectedOutput: 'apple 2\nbanana 2\ncherry 1' }
    ]
  }
];

const seed = async () => {
  await connectDB();
  console.log('Clearing old data...');
  await Topic.deleteMany({});
  await Question.deleteMany({});

  const topicMap = {};
  console.log('Seeding 36 topics...');
  for (let i = 0; i < topics.length; i++) {
    const t = await Topic.create({
      name: topics[i],
      order: i + 1,
      theory: {
        syntax: `// Example for ${topics[i]}\n`,
        explanation: `Comprehensive guide to ${topics[i]}...`,
        commonMistakes: 'Watch out for memory leaks and syntax errors.',
        importantNotes: 'This is a core concept in C++ development.',
      }
    });
    topicMap[topics[i]] = t._id;
  }

  console.log('Seeding curated questions...');
  for (const q of questionData) {
    await Question.create({
      ...q,
      topicId: topicMap[q.topic],
      inputFormat: q.inputFormat || 'Standard input',
      outputFormat: q.outputFormat || 'Standard output',
      sampleInput: q.sampleInput || '',
      sampleOutput: q.sampleOutput || '',
      constraints: q.constraints || 'N/A'
    });
  }

  // Generate filler questions for empty topics to ensure 100% coverage
  console.log('Generating coverage questions...');
  for (const topicName of topics) {
    const existing = questionData.filter(q => q.topic === topicName);
    if (existing.length < 3) {
      const diffs = ['Easy', 'Medium', 'Hard'];
      for (const d of diffs) {
        if (!existing.find(q => q.difficulty === d)) {
          await Question.create({
            topicId: topicMap[topicName],
            title: `${topicName} Challenge (${d})`,
            difficulty: d,
            statement: `Write a program to demonstrate ${topicName} in a ${d} scenario. Implement the logic to handle standard input and output correctly.`,
            constraints: 'Standard',
            inputFormat: 'Input values',
            outputFormat: 'Resulting value',
            sampleInput: '10',
            sampleOutput: '10',
            testcases: [{ input: '10', expectedOutput: '10' }, { input: '20', expectedOutput: '20' }]
          });
        }
      }
    }
  }

  console.log('SUCCESS: CodeForge Curriculum seeded with 108 questions across 36 topics.');
  process.exit(0);
};

seed();
