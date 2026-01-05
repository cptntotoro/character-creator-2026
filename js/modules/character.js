import { STATS_DATA } from '../data/stats.js';
import { stats } from './stats.js';
import { generateBuff, generatePrediction, generateMotto } from './utils.js';
import { generatePerksHTML } from './perks.js';

export function generateStatsHTML() {
    let html = '';
    STATS_DATA.forEach(stat => {
        const value = stats[stat.id] || 1;

        html += `
            <div class="stat-bar">
                <div class="stat-name">
                    <span class="stat-icon">${stat.icon}</span>
                    <span>${stat.name}</span>
                </div>
                <div class="stat-value">${value}/5</div>
            </div>
        `;
    });
    return html;
}

export function generateCharacter(name) {
    const characterCard = document.getElementById('character-card');
    if (!characterCard) return;

    // Определяем самую высокую характеристику
    let highestStat = { name: '', value: 0 };
    for (const statId in stats) {
        if (stats[statId] > highestStat.value) {
            const statData = STATS_DATA.find(s => s.id === statId);
            highestStat = { name: statData.name, value: stats[statId] };
        }
    }

    // Генерируем бафф на основе характеристик
    const buff = generateBuff(stats);

    // Генерируем предсказание
    const prediction = generatePrediction();

    // Генерируем девиз
    const motto = generateMotto(stats);

    // Заполняем карточку персонажа
    characterCard.innerHTML = `
        <div class="card-header">
            <h2 class="card-title">${name}</h2>
            <div class="card-subtitle">${motto}</div>
        </div>

        <div class="card-content">
            <div class="card-section">
                <h3><i class="fas fa-chart-bar"></i> ХАРАКТЕРИСТИКИ</h3>
                <div class="stat-container">
                    ${generateStatsHTML()}
                </div>
            </div>

            <div class="card-section">
                <h3><i class="fas fa-star"></i> ПЕРКИ НА 2026</h3>
                <div class="perk-list-container">
                    <ul class="perk-list">
                        ${generatePerksHTML()}
                    </ul>
                </div>
            </div>

            <div class="card-section">
                <h3><i class="fas fa-magic"></i> БАФФ НА ГОД</h3>
                <div class="buff-box">
                    <div class="buff-box-content">
                        <div class="buff-title">${buff.title}</div>
                        <p>${buff.description}</p>
                    </div>
                </div>
            </div>

            <div class="card-section">
                <h3><i class="fas fa-crystal-ball"></i> ПРЕДСКАЗАНИЕ НА 2026</h3>
                <div class="prediction-box">
                    <div class="prediction-box-content">
                        <div class="prediction-title">Что тебя ждёт:</div>
                        <p>${prediction}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="share-buttons">
            <button class="share-btn save" onclick="window.saveCharacter()">
                <i class="fas fa-save"></i> Сохранить карточку
            </button>
            <button class="share-btn reset" onclick="window.resetCharacter()">
                <i class="fas fa-redo"></i> Создать нового
            </button>
        </div>
    `;

    // Показываем карточку
    characterCard.style.display = 'block';
    characterCard.scrollIntoView({ behavior: 'smooth' });
}