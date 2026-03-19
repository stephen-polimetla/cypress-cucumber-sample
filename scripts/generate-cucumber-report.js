const fs = require('fs');
const path = require('path');

// Path to the reports directory
const reportsDir = path.join(__dirname, '..', 'cypress', 'reports');

// Find the cucumber report JSON file (could be .cucumber or .json)
let reportPath = null;
if (fs.existsSync(reportsDir)) {
  const files = fs.readdirSync(reportsDir);
  const reportFile = files.find(file => file.endsWith('.cucumber') || file.endsWith('.json'));
  if (reportFile) {
    reportPath = path.join(reportsDir, reportFile);
  }
}

if (!reportPath || !fs.existsSync(reportPath)) {
  console.error('Cucumber report file not found in:', reportsDir);
  process.exit(1);
}

// Read the report file
const reportData = fs.readFileSync(reportPath, 'utf8');
let report;
try {
  report = JSON.parse(reportData);
} catch (e) {
  console.error('Error parsing report JSON:', e.message);
  process.exit(1);
}

// Simple report generation logic
console.log('Cucumber Test Report');
console.log('===================');

let totalScenarios = 0;
let passedScenarios = 0;
let failedScenarios = 0;

report.forEach(feature => {
  console.log(`\nFeature: ${feature.name}`);
  feature.elements.forEach(scenario => {
    totalScenarios++;
    const status = scenario.steps.every(step => step.result.status === 'passed') ? 'PASSED' : 'FAILED';
    if (status === 'PASSED') {
      passedScenarios++;
    } else {
      failedScenarios++;
    }
    console.log(`  Scenario: ${scenario.name} - ${status}`);
  });
});

console.log('\nSummary:');
console.log(`Total Scenarios: ${totalScenarios}`);
console.log(`Passed: ${passedScenarios}`);
console.log(`Failed: ${failedScenarios}`);

// Generate a HTML report using multiple-cucumber-html-reporter
const reportGenerator = require('multiple-cucumber-html-reporter');
const htmlReportDir = path.join(reportsDir, 'html-report');
fs.mkdirSync(htmlReportDir, { recursive: true });

// multiple-cucumber-html-reporter expects JSON files; if we have a .cucumber file, copy it to .json
let jsonReportPath = reportPath;
if (reportPath.endsWith('.cucumber')) {
  jsonReportPath = reportPath.replace(/\.cucumber$/, '.json');
  fs.copyFileSync(reportPath, jsonReportPath);
}

reportGenerator.generate({
  jsonDir: reportsDir,
  reportPath: htmlReportDir,
  metadata: {
    browser: {
      name: process.env.BROWSER || 'chrome',
      version: process.env.BROWSER_VERSION || 'unknown',
    },
    device: process.env.DEVICE || 'Local test machine',
    platform: {
      name: process.platform,
      version: process.version,
    },
  },
  customData: {
    title: 'Run info',
    data: [
      { label: 'Project', value: 'Cypress Cucumber' },
      { label: 'Execution Start Time', value: new Date().toISOString() },
      { label: 'Report Source', value: path.basename(jsonReportPath) },
    ],
  },
  openReportInBrowser: false,
  saveCollectedJSON: true,
});

console.log(`\nHTML report generated at: ${path.join(htmlReportDir, 'index.html')}`);
