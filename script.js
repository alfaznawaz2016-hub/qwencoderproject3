/**
 * ============================================
 * Polytechnic CGPA Calculator - JavaScript
 * 2022 Curriculum for Diploma Engineering (Bangladesh)
 * ============================================
 * 
 * Features:
 * 1. Standard CGPA Calculator - Calculate final CGPA from all 8 semesters
 * 2. Target CGPA Calculator - Find required GPA for remaining semesters
 * 
 * Semester Weight Distribution (2022 Curriculum):
 * - Semester 1: 5% (0.05)
 * - Semester 2: 5% (0.05)
 * - Semester 3: 10% (0.10)
 * - Semester 4: 10% (0.10)
 * - Semester 5: 20% (0.20)
 * - Semester 6: 20% (0.20)
 * - Semester 7: 20% (0.20)
 * - Semester 8: 10% (0.10)
 * Total: 100% (1.00)
 */

// ============================================
// Configuration & Constants
// ============================================

/**
 * Semester weights according to Polytechnic 2022 Curriculum
 * Each weight represents the contribution of that semester to the final CGPA
 */
const SEMESTER_WEIGHTS = [
    0.05, // Semester 1 - 5%
    0.05, // Semester 2 - 5%
    0.10, // Semester 3 - 10%
    0.10, // Semester 4 - 10%
    0.20, // Semester 5 - 20%
    0.20, // Semester 6 - 20%
    0.20, // Semester 7 - 20%
    0.10  // Semester 8 - 10%
];

// Maximum GPA on the scale
const MAX_GPA = 4.00;

// Minimum GPA on the scale
const MIN_GPA = 0.00;

// ============================================
// DOM Elements - Standard Calculator
// ============================================

// Form and result containers for standard calculator
const standardForm = document.getElementById('standard-form');
const standardResult = document.getElementById('standard-result');
const finalCgpaElement = document.getElementById('final-cgpa');
const breakdownList = document.getElementById('breakdown-list');
const resetStandardBtn = document.getElementById('reset-standard');

// ============================================
// DOM Elements - Target Calculator
// ============================================

// Form and result containers for target calculator
const targetForm = document.getElementById('target-form');
const targetResult = document.getElementById('target-result');
const requiredGpaElement = document.getElementById('required-gpa');
const targetMessage = document.getElementById('target-message');
const targetAnalysis = document.getElementById('target-analysis');
const resetTargetBtn = document.getElementById('reset-target');

// All completed GPA input fields in target calculator
const completedGpaInputs = document.querySelectorAll('.completed-gpa');

// ============================================
// Tab Navigation Logic
// ============================================

/**
 * Handles tab switching between Standard and Target calculators
 * @param {Event} e - Click event from tab button
 */
function handleTabSwitch(e) {
    const clickedTab = e.target;
    const tabName = clickedTab.getAttribute('data-tab');
    
    // Remove active class from all tabs and sections
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.calculator-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Add active class to clicked tab and corresponding section
    clickedTab.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Add click event listeners to all tab buttons
document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', handleTabSwitch);
});

// ============================================
// Utility Functions
// ============================================

/**
 * Validates if a GPA value is within acceptable range (0.00 - 4.00)
 * @param {number} gpa - The GPA value to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidGPA(gpa) {
    return !isNaN(gpa) && gpa >= MIN_GPA && gpa <= MAX_GPA;
}

/**
 * Formats a number to 2 decimal places
 * @param {number} num - The number to format
 * @returns {string} - Formatted number string
 */
function formatNumber(num) {
    return num.toFixed(2);
}

/**
 * Converts weight decimal to percentage string
 * @param {number} weight - Weight as decimal (e.g., 0.05)
 * @returns {string} - Percentage string (e.g., "5%")
 */
function weightToPercentage(weight) {
    return `${Math.round(weight * 100)}%`;
}

/**
 * Gets the ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 * @param {number} num - The number
 * @returns {string} - Number with ordinal suffix
 */
function getOrdinal(num) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
    return `${num}${suffix}`;
}

/**
 * Shows an element with animation
 * @param {HTMLElement} element - The element to show
 */
function showElement(element) {
    element.classList.remove('hidden');
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = 'slideUp 0.4s ease-out';
}

/**
 * Hides an element
 * @param {HTMLElement} element - The element to hide
 */
function hideElement(element) {
    element.classList.add('hidden');
}

// ============================================
// Standard CGPA Calculator Functions
// ============================================

/**
 * Calculates the final CGPA based on entered GPAs and semester weights
 * Formula: CGPA = Σ(GPA_i × Weight_i) for all semesters
 * @param {Array<number>} gpas - Array of 8 GPA values
 * @returns {object} - Object containing final CGPA and breakdown data
 */
function calculateStandardCGPA(gpas) {
    let totalWeightedSum = 0;
    const breakdown = [];
    
    // Iterate through each semester
    for (let i = 0; i < SEMESTER_WEIGHTS.length; i++) {
        const gpa = gpas[i];
        const weight = SEMESTER_WEIGHTS[i];
        
        // Calculate weighted contribution for this semester
        const weightedContribution = gpa * weight;
        totalWeightedSum += weightedContribution;
        
        // Store breakdown information
        breakdown.push({
            semester: i + 1,
            gpa: gpa,
            weight: weight,
            contribution: weightedContribution,
            percentage: weightToPercentage(weight)
        });
    }
    
    return {
        cgpa: totalWeightedSum,
        breakdown: breakdown
    };
}

/**
 * Handles the standard calculator form submission
 * @param {Event} e - Submit event
 */
function handleStandardSubmit(e) {
    e.preventDefault();
    
    // Collect GPA values from all input fields
    const gpas = [];
    let hasError = false;
    
    for (let i = 1; i <= 8; i++) {
        const input = document.getElementById(`sem${i}`);
        const value = parseFloat(input.value);
        
        // Validate each GPA input
        if (!isValidGPA(value)) {
            showError(input, `Please enter a valid GPA between ${MIN_GPA} and ${MAX_GPA}`);
            hasError = true;
        } else {
            clearError(input);
            gpas.push(value);
        }
    }
    
    // Stop if there are validation errors
    if (hasError) return;
    
    // Calculate CGPA
    const result = calculateStandardCGPA(gpas);
    
    // Display the final CGPA with animation
    finalCgpaElement.textContent = formatNumber(result.cgpa);
    
    // Generate and display breakdown list
    renderBreakdown(result.breakdown);
    
    // Show result section with animation
    showElement(standardResult);
    
    // Scroll to results smoothly
    standardResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Renders the contribution breakdown list
 * @param {Array<object>} breakdown - Array of breakdown data
 */
function renderBreakdown(breakdown) {
    breakdownList.innerHTML = '';
    
    breakdown.forEach(item => {
        const breakdownItem = document.createElement('div');
        breakdownItem.className = 'breakdown-item';
        breakdownItem.innerHTML = `
            <span class="breakdown-semester">
                ${getOrdinal(item.semester)} Semester (${item.percentage})
            </span>
            <span class="breakdown-contribution">
                GPA: ${formatNumber(item.gpa)} → ${formatNumber(item.contribution)} points
            </span>
        `;
        breakdownList.appendChild(breakdownItem);
    });
}

/**
 * Resets the standard calculator form and hides results
 */
function resetStandardCalculator() {
    // Clear all input fields
    for (let i = 1; i <= 8; i++) {
        const input = document.getElementById(`sem${i}`);
        input.value = '';
        clearError(input);
    }
    
    // Hide results
    hideElement(standardResult);
}

// ============================================
// Target CGPA Calculator Functions
// ============================================

/**
 * Calculates the required GPA for remaining semesters to achieve target CGPA
 * Formula: Required GPA = (Target CGPA - Achieved Weighted Sum) / Remaining Weight
 * @param {Array<number|undefined>} completedGPAs - Array of completed GPA values (undefined for incomplete)
 * @param {number} targetCGPA - The desired final CGPA
 * @returns {object} - Object containing calculation results and analysis
 */
function calculateTargetCGPA(completedGPAs, targetCGPA) {
    let achievedWeightedSum = 0;
    let completedWeight = 0;
    let remainingWeight = 0;
    const completedSemesters = [];
    const remainingSemesters = [];
    
    // Analyze each semester
    for (let i = 0; i < SEMESTER_WEIGHTS.length; i++) {
        const gpa = completedGPAs[i];
        const weight = SEMESTER_WEIGHTS[i];
        
        if (gpa !== undefined && gpa !== null && gpa !== '') {
            // This semester is completed
            achievedWeightedSum += parseFloat(gpa) * weight;
            completedWeight += weight;
            completedSemesters.push({
                semester: i + 1,
                gpa: parseFloat(gpa),
                weight: weight,
                contribution: parseFloat(gpa) * weight
            });
        } else {
            // This semester is yet to be completed
            remainingWeight += weight;
            remainingSemesters.push({
                semester: i + 1,
                weight: weight
            });
        }
    }
    
    // Calculate remaining weighted points needed
    const remainingPointsNeeded = targetCGPA - achievedWeightedSum;
    
    // Calculate required average GPA for remaining semesters
    let requiredGPA = null;
    let isPossible = true;
    let message = '';
    let messageType = '';
    
    if (remainingWeight === 0) {
        // All semesters completed
        const actualCGPA = achievedWeightedSum;
        if (actualCGPA >= targetCGPA) {
            message = `🎉 Congratulations! You've already achieved your target CGPA of ${formatNumber(targetCGPA)}. Your current CGPA is ${formatNumber(actualCGPA)}.`;
            messageType = 'success';
        } else {
            message = `❌ Unfortunately, you've completed all semesters. Your final CGPA is ${formatNumber(actualCGPA)}, which is below your target of ${formatNumber(targetCGPA)}.`;
            messageType = 'warning';
        }
        isPossible = actualCGPA >= targetCGPA;
    } else {
        // Some semesters remaining
        requiredGPA = remainingPointsNeeded / remainingWeight;
        
        if (requiredGPA > MAX_GPA) {
            message = `⚠️ Target is mathematically impossible within the 4.00 scale. Please adjust your target CGPA.`;
            messageType = 'warning';
            isPossible = false;
        } else if (requiredGPA < MIN_GPA) {
            message = `🎉 Great news! You've already exceeded your target. You can maintain any GPA above 0.00 in remaining semesters.`;
            messageType = 'success';
            requiredGPA = 0; // Cap at minimum
        } else if (requiredGPA <= MAX_GPA && requiredGPA >= MIN_GPA) {
            message = `✅ To achieve your target CGPA of ${formatNumber(targetCGPA)}, you need to maintain an average GPA of ${formatNumber(requiredGPA)} in your remaining semesters.`;
            messageType = 'success';
        }
    }
    
    return {
        requiredGPA: requiredGPA,
        isPossible: isPossible,
        message: message,
        messageType: messageType,
        achievedWeightedSum: achievedWeightedSum,
        completedWeight: completedWeight,
        remainingWeight: remainingWeight,
        remainingPointsNeeded: remainingPointsNeeded,
        completedSemesters: completedSemesters,
        remainingSemesters: remainingSemesters,
        targetCGPA: targetCGPA
    };
}

/**
 * Handles the target calculator form submission
 * @param {Event} e - Submit event
 */
function handleTargetSubmit(e) {
    e.preventDefault();
    
    // Get target CGPA value
    const targetInput = document.getElementById('target-cgpa');
    const targetCGPA = parseFloat(targetInput.value);
    
    // Validate target CGPA
    if (!isValidGPA(targetCGPA)) {
        showError(targetInput, `Please enter a valid target CGPA between ${MIN_GPA} and ${MAX_GPA}`);
        return;
    }
    clearError(targetInput);
    
    // Collect completed GPA values
    const completedGPAs = [];
    let hasError = false;
    
    completedGpaInputs.forEach((input, index) => {
        const value = input.value.trim();
        
        if (value === '') {
            // Empty field means semester not completed yet
            completedGPAs.push(undefined);
        } else {
            const gpa = parseFloat(value);
            
            // Validate GPA if provided
            if (!isValidGPA(gpa)) {
                showError(input, `Please enter a valid GPA between ${MIN_GPA} and ${MAX_GPA}`);
                hasError = true;
            } else {
                clearError(input);
                completedGPAs.push(gpa);
            }
        }
    });
    
    // Stop if there are validation errors
    if (hasError) return;
    
    // Calculate required GPA
    const result = calculateTargetCGPA(completedGPAs, targetCGPA);
    
    // Display required GPA or appropriate message
    if (result.requiredGPA !== null) {
        requiredGpaElement.textContent = formatNumber(result.requiredGPA);
    } else {
        requiredGpaElement.textContent = 'N/A';
    }
    
    // Display message with appropriate styling
    targetMessage.textContent = result.message;
    targetMessage.className = `message ${result.messageType}`;
    
    // Render detailed analysis
    renderTargetAnalysis(result);
    
    // Show result section with animation
    showElement(targetResult);
    
    // Scroll to results smoothly
    targetResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Renders detailed analysis for target calculator
 * @param {object} result - Calculation result object
 */
function renderTargetAnalysis(result) {
    targetAnalysis.innerHTML = '';
    
    // Create analysis items
    const analysisItems = [
        {
            label: 'Target CGPA',
            value: formatNumber(result.targetCGPA)
        },
        {
            label: 'Completed Weight',
            value: `${Math.round(result.completedWeight * 100)}%`
        },
        {
            label: 'Remaining Weight',
            value: `${Math.round(result.remainingWeight * 100)}%`
        },
        {
            label: 'Achieved Weighted Points',
            value: formatNumber(result.achievedWeightedSum)
        },
        {
            label: 'Remaining Points Needed',
            value: formatNumber(result.remainingPointsNeeded)
        }
    ];
    
    analysisItems.forEach(item => {
        const analysisItem = document.createElement('div');
        analysisItem.className = 'breakdown-item';
        analysisItem.innerHTML = `
            <span class="breakdown-semester">${item.label}</span>
            <span class="breakdown-contribution">${item.value}</span>
        `;
        targetAnalysis.appendChild(analysisItem);
    });
    
    // Add completed semesters breakdown if any
    if (result.completedSemesters.length > 0) {
        const completedHeader = document.createElement('h4');
        completedHeader.textContent = 'Completed Semesters Breakdown';
        completedHeader.style.marginTop = '1rem';
        completedHeader.style.marginBottom = '0.5rem';
        completedHeader.style.fontSize = '0.95rem';
        completedHeader.style.color = 'var(--text-secondary)';
        targetAnalysis.appendChild(completedHeader);
        
        result.completedSemesters.forEach(sem => {
            const semItem = document.createElement('div');
            semItem.className = 'breakdown-item';
            semItem.style.borderLeftColor = 'var(--success-color)';
            semItem.innerHTML = `
                <span class="breakdown-semester">
                    ${getOrdinal(sem.semester)} Semester (${weightToPercentage(sem.weight)})
                </span>
                <span class="breakdown-contribution" style="color: var(--success-color)">
                    GPA: ${formatNumber(sem.gpa)} → ${formatNumber(sem.contribution)} points
                </span>
            `;
            targetAnalysis.appendChild(semItem);
        });
    }
    
    // Add remaining semesters info
    if (result.remainingSemesters.length > 0) {
        const remainingHeader = document.createElement('h4');
        remainingHeader.textContent = 'Remaining Semesters';
        remainingHeader.style.marginTop = '1rem';
        remainingHeader.style.marginBottom = '0.5rem';
        remainingHeader.style.fontSize = '0.95rem';
        remainingHeader.style.color = 'var(--text-secondary)';
        targetAnalysis.appendChild(remainingHeader);
        
        const remainingSemsText = result.remainingSemesters
            .map(sem => `${getOrdinal(sem.semester)} (${weightToPercentage(sem.weight)})`)
            .join(', ');
        
        const remainingItem = document.createElement('div');
        remainingItem.className = 'breakdown-item';
        remainingItem.style.borderLeftColor = 'var(--secondary-color)';
        remainingItem.innerHTML = `
            <span class="breakdown-semester">Semesters to Complete</span>
            <span class="breakdown-contribution" style="color: var(--secondary-color)">
                ${remainingSemsText}
            </span>
        `;
        targetAnalysis.appendChild(remainingItem);
    }
}

/**
 * Resets the target calculator form and hides results
 */
function resetTargetCalculator() {
    // Clear all completed GPA input fields
    completedGpaInputs.forEach(input => {
        input.value = '';
        clearError(input);
    });
    
    // Clear target CGPA input
    const targetInput = document.getElementById('target-cgpa');
    targetInput.value = '';
    clearError(targetInput);
    
    // Hide results
    hideElement(targetResult);
}

// ============================================
// Error Handling Functions
// ============================================

/**
 * Shows an error message for an input field
 * @param {HTMLElement} input - The input element
 * @param {string} message - Error message to display
 */
function showError(input, message) {
    // Remove any existing error
    clearError(input);
    
    // Add error styling
    input.style.borderColor = 'var(--warning-color)';
    input.style.backgroundColor = '#fef2f2';
    
    // Create and append error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = 'var(--warning-color)';
    errorDiv.style.fontSize = '0.75rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

/**
 * Clears error styling and message from an input field
 * @param {HTMLElement} input - The input element
 */
function clearError(input) {
    input.style.borderColor = 'var(--border-color)';
    input.style.backgroundColor = '#f9fafb';
    
    // Remove existing error message if present
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// ============================================
// Input Validation on Change
// ============================================

/**
 * Adds real-time validation to all GPA input fields
 * Provides immediate feedback when user enters invalid values
 */
function setupInputValidation() {
    // Standard calculator inputs
    for (let i = 1; i <= 8; i++) {
        const input = document.getElementById(`sem${i}`);
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (this.value !== '' && !isValidGPA(value)) {
                this.style.borderColor = 'var(--warning-color)';
            } else {
                this.style.borderColor = 'var(--border-color)';
            }
        });
        
        // Add blur validation
        input.addEventListener('blur', function() {
            const value = parseFloat(this.value);
            if (this.value !== '' && !isValidGPA(value)) {
                showError(this, `GPA must be between ${MIN_GPA} and ${MAX_GPA}`);
            }
        });
    }
    
    // Target calculator inputs
    completedGpaInputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (this.value !== '' && !isValidGPA(value)) {
                this.style.borderColor = 'var(--warning-color)';
            } else {
                this.style.borderColor = 'var(--border-color)';
            }
        });
        
        input.addEventListener('blur', function() {
            const value = parseFloat(this.value);
            if (this.value !== '' && !isValidGPA(value)) {
                showError(this, `GPA must be between ${MIN_GPA} and ${MAX_GPA}`);
            }
        });
    });
    
    // Target CGPA input
    const targetInput = document.getElementById('target-cgpa');
    targetInput.addEventListener('input', function() {
        const value = parseFloat(this.value);
        if (this.value !== '' && !isValidGPA(value)) {
            this.style.borderColor = 'var(--warning-color)';
        } else {
            this.style.borderColor = 'var(--border-color)';
        }
    });
}

// ============================================
// Event Listeners Initialization
// ============================================

/**
 * Initializes all event listeners for the application
 */
function initEventListeners() {
    // Standard calculator form submission
    standardForm.addEventListener('submit', handleStandardSubmit);
    
    // Target calculator form submission
    targetForm.addEventListener('submit', handleTargetSubmit);
    
    // Reset buttons
    resetStandardBtn.addEventListener('click', resetStandardCalculator);
    resetTargetBtn.addEventListener('click', resetTargetCalculator);
    
    // Setup input validation
    setupInputValidation();
}

// ============================================
// Application Initialization
// ============================================

/**
 * Initializes the application when DOM is fully loaded
 */
function init() {
    console.log('🎓 Polytechnic CGPA Calculator initialized');
    console.log('📚 Using 2022 Curriculum weight distribution');
    
    // Initialize event listeners
    initEventListeners();
    
    // Set default active tab
    const firstTab = document.querySelector('.tab-btn.active');
    if (firstTab) {
        firstTab.click();
    }
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
