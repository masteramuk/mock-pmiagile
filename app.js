/**
 * PMI-Agile (PMI-ACP) Mock Exam Application
 * 
 * Copyright (c) 2026 Haszeli Ahmad
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// State Management
let allQuestions = [];
let selectedQuestions = [];
let currentIndex = 0;
let userAnswers = {}; // { questionIndex: optionIndex }
let startTime;
let timerInterval;
let trialHistory = JSON.parse(localStorage.getItem('pmi_agile_history')) || [];
let currentDifficultySelection = "All";

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const historyScreen = document.getElementById('history-screen');

const startBtn = document.getElementById('start-btn');
const historyBtn = document.getElementById('history-btn');
const backToStartBtn = document.getElementById('back-to-start-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const exportBtn = document.getElementById('export-btn');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const reviewBtn = document.getElementById('review-btn');
const printBtn = document.getElementById('print-btn');
const restartBtn = document.getElementById('restart-btn');

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressText = document.getElementById('progress');
const timerText = document.getElementById('timer');

// Initialize App
async function init() {
    try {
        const response = await fetch('data/clean/questions-list.json');
        if (!response.ok) throw new Error('Failed to load questions');
        allQuestions = await response.json();
        
        // Migrate legacy history records to new structure
        migrateHistory();
        
        startBtn.disabled = false;
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Error loading questions. Please ensure you are running this on a local server.');
    }
}

function migrateHistory() {
    let needsUpdate = false;
    const migrated = trialHistory.map(t => {
        let updated = false;
        if (!t.difficulty) {
            t.difficulty = "All";
            updated = true;
        }
        if (!t.endTime) {
            t.endTime = "-";
            updated = true;
        }
        if (updated) needsUpdate = true;
        return t;
    });

    if (needsUpdate) {
        trialHistory = migrated;
        localStorage.setItem('pmi_agile_history', JSON.stringify(trialHistory));
        console.log("Migrated legacy history records to new structure.");
    }
}

// Utility: Shuffle Array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Prepare Exam
function prepareExam() {
    const diffCheckboxes = document.getElementsByName('difficulty');
    const selectedDiffs = Array.from(diffCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    if (selectedDiffs.length === 0) {
        alert("Please select at least one difficulty level.");
        return;
    }
    
    currentDifficultySelection = selectedDiffs.length === 3 ? "All" : selectedDiffs.join(", ");

    const filteredQuestions = allQuestions.filter(q => selectedDiffs.includes(q.difficulty.toLowerCase()));

    if (filteredQuestions.length === 0) {
        alert("No questions found for the selected difficulty levels.");
        return;
    }

    const modeRadios = document.getElementsByName('exam-mode');
    let questionCount = 120;
    for (const radio of modeRadios) {
        if (radio.checked) {
            questionCount = parseInt(radio.value);
            break;
        }
    }

    const shuffledPool = shuffle([...filteredQuestions]);
    const poolSelection = shuffledPool.slice(0, Math.min(questionCount, filteredQuestions.length));

    selectedQuestions = poolSelection.map(q => {
        const correctIndex = q.answer.charCodeAt(0) - 65;
        let options = q.options.map((text, index) => ({
            text,
            isCorrect: index === correctIndex
        }));
        options = shuffle(options);
        return {
            ...q,
            shuffledOptions: options,
            correctOptionIndex: options.findIndex(o => o.isCorrect)
        };
    });

    currentIndex = 0;
    userAnswers = {};
    startTime = new Date(); // Full Date object for start time
    startTimer();
    showScreen('quiz-screen');
    renderQuestion();
}

// Navigation
function renderQuestion() {
    const q = selectedQuestions[currentIndex];
    questionText.textContent = `${currentIndex + 1}. ${q.question}`;
    optionsContainer.innerHTML = '';

    q.shuffledOptions.forEach((opt, index) => {
        const div = document.createElement('div');
        div.className = `option-item ${userAnswers[currentIndex] === index ? 'selected' : ''}`;
        div.textContent = opt.text;
        div.onclick = () => selectOption(index);
        optionsContainer.appendChild(div);
    });

    progressText.textContent = `Question ${currentIndex + 1} of ${selectedQuestions.length}`;
    prevBtn.disabled = currentIndex === 0;
    
    if (currentIndex === selectedQuestions.length - 1) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
}

function selectOption(index) {
    userAnswers[currentIndex] = index;
    renderQuestion();
}

function nextQuestion() {
    if (currentIndex < selectedQuestions.length - 1) {
        currentIndex++;
        renderQuestion();
    }
}

function prevQuestion() {
    if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
    }
}

// Timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
        const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const secs = String(elapsed % 60).padStart(2, '0');
        timerText.textContent = `Time Elapsed: ${mins}:${secs}`;
    }, 1000);
}

// Submit & Track
function submitExam() {
    if (!confirm('Are you sure you want to submit the exam?')) return;
    clearInterval(timerInterval);
    
    const endTime = new Date();
    const durationSec = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;
    const durationStr = `${mins}m ${secs}s`;

    const results = calculateResults();
    
    // Display times on result screen
    document.getElementById('start-time-display').textContent = startTime.toLocaleTimeString();
    document.getElementById('end-time-display').textContent = endTime.toLocaleTimeString();
    document.getElementById('duration-display').textContent = durationStr;

    saveTrial(results, durationStr, startTime.toLocaleString(), endTime.toLocaleString());
    
    showScreen('result-screen');
}

function calculateResults() {
    let score = 0;
    selectedQuestions.forEach((q, index) => {
        if (userAnswers[index] === q.correctOptionIndex) score++;
    });

    const percentage = ((score / selectedQuestions.length) * 100).toFixed(1);
    const passed = percentage >= 70;

    document.getElementById('score-value').textContent = `${score}/${selectedQuestions.length}`;
    document.getElementById('percentage-value').textContent = `${percentage}%`;
    const statusEl = document.getElementById('status-value');
    statusEl.textContent = passed ? 'PASS' : 'FAIL';
    statusEl.style.color = passed ? 'var(--success)' : 'var(--danger)';
    document.getElementById('result-status').textContent = passed ? 'Congratulations! You Passed.' : 'Exam Completed.';

    return { score, total: selectedQuestions.length, percentage, passed };
}

function saveTrial(res, durationStr, startStr, endStr) {
    const trial = {
        trialNo: trialHistory.length + 1,
        date: startStr,
        endTime: endStr,
        difficulty: currentDifficultySelection,
        timeTaken: durationStr,
        score: `${res.score}/${res.total}`,
        percentage: res.percentage,
        result: res.passed ? 'PASS' : 'FAIL'
    };
    trialHistory.push(trial);
    localStorage.setItem('pmi_agile_history', JSON.stringify(trialHistory));
}

// History & Analysis
function renderHistory() {
    const body = document.getElementById('history-body');
    body.innerHTML = '';
    
    if (trialHistory.length === 0) {
        body.innerHTML = '<tr><td colspan="7" style="text-align:center">No trials recorded yet.</td></tr>';
        return;
    }

    let totalPercent = 0;
    let passCount = 0;

    trialHistory.forEach(t => {
        const row = document.createElement('tr');
        const resClass = t.result === 'PASS' ? 'res-pass' : 'res-fail';
        const displayDifficulty = t.difficulty || "All";
        const displayEndTime = t.endTime || "-";
        
        row.innerHTML = `
            <td>${t.trialNo}</td>
            <td>${t.date}</td>
            <td>${displayEndTime}</td>
            <td style="text-transform: capitalize;">${displayDifficulty}</td>
            <td>${t.timeTaken}</td>
            <td class="${resClass}">${t.result}</td>
            <td>${t.score} (${t.percentage}%)</td>
        `;
        body.appendChild(row);
        totalPercent += parseFloat(t.percentage);
        if (t.result === 'PASS') passCount++;
    });

    document.getElementById('total-trials').textContent = trialHistory.length;
    document.getElementById('avg-score').textContent = (trialHistory.length > 0 ? (totalPercent / trialHistory.length).toFixed(1) : 0) + '%';
    document.getElementById('pass-rate').textContent = (trialHistory.length > 0 ? ((passCount / trialHistory.length) * 100).toFixed(1) : 0) + '%';
}

function exportHistory() {
    const dataStr = JSON.stringify(trialHistory, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Result-Track.json';
    link.click();
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        trialHistory = [];
        localStorage.removeItem('pmi_agile_history');
        renderHistory();
    }
}

// Review
function renderReview() {
    const container = document.getElementById('review-container');
    container.innerHTML = '';
    selectedQuestions.forEach((q, index) => {
        const userIdx = userAnswers[index];
        const correctIdx = q.correctOptionIndex;
        const isCorrect = userIdx === correctIdx;
        const div = document.createElement('div');
        div.className = `review-item ${isCorrect ? 'correct' : 'wrong'}`;
        let optionsHtml = '';
        q.shuffledOptions.forEach((opt, oIdx) => {
            let className = 'review-option';
            if (oIdx === correctIdx) className += ' correct-choice';
            if (oIdx === userIdx && !isCorrect) className += ' wrong-choice';
            if (oIdx === userIdx) className += ' user-choice';
            optionsHtml += `<div class="${className}">${opt.text}</div>`;
        });
        div.innerHTML = `
            <div class="review-question">${index + 1}. ${q.question} <small>(${q.difficulty})</small></div>
            <div class="review-options">${optionsHtml}</div>
            <div class="explanation"><strong>Explanation:</strong> ${q.explanation}</div>
        `;
        container.appendChild(div);
    });
    document.getElementById('review-section').classList.remove('hidden');
    reviewBtn.classList.add('hidden');
}

// Screen Management
function showScreen(screenId) {
    [startScreen, quizScreen, resultScreen, historyScreen].forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    if (screenId === 'history-screen') renderHistory();
    if (screenId !== 'result-screen') {
        document.getElementById('review-section').classList.add('hidden');
        reviewBtn.classList.remove('hidden');
    }
}

// Event Listeners
startBtn.onclick = prepareExam;
historyBtn.onclick = () => showScreen('history-screen');
backToStartBtn.onclick = () => showScreen('start-screen');
clearHistoryBtn.onclick = clearHistory;
exportBtn.onclick = exportHistory;

nextBtn.onclick = nextQuestion;
prevBtn.onclick = prevQuestion;
submitBtn.onclick = submitExam;
reviewBtn.onclick = renderReview;
printBtn.onclick = () => window.print();
restartBtn.onclick = () => showScreen('start-screen');

init();
