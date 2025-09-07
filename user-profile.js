// User Profile JavaScript
class UserProfile {
    constructor() {
        this.profile = {
            personalInfo: {},
            goals: {},
            progress: {},
            settings: {}
        };
        this.weightChart = null;
        this.nutritionChart = null;
        
        this.initializeApp();
    }

    initializeApp() {
        this.bindEvents();
        this.loadProfile();
        this.initializeCharts();
        this.updateDisplay();
    }

    bindEvents() {
        document.getElementById('profileForm').addEventListener('submit', (e) => this.handleProfileSubmit(e));
        document.getElementById('goalsForm').addEventListener('submit', (e) => this.handleGoalsSubmit(e));
        document.getElementById('toggleTheme').addEventListener('click', () => this.toggleTheme());
        
        // Settings toggles
        document.getElementById('notificationsEnabled').addEventListener('change', (e) => this.updateSetting('notifications', e.target.checked));
        document.getElementById('darkModeEnabled').addEventListener('change', (e) => this.updateSetting('darkMode', e.target.checked));
        document.getElementById('autoSaveEnabled').addEventListener('change', (e) => this.updateSetting('autoSave', e.target.checked));
        document.getElementById('analyticsEnabled').addEventListener('change', (e) => this.updateSetting('analytics', e.target.checked));
    }

    handleProfileSubmit(e) {
        e.preventDefault();
        
        this.profile.personalInfo = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            weight: parseFloat(document.getElementById('weight').value),
            height: parseInt(document.getElementById('height').value)
        };

        this.saveProfile();
        this.updateDisplay();
        this.showToast('Profile updated successfully!', 'success');
    }

    handleGoalsSubmit(e) {
        e.preventDefault();
        
        this.profile.goals = {
            activityLevel: parseFloat(document.getElementById('activityLevel').value),
            dietPreference: document.getElementById('dietPreference').value,
            healthGoal: document.getElementById('healthGoal').value,
            weeklyGoal: parseFloat(document.getElementById('weeklyGoal').value),
            allergies: document.getElementById('allergies').value
        };

        this.saveProfile();
        this.updateDisplay();
        this.showToast('Goals updated successfully!', 'success');
    }

    updateSetting(key, value) {
        this.profile.settings[key] = value;
        this.saveProfile();
        
        if (key === 'darkMode') {
            this.toggleTheme();
        }
    }

    updateDisplay() {
        this.updateProgressStats();
        this.updateBMICalculator();
        this.updateCharts();
        this.updateMealHistory();
    }

    updateProgressStats() {
        const { personalInfo, goals } = this.profile;
        
        if (personalInfo.weight) {
            document.getElementById('currentWeight').textContent = `${personalInfo.weight} kg`;
            
            // Calculate target weight based on goal
            let targetWeight = personalInfo.weight;
            if (goals.healthGoal === 'lose') {
                targetWeight = personalInfo.weight - (goals.weeklyGoal * 4); // 4 weeks
            } else if (goals.healthGoal === 'gain') {
                targetWeight = personalInfo.weight + (goals.weeklyGoal * 4);
            }
            
            document.getElementById('targetWeight').textContent = `${targetWeight.toFixed(1)} kg`;
            
            // Update progress bar
            const progress = Math.min((personalInfo.weight / targetWeight) * 100, 100);
            document.getElementById('weightProgress').style.width = `${progress}%`;
        }

        // Update calories (simulate daily intake)
        const dailyCalories = this.calculateDailyCalories();
        document.getElementById('dailyCalories').textContent = `${dailyCalories} kcal`;
        document.getElementById('calorieGoal').textContent = `${dailyCalories} kcal`;
        
        // Update streak
        const streak = this.calculateStreak();
        document.getElementById('streakDays').textContent = `${streak} days`;
        document.getElementById('bestStreak').textContent = `${Math.max(streak, 15)} days`;
        
        const streakProgress = Math.min((streak / 30) * 100, 100);
        document.getElementById('streakProgress').style.width = `${streakProgress}%`;
    }

    updateBMICalculator() {
        const { personalInfo } = this.profile;
        
        if (personalInfo.weight && personalInfo.height) {
            const heightInMeters = personalInfo.height / 100;
            const bmi = personalInfo.weight / (heightInMeters * heightInMeters);
            
            document.getElementById('bmiValue').textContent = bmi.toFixed(1);
            
            let category = '';
            let color = '';
            if (bmi < 18.5) {
                category = 'Underweight';
                color = 'text-info';
            } else if (bmi < 25) {
                category = 'Normal weight';
                color = 'text-success';
            } else if (bmi < 30) {
                category = 'Overweight';
                color = 'text-warning';
            } else {
                category = 'Obese';
                color = 'text-danger';
            }
            
            document.getElementById('bmiCategory').textContent = category;
            document.getElementById('bmiCategory').className = `bmi-category ${color}`;
        }
    }

    calculateDailyCalories() {
        const { personalInfo, goals } = this.profile;
        
        if (!personalInfo.weight || !personalInfo.height || !personalInfo.age || !personalInfo.gender) {
            return 2000; // Default
        }

        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr;
        if (personalInfo.gender === 'male') {
            bmr = 10 * personalInfo.weight + 6.25 * personalInfo.height - 5 * personalInfo.age + 5;
        } else {
            bmr = 10 * personalInfo.weight + 6.25 * personalInfo.height - 5 * personalInfo.age - 161;
        }

        // Apply activity level
        const activityLevel = goals.activityLevel || 1.55;
        const tdee = bmr * activityLevel;

        // Adjust based on health goal
        let dailyCalories = tdee;
        if (goals.healthGoal === 'lose') {
            dailyCalories -= 500; // 500 calorie deficit
        } else if (goals.healthGoal === 'gain') {
            dailyCalories += 500; // 500 calorie surplus
        }

        return Math.round(dailyCalories);
    }

    calculateStreak() {
        // Simulate streak calculation based on meal logging
        const lastLoggedDate = localStorage.getItem('lastMealLogged');
        if (!lastLoggedDate) return 0;
        
        const today = new Date();
        const lastLogged = new Date(lastLoggedDate);
        const diffTime = Math.abs(today - lastLogged);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return Math.min(diffDays, 30); // Cap at 30 days
    }

    initializeCharts() {
        // Weight progress chart
        const weightCtx = document.getElementById('weightChart');
        if (weightCtx) {
            this.weightChart = new Chart(weightCtx, {
                type: 'line',
                data: {
                    labels: this.generateDateLabels(30),
                    datasets: [{
                        label: 'Weight (kg)',
                        data: this.generateWeightData(30),
                        borderColor: '#0d6efd',
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            title: {
                                display: true,
                                text: 'Weight (kg)'
                            }
                        }
                    }
                }
            });
        }

        // Nutrition distribution chart
        const nutritionCtx = document.getElementById('nutritionChart');
        if (nutritionCtx) {
            this.nutritionChart = new Chart(nutritionCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Protein', 'Carbohydrates', 'Fat'],
                    datasets: [{
                        data: [30, 45, 25],
                        backgroundColor: [
                            '#ffc107',
                            '#0dcaf0',
                            '#0d6efd'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    updateCharts() {
        // Update weight chart with current data
        if (this.weightChart && this.profile.personalInfo.weight) {
            const currentWeight = this.profile.personalInfo.weight;
            const newData = this.generateWeightData(30, currentWeight);
            this.weightChart.data.datasets[0].data = newData;
            this.weightChart.update();
        }
    }

    generateDateLabels(days) {
        const labels = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        
        return labels;
    }

    generateWeightData(days, currentWeight = 70) {
        const data = [];
        const baseWeight = currentWeight;
        
        for (let i = 0; i < days; i++) {
            // Generate realistic weight fluctuation
            const variation = (Math.random() - 0.5) * 2; // ±1 kg variation
            const trend = (days - i) * 0.01; // Slight upward trend
            data.push(Math.round((baseWeight + variation + trend) * 10) / 10);
        }
        
        return data;
    }

    updateMealHistory() {
        const tableBody = document.getElementById('mealHistoryTable');
        
        // Generate sample meal history
        const mealHistory = this.generateMealHistory();
        
        tableBody.innerHTML = mealHistory.map(meal => `
            <tr>
                <td>${meal.date}</td>
                <td>${meal.name}</td>
                <td><span class="badge bg-danger">${meal.calories}</span></td>
                <td><span class="badge bg-warning">${meal.protein}g</span></td>
                <td><span class="badge bg-info">${meal.carbs}g</span></td>
                <td><span class="badge bg-primary">${meal.fat}g</span></td>
                <td>
                    <button class="btn btn-outline-primary btn-sm" onclick="userProfile.viewMealDetails('${meal.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    generateMealHistory() {
        const meals = [
            'Grilled Chicken Salad',
            'Quinoa Buddha Bowl',
            'Salmon with Roasted Vegetables',
            'Avocado Toast',
            'Greek Yogurt Parfait',
            'Turkey Wrap',
            'Vegetable Soup'
        ];
        
        const history = [];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const meal = meals[Math.floor(Math.random() * meals.length)];
            history.push({
                id: `meal-${i}`,
                date: date.toLocaleDateString(),
                name: meal,
                calories: Math.floor(Math.random() * 400) + 200,
                protein: Math.floor(Math.random() * 30) + 15,
                carbs: Math.floor(Math.random() * 40) + 20,
                fat: Math.floor(Math.random() * 20) + 8
            });
        }
        
        return history;
    }

    viewMealDetails(mealId) {
        this.showToast('Meal details feature coming soon!', 'info');
    }

    exportData() {
        const data = {
            profile: this.profile,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `diet-app-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showToast('Data exported successfully!', 'success');
    }

    clearData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.removeItem('userProfile_data');
            localStorage.removeItem('nutritionTracker_data');
            localStorage.removeItem('mealPlanner_preferences');
            
            // Reset forms
            document.getElementById('profileForm').reset();
            document.getElementById('goalsForm').reset();
            
            // Reset profile
            this.profile = {
                personalInfo: {},
                goals: {},
                progress: {},
                settings: {}
            };
            
            this.updateDisplay();
            this.showToast('All data cleared successfully!', 'success');
        }
    }

    loadProfile() {
        const saved = localStorage.getItem('userProfile_data');
        if (saved) {
            this.profile = JSON.parse(saved);
            
            // Load profile data into forms
            const { personalInfo, goals, settings } = this.profile;
            
            if (personalInfo) {
                document.getElementById('fullName').value = personalInfo.fullName || '';
                document.getElementById('email').value = personalInfo.email || '';
                document.getElementById('age').value = personalInfo.age || '';
                document.getElementById('gender').value = personalInfo.gender || '';
                document.getElementById('weight').value = personalInfo.weight || '';
                document.getElementById('height').value = personalInfo.height || '';
            }
            
            if (goals) {
                document.getElementById('activityLevel').value = goals.activityLevel || '1.55';
                document.getElementById('dietPreference').value = goals.dietPreference || '';
                document.getElementById('healthGoal').value = goals.healthGoal || 'maintain';
                document.getElementById('weeklyGoal').value = goals.weeklyGoal || '';
                document.getElementById('allergies').value = goals.allergies || '';
            }
            
            if (settings) {
                document.getElementById('notificationsEnabled').checked = settings.notifications !== false;
                document.getElementById('darkModeEnabled').checked = settings.darkMode === true;
                document.getElementById('autoSaveEnabled').checked = settings.autoSave !== false;
                document.getElementById('analyticsEnabled').checked = settings.analytics !== false;
            }
        }
    }

    saveProfile() {
        localStorage.setItem('userProfile_data', JSON.stringify(this.profile));
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        // Add to page
        document.body.appendChild(toast);

        // Show toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        // Remove after hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('dark-theme');
        
        if (isDark) {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    }
}

// Initialize the app when DOM is loaded
let userProfile;
document.addEventListener('DOMContentLoaded', () => {
    userProfile = new UserProfile();
});
