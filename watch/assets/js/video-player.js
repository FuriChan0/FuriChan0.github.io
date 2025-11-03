class AnimePlayer {
    constructor() {
        this.animeData = null;
        this.currentEpisode = null;
        this.currentVoice = null;
        this.availableVoices = [];
        this.init();
    }

    init() {
        this.loadAnimeData();
        this.setupTheme();
        this.setupEventListeners();
    }

    loadAnimeData() {
        try {
            const animeDataElement = document.getElementById('animeData');
            if (animeDataElement) {
                this.animeData = JSON.parse(animeDataElement.textContent);
                this.renderAnimePage();
            } else {
                console.error('Элемент с данными аниме не найден!');
            }
        } catch (error) {
            console.error('Ошибка загрузки данных аниме:', error);
        }
    }

    renderAnimePage() {
        if (!this.animeData) return;

        // Устанавливаем заголовок страницы
        document.title = `${this.animeData.title} - FuriProject`;

        // Заполняем основную информацию
        this.renderAnimeInfo();

        // Настраиваем озвучки
        this.setupVoices();

        // Генерируем список серий для текущей озвучки
        this.generateEpisodesList();

        // Восстанавливаем последнюю просмотренную серию и озвучку
        this.restoreLastWatched();
    }

    renderAnimeInfo() {
        // Заполняем обложку
        const coverElement = document.getElementById('animeCover');
        if (coverElement && this.animeData.cover) {
            coverElement.innerHTML = `<img src="${this.animeData.cover}" alt="${this.animeData.title} Обложка">`;
        }

        // Заполняем заголовок
        const titleElement = document.getElementById('animeTitle');
        if (titleElement) {
            titleElement.textContent = this.animeData.title;
        }

        // Заполняем описание
        const descElement = document.getElementById('animeDescription');
        if (descElement && this.animeData.description) {
            descElement.innerHTML = `<p>${this.animeData.description}</p>`;
        }
    }

    setupVoices() {
        if (!this.animeData.voices) return;

        this.availableVoices = Object.keys(this.animeData.voices);
        
        // Если есть несколько озвучек, показываем выбор
        if (this.availableVoices.length > 1) {
            this.renderVoiceSelector();
        }
        
        // Устанавливаем первую озвучку по умолчанию
        this.currentVoice = this.availableVoices[0];
    }

    renderVoiceSelector() {
        const voiceContainer = document.getElementById('voiceSelectorContainer');
        const voiceButtons = document.getElementById('voiceButtons');
        
        if (!voiceContainer || !voiceButtons) return;

        voiceContainer.style.display = 'block';
        voiceButtons.innerHTML = '';

        this.availableVoices.forEach(voiceKey => {
            const voice = this.animeData.voices[voiceKey];
            const button = document.createElement('button');
            button.className = 'voice-btn';
            button.textContent = voice.name || voiceKey;
            button.setAttribute('data-voice', voiceKey);
            
            button.addEventListener('click', () => {
                this.selectVoice(voiceKey);
            });
            
            voiceButtons.appendChild(button);
        });
    }

    selectVoice(voiceKey) {
        // Удаляем активный класс у всех кнопок озвучки
        document.querySelectorAll('.voice-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Добавляем активный класс текущей кнопке
        const voiceBtn = document.querySelector(`[data-voice="${voiceKey}"]`);
        if (voiceBtn) {
            voiceBtn.classList.add('active');
        }
        
        this.currentVoice = voiceKey;
        
        // Перегенерируем список серий для выбранной озвучки
        this.generateEpisodesList();
        
        // Если была выбрана серия, загружаем ее в новой озвучке
        if (this.currentEpisode) {
            this.loadEpisode(this.currentEpisode);
        }
        
        // Сохраняем выбор озвучки
        this.saveLastWatched();
    }

    generateEpisodesList() {
        const episodesGrid = document.getElementById('episodesGrid');
        if (!episodesGrid || !this.currentVoice) return;

        episodesGrid.innerHTML = '';
        
        const episodes = this.animeData.voices[this.currentVoice].episodes;
        const episodeCount = episodes.length;
        
        // Добавляем класс для адаптивности
        episodesGrid.className = `episodes-grid episodes-count-${Math.min(episodeCount, 10)}`;

        episodes.forEach(episode => {
            const episodeBtn = document.createElement('button');
            episodeBtn.className = 'episode-btn';
            episodeBtn.textContent = episode.number;
            episodeBtn.setAttribute('data-episode', episode.number);
            
            episodeBtn.addEventListener('click', () => {
                this.selectEpisode(episode);
            });
            
            episodesGrid.appendChild(episodeBtn);
        });
    }

    selectEpisode(episode) {
        // Удаляем активный класс у всех кнопок
        document.querySelectorAll('.episode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Добавляем активный класс текущей кнопке
        const episodeBtn = document.querySelector(`[data-episode="${episode.number}"]`);
        if (episodeBtn) {
            episodeBtn.classList.add('active');
        }
        
        // Загружаем эпизод
        this.loadEpisode(episode);
    }

    loadEpisode(episode) {
        const videoPlayer = document.getElementById('videoPlayer');
        const episodeTitle = document.getElementById('episodeTitle');
        const episodeDescription = document.getElementById('episodeDescription');
        
        if (!videoPlayer || !episodeTitle || !episodeDescription) return;

        // Обновляем видео
        videoPlayer.innerHTML = episode.video;
        
        // Обновляем информацию о серии
        episodeTitle.textContent = `Серия ${episode.number}: ${episode.title}`;
        episodeDescription.textContent = episode.description;
        
        // Сохраняем текущую серию
        this.currentEpisode = episode;
        
        // Сохраняем в localStorage
        this.saveLastWatched();
    }

    saveLastWatched() {
        if (this.animeData && this.currentEpisode && this.currentVoice) {
            const storageKey = `lastWatched_${this.animeData.title.replace(/\s+/g, '_')}`;
            localStorage.setItem(storageKey, JSON.stringify({
                episode: this.currentEpisode.number,
                voice: this.currentVoice
            }));
        }
    }

    restoreLastWatched() {
        if (!this.animeData) return;

        const storageKey = `lastWatched_${this.animeData.title.replace(/\s+/g, '_')}`;
        const lastWatched = localStorage.getItem(storageKey);
        
        if (lastWatched) {
            try {
                const { episode, voice } = JSON.parse(lastWatched);
                
                // Восстанавливаем озвучку если она доступна
                if (voice && this.availableVoices.includes(voice)) {
                    this.currentVoice = voice;
                    const voiceBtn = document.querySelector(`[data-voice="${voice}"]`);
                    if (voiceBtn) {
                        voiceBtn.click(); // Это вызовет selectVoice и перегенерацию списка серий
                    }
                }
                
                // Восстанавливаем эпизод после небольшой задержки (чтобы список серий успел сгенерироваться)
                setTimeout(() => {
                    if (episode && this.animeData.voices[this.currentVoice]) {
                        const episodeData = this.animeData.voices[this.currentVoice].episodes.find(ep => ep.number == episode);
                        if (episodeData) {
                            this.selectEpisode(episodeData);
                        }
                    }
                }, 100);
                
            } catch (error) {
                console.error('Ошибка восстановления последнего просмотра:', error);
            }
        }
    }

    setupTheme() {
        // Используем функциональность из common.js
        // Убедимся, что тема применяется ко всем новым элементам
        const observer = new MutationObserver(() => {
            // При изменении DOM переприменяем стили к новым элементам
            this.applyThemeToNewElements();
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }

    applyThemeToNewElements() {
        // Дополнительная логика для применения темы к динамически созданным элементам
        // Обычно не требуется, так как CSS переменные автоматически применяются
    }

    setupEventListeners() {
        // Дополнительные обработчики событий если нужны
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.animePlayer = new AnimePlayer();
});