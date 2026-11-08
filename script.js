document.addEventListener('DOMContentLoaded', function() {
    const btnCasa = document.getElementById('btn-casa');
    const btnSala = document.getElementById('btn-sala');
    const mainView = document.getElementById('main-view');
    const calendarView = document.getElementById('calendar-view');
    const backBtn = document.getElementById('back-btn');
    const editBtn = document.getElementById('edit-btn');
    const editOptions = document.getElementById('edit-options');
    const saveBtn = document.getElementById('save-btn');
    const calendarTitle = document.getElementById('calendar-title');
    const calendar = document.getElementById('calendar');

    let isEditMode = false;
    let selectedDay = null;
    let selectedOption = null;
    let currentLocation = null;
    let assignments = {};

    // Richiedi permesso notifiche
    function requestNotificationPermission() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                console.log('Permesso notifiche:', permission);
            });
        }
    }

    // Carica assegnazioni da localStorage
    function loadAssignments() {
        const saved = localStorage.getItem('calendarAssignments');
        if (saved) {
            assignments = JSON.parse(saved);
        }
    }

    // Salva assegnazioni in localStorage
    function saveAssignments() {
        localStorage.setItem('calendarAssignments', JSON.stringify(assignments));
    }

    // Invia notifica
    function sendNotification(location, type) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(`${location} - ${type}`, {
                body: `Ricordati di preparare ${type} per ${location}`,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🗑️</text></svg>',
                requireInteraction: true
            });

            notification.onclick = function() {
                window.focus();
                notification.close();
            };
        }
    }

    // Controlla se ci sono notifiche da inviare
    function checkNotifications() {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const hour = now.getHours();
        const minute = now.getMinutes();

        // Controlla se sono le 01:00
        if (hour === 1 && minute === 0) {
            Object.keys(assignments).forEach(key => {
                const [location, year, month, day] = key.split('-');
                const dateKey = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

                if (dateKey === today) {
                    const assignment = assignments[key];
                    sendNotification(location, assignment.type);
                }
            });
        }
    }

    // Avvia controllo periodico notifiche (ogni 30 secondi per non perdere l'orario)
    setInterval(checkNotifications, 30000);

    // Controlla subito all'avvio
    checkNotifications();

    // Richiedi permesso all'avvio
    requestNotificationPermission();

    // Registra service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('Service Worker registrato:', registration);
            })
            .catch(error => {
                console.log('Service Worker registrazione fallita:', error);
            });
    }

    const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

    function generateCalendar(year) {
        calendar.innerHTML = '';
        const today = new Date();
        let todayElement = null;

        for (let month = 0; month < 12; month++) {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'month';

            const monthName = document.createElement('div');
            monthName.className = 'month-name';
            monthName.textContent = monthNames[month];
            monthDiv.appendChild(monthName);

            const daysList = document.createElement('div');
            daysList.className = 'days-list';

            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dayOfWeek = date.getDay();
                const dateKey = `${currentLocation}-${year}-${month}-${day}`;

                const dayRow = document.createElement('div');
                dayRow.className = 'day-row';
                dayRow.dataset.date = dateKey;
                dayRow.dataset.day = day;

                if (year === today.getFullYear() &&
                    month === today.getMonth() &&
                    day === today.getDate()) {
                    dayRow.classList.add('today');
                    dayRow.id = 'today-element';
                    todayElement = dayRow;
                }

                // Applica assegnazione se esiste
                if (assignments[dateKey]) {
                    dayRow.classList.add('assigned');
                    const assignment = assignments[dateKey];
                }

                const dayName = document.createElement('div');
                dayName.className = 'day-name';
                dayName.textContent = dayNames[dayOfWeek];

                const dayNumber = document.createElement('div');
                dayNumber.className = 'day-number';
                dayNumber.textContent = day;

                // Mostra lettera assegnata
                if (assignments[dateKey]) {
                    dayNumber.textContent = assignments[dateKey].type;
                    dayNumber.style.backgroundColor = assignments[dateKey].color;
                    dayNumber.style.color = getContrastColor(assignments[dateKey].color);
                }

                dayRow.appendChild(dayName);
                dayRow.appendChild(dayNumber);
                daysList.appendChild(dayRow);

                // Click sul giorno in modalità edit
                dayRow.addEventListener('click', function() {
                    if (isEditMode) {
                        selectDay(dayRow, dateKey);
                    }
                });
            }

            monthDiv.appendChild(daysList);
            calendar.appendChild(monthDiv);
        }

        // Scroll automatico al giorno corrente
        if (todayElement) {
            setTimeout(() => {
                todayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }

    function getContrastColor(hexcolor) {
        const r = parseInt(hexcolor.slice(1, 3), 16);
        const g = parseInt(hexcolor.slice(3, 5), 16);
        const b = parseInt(hexcolor.slice(5, 7), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? '#000000' : '#ffffff';
    }

    function selectDay(dayRow, dateKey) {
        // Rimuovi selezione precedente
        document.querySelectorAll('.day-row.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // Seleziona nuovo giorno
        dayRow.classList.add('selected');
        selectedDay = dateKey;

        if ('vibrate' in navigator) {
            navigator.vibrate(30);
        }
    }

    function showCalendar(location) {
        mainView.style.display = 'none';
        calendarView.style.display = 'flex';
        calendarTitle.textContent = location;
        currentLocation = location;
        loadAssignments();
        const currentYear = new Date().getFullYear();
        generateCalendar(currentYear);
    }

    function showMain() {
        calendarView.style.display = 'none';
        mainView.style.display = 'flex';
    }

    btnCasa.addEventListener('click', function() {
        console.log('Casa cliccato');
        showCalendar('Casa');
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    });

    btnSala.addEventListener('click', function() {
        console.log('Sala cliccato');
        showCalendar('Sala');
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    });

    backBtn.addEventListener('click', function() {
        showMain();
        if ('vibrate' in navigator) {
            navigator.vibrate(30);
        }
    });

    editBtn.addEventListener('click', function() {
        isEditMode = !isEditMode;
        editOptions.style.display = isEditMode ? 'flex' : 'none';
        editBtn.textContent = isEditMode ? '✕ Chiudi' : '✎ Edit';

        if (!isEditMode) {
            selectedDay = null;
            selectedOption = null;
            document.querySelectorAll('.day-row.selected').forEach(el => {
                el.classList.remove('selected');
            });
            document.querySelectorAll('.edit-option.selected').forEach(el => {
                el.classList.remove('selected');
            });
        }

        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    });

    // Gestione selezione opzioni
    document.querySelectorAll('.edit-option').forEach(option => {
        option.addEventListener('click', function() {
            if (!selectedDay) {
                return;
            }

            document.querySelectorAll('.edit-option').forEach(el => {
                el.classList.remove('selected');
            });

            this.classList.add('selected');

            // Opzione annulla
            if (this.dataset.type === 'cancel') {
                delete assignments[selectedDay];
                const dayRow = document.querySelector(`[data-date="${selectedDay}"]`);
                if (dayRow) {
                    const dayNumber = dayRow.querySelector('.day-number');
                    dayNumber.textContent = dayRow.dataset.day;
                    dayNumber.style.backgroundColor = '';
                    dayNumber.style.color = '';
                    dayRow.classList.remove('assigned');
                }
                if ('vibrate' in navigator) {
                    navigator.vibrate(30);
                }
                return;
            }

            selectedOption = {
                type: this.dataset.type,
                color: this.dataset.color
            };

            // Assegna immediatamente
            assignments[selectedDay] = selectedOption;
            const dayRow = document.querySelector(`[data-date="${selectedDay}"]`);
            if (dayRow) {
                const dayNumber = dayRow.querySelector('.day-number');
                dayNumber.textContent = selectedOption.type;
                dayNumber.style.backgroundColor = selectedOption.color;
                dayNumber.style.color = getContrastColor(selectedOption.color);
                dayRow.classList.add('assigned');
            }

            if ('vibrate' in navigator) {
                navigator.vibrate(30);
            }
        });
    });

    saveBtn.addEventListener('click', function() {
        saveAssignments();
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    });
});
