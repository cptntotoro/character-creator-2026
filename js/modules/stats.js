import { STATS_DATA } from '../data/stats.js';
import { INITIAL_STATE } from '../data/init.js';

let pointsLeft = INITIAL_STATE.pointsLeft;
let stats = INITIAL_STATE.stats;

export function increaseStat(statId) {
    if (pointsLeft > 0 && stats[statId] < 5) {
        stats[statId]++;
        pointsLeft--;
        return true;
    }
    return false;
}

export function decreaseStat(statId) {
    if (stats[statId] > 1) {
        stats[statId]--;
        pointsLeft++;
        return true;
    }
    return false;
}

export function resetStats() {
    pointsLeft = INITIAL_STATE.pointsLeft;
    stats = { ...INITIAL_STATE.stats };
    STATS_DATA.forEach(stat => {
        stats[stat.id] = 1;
    });
}

export function initStats() {
    resetStats();

    const container = document.getElementById('stats-container');
    if (!container) return;

    container.innerHTML = '';

    STATS_DATA.forEach(stat => {
        stats[stat.id] = 1;

        const statElement = document.createElement('div');
        statElement.className = 'stat';
        statElement.innerHTML = `
            <div class="stat-header">
                <div class="stat-icon">${stat.icon}</div>
                <div class="stat-info">
                    <h3>${stat.name}</h3>
                    <p>${stat.example}</p>
                </div>
            </div>
            <div class="stat-controls">
                <button class="stat-btn decrease" data-stat="${stat.id}" disabled>-</button>
                <div class="stat-value" id="value-${stat.id}">1</div>
                <button class="stat-btn increase" data-stat="${stat.id}">+</button>
            </div>
        `;

        container.appendChild(statElement);
    });
}

export function updateStatsUI() {
    // Обновляем очки
    const pointsLeftElement = document.getElementById('points-left');
    if (pointsLeftElement) {
        pointsLeftElement.textContent = pointsLeft;
    }

    // Обновляем значения характеристик
    STATS_DATA.forEach(stat => {
        const valueElement = document.getElementById(`value-${stat.id}`);
        const decreaseBtn = document.querySelector(`[data-stat="${stat.id}"].decrease`);
        const increaseBtn = document.querySelector(`[data-stat="${stat.id}"].increase`);

        if (valueElement) {
            valueElement.textContent = stats[stat.id] || 1;
        }

        if (decreaseBtn) {
            decreaseBtn.disabled = (stats[stat.id] || 1) <= 1;
            decreaseBtn.style.opacity = decreaseBtn.disabled ? '0.5' : '1';
        }

        if (increaseBtn) {
            increaseBtn.disabled = pointsLeft <= 0 || (stats[stat.id] || 1) >= 5;
            increaseBtn.style.opacity = increaseBtn.disabled ? '0.5' : '1';
        }
    });
}

export { pointsLeft, stats };