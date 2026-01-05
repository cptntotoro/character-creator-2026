import { STATS_DATA } from '../data/stats.js';
import { BUFFS_DATA } from '../data/buffs.js';
import { PREDICTIONS_DATA } from '../data/predictions.js';
import { MOTTOS_DATA } from '../data/mottos.js';

export function generateBuff(stats) {
    // Определяем доминирующую характеристику
    let dominantStat = '';
    let maxValue = 0;

    for (const statId in stats) {
        if (stats[statId] > maxValue) {
            maxValue = stats[statId];
            dominantStat = statId;
        }
    }

    return BUFFS_DATA[dominantStat] || {
        title: 'Благословение целостности',
        description: 'Вы не идеальны во всём, но гармоничны в целом. Как оркестр, где каждый инструмент играет свою партию — не громче других, но важнее всех вместе.'
    };
}

export function generatePrediction() {
    const randomIndex = Math.floor(Math.random() * PREDICTIONS_DATA.length);
    return PREDICTIONS_DATA[randomIndex];
}

export function generateMotto(stats) {
    // Определяем доминирующую характеристику
    let dominantStat = '';
    let maxValue = 0;

    for (const statId in stats) {
        if (stats[statId] > maxValue) {
            maxValue = stats[statId];
            dominantStat = statId;
        }
    }

    return MOTTOS_DATA[dominantStat] || '«Меньше перфекционизма, больше питцы»';
}

export function updateGenerateButton() {
    const name = document.getElementById('character-name').value.trim();
    const generateBtn = document.getElementById('generate-btn');

    // ВАЖНО: читаем pointsLeft из DOM, который обновляется updateStatsUI()
    const pointsLeftElement = document.getElementById('points-left');
    const pointsLeft = pointsLeftElement ? parseInt(pointsLeftElement.textContent) : 15;

    if (name.length > 0 && pointsLeft === 0) {
        generateBtn.disabled = false;
        generateBtn.style.cursor = 'pointer';
    } else {
        generateBtn.disabled = true;
        generateBtn.style.cursor = 'not-allowed';
    }
}

// Вспомогательная функция для рисования скругленных прямоугольников
export function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}