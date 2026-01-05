import { STATS_DATA } from '../data/stats.js';
import { PERKS_DATA } from '../data/perks.js';
import { stats } from './stats.js';
import { selectedPerks } from './perks.js';
import { generateBuff, generatePrediction, generateMotto, drawRoundedRect } from './utils.js';

export function saveCharacter() {
    const name = document.getElementById('character-name').value.trim() || 'Персонаж';

    // Создаем canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Устанавливаем фиксированные размеры
    canvas.width = 1000;
    canvas.height = 1500;

    // 1. Фон карточки
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';

    const cardX = 40;
    const cardY = 40;
    const cardWidth = canvas.width - 80;
    const cardHeight = canvas.height - 80;
    const borderRadius = 16;

    // Рисуем скругленную карточку
    drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, borderRadius);
    ctx.fill();

    // Верхняя градиентная полоса
    const borderGradient = ctx.createLinearGradient(cardX, cardY, cardX + cardWidth, cardY);
    borderGradient.addColorStop(0, '#8a2be2');
    borderGradient.addColorStop(0.5, '#ff6b6b');
    borderGradient.addColorStop(1, '#8a2be2');
    ctx.fillStyle = borderGradient;
    ctx.fillRect(cardX, cardY, cardWidth, 5);

    // Декор в правом верхнем углу
    ctx.fillStyle = 'rgba(138, 43, 226, 0.1)';
    ctx.beginPath();
    ctx.moveTo(cardX + cardWidth, cardY);
    ctx.lineTo(cardX + cardWidth, cardY + 120);
    ctx.lineTo(cardX + cardWidth - 120, cardY);
    ctx.closePath();
    ctx.fill();

    let currentY = cardY + 70;

    // 2. Заголовок
    ctx.fillStyle = '#2d1b69';
    ctx.font = 'bold 42px "Courier New", monospace';
    ctx.textAlign = 'center';

    let displayName = name.toUpperCase();
    const maxNameWidth = cardWidth - 100;
    let nameMetrics = ctx.measureText(displayName);

    if (nameMetrics.width > maxNameWidth) {
        while (ctx.measureText(displayName + '...').width > maxNameWidth && displayName.length > 3) {
            displayName = displayName.substring(0, displayName.length - 1);
        }
        displayName += '...';
    }

    ctx.fillText(displayName, cardX + cardWidth / 2, currentY);

    // Дополнительный текст (девиз)
    const motto = generateMotto();
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(motto, cardX + cardWidth / 2, currentY + 40);

    // Разделитель
    currentY += 80;
    ctx.strokeStyle = '#e0e0e0';
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(cardX + 60, currentY);
    ctx.lineTo(cardX + cardWidth - 60, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Отступ после разделителя
    currentY += 70;

    // 3. Характеристики
    ctx.fillStyle = '#8a2be2';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('ХАРАКТЕРИСТИКИ', cardX + 60, currentY);

    currentY += 50;

    // Все характеристики в один столбец
    const columnX = cardX + 60;
    const columnWidth = cardWidth - 120;
    const statSpacing = 55; // Одинаковый интервал между характеристиками

    for (let i = 0; i < STATS_DATA.length; i++) {
        const stat = STATS_DATA[i];
        const value = stats[stat.id];
        const statY = currentY + i * statSpacing;

        // Эмодзи
        ctx.fillStyle = '#333';
        ctx.font = '30px Arial';
        ctx.fillText(stat.icon, columnX, statY);

        // Название характеристики
        ctx.font = 'bold 20px Arial';
        ctx.fillText(stat.name, columnX + 45, statY);

        // Значение (справа)
        ctx.fillStyle = '#8a2be2';
        ctx.font = 'bold 30px "Courier New", monospace';
        const valueX = columnX + columnWidth - 80;
        ctx.fillText(`${value}/5`, valueX, statY + 5);
    }

    // Отступ после характеристик
    currentY += STATS_DATA.length * statSpacing + 40;

    // 4. Перки
    ctx.fillStyle = '#8a2be2';
    ctx.font = 'bold 30px Arial';
    ctx.fillText('ПЕРКИ НА 2026', cardX + 60, currentY);

    currentY += 50;

    if (selectedPerks.length > 0) {
        // Все перки в один столбец
        const perkColumnX = cardX + 60;
        const perkItemHeight = 32;
        const perkSpacing = 35; // Одинаковый интервал между перками

        for (let i = 0; i < selectedPerks.length; i++) {
            const perk = PERKS_DATA.find(p => p.id === selectedPerks[i]);
            if (!perk) continue;

            const perkY = currentY + i * perkSpacing;

            // Галочка
            ctx.fillStyle = '#4CAF50';
            ctx.font = 'bold 18px Arial';
            ctx.fillText('✓', perkColumnX, perkY);

            // Название перка
            ctx.fillStyle = '#333';
            ctx.font = '19px Arial';

            let perkName = perk.name;
            const maxPerkNameWidth = cardWidth - 140;
            let perkNameMetrics = ctx.measureText(perkName);

            if (perkNameMetrics.width > maxPerkNameWidth) {
                while (ctx.measureText(perkName + '...').width > maxPerkNameWidth && perkName.length > 3) {
                    perkName = perkName.substring(0, perkName.length - 1);
                }
                perkName += '...';
            }

            ctx.fillText(perkName, perkColumnX + 30, perkY);
        }

        // Отступ после перков
        currentY += selectedPerks.length * perkSpacing + 40;
    } else {
        ctx.fillStyle = '#999';
        ctx.font = 'italic 20px Arial';
        ctx.fillText('Перки не выбраны', cardX + 60, currentY);
        currentY += 60;
    }

    // 5. Бафф на год
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 30px Arial';
    ctx.fillText('БАФФ НА ГОД', cardX + 60, currentY);

    currentY += 40;

    // Рисуем блок баффа
    const buff = generateBuff();

    // Фон баффа
    ctx.fillStyle = '#e6f7ff';
    const buffHeight = 140;
    drawRoundedRect(ctx, cardX + 60, currentY, cardWidth - 120, buffHeight, 12);
    ctx.fill();

    // Левая граница
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(cardX + 60, currentY, 5, buffHeight);

    // Заголовок баффа
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(buff.title, cardX + 80, currentY + 35);

    // Описание баффа
    ctx.fillStyle = '#333';
    ctx.font = '18px Arial';

    const description = buff.description;
    const maxWidth = cardWidth - 160;
    let descY = currentY + 70;

    const words = description.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, cardX + 80, descY);
            line = words[n] + ' ';
            descY += 25;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, cardX + 80, descY);

    // Отступ после баффа
    currentY += buffHeight + 70;

    // 6. Предсказание
    ctx.fillStyle = '#ff9800';
    ctx.font = 'bold 30px Arial';
    ctx.fillText('ПРЕДСКАЗАНИЕ НА 2026', cardX + 60, currentY);

    currentY += 40;

    // Рисуем блок предсказания
    const prediction = generatePrediction();

    // Фон предсказания
    ctx.fillStyle = '#fff8e6';
    const predictionHeight = 100;
    drawRoundedRect(ctx, cardX + 60, currentY, cardWidth - 120, predictionHeight, 12);
    ctx.fill();

    // Левая граница
    ctx.fillStyle = '#ff9800';
    ctx.fillRect(cardX + 60, currentY, 5, predictionHeight);

    // Заголовок предсказания
    ctx.fillStyle = '#ff9800';
    ctx.font = 'bold 22px Arial';
    ctx.fillText('Что тебя ждёт:', cardX + 80, currentY + 32);

    // Текст предсказания
    ctx.fillStyle = '#333';
    ctx.font = '17px Arial';

    const predictionText = prediction;
    const maxPredictionWidth = cardWidth - 160;
    let predY = currentY + 62;

    const predWords = predictionText.split(' ');
    let predLine = '';
    for (let n = 0; n < predWords.length; n++) {
        const testPredLine = predLine + predWords[n] + ' ';
        const predMetrics = ctx.measureText(testPredLine);

        if (predMetrics.width > maxPredictionWidth && n > 0) {
            ctx.fillText(predLine, cardX + 80, predY);
            predLine = predWords[n] + ' ';
            predY += 22;
        } else {
            predLine = testPredLine;
        }
    }
    ctx.fillText(predLine, cardX + 80, predY);

    // Отступ после предсказания
    currentY += predictionHeight + 60;

    // 7. Подпись - проверяем, чтобы не наезжала на контент
    ctx.fillStyle = '#666';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';

    // Убеждаемся, что подпись помещается
    const minFooterY = cardY + cardHeight - 40;
    const footerY = Math.min(currentY, minFooterY);

    // Рисуем подпись только если есть место
    if (footerY < cardY + cardHeight - 20) {
        ctx.fillText('Сделано с ❤️ для Алисы и Миши', cardX + cardWidth / 2, footerY);
    }

    // 8. Скачиваем изображение
    canvas.toBlob(function (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name.replace(/\s+/g, '_')}_2026.png`;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }, 'image/png', 1.0);
}

// Добавляем поддержку roundRect для старых браузеров
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;

        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, radius);
        this.arcTo(x, y + height, x, y, radius);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();
        return this;
    };
}