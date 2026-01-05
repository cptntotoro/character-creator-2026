import { initStats, updateStatsUI, increaseStat, decreaseStat, resetStats } from './modules/stats.js';
import { initPerks, togglePerk, resetPerks } from './modules/perks.js';
import { generateCharacter } from './modules/character.js';
import { saveCharacter } from './modules/canvas.js';
import { updateGenerateButton } from './modules/utils.js';

// Инициализация слушателей событий
function initEventListeners() {
    try {
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                const name = document.getElementById('character-name').value.trim() || 'Анонимный Оптимист';
                generateCharacter(name);
            });
        }

        const nameInput = document.getElementById('character-name');
        if (nameInput) {
            nameInput.addEventListener('input', updateGenerateButton);
        }

        // Делегирование событий для характеристик
        document.getElementById('stats-container')?.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('increase')) {
                const statId = target.dataset.stat;
                if (statId && increaseStat(statId)) {
                    updateStatsUI();
                    updateGenerateButton();
                }
            } else if (target.classList.contains('decrease')) {
                const statId = target.dataset.stat;
                if (statId && decreaseStat(statId)) {
                    updateStatsUI();
                    updateGenerateButton();
                }
            }
        });

        // Делегирование событий для перков
        document.getElementById('perks-container')?.addEventListener('click', (e) => {
            const target = e.target.closest('.perk');
            if (target) {
                const perkId = target.querySelector('.perk-checkbox')?.dataset.perk;
                if (perkId && togglePerk(perkId)) {
                    updateGenerateButton();
                }
            }
        });

    } catch (error) {
        console.error('Ошибка инициализации слушателей событий:', error);
    }
}

// Сброс и создание нового персонажа
function resetCharacter() {
    if (confirm('Создать нового персонажа? Текущий прогресс будет потерян.')) {
        resetStats();
        resetPerks();
        updateStatsUI();
        updateGenerateButton();

        // Скрываем карточку
        const characterCard = document.getElementById('character-card');
        if (characterCard) {
            characterCard.style.display = 'none';
        }

        // Прокручиваем наверх
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function () {
    initStats();
    initPerks();
    initEventListeners();
    updateStatsUI();
    updateGenerateButton();
});

// Экспортируем функции для глобального использования
window.increaseStat = increaseStat;
window.decreaseStat = decreaseStat;
window.togglePerk = togglePerk;
window.saveCharacter = saveCharacter;
window.resetCharacter = resetCharacter;
window.generateCharacter = generateCharacter;
window.updateGenerateButton = updateGenerateButton;