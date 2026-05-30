package com.example.pz3max

import android.app.Activity
import android.os.Bundle
import android.text.InputType
import android.widget.*

class MoviesActivity : Activity() {
    private lateinit var store: JsonStore
    private lateinit var movies: MutableList<Movie>
    private lateinit var listBox: LinearLayout
    private lateinit var filterInput: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        store = JsonStore(this)
        movies = store.getMovies()

        val root = rootScroll("Рівень 3: Фільми")
        val titleInput = input("Назва фільму")
        val genreInput = input("Жанр")
        val ratingInput = input("Рейтинг 0..10", InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_FLAG_DECIMAL)
        filterInput = input("Фільтр за жанром або назвою")
        listBox = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }

        root.addView(TextView(this).apply {
            text = "Кожен фільм має назву, жанр та рейтинг. Реалізовано додавання, фільтрацію, сортування та видалення."
            textSize = 16f
        })
        root.addView(titleInput)
        root.addView(genreInput)
        root.addView(ratingInput)
        root.addView(primaryButton("Додати фільм").apply {
            setOnClickListener {
                val title = titleInput.text.toString().trim()
                val genre = genreInput.text.toString().trim()
                val rating = ratingInput.text.toString().replace(',', '.').toDoubleOrNull()
                if (title.isEmpty() || genre.isEmpty() || rating == null || rating !in 0.0..10.0) {
                    Toast.makeText(this@MoviesActivity, "Заповніть назву, жанр і рейтинг 0..10", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
                movies.add(Movie((movies.maxOfOrNull { it.id } ?: 0) + 1, title, genre, rating))
                titleInput.setText("")
                genreInput.setText("")
                ratingInput.setText("")
                saveAndRender()
            }
        })
        root.addView(filterInput)
        root.addView(primaryButton("Застосувати фільтр").apply { setOnClickListener { render() } })
        root.addView(primaryButton("Сортувати за рейтингом").apply {
            setOnClickListener {
                movies.sortByDescending { it.rating }
                saveAndRender()
            }
        })
        root.addView(listBox)
        root.addView(primaryButton("Назад").apply { setOnClickListener { finish() } })
        render()
    }

    private fun saveAndRender() {
        store.saveMovies(movies)
        render()
    }

    private fun render() {
        listBox.removeAllViews()
        val query = filterInput.text.toString().trim().lowercase()
        val filtered = movies.filter {
            query.isEmpty() || it.title.lowercase().contains(query) || it.genre.lowercase().contains(query)
        }
        listBox.addView(TextView(this).apply {
            text = "Показано: ${filtered.size} з ${movies.size}"
            textSize = 16f
        })
        filtered.forEach { movie ->
            val card = card()
            card.addView(TextView(this).apply {
                text = movie.title
                textSize = 19f
                bold()
            })
            card.addView(TextView(this).apply { text = "Жанр: ${movie.genre}" })
            card.addView(TextView(this).apply { text = "Рейтинг: ${movie.rating}" })
            card.addView(primaryButton("Видалити").apply {
                setOnClickListener {
                    movies.removeAll { it.id == movie.id }
                    saveAndRender()
                }
            })
            listBox.addView(card)
        }
    }
}
