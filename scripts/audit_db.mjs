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
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected for Audit');
  } catch (error) {
    console.error('❌ Audit connection error:', error);
    process.exit(1);
  }
};

const Topic = mongoose.models.Topic || mongoose.model('Topic', new mongoose.Schema({ name: String }));
const Question = mongoose.models.Question || mongoose.model('Question', new mongoose.Schema({ topicId: mongoose.Schema.Types.ObjectId, difficulty: String, title: String }));

const audit = async () => {
  await connectDB();
  
  const topics = await Topic.find().sort({ order: 1 });
  console.log(`\n📊 AUDIT REPORT:`);
  console.log(`-------------------------------------------------`);
  console.log(`${'Topic Name'.padEnd(35)} | E | M | H | Total`);
  console.log(`-------------------------------------------------`);

  let totalQuestions = 0;
  let missingTopics = [];

  for (const t of topics) {
    const easy = await Question.countDocuments({ topicId: t._id, difficulty: 'Easy' });
    const medium = await Question.countDocuments({ topicId: t._id, difficulty: 'Medium' });
    const hard = await Question.countDocuments({ topicId: t._id, difficulty: 'Hard' });
    
    const sum = easy + medium + hard;
    totalQuestions += sum;

    const row = `${t.name.padEnd(35)} | ${easy} | ${medium} | ${hard} | ${sum}`;
    console.log(row);

    if (sum < 3) missingTopics.push(t.name);
  }

  console.log(`-------------------------------------------------`);
  console.log(`TOTAL QUESTIONS IN DB: ${totalQuestions}`);
  console.log(`TOTAL TOPICS IN DB: ${topics.length}`);

  if (missingTopics.length > 0) {
    console.log(`\n⚠️ MISSING QUESTIONS IN TOPICS:`);
    console.log(missingTopics.join(', '));
  } else if (totalQuestions === 108) {
    console.log(`\n✅ PERFECT! All 108 questions are present.`);
  } else {
    console.log(`\n🤔 Something is off. Expected 108, but found ${totalQuestions}.`);
  }

  process.exit(0);
};

audit();
