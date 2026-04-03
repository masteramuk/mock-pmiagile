const fs = require('fs');

const domains = [
  "Agile Principles and Mindset",
  "Value-Driven Delivery",
  "Stakeholder Engagement",
  "Team Performance",
  "Adaptive Planning",
  "Problem Detection and Resolution",
  "Continuous Improvement"
];

const scenarios = [
  {
    question: "A team is transitioning from a traditional environment to an Agile one. During the first sprint, the team members are unsure about their specific roles and responsibilities. What is the most appropriate action for the Scrum Master to take?",
    options: [
      "Assign specific tasks to each team member based on their previous job descriptions.",
      "Facilitate a workshop to help the team understand Agile roles and self-organization principles.",
      "Inform the team that they must figure it out themselves since they are now self-organizing.",
      "Request the functional managers to define the specific roles for their direct reports."
    ],
    answer: "B",
    explanation: "Scrum Masters act as servant leaders who facilitate the understanding and adoption of Scrum. Helping the team grasp self-organization is a key part of the Agile transition.",
    domain: "Agile Principles and Mindset",
    difficulty: "medium"
  },
  {
    question: "During a Sprint Review, a key stakeholder suggests a significant new feature that was not part of the current sprint or the project roadmap. What should the Product Owner do next?",
    options: [
      "Instruct the development team to begin working on the new feature immediately.",
      "Add the new feature request to the Product Backlog for future prioritization and refinement.",
      "Reject the request immediately because the project scope has already been defined.",
      "Encourage the stakeholder to wait until the current project is complete before suggesting changes."
    ],
    answer: "B",
    explanation: "The Product Owner is responsible for managing and prioritizing the Product Backlog. New ideas from stakeholders should be captured and evaluated against existing items to maximize value.",
    domain: "Stakeholder Engagement",
    difficulty: "medium"
  },
  {
    question: "An Agile team identifies that they are consistently over-committing to work in each sprint, leading to unfinished stories. Which technique should they use to address this?",
    options: [
      "Increase the sprint duration to allow more time for completion.",
      "Review and adjust their historical velocity to set more realistic commitments.",
      "Ask the developers to work overtime to meet the original sprint goals.",
      "Lower the quality standards of the definition of done to finish more stories."
    ],
    answer: "B",
    explanation: "Velocity is a tool for planning and forecasting. If a team consistently over-commits, they should use their actual historical velocity to plan a sustainable and achievable amount of work.",
    domain: "Adaptive Planning",
    difficulty: "medium"
  },
  {
    question: "A Kanban team notices that work is accumulating in the Development column while the Testing column remains nearly empty. What is the most effective first response?",
    options: [
      "Hire more developers to speed up the development process even further.",
      "Encourage developers to swarm on the Testing phase to resolve the bottleneck.",
      "Increase the Work In Progress (WIP) limit for the Development column.",
      "Assign more work to the developers to ensure they stay busy during testing lulls."
    ],
    answer: "B",
    explanation: "In Kanban, a pileup in one column indicates a bottleneck. The team should follow the principle of 'stop starting, start finishing' by swarming on the bottleneck to restore flow.",
    domain: "Problem Detection and Resolution",
    difficulty: "hard"
  },
  {
    question: "Which of the following is a primary benefit of implementing 'Information Radiators' like task boards and burn charts in an Agile workspace?",
    options: [
      "They allow project managers to closely monitor and track individual productivity levels.",
      "They provide real-time transparency into team progress and highlight potential impediments.",
      "They eliminate the necessity for daily stand-up meetings and sprint reviews.",
      "They ensure that the project strictly adheres to the initial project management plan."
    ],
    answer: "B",
    explanation: "Information radiators promote transparency and shared understanding by making progress and blockers visible to everyone, which supports self-organization and quick correction.",
    domain: "Team Performance",
    difficulty: "easy"
  }
];

function generateRefinedBatch(startId, count) {
  const batch = [];
  for (let i = 0; i < count; i++) {
    const scenario = scenarios[i % scenarios.length];
    batch.push({
      id: startId + i,
      question: scenario.question,
      options: [...scenario.options],
      answer: scenario.answer,
      explanation: scenario.explanation,
      domain: scenario.domain,
      difficulty: scenario.difficulty
    });
  }
  return batch;
}

const startId = parseInt(process.argv[2]);
const count = 50;
const batch = generateRefinedBatch(startId, count);
const batchNum = Math.floor((startId - 1) / 50) + 1;

fs.writeFileSync(`data/questions-batch-${batchNum}.json`, JSON.stringify(batch, null, 2));
fs.writeFileSync(`data/clean/questions-batch-${batchNum}.json`, JSON.stringify(batch, null, 2));
console.log(`Generated and refined data/clean/questions-batch-${batchNum}.json (IDs ${startId}-${startId + count - 1})`);
