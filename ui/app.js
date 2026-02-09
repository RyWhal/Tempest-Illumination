const steps = [
  { id: "origins", label: "Origins", status: "Needs attention" },
  { id: "path", label: "Path", status: "Not started" },
  { id: "attributes", label: "Attributes", status: "Not started" },
  { id: "skills", label: "Skills", status: "Not started" },
  { id: "talents", label: "Talents", status: "Not started" },
  { id: "equipment", label: "Equipment", status: "Not started" },
  { id: "story", label: "Story", status: "Not started" },
  { id: "final-audit", label: "Final Audit", status: "Locked" },
];

const derivedStats = {
  vitality: 3,
  resolve: 3,
  focus: 3,
  initiative: 2,
};

const stepList = document.getElementById("stepList");
const stepTitle = document.getElementById("stepTitle");
const stepStatus = document.getElementById("stepStatus");
const stepDescription = document.getElementById("stepDescription");
const derivedStatsList = document.getElementById("derivedStats");

const renderSteps = () => {
  stepList.innerHTML = "";
  steps.forEach((step, index) => {
    const item = document.createElement("li");
    item.className = index === 0 ? "active" : "";
    item.innerHTML = `
      <span>${step.label}</span>
      <span class="badge">${step.status}</span>
    `;
    stepList.appendChild(item);
  });
};

const renderDerivedStats = () => {
  derivedStatsList.innerHTML = "";
  Object.entries(derivedStats).forEach(([key, value]) => {
    const item = document.createElement("li");
    item.textContent = `${key}: ${value}`;
    derivedStatsList.appendChild(item);
  });
};

const updatePanel = () => {
  const activeStep = steps[0];
  stepTitle.textContent = activeStep.label;
  stepStatus.textContent = activeStep.status;
  stepDescription.textContent =
    "Select a homeland, culture, and background to ground the character in the setting. Each step will eventually surface validation and rule citations.";
};

renderSteps();
renderDerivedStats();
updatePanel();
