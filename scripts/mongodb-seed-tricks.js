// MongoDB script to insert math tricks directly
// Run this in MongoDB Compass or MongoDB Shell

// Import necessary modules
const { use, db, ObjectId } = require("mongodb")

// Switch to your database
use("mathwars") // Replace 'mathwars' with your actual database name

// Get the system user ID (you'll need to replace this with actual ObjectId after running user script)
const systemUser = db.users.findOne({ username: "system" })
const systemUserId = systemUser ? systemUser._id : ObjectId()

// Clear existing tricks
db.tricks.deleteMany({})

// Insert comprehensive math tricks
db.tricks.insertMany([
  {
    _id: ObjectId(),
    title: "Square of Numbers ending in 5",
    description: "Learn to calculate squares of numbers ending in 5 in seconds",
    category: "Speed Arithmetic",
    difficulty: "Easy",
    timeToLearn: "3 min",
    examRelevance: ["SSC", "Banking", "Railway"],
    steps: [
      {
        title: "Understanding the Pattern",
        content: "When we square a number ending in 5, there's a beautiful pattern that emerges.",
        example: "Let's look at: 15² = 225, 25² = 625, 35² = 1225",
        visual: "Notice how the last two digits are always 25!",
      },
      {
        title: "The Magic Formula",
        content: "For any number ending in 5, follow this simple rule:",
        example: "Take the first digit(s), multiply by (itself + 1), then append 25",
        visual: "For 35²: 3 × (3+1) = 3 × 4 = 12, so 35² = 1225",
      },
      {
        title: "Step-by-Step Method",
        content: "Let's break down the process into simple steps:",
        example: "For 45²:\n1. Take first digit: 4\n2. Multiply by next number: 4 × 5 = 20\n3. Append 25: 2025",
        visual: "45² = 2025 ✓",
      },
      {
        title: "Practice Examples",
        content: "Now let's practice with different numbers:",
        example: "65² = 6 × 7 = 42, so 65² = 4225\n85² = 8 × 9 = 72, so 85² = 7225",
        visual: "The pattern works for any number ending in 5!",
      },
    ],
    keyPoints: ["Works for any number ending in 5", "Mental calculation possible", "Saves 80% time"],
    tips: [
      "Always remember: first digit × (first digit + 1), then add 25",
      "Practice with small numbers first, then move to larger ones",
      "This trick saves 70-80% calculation time in exams",
    ],
    practiceQuestions: [
      {
        question: "25²",
        answer: "625",
        explanation: "2 × 3 = 6, append 25 = 625",
      },
      {
        question: "55²",
        answer: "3025",
        explanation: "5 × 6 = 30, append 25 = 3025",
      },
      {
        question: "75²",
        answer: "5625",
        explanation: "7 × 8 = 56, append 25 = 5625",
      },
      {
        question: "95²",
        answer: "9025",
        explanation: "9 × 10 = 90, append 25 = 9025",
      },
    ],
    examApplications: [
      {
        exam: "SSC CGL",
        usage: "Frequently appears in arithmetic sections",
        timesSaved: "30-45 seconds per question",
      },
      {
        exam: "Banking",
        usage: "Useful in quantitative aptitude",
        timesSaved: "20-30 seconds per question",
      },
    ],
    rating: 4.8,
    studentsLearned: 12500,
    author: systemUserId,
    tags: ["squares", "mental math", "pattern"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    title: "Multiplication by 11 Trick",
    description: "Multiply any number by 11 using this amazing shortcut",
    category: "Speed Arithmetic",
    difficulty: "Easy",
    timeToLearn: "4 min",
    examRelevance: ["SSC", "Banking", "Railway", "Others"],
    steps: [
      {
        title: "The Basic Rule",
        content: "To multiply any 2-digit number by 11, add the digits and place the sum in the middle.",
        example: "23 × 11: Add 2+3=5, place between: 2_5_3 = 253",
        visual: "The original digits stay in place, sum goes in the middle!",
      },
      {
        title: "Handling Carry Over",
        content: "When the sum is greater than 9, carry over to the left digit.",
        example: "67 × 11: 6+7=13, so 6+1=7 and 3 in middle = 737",
        visual: "67 × 11 = 737 (carry the 1 from 13)",
      },
      {
        title: "Three Digit Numbers",
        content: "The same principle applies to larger numbers.",
        example: "123 × 11: 1_(1+2)_(2+3)_3 = 1_3_5_3 = 1353",
        visual: "Add adjacent digits, handle carry-overs as needed",
      },
    ],
    keyPoints: ["Add adjacent digits", "Works for any 2-digit number", "Expandable to larger numbers"],
    tips: [
      "Start with simple numbers like 12, 23, 34",
      "Remember to handle carry-over for sums > 9",
      "Practice until it becomes automatic",
    ],
    practiceQuestions: [
      {
        question: "34 × 11",
        answer: "374",
        explanation: "3+4=7, place in middle: 374",
      },
      {
        question: "56 × 11",
        answer: "616",
        explanation: "5+6=11, carry over: 616",
      },
      {
        question: "78 × 11",
        answer: "858",
        explanation: "7+8=15, carry over: 858",
      },
      {
        question: "123 × 11",
        answer: "1353",
        explanation: "1_(1+2)_(2+3)_3 = 1353",
      },
    ],
    examApplications: [
      {
        exam: "Banking",
        usage: "Quick calculations in quantitative sections",
        timesSaved: "20-30 seconds per question",
      },
      {
        exam: "SSC",
        usage: "Arithmetic and number system questions",
        timesSaved: "25-35 seconds per question",
      },
    ],
    rating: 4.7,
    studentsLearned: 15200,
    author: systemUserId,
    tags: ["multiplication", "11", "mental math"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    title: "Percentage to Fraction Quick Conversion",
    description: "Convert percentages to fractions instantly without calculation",
    category: "Percentage",
    difficulty: "Medium",
    timeToLearn: "5 min",
    examRelevance: ["SSC", "Banking"],
    steps: [
      {
        title: "Common Conversions",
        content: "Memorize these frequently used percentage to fraction conversions.",
        example: "25% = 1/4, 50% = 1/2, 75% = 3/4, 33.33% = 1/3, 66.67% = 2/3",
        visual: "These appear in 80% of competitive exam questions!",
      },
      {
        title: "Advanced Conversions",
        content: "Learn more complex but commonly tested conversions.",
        example: "12.5% = 1/8, 37.5% = 3/8, 62.5% = 5/8, 87.5% = 7/8",
        visual: "Master these for data interpretation questions",
      },
      {
        title: "Banking Specific",
        content: "Special conversions frequently used in banking exams.",
        example: "16.67% = 1/6, 83.33% = 5/6, 14.29% = 1/7, 85.71% = 6/7",
        visual: "These save massive time in banking calculations",
      },
    ],
    keyPoints: ["Memorize common conversions", "Useful in DI questions", "Reduces calculation time"],
    tips: [
      "Create flashcards for quick memorization",
      "Practice with data interpretation questions",
      "Focus on banking-specific percentages for banking exams",
    ],
    practiceQuestions: [
      {
        question: "What is 37.5% as a fraction?",
        answer: "3/8",
        explanation: "37.5% = 3/8",
      },
      {
        question: "Convert 83.33% to fraction",
        answer: "5/6",
        explanation: "83.33% = 5/6",
      },
      {
        question: "What is 62.5% as a fraction?",
        answer: "5/8",
        explanation: "62.5% = 5/8",
      },
      {
        question: "Convert 16.67% to fraction",
        answer: "1/6",
        explanation: "16.67% = 1/6",
      },
    ],
    examApplications: [
      {
        exam: "SSC CGL",
        usage: "Data interpretation and percentage questions",
        timesSaved: "45-60 seconds per question",
      },
      {
        exam: "Banking",
        usage: "Profit/loss and interest calculations",
        timesSaved: "30-45 seconds per question",
      },
    ],
    rating: 4.9,
    studentsLearned: 9800,
    author: systemUserId,
    tags: ["percentage", "fraction", "conversion"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    title: "Compound Interest Formula Shortcut",
    description: "Calculate compound interest without complex formulas",
    category: "Banking Math",
    difficulty: "Hard",
    timeToLearn: "8 min",
    examRelevance: ["Banking", "SSC"],
    steps: [
      {
        title: "Understanding the Basics",
        content: "Compound interest can be calculated using shortcuts for common scenarios.",
        example: "For 2 years: Amount = P(1 + R/100)²",
        visual: "We'll learn to do this mentally without calculators",
      },
      {
        title: "Two Year Shortcut",
        content: "For 2 years, use this mental calculation method.",
        example:
          "P=1000, R=10%, T=2 years\nCI = P × R/100 × (2 + R/100)\nCI = 1000 × 10/100 × (2 + 10/100) = 100 × 2.1 = 210",
        visual: "Much faster than the traditional formula!",
      },
      {
        title: "Three Year Method",
        content: "For 3 years, extend the pattern.",
        example: "Use successive percentage increases\nYear 1: +10%, Year 2: +10% on new amount, Year 3: +10% again",
        visual: "Break it down year by year for mental calculation",
      },
    ],
    keyPoints: ["Avoid lengthy calculations", "Pattern recognition", "Banking exam essential"],
    tips: [
      "Master 2-year calculations first",
      "Practice with round numbers",
      "Learn common interest rates (5%, 10%, 15%, 20%)",
    ],
    practiceQuestions: [
      {
        question: "CI on ₹1000 at 10% for 2 years",
        answer: "₹210",
        explanation: "1000 × 0.1 × 2.1 = 210",
      },
      {
        question: "CI on ₹2000 at 15% for 2 years",
        answer: "₹645",
        explanation: "2000 × 0.15 × 2.15 = 645",
      },
    ],
    examApplications: [
      {
        exam: "Banking",
        usage: "Direct questions and word problems",
        timesSaved: "60-90 seconds per question",
      },
    ],
    rating: 4.6,
    studentsLearned: 7500,
    author: systemUserId,
    tags: ["compound interest", "banking", "shortcuts"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    title: "Time and Work Unitary Method",
    description: "Solve time and work problems in 30 seconds",
    category: "Time & Work",
    difficulty: "Medium",
    timeToLearn: "6 min",
    examRelevance: ["SSC", "Railway", "Banking"],
    steps: [
      {
        title: "LCM Method Introduction",
        content: "Use LCM to solve time and work problems efficiently.",
        example: "If A can do work in 10 days, B in 15 days, find LCM(10,15) = 30",
        visual: "LCM represents the total work units",
      },
      {
        title: "Calculate Work Rates",
        content: "Find individual work rates using the LCM.",
        example: "A's rate = 30/10 = 3 units/day\nB's rate = 30/15 = 2 units/day\nCombined = 5 units/day",
        visual: "Higher rate means faster worker",
      },
      {
        title: "Solve Combined Work",
        content: "Calculate time for combined work.",
        example: "Time together = Total work / Combined rate = 30/5 = 6 days",
        visual: "Always faster than individual work",
      },
    ],
    keyPoints: ["LCM method", "Efficiency concept", "Combined work shortcuts"],
    tips: ["Always find LCM first", "Work rate = Total work / Time taken", "Combined rate = Sum of individual rates"],
    practiceQuestions: [
      {
        question: "A can do work in 12 days, B in 18 days. Together?",
        answer: "7.2 days",
        explanation: "LCM(12,18)=36, rates: 3+2=5, time=36/5=7.2",
      },
      {
        question: "A can do work in 8 days, B in 12 days. Together?",
        answer: "4.8 days",
        explanation: "LCM(8,12)=24, rates: 3+2=5, time=24/5=4.8",
      },
    ],
    examApplications: [
      {
        exam: "SSC",
        usage: "Arithmetic reasoning section",
        timesSaved: "45-60 seconds per question",
      },
      {
        exam: "Railway",
        usage: "Quantitative aptitude",
        timesSaved: "30-45 seconds per question",
      },
    ],
    rating: 4.8,
    studentsLearned: 11000,
    author: systemUserId,
    tags: ["time and work", "LCM", "efficiency"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    title: "Profit Loss Percentage Tricks",
    description: "Calculate profit/loss percentages without formulas",
    category: "Profit & Loss",
    difficulty: "Medium",
    timeToLearn: "7 min",
    examRelevance: ["SSC", "Banking"],
    steps: [
      {
        title: "Basic Profit/Loss Concept",
        content: "Understand the relationship between CP, SP, and profit/loss.",
        example: "Profit% = (Profit/CP) × 100\nLoss% = (Loss/CP) × 100",
        visual: "Always calculate percentage on Cost Price",
      },
      {
        title: "Quick Percentage Method",
        content: "Use ratios for quick calculations.",
        example: "If SP:CP = 5:4, then profit = 1 part out of 4\nProfit% = 1/4 × 100 = 25%",
        visual: "Ratio method is much faster than formulas",
      },
      {
        title: "Successive Discounts",
        content: "Handle multiple discounts efficiently.",
        example: "Two successive discounts of 10% and 20%\nNet discount = 10 + 20 - (10×20)/100 = 28%",
        visual: "Single equivalent discount formula",
      },
    ],
    keyPoints: ["Avoid formula confusion", "Visual method", "Successive calculations"],
    tips: [
      "Always identify CP and SP clearly",
      "Use ratio method for complex problems",
      "Practice successive discount formula",
    ],
    practiceQuestions: [
      {
        question: "CP=₹400, SP=₹500. Profit%?",
        answer: "25%",
        explanation: "Profit=100, Profit%=100/400×100=25%",
      },
      {
        question: "Two discounts 15% and 10%. Net discount?",
        answer: "23.5%",
        explanation: "15+10-(15×10)/100=23.5%",
      },
    ],
    examApplications: [
      {
        exam: "SSC",
        usage: "Arithmetic and word problems",
        timesSaved: "30-45 seconds per question",
      },
      {
        exam: "Banking",
        usage: "Quantitative aptitude section",
        timesSaved: "25-40 seconds per question",
      },
    ],
    rating: 4.5,
    studentsLearned: 8900,
    author: systemUserId,
    tags: ["profit", "loss", "percentage", "discount"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
])

print("Math tricks inserted successfully!")
print("Total tricks inserted: 6")
