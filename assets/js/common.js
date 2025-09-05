// Устанавливаем текущий год
const currentYear = new Date().getFullYear();
document.getElementById('currentYear').textContent = currentYear;

// Проверяем сохраненную тему или предпочтения системы
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Устанавливаем начальную тему
if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (document.getElementById('themeToggle')) {
        document.getElementById('themeToggle').textContent = '☀️';
    }
} else {
    document.documentElement.removeAttribute('data-theme');
    if (document.getElementById('themeToggle')) {
        document.getElementById('themeToggle').textContent = '🌙';
    }
}

// Обработчик переключения темы
if (document.getElementById('themeToggle')) {
    document.getElementById('themeToggle').addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            this.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            this.textContent = '☀️';
        }
    });
}