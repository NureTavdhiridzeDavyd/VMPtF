package com.example.pz3max

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

class JsonStore(context: Context) {
    private val prefs = context.getSharedPreferences("pz3_storage", Context.MODE_PRIVATE)

    fun getTasks(): MutableList<TaskItem> = try {
        val array = JSONArray(prefs.getString("tasks", "[]") ?: "[]")
        val result = mutableListOf<TaskItem>()
        for (i in 0 until array.length()) {
            val obj = array.optJSONObject(i) ?: continue
            result.add(
                TaskItem(
                    id = obj.optInt("id", i + 1),
                    title = obj.optString("title", "Завдання ${i + 1}"),
                    done = obj.optBoolean("done", false)
                )
            )
        }
        result
    } catch (e: Exception) {
        mutableListOf()
    }

    fun saveTasks(tasks: List<TaskItem>) {
        val array = JSONArray()
        tasks.forEach {
            array.put(JSONObject().put("id", it.id).put("title", it.title).put("done", it.done))
        }
        prefs.edit().putString("tasks", array.toString()).apply()
    }

    fun getMovies(): MutableList<Movie> {
        val saved = prefs.getString("movies", null)
        if (saved == null) {
            val demo = mutableListOf(
                Movie(1, "Interstellar", "Sci-Fi", 8.7),
                Movie(2, "The Dark Knight", "Action", 9.0),
                Movie(3, "The Grand Budapest Hotel", "Comedy", 8.1)
            )
            saveMovies(demo)
            return demo
        }

        return try {
            val array = JSONArray(saved)
            val result = mutableListOf<Movie>()
            for (i in 0 until array.length()) {
                val obj = array.optJSONObject(i) ?: continue
                result.add(
                    Movie(
                        id = obj.optInt("id", i + 1),
                        title = obj.optString("title", "Фільм ${i + 1}"),
                        genre = obj.optString("genre", "Невідомий жанр"),
                        rating = obj.optDouble("rating", 0.0).coerceIn(0.0, 10.0)
                    )
                )
            }
            result
        } catch (e: Exception) {
            prefs.edit().remove("movies").apply()
            getMovies()
        }
    }

    fun saveMovies(movies: List<Movie>) {
        val array = JSONArray()
        movies.forEach {
            array.put(JSONObject().put("id", it.id).put("title", it.title).put("genre", it.genre).put("rating", it.rating))
        }
        prefs.edit().putString("movies", array.toString()).apply()
    }

    fun getReaders(): MutableList<Reader> {
        val saved = prefs.getString("readers", null)
        if (saved == null) {
            val demo = mutableListOf(Reader(1, "Давид"), Reader(2, "Марко"))
            saveReaders(demo)
            return demo
        }

        return try {
            val array = JSONArray(saved)
            val result = mutableListOf<Reader>()
            for (i in 0 until array.length()) {
                val obj = array.optJSONObject(i) ?: continue
                result.add(Reader(obj.optInt("id", i + 1), obj.optString("name", "Читач ${i + 1}")))
            }
            result
        } catch (e: Exception) {
            prefs.edit().remove("readers").apply()
            getReaders()
        }
    }

    fun saveReaders(readers: List<Reader>) {
        val array = JSONArray()
        readers.forEach { array.put(JSONObject().put("id", it.id).put("name", it.name)) }
        prefs.edit().putString("readers", array.toString()).apply()
    }

    fun getBooks(): MutableList<Book> {
        val saved = prefs.getString("books", null)
        if (saved == null) {
            val demo = mutableListOf(
                Book(1, "Kotlin для Android", "JetBrains Guide", 3),
                Book(2, "Clean Code", "Robert C. Martin", 2),
                Book(3, "Android UI", "Google Samples", 1)
            )
            saveBooks(demo)
            return demo
        }

        return try {
            val array = JSONArray(saved)
            val result = mutableListOf<Book>()
            for (i in 0 until array.length()) {
                val obj = array.optJSONObject(i) ?: continue
                val borrowed = mutableListOf<Int>()
                val borrowedArray = obj.optJSONArray("borrowedBy") ?: JSONArray()
                for (j in 0 until borrowedArray.length()) {
                    val readerId = borrowedArray.optInt(j, -1)
                    if (readerId > 0) borrowed.add(readerId)
                }

                val totalCopies = obj.optInt("totalCopies", obj.optInt("copies", 1)).coerceAtLeast(1)
                result.add(
                    Book(
                        id = obj.optInt("id", i + 1),
                        title = obj.optString("title", "Книга ${i + 1}"),
                        author = obj.optString("author", "Невідомий автор"),
                        totalCopies = totalCopies,
                        borrowedBy = borrowed.distinct().take(totalCopies).toMutableList()
                    )
                )
            }
            result
        } catch (e: Exception) {
            prefs.edit().remove("books").apply()
            getBooks()
        }
    }

    fun saveBooks(books: List<Book>) {
        val array = JSONArray()
        books.forEach {
            array.put(
                JSONObject()
                    .put("id", it.id)
                    .put("title", it.title)
                    .put("author", it.author)
                    .put("totalCopies", it.totalCopies)
                    .put("borrowedBy", JSONArray(it.borrowedBy))
            )
        }
        prefs.edit().putString("books", array.toString()).apply()
    }
}
