// app.js

// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Раскрываем на весь экран
tg.enableClosingConfirmation(); // Запрос подтверждения при закрытии

// Состояние приложения
const appState = {
    // Данные пользователя
    userId: 'IPUWEOYO',
    username: '@solotars',
    daysLeft: 25,
    
    // Балансы
    mainBalance: 0.021317438,
    totalIncome: 0.003426571,
    bonusBalance: 0.021317438,
    friendsIncome: 0,
    
    // Ставки
    baseRate: 1.1, // Базовая ставка 1.1%
    friendsBonus: 0, // Бонус от друзей
    maxRate: 2.0, // Максимальная ставка
    
    // Игровой ID
    gameId: 'IPUWEOYO',
    
    // Реферальная ссылка
    referralLink: 'https://t.me/my_tonbank_bot?start=ref_IPUWEOYO',
    
    // Время выплаты бонусов (18:00)
    payoutHour: 18,
    
    // Функции для расчетов
    calculateDailyIncome() {
        // Формула: sqrt(n) + процент от баланса
        const sqrtTerm = Math.sqrt(this.mainBalance);
        const percentTerm = (this.mainBalance * (this.baseRate + this.friendsBonus) / 100);
        return sqrtTerm + percentTerm;
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Заполняем данные пользователя
    document.getElementById('user-id').textContent = appState.userId;
    
    // Настройка навигации
    setupNavigation();
    
    // Инициализация всех экранов
    updateMainScreen();
    updateFriendsScreen();
    updateGamesScreen();
    updateBonusScreen();
    
    // Запуск таймеров
    startBonusCountdown();
    updateDataEveryMinute();
});

// НАВИГАЦИЯ МЕЖДУ ЭКРАНАМИ
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const screens = document.querySelectorAll('.screen');
    const headerTitle = document.getElementById('header-title');
    
    const screenTitles = {
        'main': 'TONBANK - Доход',
        'friends': 'Мои друзья',
        'games': 'Game Center',
        'bonus': 'Бонусный доход'
    };
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetScreen = this.getAttribute('data-screen');
            
            // Обновляем активную кнопку
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Переключаем экраны
            screens.forEach(screen => {
                screen.classList.remove('active');
                if (screen.id === targetScreen + '-screen') {
                    screen.classList.add('active');
                }
            });
            
            // Обновляем заголовок
            headerTitle.textContent = screenTitles[targetScreen] || 'TONBANK';
            
            // Прокрутка вверх при переключении
            window.scrollTo(0, 0);
        });
    });
}

// ОБНОВЛЕНИЕ ЭКРАНОВ
function updateMainScreen() {
    // Баланс
    document.getElementById('main-balance').textContent = 
        appState.mainBalance.toFixed(9).replace(/\.?0+$/, '');
    
    // Текущая ставка
    document.getElementById('rate').textContent = 
        (appState.baseRate + appState.friendsBonus).toFixed(1);
    
    // Дневной доход (расчёт по формуле)
    const dailyIncome = appState.calculateDailyIncome();
    document.getElementById('daily-income').textContent = 
        dailyIncome.toFixed(7) + ' TON';
    
    // Общий доход
    document.getElementById('total-income').textContent = 
        appState.totalIncome.toFixed(9).replace(/\.?0+$/, '');
}

function updateFriendsScreen() {
    // Реферальная ссылка
    document.getElementById('ref-link').textContent = appState.referralLink;
}

function updateGamesScreen() {
    // Можно добавить динамическое обновление игр
}

function updateBonusScreen() {
    // Баланс на экране бонусов
    document.getElementById('bonus-balance').textContent = 
        appState.bonusBalance.toFixed(9) + ' TON';
}

// ТАЙМЕР ДО ВЫПЛАТЫ БОНУСОВ
function startBonusCountdown() {
    function updateCountdown() {
        const now = new Date();
        const target = new Date();
        
        target.setHours(appState.payoutHour, 0, 0, 0);
        
        // Если время уже прошло сегодня, устанавливаем на завтра
        if (now > target) {
            target.setDate(target.getDate() + 1);
        }
        
        const diff = target - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('bonus-countdown').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ОБНОВЛЕНИЕ ДАННЫХ КАЖДУЮ МИНУТУ
function updateDataEveryMinute() {
    setInterval(() => {
        // В реальном приложении здесь был бы запрос к серверу
        // Для демо просто обновляем отображение
        updateMainScreen();
    }, 60000);
}

// ОСНОВНЫЕ ФУНКЦИИ ПРИЛОЖЕНИЯ

function deposit() {
    tg.showAlert('Функция пополнения. В реальном приложении здесь будет открытие TON кошелька.');
    // В реальном приложении: tg.sendData для открытия диалога пополнения
}

function withdraw() {
    tg.showAlert(`Запрос на вывод ${appState.mainBalance.toFixed(6)} TON отправлен.`);
}

function reinvest() {
    // Переводим доход в основной баланс
    appState.mainBalance += appState.totalIncome;
    appState.totalIncome = 0;
    
    updateMainScreen();
    tg.showAlert('Доход реинвестирован в основной баланс!');
}

function withdrawIncome() {
    tg.showAlert(`Вывод дохода ${appState.totalIncome.toFixed(6)} TON.`);
}

function collectFromFriends() {
    if (appState.friendsIncome > 0) {
        appState.mainBalance += appState.friendsIncome;
        appState.friendsIncome = 0;
        
        updateMainScreen();
        tg.showAlert(`Собрано ${appState.friendsIncome.toFixed(6)} TON от друзей!`);
    } else {
        tg.showAlert('Нет активностей друзей для сбора.');
    }
}

function copyRefLink() {
    navigator.clipboard.writeText(appState.referralLink)
        .then(() => tg.showAlert('Реферальная ссылка скопирована!'))
        .catch(() => tg.showAlert('Не удалось скопировать ссылку'));
}

function openGame(gameType) {
    const gameNames = {
        'jetton': 'JetTon',
        'spinbank': 'SpinBank',
        'ticket': 'Счастливый билет'
    };
    
    tg.showAlert(`Запуск игры: ${gameNames[gameType]}. В реальном приложении здесь будет переход в мини-игру.`);
    
    // Увеличиваем ставку при покупке билета
    if (gameType === 'ticket') {
        if (appState.baseRate + appState.friendsBonus < appState.maxRate) {
            appState.baseRate += 0.1;
            updateMainScreen();
            tg.showAlert('Ставка дохода увеличена на 0.1%!');
        }
    }
}

function activatePromo() {
    const promoCode = document.getElementById('promo-code').value;
    if (promoCode) {
        tg.showAlert(`Промокод "${promoCode}" активирован! Бонус будет начислен в 18:00.`);
        document.getElementById('promo-code').value = '';
    } else {
        tg.showAlert('Введите промокод');
    }
}

// Интеграция с Telegram (получение данных пользователя)
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    appState.username = '@' + (user.username || user.first_name);
    document.querySelector('.user-info h2').textContent = appState.username;
}

// Для отладки в браузере (без Telegram)
if (typeof window.Telegram === 'undefined') {
    console.log('Приложение запущено в браузере. Telegram WebApp не обнаружен.');
    document.querySelector('.user-info h2').textContent = appState.username;
                                }
