package com.example.pz3max

import android.app.Activity
import android.os.Bundle
import android.text.InputType
import android.widget.*

class LibraryActivity : Activity() {
    private lateinit var store: JsonStore
    private lateinit var books: MutableList<Book>
    private lateinit var readers: MutableList<Reader>
    private lateinit var listBox: LinearLayout
    private lateinit var bookSpinner: Spinner
    private lateinit var readerSpinner: Spinner
    private lateinit var stats: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        store = JsonStore(this)
        books = store.getBooks()
        readers = store.getReaders()

        val root = rootScroll("Рівень 4: Бібліотека")
        stats = TextView(this).apply { textSize = 16f }
        listBox = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }

        val bookTitle = input("Назва книги")
        val bookAuthor = input("Автор")
        val copiesInput = input("Кількість примірників", InputType.TYPE_CLASS_NUMBER)
        val readerName = input("Ім'я читача")
        bookSpinner = Spinner(this)
        readerSpinner = Spinner(this)

        root.addView(TextView(this).apply {
            text = "У бібліотеці можна додавати книги й читачів, видавати книги та повертати їх назад."
            textSize = 16f
        })
        root.addView(stats)
        root.addSpace()

        root.addView(TextView(this).apply { text = "Додати книгу"; textSize = 18f; bold() })
        root.addView(bookTitle)
        root.addView(bookAuthor)
        root.addView(copiesInput)
        root.addView(primaryButton("Додати книгу").apply {
            setOnClickListener {
                val title = bookTitle.text.toString().trim()
                val author = bookAuthor.text.toString().trim()
                val copies = copiesInput.text.toString().toIntOrNull()
                if (title.isEmpty() || author.isEmpty() || copies == null || copies < 1) {
                    Toast.makeText(this@LibraryActivity, "Заповніть книгу, автора і кількість", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
                books.add(Book((books.maxOfOrNull { it.id } ?: 0) + 1, title, author, copies))
                bookTitle.setText("")
                bookAuthor.setText("")
                copiesInput.setText("")
                saveAndRender()
            }
        })

        root.addSpace()
        root.addView(TextView(this).apply { text = "Додати читача"; textSize = 18f; bold() })
        root.addView(readerName)
        root.addView(primaryButton("Додати читача").apply {
            setOnClickListener {
                val name = readerName.text.toString().trim()
                if (name.isEmpty()) {
                    Toast.makeText(this@LibraryActivity, "Введіть ім'я читача", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
                readers.add(Reader((readers.maxOfOrNull { it.id } ?: 0) + 1, name))
                readerName.setText("")
                saveAndRender()
            }
        })

        root.addSpace()
        root.addView(TextView(this).apply { text = "Видача / повернення"; textSize = 18f; bold() })
        root.addView(bookSpinner)
        root.addView(readerSpinner)
        root.addView(primaryButton("Видати книгу").apply { setOnClickListener { lendBook() } })
        root.addView(primaryButton("Повернути книгу").apply { setOnClickListener { returnBook() } })
        root.addView(listBox)
        root.addView(primaryButton("Назад").apply { setOnClickListener { finish() } })
        render()
    }

    private fun lendBook() {
        val bookIndex = bookSpinner.selectedItemPosition
        val readerIndex = readerSpinner.selectedItemPosition

        if (books.isEmpty() || readers.isEmpty() || bookIndex !in books.indices || readerIndex !in readers.indices) {
            Toast.makeText(this, "Додайте хоча б одну книгу та одного читача", Toast.LENGTH_SHORT).show()
            return
        }

        val book = books[bookIndex]
        val reader = readers[readerIndex]

        if (book.availableCopies() <= 0) {
            Toast.makeText(this, "Немає доступних примірників", Toast.LENGTH_SHORT).show()
            return
        }

        if (reader.id in book.borrowedBy) {
            Toast.makeText(this, "Цей читач уже має цю книгу", Toast.LENGTH_SHORT).show()
            return
        }

        book.borrowedBy.add(reader.id)
        saveAndRender()
    }

    private fun returnBook() {
        val bookIndex = bookSpinner.selectedItemPosition
        val readerIndex = readerSpinner.selectedItemPosition

        if (books.isEmpty() || readers.isEmpty() || bookIndex !in books.indices || readerIndex !in readers.indices) {
            Toast.makeText(this, "Додайте хоча б одну книгу та одного читача", Toast.LENGTH_SHORT).show()
            return
        }

        val book = books[bookIndex]
        val reader = readers[readerIndex]

        if (!book.borrowedBy.remove(reader.id)) {
            Toast.makeText(this, "Цей читач не брав обрану книгу", Toast.LENGTH_SHORT).show()
            return
        }

        saveAndRender()
    }

    private fun saveAndRender() {
        store.saveBooks(books)
        store.saveReaders(readers)
        render()
    }

    private fun render() {
        updateSpinners()
        listBox.removeAllViews()

        val totalCopies = books.sumOf { it.totalCopies }
        val borrowed = books.sumOf { it.borrowedBy.size }
        stats.text = "Книг: ${books.size}. Примірників: $totalCopies. Видано: $borrowed. Читачів: ${readers.size}."

        if (books.isEmpty()) {
            listBox.addView(TextView(this).apply { text = "Книг поки немає. Додайте першу книгу." })
            return
        }

        books.forEach { book ->
            val card = card()
            card.addView(TextView(this).apply {
                text = book.title
                textSize = 19f
                bold()
            })
            card.addView(TextView(this).apply { text = "Автор: ${book.author}" })
            card.addView(TextView(this).apply { text = "Усього: ${book.totalCopies}. Доступно: ${book.availableCopies()}. Видано: ${book.borrowedBy.size}." })
            val readersText = book.borrowedBy.mapNotNull { id -> readers.find { it.id == id }?.name }
            card.addView(TextView(this).apply { text = "У читачів: ${if (readersText.isEmpty()) "немає" else readersText.joinToString()}" })
            listBox.addView(card)
        }
    }

    private fun updateSpinners() {
        val bookAdapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            if (books.isEmpty()) listOf("Немає книг") else books.map { "${it.title} (${it.availableCopies()}/${it.totalCopies})" }
        )
        bookAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        bookSpinner.adapter = bookAdapter

        val readerAdapter = ArrayAdapter(
            this,
            android.R.layout.simple_spinner_item,
            if (readers.isEmpty()) listOf("Немає читачів") else readers.map { it.name }
        )
        readerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        readerSpinner.adapter = readerAdapter
    }
}
