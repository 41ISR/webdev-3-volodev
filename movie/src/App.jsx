import { useState, useEffect } from 'react'
import './App.css'
import { nanoid } from "nanoid"

function App() {
  
  // Состояния приложения
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [filterGenre, setFilterGenre] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [isEditing, setIsEditing] = useState(false)
  const [currentMovie, setCurrentMovie] = useState(null)

  
  
  // Форма добавления/редактирования
  const [formData, setFormData] = useState({
    title: '',
    genre: 'драма',
    rating: 5,
    review: '',
    date: new Date()
  })

  
  // Жанры фильмов
  const genres = {
    'драма': 'Драма',
    'комедия': 'Комедия',
    'боевик': 'Боевик',
    'триллер': 'Триллер',
    'фантастика': 'Фантастика',
    'ужасы': 'Ужасы',
    'документальный': 'Документальный',
    'другое': 'Другое'
  }

  
  
  // Эффект для фильтрации и сортировки
  useEffect(() => {
    let result = [...movies]
    
  
  
    // Фильтрация по жанру
    if (filterGenre !== 'all') {
      result = result.filter(movie => movie.genre === filterGenre)
    }
    
  
    // Сортировка
    switch (sortOrder) {
      case 'rating-high':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'rating-low':
        result.sort((a, b) => a.rating - b.rating)
        break
      case 'newest':
        result.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.date) - new Date(b.date))
        break
      default:
        break
    }
    
    setFilteredMovies(result)
  }, [movies, filterGenre, sortOrder])

  
  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }))
  }

  
  // Добавление нового фильма
  const handleAddMovie = () => {
    if (!formData.title.trim()) {
      alert('Название фильма обязательно!')
      return
    }

    const newMovie = {
      id: nanoid(),
      ...formData,
      date: new Date()
    }

    setMovies(prev => [newMovie, ...prev])
    resetForm()
  }

  
  
  // Редактирование фильма
  const handleEditMovie = () => {
    if (!formData.title.trim()) {
      alert('Название фильма обязательно!')
      return
    }

    setMovies(prev => prev.map(movie => 
      movie.id === currentMovie.id 
        ? { ...movie, ...formData }
        : movie
    ))

    setIsEditing(false)
    setCurrentMovie(null)
    resetForm()
  }

  
  
  // Удаление фильма
  const handleDeleteMovie = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот фильм?')) {
      setMovies(prev => prev.filter(movie => movie.id !== id))
    }
  }

  
  
  // Начало редактирования
  const startEditMovie = (movie) => {
    setFormData({
      title: movie.title,
      genre: movie.genre,
      rating: movie.rating,
      review: movie.review,
      date: movie.date
    })
    setCurrentMovie(movie)
    setIsEditing(true)
  }

  
  // Сброс формы
  const resetForm = () => {
    setFormData({
      title: '',
      genre: 'драма',
      rating: 5,
      review: '',
      date: new Date()
    })
  }

  
  
  // Отмена редактирования
  const handleCancelEdit = () => {
    setIsEditing(false)
    setCurrentMovie(null)
    resetForm()
  }

  
  
  // Получение класса для оценки
  const getRatingClass = (rating) => {
    if (rating >= 9) return 'rating-excellent'
    if (rating >= 7) return 'rating-good'
    if (rating >= 5) return 'rating-average'
    return 'rating-poor'
  }

  
  
  // Обрезка текста обзора
  const truncateReview = (text) => {
    return text.length > 100 ? text.substring(0, 100) + '...' : text
  }

  
  // делает даты
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  
  // название проекта
  return (
    <div className="movie-tracker">
      <header className="header">
        <h1>Movie Tracker</h1>
        <p>Отслеживайте просмотренные фильмы с оценками и обзорами</p>
      </header>

 
 
      {/* Форма добавления/редактирования */}
      <div className="movie-form">
        <h2>{isEditing ? 'Редактировать фильм' : 'Добавить новый фильм'}</h2>
        
        <div className="form-group">
          <label htmlFor="title">Название фильма *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Введите название фильма"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="genre">Жанр</label>
          <select
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
          >
            {Object.entries(genres).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="rating">
            Оценка: <span className={`rating-value ${getRatingClass(formData.rating)}`}>
              {formData.rating}/10
            </span>
          </label>
          <input
            type="range"
            id="rating"
            name="rating"
            min="1"
            max="10"
            value={formData.rating}
            onChange={handleInputChange}
          />
          <div className="rating-slider-labels">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="review">Краткий обзор (до 500 символов)</label>
          <textarea
            id="review"
            name="review"
            value={formData.review}
            onChange={handleInputChange}
            placeholder="Напишите ваш обзор..."
            maxLength="500"
            rows="4"
          />
          <div className="char-count">{formData.review.length}/500</div>
        </div>

        <div className="form-actions">
          {isEditing ? (
            <>
              <button type="button" onClick={handleEditMovie} className="btn-primary">
                Сохранить изменения
              </button>
              <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                Отмена
              </button>
            </>
          ) : (
            <button type="button" onClick={handleAddMovie} className="btn-primary">
              Добавить фильм
            </button>
          )}
        </div>
      </div>

      
      
      
      {/* вкладка фильтра */}
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="genre-filter">Фильтр по жанру:</label>
          <select
            id="genre-filter"
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
          >
            <option value="all">Все жанры</option>
            {Object.entries(genres).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-order">Сортировка:</label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="rating-high">Оценка (высокая → низкая)</option>
            <option value="rating-low">Оценка (низкая → высокая)</option>
          </select>
        </div>
      </div>

      
      
      
      {/* здесь должен быть список фильмов */}
      <div className="movies-list">
        <h2>Мои фильмы ({filteredMovies.length})</h2>
        
        {filteredMovies.length === 0 ? (
          <div className="empty-state">
            <p>Нет фильмов для отображения. Добавьте первый фильм!</p>
          </div>
        ) : (
          <div className="movies-grid">
            {filteredMovies.map(movie => (
              <div key={movie.id} className="movie-card">
                <div className="movie-header">
                  <h3 className="movie-title">{movie.title}</h3>
                  <span className="movie-genre">{genres[movie.genre]}</span>
                </div>
                
                <div className={`movie-rating ${getRatingClass(movie.rating)}`}>
                   {movie.rating}/10
                </div>
                
                <div className="movie-review">
                  <p>{truncateReview(movie.review) || 'Обзор отсутствует'}</p>
                </div>
                
                <div className="movie-footer">
                  <span className="movie-date">{formatDate(movie.date)}</span>
                  <div className="movie-actions">
                    <button 
                      onClick={() => startEditMovie(movie)}
                      className="btn-edit"
                      title="Редактировать"
                    >
                  
                    </button>
                    <button 
                      onClick={() => handleDeleteMovie(movie.id)}
                      className="btn-delete"
                      title="Удалить"
                    >
                      
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App