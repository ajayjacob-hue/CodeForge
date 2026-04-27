import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

// 1. Database Connection Logic
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
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    };
    await mongoose.connect(MONGODB_URI, opts);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ Connection error:', error);
    process.exit(1);
  }
};

// 2. Schemas
const Topic = mongoose.models.Topic || mongoose.model('Topic', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  order: { type: Number, required: true },
  theory: { syntax: String, explanation: String, commonMistakes: String, importantNotes: String },
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
  testcases: [{ input: { type: String, required: true }, expectedOutput: { type: String, required: true } }],
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

// ==========================================================
// 3. PASTE THE DATA FROM CHATGPT BELOW
// ==========================================================

const commonData = {
  'Abstract Classes-Easy': {
    title: 'Abstract Square Perimeter',
    statement: 'Create an abstract class Polygon with a pure virtual function perimeter(). Derive a Square class that implements the function. Given side length S, print the perimeter of the square.',
    inputFormat: 'Single integer S.',
    outputFormat: 'Print 4 * S.',
    constraints: '1 <= S <= 100000',
    sampleInput: '5',
    sampleOutput: '20',
    testcases: [
      { input: '5', output: '20' },
      { input: '1', output: '4' },
      { input: '10', output: '40' }
    ]
  },

  'Abstract Classes-Medium': {
    title: 'Vehicle Speed Model',
    statement: 'Create an abstract class Vehicle with pure virtual function speed(). Derive Car class that returns distance divided by time using integer division. Given distance D and time T, print speed.',
    inputFormat: 'Two integers D and T.',
    outputFormat: 'Print D / T using integer division.',
    constraints: '1 <= D,T <= 1000000',
    sampleInput: '120 3',
    sampleOutput: '40',
    testcases: [
      { input: '120 3', output: '40' },
      { input: '10 4', output: '2' },
      { input: '1 1', output: '1' }
    ]
  },

  'Abstract Classes-Hard': {
    title: 'Abstract Billing Engine',
    statement: 'Create an abstract class Bill with pure virtual total(). If type is 1, use ElectricityBill where total = units * rate. If type is 2, use WaterBill where total = fixedCharge + usageCharge. Print final bill amount.',
    inputFormat: 'If type=1: 1 units rate\nIf type=2: 2 fixedCharge usageCharge',
    outputFormat: 'Print total bill.',
    constraints: 'All values are non-negative integers.',
    sampleInput: '1 150 6',
    sampleOutput: '900',
    testcases: [
      { input: '1 150 6', output: '900' },
      { input: '2 200 75', output: '275' },
      { input: '1 0 9', output: '0' }
    ]
  },

  'Function Templates-Easy': {
    title: 'Template Maximum of Two',
    statement: 'Create a function template maxVal(T a, T b) that returns the greater of two values. For this problem, integers are given.',
    inputFormat: 'Two integers A and B.',
    outputFormat: 'Print the larger value.',
    constraints: '-10^9 <= A,B <= 10^9',
    sampleInput: '7 12',
    sampleOutput: '12',
    testcases: [
      { input: '7 12', output: '12' },
      { input: '-3 -8', output: '-3' },
      { input: '5 5', output: '5' }
    ]
  },

  'Function Templates-Medium': {
    title: 'Template Swap Values',
    statement: 'Create a function template swapVal(T &a, T &b) to swap two values. Integers are provided for this problem.',
    inputFormat: 'Two integers A and B.',
    outputFormat: 'Print swapped values separated by space.',
    constraints: '-10^9 <= A,B <= 10^9',
    sampleInput: '4 9',
    sampleOutput: '9 4',
    testcases: [
      { input: '4 9', output: '9 4' },
      { input: '1 1', output: '1 1' },
      { input: '-2 7', output: '7 -2' }
    ]
  },

  'Function Templates-Hard': {
    title: 'Template Array Sum',
    statement: 'Create a function template sumArray(T arr[], int n) that returns the sum of all array elements. Integer array is used here.',
    inputFormat: 'First line contains N.\nSecond line contains N integers.',
    outputFormat: 'Print total sum.',
    constraints: '1 <= N <= 100000',
    sampleInput: '5\n1 2 3 4 5',
    sampleOutput: '15',
    testcases: [
      { input: '5\n1 2 3 4 5', output: '15' },
      { input: '3\n10 -2 7', output: '15' },
      { input: '1\n99', output: '99' }
    ]
  },

  'Class Templates-Easy': {
    title: 'Template Box Storage',
    statement: 'Create a class template Box<T> that stores one value. Integer input is given. Print the stored value.',
    inputFormat: 'Single integer X.',
    outputFormat: 'Print X.',
    constraints: '-10^9 <= X <= 10^9',
    sampleInput: '25',
    sampleOutput: '25',
    testcases: [
      { input: '25', output: '25' },
      { input: '-7', output: '-7' },
      { input: '0', output: '0' }
    ]
  },

  'Class Templates-Medium': {
    title: 'Template Pair Sum',
    statement: 'Create a class template Pair<T> storing two values. For integer inputs, print their sum.',
    inputFormat: 'Two integers A and B.',
    outputFormat: 'Print A + B.',
    constraints: '-10^9 <= A,B <= 10^9',
    sampleInput: '8 5',
    sampleOutput: '13',
    testcases: [
      { input: '8 5', output: '13' },
      { input: '-3 9', output: '6' },
      { input: '0 0', output: '0' }
    ]
  },

  'Class Templates-Hard': {
    title: 'Template Dynamic Stack',
    statement: 'Create a class template Stack<T> with push and pop operations. Given N integers, push all values and then pop everything. Print popped order.',
    inputFormat: 'First line contains N.\nSecond line contains N integers.',
    outputFormat: 'Print elements in reverse insertion order separated by spaces.',
    constraints: '1 <= N <= 100000',
    sampleInput: '5\n1 2 3 4 5',
    sampleOutput: '5 4 3 2 1',
    testcases: [
      { input: '5\n1 2 3 4 5', output: '5 4 3 2 1' },
      { input: '3\n9 8 7', output: '7 8 9' },
      { input: '1\n42', output: '42' }
    ]
  },

  'Standard Template Library-Easy': {
    title: 'Vector Sum',
    statement: 'Use STL vector to store N integers and print the sum of all elements.',
    inputFormat: 'First line contains N.\nSecond line contains N integers.',
    outputFormat: 'Print sum.',
    constraints: '1 <= N <= 100000',
    sampleInput: '4\n1 2 3 4',
    sampleOutput: '10',
    testcases: [
      { input: '4\n1 2 3 4', output: '10' },
      { input: '1\n99', output: '99' },
      { input: '3\n10 -5 2', output: '7' }
    ]
  },

  'Standard Template Library-Medium': {
    title: 'Set Unique Count',
    statement: 'Use STL set to store N integers and print the number of distinct values.',
    inputFormat: 'First line contains N.\nSecond line contains N integers.',
    outputFormat: 'Print count of unique elements.',
    constraints: '1 <= N <= 100000',
    sampleInput: '6\n1 2 2 3 3 3',
    sampleOutput: '3',
    testcases: [
      { input: '6\n1 2 2 3 3 3', output: '3' },
      { input: '5\n5 5 5 5 5', output: '1' },
      { input: '4\n1 2 3 4', output: '4' }
    ]
  },

  'Standard Template Library-Hard': {
    title: 'Priority Queue Merge Cost',
    statement: 'Given N positive integers, repeatedly remove the two smallest values, add them, and insert their sum back. Accumulate total merge cost. Use STL priority_queue or equivalent heap.',
    inputFormat: 'First line contains N.\nSecond line contains N integers.',
    outputFormat: 'Print total merge cost.',
    constraints: '1 <= N <= 100000\n1 <= Ai <= 10^9',
    sampleInput: '4\n1 2 3 4',
    sampleOutput: '19',
    testcases: [
      { input: '4\n1 2 3 4', output: '19' },
      { input: '1\n10', output: '0' },
      { input: '3\n5 5 5', output: '25' }
    ]
  }
};

// ==========================================================
// 4. INCREMENTAL Seeding Execution Logic
// ==========================================================

const seed = async () => {
  await connectDB();
  console.log('🔄 Starting incremental seeding (No Wipe)...');

  const topicMap = {};
  console.log('📚 Checking Topics...');
  for (let i = 0; i < topics.length; i++) {
    const t = await Topic.findOneAndUpdate(
      { name: topics[i] },
      {
        $setOnInsert: {
          order: i + 1,
          theory: {
            syntax: `// Standard C++ syntax for ${topics[i]}`,
            explanation: `Comprehensive guide to ${topics[i]}.`,
            commonMistakes: 'Watch for syntax and logical errors.',
            importantNotes: 'Core building block of C++.'
          }
        }
      },
      { upsert: true, returnDocument: 'after' }
    );
    topicMap[topics[i]] = t._id;
  }

  console.log('💎 Syncing Questions...');
  let count = 0;
  const keys = Object.keys(commonData);

  for (const key of keys) {
    const lastHyphenIndex = key.lastIndexOf('-');
    if (lastHyphenIndex === -1) continue;

    const topicName = key.substring(0, lastHyphenIndex).trim();
    const difficulty = key.substring(lastHyphenIndex + 1).trim();
    const q = commonData[key];

    if (topicMap[topicName]) {
      await Question.findOneAndUpdate(
        { topicId: topicMap[topicName], difficulty: difficulty, title: q.title },
        {
          statement: q.statement,
          inputFormat: q.inputFormat,
          outputFormat: q.outputFormat,
          constraints: q.constraints,
          sampleInput: q.sampleInput,
          sampleOutput: q.sampleOutput,
          testcases: q.testcases.map(tc => ({ input: tc.input, expectedOutput: tc.output }))
        },
        { upsert: true }
      );
      count++;
    } else {
      console.warn(`⚠️ Topic not found for key: ${key}`);
    }
  }

  console.log(`\n✅ SUCCESS! Synced ${count} questions in this batch.`);
  console.log('Your previous questions are still safe in the database.');
  process.exit(0);
};

seed();
