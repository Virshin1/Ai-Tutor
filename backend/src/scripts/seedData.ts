import mongoose from 'mongoose';
import LessonPlan from '../models/LessonPlan';
import Rubric from '../models/Rubric';
import IEP from '../models/IEP';
import ExitTicket from '../models/ExitTicket';
import ReportComment from '../models/ReportComment';
import Assignment from '../models/Assignment';
import Direction from '../models/Direction';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/teaching-tools');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      LessonPlan.deleteMany({}),
      Rubric.deleteMany({}),
      IEP.deleteMany({}),
      ExitTicket.deleteMany({}),
      ReportComment.deleteMany({}),
      Assignment.deleteMany({}),
      Direction.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Sample Lesson Plans
    const lessonPlans = [
      {
        title: 'Introduction to Fractions',
        subject: 'Mathematics',
        gradeLevel: '4th Grade',
        duration: '45 minutes',
        objectives: 'Students will understand basic fractions, identify numerator and denominator, and solve simple fraction problems.',
        materials: 'Fraction circles, whiteboard, markers, worksheets',
        activities: `## Lesson Activities

### 1. Introduction (10 minutes)
- Begin with a real-world example: "If you have a pizza cut into 8 slices and eat 3, what fraction did you eat?"
- Show fraction circles and explain parts of a whole

### 2. Guided Practice (20 minutes)
- Use fraction circles to demonstrate 1/2, 1/3, 1/4, 1/6, 1/8
- Students work in pairs with fraction manipulatives
- Practice writing fractions and identifying parts

### 3. Independent Practice (10 minutes)
- Complete worksheet with fraction identification
- Draw fractions using circles and rectangles

### 4. Assessment (5 minutes)
- Quick check: Students show 3/4 using fraction circles`,
        assessment: 'Students will demonstrate understanding by correctly identifying and drawing fractions on their worksheets.'
      },
      {
        title: 'Photosynthesis Process',
        subject: 'Science',
        gradeLevel: '5th Grade',
        duration: '60 minutes',
        objectives: 'Students will understand the process of photosynthesis and identify the key components needed for plants to make food.',
        materials: 'Live plants, test tubes, water, sunlight, magnifying glasses, diagrams',
        activities: `## Lesson Activities

### 1. Introduction (15 minutes)
- Show students a healthy plant and discuss what it needs to survive
- Introduce the concept of photosynthesis using simple language
- Show diagrams of the process

### 2. Hands-on Experiment (30 minutes)
- Students observe plants in different conditions (sunlight vs. dark)
- Use magnifying glasses to examine leaves
- Discuss observations and predictions

### 3. Discussion and Conclusion (15 minutes)
- Review what plants need for photosynthesis
- Connect to real-world examples
- Discuss why photosynthesis is important for all living things`,
        assessment: 'Students will complete a simple diagram labeling the parts of photosynthesis and explain the process in their own words.'
      }
    ];

    // Sample Rubrics
    const rubrics = [
      {
        title: 'Science Lab Report',
        subject: 'Science',
        gradeLevel: '6th Grade',
        criteria: 'Hypothesis, Procedure, Data Collection, Analysis, Conclusion',
        levels: `## Science Lab Report Rubric

### Excellent (4 points)
- **Hypothesis**: Clear, testable, and well-reasoned
- **Procedure**: Detailed, replicable, and safe
- **Data Collection**: Accurate, complete, and well-organized
- **Analysis**: Thorough, logical, and supported by data
- **Conclusion**: Insightful, connects to hypothesis, suggests further research

### Good (3 points)
- **Hypothesis**: Clear and testable
- **Procedure**: Complete and safe
- **Data Collection**: Accurate and complete
- **Analysis**: Logical and supported by data
- **Conclusion**: Connects to hypothesis

### Satisfactory (2 points)
- **Hypothesis**: Present but could be clearer
- **Procedure**: Complete but lacks detail
- **Data Collection**: Present but may have gaps
- **Analysis**: Basic analysis present
- **Conclusion**: Basic conclusion present

### Needs Improvement (1 point)
- **Hypothesis**: Unclear or missing
- **Procedure**: Incomplete or unsafe
- **Data Collection**: Inaccurate or incomplete
- **Analysis**: Missing or incorrect
- **Conclusion**: Missing or incorrect`
      },
      {
        title: 'Creative Writing Assignment',
        subject: 'Language Arts',
        gradeLevel: '5th Grade',
        criteria: 'Creativity, Organization, Grammar, Vocabulary, Length',
        levels: `## Creative Writing Rubric

### Excellent (4 points)
- **Creativity**: Highly original and engaging story
- **Organization**: Clear beginning, middle, and end with smooth transitions
- **Grammar**: Few to no errors
- **Vocabulary**: Rich, varied, and age-appropriate
- **Length**: Meets or exceeds requirements

### Good (3 points)
- **Creativity**: Original and interesting story
- **Organization**: Clear structure with good flow
- **Grammar**: Minor errors that don't interfere with meaning
- **Vocabulary**: Good variety and appropriate level
- **Length**: Meets requirements

### Satisfactory (2 points)
- **Creativity**: Some original elements
- **Organization**: Basic structure present
- **Grammar**: Several errors but meaning is clear
- **Vocabulary**: Basic but appropriate
- **Length**: Close to requirements

### Needs Improvement (1 point)
- **Creativity**: Lacks originality
- **Organization**: Unclear or missing structure
- **Grammar**: Many errors that interfere with meaning
- **Vocabulary**: Limited or inappropriate
- **Length**: Significantly below requirements`
      }
    ];

    // Sample IEPs
    const ieps = [
      {
        studentName: 'Alex Johnson',
        gradeLevel: '3rd Grade',
        subject: 'General',
        goals: 'Improve reading fluency, develop math problem-solving skills, enhance social interactions',
        accommodations: 'Extended time on tests, preferential seating, use of calculator for math',
        modifications: `## Individualized Education Program

### Student Information
- **Name**: Alex Johnson
- **Grade**: 3rd Grade
- **Primary Disability**: Learning Disability (Reading and Math)

### Annual Goals

#### Reading Goal
Alex will improve reading fluency from 45 words per minute to 80 words per minute with 90% accuracy by the end of the school year.

**Objectives:**
- Read grade-level text with appropriate pacing
- Use context clues to decode unfamiliar words
- Demonstrate comprehension through retelling

#### Math Goal
Alex will solve multi-step word problems with 80% accuracy using appropriate strategies.

**Objectives:**
- Identify key information in word problems
- Choose appropriate operations
- Show work clearly and logically

#### Social Goal
Alex will initiate positive interactions with peers during structured activities 3 out of 5 opportunities.

**Objectives:**
- Participate in group activities
- Share materials appropriately
- Ask for help when needed

### Accommodations and Modifications
- Extended time on tests and assignments
- Preferential seating near the teacher
- Use of calculator for math calculations
- Audio recordings of text when available
- Small group instruction for reading
- Visual aids and graphic organizers`
      },
      {
        studentName: 'Sarah Chen',
        gradeLevel: '4th Grade',
        subject: 'General',
        goals: 'Improve written expression, develop organizational skills, enhance attention to task',
        accommodations: 'Use of graphic organizers, frequent breaks, visual schedules',
        modifications: `## Individualized Education Program

### Student Information
- **Name**: Sarah Chen
- **Grade**: 4th Grade
- **Primary Disability**: ADHD and Written Expression Disorder

### Annual Goals

#### Writing Goal
Sarah will write a complete paragraph with a topic sentence, supporting details, and conclusion with 85% accuracy.

**Objectives:**
- Use graphic organizers to plan writing
- Include relevant supporting details
- Use proper punctuation and capitalization

#### Organization Goal
Sarah will maintain an organized desk and complete homework assignments 90% of the time.

**Objectives:**
- Use color-coded folders for different subjects
- Complete daily homework checklist
- Return completed work on time

#### Attention Goal
Sarah will maintain focus on academic tasks for 20 minutes with minimal redirection.

**Objectives:**
- Use fidget tools appropriately
- Take scheduled breaks when needed
- Complete tasks before moving to next activity

### Accommodations and Modifications
- Use of graphic organizers for writing
- Frequent breaks during long tasks
- Visual schedules and checklists
- Preferential seating to minimize distractions
- Extended time for written assignments
- Use of computer for written work when appropriate`
      }
    ];

    // Sample Exit Tickets
    const exitTickets = [
      {
        subject: 'General',
        gradeLevel: '4th Grade',
        topic: 'Fractions',
        questions: `## Exit Ticket: Fractions

**Name:** _________________  **Date:** _________________

### 1. What is the numerator in the fraction 3/4?
   a) 3
   b) 4
   c) 7
   d) 12

### 2. Draw a picture to show 2/3 of a circle.

### 3. If you have 8 cookies and eat 5, what fraction did you eat?
   Write your answer: _______________

### 4. True or False: 1/2 is equal to 2/4
   Circle: True  /  False

### 5. What fraction of the class is wearing blue today?
   Write your answer: _______________`
      },
      {
        subject: 'General',
        gradeLevel: '5th Grade',
        topic: 'Photosynthesis',
        questions: `## Exit Ticket: Photosynthesis

**Name:** _________________  **Date:** _________________

### 1. What three things do plants need for photosynthesis?
   a) Water, soil, and air
   b) Sunlight, water, and carbon dioxide
   c) Oxygen, food, and water
   d) Soil, fertilizer, and air

### 2. What gas do plants release during photosynthesis?
   a) Carbon dioxide
   b) Oxygen
   c) Nitrogen
   d) Hydrogen

### 3. Draw a simple diagram showing what goes into a plant and what comes out during photosynthesis.

### 4. Why is photosynthesis important for humans?
   Write your answer: _______________

### 5. What would happen to a plant if you put it in a dark room for a week?
   Write your answer: _______________`
      }
    ];

    // Sample Report Comments
    const reportComments = [
      {
        studentName: 'Michael Rodriguez',
        gradeLevel: 'General',
        subject: 'Mathematics',
        performance: 'Above Grade Level',
        comment: `Michael has demonstrated exceptional mathematical thinking throughout this quarter. He consistently shows strong problem-solving skills and can apply mathematical concepts to real-world situations. His work with fractions and decimals has been particularly impressive, often helping classmates understand difficult concepts. Michael's ability to explain his reasoning clearly makes him a valuable member of our math community. He continues to challenge himself with more complex problems and shows great enthusiasm for learning new mathematical concepts.`
      },
      {
        studentName: 'Emma Thompson',
        gradeLevel: 'General',
        subject: 'Language Arts',
        performance: 'At Grade Level',
        comment: `Emma has made steady progress in reading and writing this quarter. She shows good comprehension skills when reading independently and participates thoughtfully in class discussions. Her writing has improved significantly, particularly in organizing her ideas and using descriptive language. Emma works well independently and is beginning to take more initiative in her learning. With continued practice and support, she will continue to develop her literacy skills.`
      }
    ];

    // Sample Assignments
    const assignments = [
      {
        subject: 'Mathematics',
        gradeLevel: '4th Grade',
        topic: 'Personalized Assignments',
        studentLevel: 'Advanced',
        assignments: `## Personalized Math Assignments for Advanced 4th Grade Student

### Assignment 1: Fraction Challenge (Due: Friday)
**Objective**: Apply fraction concepts to real-world problems

**Tasks**:
1. Create a recipe that serves 6 people, then modify it to serve 4 people using fractions
2. Design a garden layout where 1/3 is flowers, 1/4 is vegetables, and the rest is grass
3. Solve 5 word problems involving fractions and mixed numbers

**Extension**: Research how fractions are used in cooking, construction, or music

### Assignment 2: Math in the Real World (Due: Next Wednesday)
**Objective**: Connect mathematical concepts to everyday life

**Tasks**:
1. Keep a spending log for one week, calculating percentages of spending categories
2. Measure and calculate the area and perimeter of 5 objects in your home
3. Create a budget for a hypothetical $100 shopping trip

**Extension**: Interview a family member about how they use math in their job

### Assignment 3: Creative Math Project (Due: Two weeks)
**Objective**: Demonstrate understanding through creative expression

**Tasks**:
1. Create a math board game that teaches fraction concepts
2. Write a story that incorporates mathematical problems
3. Design a poster explaining a mathematical concept to younger students

**Extension**: Present your project to the class`
      },
      {
        subject: 'Science',
        gradeLevel: '5th Grade',
        topic: 'Personalized Assignments',
        studentLevel: 'At Grade Level',
        assignments: `## Personalized Science Assignments for 5th Grade Student

### Assignment 1: Ecosystem Investigation (Due: Friday)
**Objective**: Explore local ecosystems and food chains

**Tasks**:
1. Observe and document 5 different plants and animals in your backyard or local park
2. Create a simple food chain diagram
3. Research one local animal and its role in the ecosystem

**Extension**: Create a diorama of your chosen ecosystem

### Assignment 2: Weather Tracking (Due: Next Monday)
**Objective**: Understand weather patterns and data collection

**Tasks**:
1. Record daily weather for one week (temperature, precipitation, wind)
2. Create a weather chart or graph
3. Compare your data to historical averages for your area

**Extension**: Research how weather affects local wildlife

### Assignment 3: Simple Experiments (Due: Two weeks)
**Objective**: Practice scientific method and observation skills

**Tasks**:
1. Conduct a simple experiment (e.g., plant growth with different amounts of water)
2. Record observations daily for one week
3. Write a simple conclusion about your findings

**Extension**: Present your experiment to the class`
      }
    ];

    // Sample Directions
    const directions = [
      {
        activity: 'Science Lab Safety',
        gradeLevel: '5th Grade',
        subject: 'General',
        directions: `## Science Lab Safety Directions

### Before the Lab (5 minutes)
1. **Wash your hands** thoroughly with soap and water
2. **Tie back long hair** and remove loose jewelry
3. **Put on safety goggles** - make sure they fit properly
4. **Review the experiment** with your partner
5. **Clear your workspace** of unnecessary items

### During the Lab (30 minutes)
1. **Listen carefully** to all instructions before starting
2. **Never taste or smell** any chemicals unless specifically told to do so
3. **Keep your workspace clean** and organized
4. **Use equipment carefully** - report any broken items immediately
5. **Work with your partner** - no solo experiments
6. **Stay at your station** unless given permission to move

### After the Lab (10 minutes)
1. **Clean up your workspace** completely
2. **Dispose of materials** in the proper containers
3. **Wash your hands** again
4. **Return all equipment** to its proper place
5. **Complete your lab report** with your observations

### Emergency Procedures
- If you spill something, **tell the teacher immediately**
- If you get something in your eyes, **use the eyewash station**
- If there's a fire, **follow the teacher's instructions**
- **Never run** in the lab

### Remember
- Safety first, always!
- When in doubt, ask the teacher
- Better safe than sorry!`
      },
      {
        activity: 'Group Discussion',
        gradeLevel: '4th Grade',
        subject: 'General',
        directions: `## Group Discussion Directions

### Preparation (5 minutes)
1. **Find your assigned group** - look for your name on the board
2. **Move to your group's area** quietly and quickly
3. **Get your materials ready** - paper, pencil, and any handouts
4. **Choose a group leader** - this person will keep the group on track
5. **Choose a recorder** - this person will write down your group's ideas

### During Discussion (15 minutes)
1. **Take turns speaking** - raise your hand if you want to talk
2. **Listen actively** - look at the speaker and nod to show you're listening
3. **Build on others' ideas** - say "I agree with..." or "I also think..."
4. **Ask questions** if you don't understand something
5. **Stay on topic** - the group leader will help with this
6. **Include everyone** - make sure all group members participate

### Sharing Ideas (10 minutes)
1. **Work together** to prepare your group's response
2. **Choose a spokesperson** to share with the class
3. **Practice your response** - make sure everyone agrees
4. **Listen to other groups** - you might learn something new
5. **Ask questions** of other groups if you're curious

### Group Roles
- **Leader**: Keeps group focused and on task
- **Recorder**: Writes down important ideas
- **Timekeeper**: Makes sure group finishes on time
- **Encourager**: Makes sure everyone participates

### Remember
- Use inside voices
- Be respectful of all ideas
- Work together as a team!`
      }
    ];

    // Insert all sample data
    await LessonPlan.insertMany(lessonPlans);
    await Rubric.insertMany(rubrics);
    await IEP.insertMany(ieps);
    await ExitTicket.insertMany(exitTickets);
    await ReportComment.insertMany(reportComments);
    await Assignment.insertMany(assignments);
    await Direction.insertMany(directions);

    console.log('Sample data inserted successfully!');
    console.log(`- ${lessonPlans.length} Lesson Plans`);
    console.log(`- ${rubrics.length} Rubrics`);
    console.log(`- ${ieps.length} IEPs`);
    console.log(`- ${exitTickets.length} Exit Tickets`);
    console.log(`- ${reportComments.length} Report Comments`);
    console.log(`- ${assignments.length} Assignments`);
    console.log(`- ${directions.length} Directions`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData(); 