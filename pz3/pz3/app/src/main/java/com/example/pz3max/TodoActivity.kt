package com.example.pz3max

import android.app.Activity
import android.os.Bundle
import android.widget.*

class TodoActivity : Activity() {
    private lateinit var store: JsonStore
    private lateinit var tasks: MutableList<TaskItem>
    private lateinit var listBox: LinearLayout
    private lateinit var stats: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        store = JsonStore(this)
        tasks = store.getTasks()

        val root = rootScroll("Рівень 2: ToDo")
        val taskInput = input("Нове завдання")
        stats = TextView(this).apply { textSize = 16f }
        listBox = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }

        root.addView(TextView(this).apply {
            text = "Користувач може додавати завдання, відмічати їх виконаними та видаляти. Дані зберігаються локально."
            textSize = 16f
        })
        root.addView(taskInput)
        root.addView(primaryButton("Додати завдання").apply {
            setOnClickListener {
                val title = taskInput.text.toString().trim()
                if (title.isEmpty()) {
                    Toast.makeText(this@TodoActivity, "Введіть текст завдання", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
                val nextId = (tasks.maxOfOrNull { it.id } ?: 0) + 1
                tasks.add(TaskItem(nextId, title, false))
                taskInput.setText("")
                saveAndRender()
            }
        })
        root.addView(stats)
        root.addView(listBox)
        root.addView(primaryButton("Назад").apply { setOnClickListener { finish() } })
        render()
    }

    private fun saveAndRender() {
        store.saveTasks(tasks)
        render()
    }

    private fun render() {
        listBox.removeAllViews()
        val done = tasks.count { it.done }
        stats.text = "Усього: ${tasks.size}. Виконано: $done. Активні: ${tasks.size - done}."
        if (tasks.isEmpty()) {
            listBox.addView(TextView(this).apply { text = "Список поки порожній." })
            return
        }
        tasks.forEach { task ->
            val card = card()
            val checkbox = CheckBox(this).apply {
                text = task.title
                textSize = 17f
                isChecked = task.done
                setOnCheckedChangeListener { _, checked ->
                    task.done = checked
                    saveAndRender()
                }
            }
            val delete = primaryButton("Видалити").apply {
                setOnClickListener {
                    tasks.removeAll { it.id == task.id }
                    saveAndRender()
                }
            }
            card.addView(checkbox)
            card.addView(delete)
            listBox.addView(card)
        }
    }
}
