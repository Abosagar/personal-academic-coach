import { Course, Topic, GlossaryTerm, CriticalThinkingQuestion } from '../types';

// Course colors for visual distinction
export const COURSE_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
];

// Mock AI analysis - generates topics based on course name
export function generateMockTopics(courseName: string): Topic[] {
  const courseTopics: Record<string, Topic[]> = {
    'marketing': [
      { id: '1', name: 'Marketing Fundamentals', nameAr: 'أساسيات التسويق', priority: 'high', estimatedMinutes: 45, completed: false },
      { id: '2', name: 'Consumer Behavior', nameAr: 'سلوك المستهلك', priority: 'high', estimatedMinutes: 60, completed: false },
      { id: '3', name: 'Market Segmentation', nameAr: 'تجزئة السوق', priority: 'high', estimatedMinutes: 45, completed: false },
      { id: '4', name: 'Brand Management', nameAr: 'إدارة العلامة التجارية', priority: 'low', estimatedMinutes: 40, completed: false },
      { id: '5', name: 'Digital Marketing', nameAr: 'التسويق الرقمي', priority: 'high', estimatedMinutes: 50, completed: false },
      { id: '6', name: 'Marketing Mix (4Ps)', nameAr: 'المزيج التسويقي', priority: 'high', estimatedMinutes: 55, completed: false },
      { id: '7', name: 'Marketing Research', nameAr: 'بحوث التسويق', priority: 'low', estimatedMinutes: 35, completed: false },
    ],
    'accounting': [
      { id: '1', name: 'Accounting Principles', nameAr: 'مبادئ المحاسبة', priority: 'high', estimatedMinutes: 50, completed: false },
      { id: '2', name: 'Financial Statements', nameAr: 'القوائم المالية', priority: 'high', estimatedMinutes: 60, completed: false },
      { id: '3', name: 'Journal Entries', nameAr: 'القيود اليومية', priority: 'high', estimatedMinutes: 45, completed: false },
      { id: '4', name: 'Trial Balance', nameAr: 'ميزان المراجعة', priority: 'low', estimatedMinutes: 40, completed: false },
      { id: '5', name: 'Depreciation Methods', nameAr: 'طرق الإهلاك', priority: 'high', estimatedMinutes: 55, completed: false },
      { id: '6', name: 'Cost Accounting', nameAr: 'محاسبة التكاليف', priority: 'low', estimatedMinutes: 50, completed: false },
    ],
    'finance': [
      { id: '1', name: 'Time Value of Money', nameAr: 'القيمة الزمنية للنقود', priority: 'high', estimatedMinutes: 55, completed: false },
      { id: '2', name: 'Capital Budgeting', nameAr: 'موازنة رأس المال', priority: 'high', estimatedMinutes: 60, completed: false },
      { id: '3', name: 'Risk and Return', nameAr: 'المخاطر والعائد', priority: 'high', estimatedMinutes: 50, completed: false },
      { id: '4', name: 'Portfolio Theory', nameAr: 'نظرية المحفظة', priority: 'low', estimatedMinutes: 45, completed: false },
      { id: '5', name: 'Cost of Capital', nameAr: 'تكلفة رأس المال', priority: 'high', estimatedMinutes: 50, completed: false },
    ],
    'management': [
      { id: '1', name: 'Management Functions', nameAr: 'وظائف الإدارة', priority: 'high', estimatedMinutes: 45, completed: false },
      { id: '2', name: 'Organizational Structure', nameAr: 'الهيكل التنظيمي', priority: 'high', estimatedMinutes: 50, completed: false },
      { id: '3', name: 'Leadership Styles', nameAr: 'أنماط القيادة', priority: 'low', estimatedMinutes: 40, completed: false },
      { id: '4', name: 'Decision Making', nameAr: 'اتخاذ القرارات', priority: 'high', estimatedMinutes: 55, completed: false },
      { id: '5', name: 'Strategic Planning', nameAr: 'التخطيط الاستراتيجي', priority: 'high', estimatedMinutes: 60, completed: false },
    ],
    'economics': [
      { id: '1', name: 'Supply and Demand', nameAr: 'العرض والطلب', priority: 'high', estimatedMinutes: 50, completed: false },
      { id: '2', name: 'Market Structures', nameAr: 'هياكل السوق', priority: 'high', estimatedMinutes: 55, completed: false },
      { id: '3', name: 'Elasticity', nameAr: 'المرونة', priority: 'high', estimatedMinutes: 45, completed: false },
      { id: '4', name: 'GDP and Growth', nameAr: 'الناتج المحلي والنمو', priority: 'low', estimatedMinutes: 40, completed: false },
      { id: '5', name: 'Monetary Policy', nameAr: 'السياسة النقدية', priority: 'low', estimatedMinutes: 50, completed: false },
    ],
  };

  const normalizedName = courseName.toLowerCase();
  
  for (const [key, topics] of Object.entries(courseTopics)) {
    if (normalizedName.includes(key)) {
      return topics.map(t => ({ ...t, id: crypto.randomUUID() }));
    }
  }

  // Default topics for unknown courses
  return [
    { id: crypto.randomUUID(), name: 'Introduction & Overview', nameAr: 'مقدمة ونظرة عامة', priority: 'high', estimatedMinutes: 45, completed: false },
    { id: crypto.randomUUID(), name: 'Core Concepts', nameAr: 'المفاهيم الأساسية', priority: 'high', estimatedMinutes: 60, completed: false },
    { id: crypto.randomUUID(), name: 'Practical Applications', nameAr: 'التطبيقات العملية', priority: 'high', estimatedMinutes: 50, completed: false },
    { id: crypto.randomUUID(), name: 'Case Studies', nameAr: 'دراسات الحالة', priority: 'low', estimatedMinutes: 40, completed: false },
    { id: crypto.randomUUID(), name: 'Review & Summary', nameAr: 'المراجعة والملخص', priority: 'low', estimatedMinutes: 35, completed: false },
  ];
}

// Mock study content generator
export function generateStudyContent(topic: Topic, courseName: string): string {
  const contents: Record<string, string> = {
    'Marketing Fundamentals': `
## Marketing Fundamentals: A Business Executive Perspective

Marketing is the strategic function that bridges the gap between what your organization offers and what the market demands. As a business leader, understanding marketing fundamentals is crucial for making informed decisions about resource allocation, market positioning, and competitive strategy.

### The Strategic Value of Marketing

From an executive standpoint, marketing serves three critical functions:

1. **Revenue Generation**: Marketing directly impacts the top line by acquiring customers and driving sales.
2. **Brand Equity Building**: Long-term brand value translates to pricing power and customer loyalty.
3. **Market Intelligence**: Marketing provides insights that inform product development and strategic direction.

### Key Performance Indicators (KPIs)

Executives should monitor these marketing metrics:
- Customer Acquisition Cost (CAC)
- Customer Lifetime Value (CLV)
- Return on Marketing Investment (ROMI)
- Market Share Growth
- Brand Awareness Metrics

### Strategic Decision Points

When reviewing marketing initiatives, consider:
- Does this align with our overall business strategy?
- What is the expected ROI and payback period?
- How does this position us against competitors?
- What resources are required for successful execution?
    `,
    'Consumer Behavior': `
## Consumer Behavior: Understanding Your Market

Effective executives recognize that consumer behavior insights drive better business decisions. Understanding why customers buy enables more efficient resource allocation and higher conversion rates.

### The Consumer Decision Journey

Modern consumers follow a non-linear path:
1. **Awareness**: How do customers discover your solution?
2. **Consideration**: What factors influence their evaluation?
3. **Decision**: What triggers the purchase decision?
4. **Retention**: How do you maintain the relationship?

### Psychological Drivers

Key behavioral factors that influence purchasing:
- **Cognitive Biases**: Anchoring, social proof, scarcity
- **Emotional Triggers**: Fear, aspiration, belonging
- **Rational Factors**: Price, quality, convenience

### Executive Applications

Use consumer behavior insights to:
- Optimize pricing strategies
- Design effective marketing campaigns
- Improve product features based on actual needs
- Develop customer retention programs
    `,
    'Accounting Principles': `
## Accounting Principles: The Language of Business

As a business executive, financial literacy is non-negotiable. Accounting principles provide the framework for understanding organizational performance and making data-driven decisions.

### The Foundation: GAAP

Generally Accepted Accounting Principles ensure:
- Consistency in financial reporting
- Comparability across organizations
- Reliability of financial data

### Core Concepts Every Executive Must Know

1. **Accrual Basis**: Revenue and expenses are recorded when earned/incurred, not when cash changes hands.
2. **Matching Principle**: Expenses are matched to the revenues they generate.
3. **Going Concern**: Financial statements assume the business will continue operating.
4. **Conservatism**: When uncertain, report lower asset values and higher liabilities.

### Financial Statement Analysis

Executives should regularly review:
- **Income Statement**: Are we profitable?
- **Balance Sheet**: What do we own and owe?
- **Cash Flow Statement**: Where is our money going?
    `,
  };

  const content = contents[topic.name];
  if (content) return content;

  return `
## ${topic.name}: Executive Summary

This module covers the essential concepts of ${topic.name} within the context of ${courseName}. 

### Learning Objectives

By the end of this session, you will be able to:
- Understand the core principles of ${topic.name}
- Apply these concepts to real business scenarios
- Make informed decisions based on this knowledge

### Key Concepts

The study of ${topic.name} involves understanding how theoretical frameworks translate into practical business applications. As a business leader, your role is to leverage this knowledge to drive organizational success.

### Business Applications

Consider how ${topic.name} impacts:
- Strategic planning and resource allocation
- Competitive positioning in the market
- Operational efficiency and effectiveness
- Stakeholder value creation

### Action Items

1. Review the key concepts presented
2. Consider how they apply to your current context
3. Identify opportunities for implementation
  `;
}

// Glossary terms
export function getGlossaryTerms(courseName: string): GlossaryTerm[] {
  const allTerms: Record<string, GlossaryTerm[]> = {
    'marketing': [
      { term: 'Market Segmentation', definition: 'Dividing a market into distinct groups with similar needs', arabic: 'تجزئة السوق' },
      { term: 'Brand Equity', definition: 'The commercial value derived from consumer perception', arabic: 'قيمة العلامة التجارية' },
      { term: 'ROI', definition: 'Return on Investment - measure of profitability', arabic: 'العائد على الاستثمار' },
      { term: 'Target Audience', definition: 'Specific group of consumers most likely to buy', arabic: 'الجمهور المستهدف' },
      { term: 'Conversion Rate', definition: 'Percentage of visitors who complete desired action', arabic: 'معدل التحويل' },
      { term: 'Customer Acquisition', definition: 'Process of gaining new customers', arabic: 'اكتساب العملاء' },
    ],
    'accounting': [
      { term: 'Assets', definition: 'Resources owned by a company with economic value', arabic: 'الأصول' },
      { term: 'Liabilities', definition: 'Financial obligations owed to external parties', arabic: 'الالتزامات' },
      { term: 'Equity', definition: 'Owner\'s residual interest in company assets', arabic: 'حقوق الملكية' },
      { term: 'Revenue', definition: 'Income generated from normal business operations', arabic: 'الإيرادات' },
      { term: 'Depreciation', definition: 'Allocation of asset cost over useful life', arabic: 'الإهلاك' },
      { term: 'Amortization', definition: 'Gradual reduction of intangible asset value', arabic: 'الإطفاء' },
    ],
    'finance': [
      { term: 'NPV', definition: 'Net Present Value - difference between cash inflows and outflows', arabic: 'صافي القيمة الحالية' },
      { term: 'IRR', definition: 'Internal Rate of Return - discount rate making NPV zero', arabic: 'معدل العائد الداخلي' },
      { term: 'WACC', definition: 'Weighted Average Cost of Capital', arabic: 'المتوسط المرجح لتكلفة رأس المال' },
      { term: 'Leverage', definition: 'Use of debt to increase potential return', arabic: 'الرافعة المالية' },
      { term: 'Liquidity', definition: 'Ability to convert assets to cash quickly', arabic: 'السيولة' },
    ],
  };

  const normalizedName = courseName.toLowerCase();
  for (const [key, terms] of Object.entries(allTerms)) {
    if (normalizedName.includes(key)) {
      return terms;
    }
  }

  return [
    { term: 'Strategy', definition: 'Long-term plan to achieve objectives', arabic: 'الاستراتيجية' },
    { term: 'Analysis', definition: 'Detailed examination of elements or structure', arabic: 'التحليل' },
    { term: 'Implementation', definition: 'Process of putting a plan into action', arabic: 'التنفيذ' },
    { term: 'Evaluation', definition: 'Assessment of value or performance', arabic: 'التقييم' },
  ];
}

// Critical thinking questions
export function getCriticalThinkingQuestions(topic: Topic): CriticalThinkingQuestion[] {
  return [
    {
      id: '1',
      question: `How would you apply the concepts of ${topic.name} to a real-world business scenario you're familiar with?`,
      hints: ['Consider a company you know well', 'Think about specific decisions they made'],
    },
    {
      id: '2',
      question: `What are the potential risks of ignoring ${topic.name} principles in business decision-making?`,
      hints: ['Think about financial implications', 'Consider competitive disadvantages'],
    },
    {
      id: '3',
      question: `How has digital transformation changed the application of ${topic.name} in modern organizations?`,
      hints: ['Consider technology tools', 'Think about data-driven approaches'],
    },
  ];
}

// Calculate expected GPA based on progress
export function calculateExpectedGPA(courses: Course[]): number {
  if (courses.length === 0) return 0;
  
  let totalProgress = 0;
  courses.forEach(course => {
    const completedTopics = course.topics.filter(t => t.completed).length;
    const progress = course.topics.length > 0 ? completedTopics / course.topics.length : 0;
    totalProgress += progress;
  });
  
  const avgProgress = totalProgress / courses.length;
  // Map progress to GPA (0-4 scale)
  return Math.round((avgProgress * 4) * 100) / 100;
}

// Get daily focus suggestion
export function getDailyFocus(courses: Course[]): { course: Course; topic: Topic } | null {
  for (const course of courses) {
    const highPriorityIncomplete = course.topics.find(
      t => t.priority === 'high' && !t.completed
    );
    if (highPriorityIncomplete) {
      return { course, topic: highPriorityIncomplete };
    }
  }
  
  for (const course of courses) {
    const anyIncomplete = course.topics.find(t => !t.completed);
    if (anyIncomplete) {
      return { course, topic: anyIncomplete };
    }
  }
  
  return null;
}

// Format time display
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours} ساعة ${mins > 0 ? `و ${mins} دقيقة` : ''}`;
  }
  return `${mins} دقيقة`;
}

// Validate .edu email
export function isEduEmail(email: string): boolean {
  return email.toLowerCase().endsWith('.edu') || 
         email.toLowerCase().includes('.edu.') ||
         email.toLowerCase().includes('@edu.');
}
