import mongoose from 'mongoose';

// Since we are using JS module to avoid TS execution issues:
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codeforge';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  order: { type: Number, required: true },
  theory: {
    syntax: { type: String, default: '' },
    explanation: { type: String, default: '' },
    commonMistakes: { type: String, default: '' },
    importantNotes: { type: String, default: '' },
  },
});

const questionSchema = new mongoose.Schema({
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  statement: { type: String, required: true },
  constraints: { type: String, required: true },
  inputFormat: { type: String, required: true },
  outputFormat: { type: String, required: true },
  sampleInput: { type: String, required: true },
  sampleOutput: { type: String, required: true },
  explanation: { type: String, default: '' },
  hints: [{ type: String }],
  testcases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
  }],
});

const Topic = mongoose.models.Topic || mongoose.model('Topic', topicSchema);
const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

const topicsData = [
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

const sampleQuestions = [
  {
    topicName: '1D Array',
    title: 'Sum of Array Elements',
    difficulty: 'Easy',
    statement: 'Given an array of integers, find the sum of its elements.',
    constraints: '1 <= N <= 1000\n1 <= A[i] <= 1000',
    inputFormat: 'The first line contains an integer N, the size of the array.\nThe second line contains N space-separated integers.',
    outputFormat: 'Print a single integer, the sum of the array elements.',
    sampleInput: '5\n1 2 3 4 5',
    sampleOutput: '15',
    explanation: '1 + 2 + 3 + 4 + 5 = 15.',
    hints: ['Iterate through the array and maintain a sum variable.'],
    testcases: [
      { input: '5\n1 2 3 4 5', expectedOutput: '15' },
      { input: '3\n10 20 30', expectedOutput: '60' },
      { input: '1\n100', expectedOutput: '100' },
      { input: '4\n5 5 5 5', expectedOutput: '20' },
      { input: '6\n1 1 1 1 1 1', expectedOutput: '6' },
      { input: '2\n999 1', expectedOutput: '1000' }
    ]
  },
  {
    topicName: '1D Array',
    title: 'Find Maximum Element',
    difficulty: 'Medium',
    statement: 'Find the maximum element in a given 1D array.',
    constraints: '1 <= N <= 10000\n-10^9 <= A[i] <= 10^9',
    inputFormat: 'First line contains N. Second line contains N integers.',
    outputFormat: 'Print the maximum integer.',
    sampleInput: '4\n-1 5 2 9',
    sampleOutput: '9',
    explanation: '9 is the largest element in the array.',
    hints: ['Initialize max with the first element and compare with the rest.'],
    testcases: [
      { input: '4\n-1 5 2 9', expectedOutput: '9' },
      { input: '1\n-5', expectedOutput: '-5' },
      { input: '3\n10 10 10', expectedOutput: '10' },
      { input: '5\n1 2 3 4 5', expectedOutput: '5' },
      { input: '5\n5 4 3 2 1', expectedOutput: '5' },
      { input: '2\n-100 -200', expectedOutput: '-100' }
    ]
  },
  {
    topicName: 'Strings',
    title: 'Reverse a String',
    difficulty: 'Easy',
    statement: 'Given a string S, print the reverse of the string.',
    constraints: '1 <= |S| <= 1000. String contains only lowercase English letters.',
    inputFormat: 'A single string S.',
    outputFormat: 'Print the reversed string.',
    sampleInput: 'hello',
    sampleOutput: 'olleh',
    explanation: 'The reverse of hello is olleh.',
    hints: ['Use a loop from the end of the string to the beginning.'],
    testcases: [
      { input: 'hello', expectedOutput: 'olleh' },
      { input: 'world', expectedOutput: 'dlrow' },
      { input: 'a', expectedOutput: 'a' },
      { input: 'abcde', expectedOutput: 'edcba' },
      { input: 'codeforge', expectedOutput: 'egrofedoc' },
      { input: 'racecar', expectedOutput: 'racecar' }
    ]
  }
];

const seedData = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Topic.deleteMany({});
  await Question.deleteMany({});

  console.log('Inserting topics...');
  let orderCounter = 1;
  const topicDocs = [];
  for (const t of topicsData) {
    const doc = await Topic.create({
      name: t,
      order: orderCounter++,
      theory: {
        syntax: 'Syntax example for ' + t,
        explanation: 'Detailed explanation of ' + t,
        commonMistakes: 'Watch out for common errors in ' + t,
        importantNotes: 'Remember these key points for ' + t,
      }
    });
    topicDocs.push(doc);
  }

  console.log('Inserting sample questions...');
  for (const q of sampleQuestions) {
    const topic = topicDocs.find(t => t.name === q.topicName);
    if (topic) {
      await Question.create({
        ...q,
        topicId: topic._id
      });
    }
  }

  console.log('Seeding completed successfully!');
  process.exit(0);
};

seedData();
