import { quizData } from './questions.js';

class QuizApp {
    constructor() {
        this.currentQuizId = null;
        this.currentQuestions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.isAnswered = false;

        // DOM要素
        this.screens = {
            home: document.getElementById('home-screen'),
            quiz: document.getElementById('quiz-screen'),
            result: document.getElementById('result-screen')
        };

        this.elements = {
            title: document.getElementById('quiz-title'),
            progress: document.getElementById('progress-fill'),
            questionNum: document.getElementById('question-number'),
            levelBadge: document.getElementById('level-badge'),
            questionText: document.getElementById('question-text'),
            optionsGrid: document.getElementById('options-grid'),
            feedback: document.getElementById('feedback-section'),
            resultText: document.getElementById('result-text'),
            explanation: document.getElementById('explanation-text'),
            scoreNum: document.getElementById('score-num'),
            scoreTotal: document.getElementById('score-total'),
            modalOverlay: document.getElementById('modal-overlay'),
            modalBody: document.getElementById('reading-text')
        };
    }

    start(quizId) {
        const data = quizData[quizId];
        if (!data) return;

        this.currentQuizId = quizId;
        this.currentQuestions = data.questions;
        this.currentIndex = 0;
        this.score = 0;

        // 背景色の適用
        document.body.style.backgroundColor = data.themeColor;
        document.documentElement.style.setProperty('--accent', data.accentColor);

        // UIの切り替え
        this.showScreen('quiz');
        this.elements.title.textContent = data.title;
        this.loadQuestion();
    }

    loadQuestion() {
        this.isAnswered = false;
        const q = this.currentQuestions[this.currentIndex];

        // 進捗更新
        const progress = ((this.currentIndex) / this.currentQuestions.length) * 100;
        this.elements.progress.style.width = `${progress}%`;

        // 問題文更新
        this.elements.questionNum.textContent = `第 ${this.currentIndex + 1} 問 / ${this.currentQuestions.length}`;
        this.elements.levelBadge.textContent = q.level;
        this.elements.levelBadge.className = `level-badge level-${q.level}`;
        this.elements.questionText.textContent = q.question;

        // 選択肢生成
        this.elements.optionsGrid.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.onclick = () => this.select(idx);
            this.elements.optionsGrid.appendChild(btn);
        });

        this.elements.feedback.classList.add('hidden');
    }

    select(index) {
        if (this.isAnswered) return;
        this.isAnswered = true;

        const q = this.currentQuestions[this.currentIndex];
        const buttons = this.elements.optionsGrid.querySelectorAll('.option-btn');
        const isCorrect = index === q.answer;

        if (isCorrect) {
            this.score++;
            buttons[index].classList.add('correct');
            this.elements.resultText.textContent = "正解！";
        } else {
            buttons[index].classList.add('wrong');
            buttons[q.answer].classList.add('correct');
            this.elements.resultText.textContent = "不正解...";
        }

        // 解説表示
        this.elements.explanation.textContent = q.explanation;
        this.elements.feedback.classList.remove('hidden');

        // 全ボタン無効化
        buttons.forEach(btn => btn.disabled = true);
    }

    next() {
        this.currentIndex++;
        if (this.currentIndex < this.currentQuestions.length) {
            this.loadQuestion();
        } else {
            this.showResult();
        }
    }

    showResult() {
        this.showScreen('result');
        this.elements.scoreNum.textContent = this.score;
        this.elements.scoreTotal.textContent = `/ ${this.currentQuestions.length}`;

        const percent = (this.score / this.currentQuestions.length) * 100;
        let subtitle = "お疲れ様でした！";
        if (percent === 100) subtitle = "完璧です！素晴らしい！";
        else if (percent >= 80) subtitle = "大変優秀な成績です！";
        else if (percent >= 50) subtitle = "まずまずの結果です。復習しましょう！";

        document.getElementById('result-subtitle').textContent = subtitle;
    }

    showScreen(screenId) {
        Object.values(this.screens).forEach(s => s.classList.add('hidden'));
        this.screens[screenId].classList.remove('hidden');
    }

    openModal() {
        const data = quizData[this.currentQuizId];
        if (data) {
            this.elements.modalBody.innerText = data.text;
            document.getElementById('modal-title').textContent = data.title + "（本文）";
            this.elements.modalOverlay.classList.add('active');
        }
    }

    closeModal() {
        this.elements.modalOverlay.classList.remove('active');
    }
}

// アプリの起動
window.quizApp = new QuizApp();
