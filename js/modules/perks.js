import { PERKS_DATA } from '../data/perks.js';
import { INITIAL_STATE } from '../data/init.js';

let selectedPerks = INITIAL_STATE.selectedPerks;

export function getSelectedPerks() {
    return [...selectedPerks];
}

export function resetPerks() {
    selectedPerks = [...INITIAL_STATE.selectedPerks];
    const checkboxes = document.querySelectorAll('.perk-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('.perk').forEach(el => {
        el.classList.remove('selected');
    });
}

export function initPerks() {
    const container = document.getElementById('perks-container');
    if (!container) return;

    container.innerHTML = '';

    PERKS_DATA.forEach(perk => {
        const perkElement = document.createElement('div');
        perkElement.className = 'perk';
        perkElement.id = `perk-${perk.id}`;
        perkElement.innerHTML = `
            <input type="checkbox" class="perk-checkbox" id="checkbox-${perk.id}" data-perk="${perk.id}">
            <div class="perk-checkmark"></div>
            <div class="perk-header">
                <div class="perk-title">${perk.name}</div>
            </div>
            <div class="perk-desc">${perk.description}</div>
        `;

        container.appendChild(perkElement);
    });
}

export function togglePerk(perkId) {
    const index = selectedPerks.indexOf(perkId);
    const perkElement = document.getElementById(`perk-${perkId}`);

    if (index === -1) {
        // Проверяем, можно ли выбрать еще перки
        if (selectedPerks.length >= 3) {
            alert('Можно выбрать только 3 перка!');
            return false;
        }

        // Добавляем перк
        selectedPerks.push(perkId);
        if (perkElement) {
            perkElement.classList.add('selected');
        }
        document.getElementById(`checkbox-${perkId}`).checked = true;
        return true;
    } else {
        // Убираем перк
        selectedPerks.splice(index, 1);
        if (perkElement) {
            perkElement.classList.remove('selected');
        }
        document.getElementById(`checkbox-${perkId}`).checked = false;
        return true;
    }
}

export function generatePerksHTML() {
    let html = '';
    selectedPerks.forEach(perkId => {
        const perk = PERKS_DATA.find(p => p.id === perkId);
        if (perk) {
            html += `<li><i class="fas fa-check-circle"></i> <span>${perk.name}</span></li>`;
        }
    });
    return html;
}

export { selectedPerks };