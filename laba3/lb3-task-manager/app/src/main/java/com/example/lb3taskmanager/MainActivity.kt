package com.example.lb3taskmanager

import android.app.Activity
import android.app.AlertDialog
import android.content.Context
import android.graphics.Color
import android.os.Bundle
import android.text.InputType
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.*
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

class MainActivity : Activity() {
    private val prefs by lazy { getSharedPreferences("lb3_task_manager_store", Context.MODE_PRIVATE) }
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.US)
    private var currentUser: User? = null
    private var tasks = mutableListOf<Task>()
    private var users = mutableListOf<User>()

    data class User(
        val id: Int,
        var name: String,
        var email: String,
        var password: String,
        var role: String
    )

    data class Task(
        val id: Int,
        var title: String,
        var description: String,
        var status: String,
        var priority: String,
        var deadline: String,
        var userId: Int,
        var createdAt: String
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        seedDataIfNeeded()
        loadData()
        showLoginScreen()
    }

    private fun seedDataIfNeeded() {
        if (prefs.getBoolean("seeded", false)) return
        val initialUsers = JSONArray()
            .put(userToJson(User(1, "Адміністратор", "admin@taskmanager.local", "admin123", "admin")))
            .put(userToJson(User(2, "Davyd Tavdhiridze", "davyd.tavdhiridze@nure.ua", "user123", "user")))

        val today = Calendar.getInstance()
        val tomorrow = Calendar.getInstance().apply { add(Calendar.DAY_OF_YEAR, 1) }
        val afterTwoDays = Calendar.getInstance().apply { add(Calendar.DAY_OF_YEAR, 2) }
        val past = Calendar.getInstance().apply { add(Calendar.DAY_OF_YEAR, -2) }

        val initialTasks = JSONArray()
            .put(taskToJson(Task(1, "Підготувати звіт до лабораторної роботи", "Описати реалізовану систему управління задачами та зробити скріншоти.", "in_progress", "high", dateFormat.format(tomorrow.time), 2, dateFormat.format(today.time))))
            .put(taskToJson(Task(2, "Перевірити виконані завдання", "Позначити завершені задачі та перевірити статистику.", "done", "medium", dateFormat.format(today.time), 2, dateFormat.format(today.time))))
            .put(taskToJson(Task(3, "Провести демонстрацію ролі Admin", "Показати, що адміністратор бачить усі задачі та може призначати задачі користувачам.", "new", "medium", dateFormat.format(afterTwoDays.time), 1, dateFormat.format(today.time))))
            .put(taskToJson(Task(4, "Прострочена тестова задача", "Задача потрібна для демонстрації прострочених дедлайнів у нагадуваннях.", "in_progress", "low", dateFormat.format(past.time), 2, dateFormat.format(past.time))))

        prefs.edit()
            .putString("users", initialUsers.toString())
            .putString("tasks", initialTasks.toString())
            .putBoolean("seeded", true)
            .apply()
    }

    private fun loadData() {
        users = jsonToUsers(prefs.getString("users", "[]") ?: "[]").toMutableList()
        tasks = jsonToTasks(prefs.getString("tasks", "[]") ?: "[]").toMutableList()
    }

    private fun saveData() {
        prefs.edit()
            .putString("users", JSONArray(users.map { userToJson(it) }).toString())
            .putString("tasks", JSONArray(tasks.map { taskToJson(it) }).toString())
            .apply()
    }

    private fun userToJson(user: User) = JSONObject()
        .put("id", user.id)
        .put("name", user.name)
        .put("email", user.email)
        .put("password", user.password)
        .put("role", user.role)

    private fun taskToJson(task: Task) = JSONObject()
        .put("id", task.id)
        .put("title", task.title)
        .put("description", task.description)
        .put("status", task.status)
        .put("priority", task.priority)
        .put("deadline", task.deadline)
        .put("userId", task.userId)
        .put("createdAt", task.createdAt)

    private fun jsonToUsers(raw: String): List<User> {
        val arr = JSONArray(raw)
        return (0 until arr.length()).map { i ->
            val o = arr.getJSONObject(i)
            User(o.getInt("id"), o.getString("name"), o.getString("email"), o.getString("password"), o.getString("role"))
        }
    }

    private fun jsonToTasks(raw: String): List<Task> {
        val arr = JSONArray(raw)
        return (0 until arr.length()).map { i ->
            val o = arr.getJSONObject(i)
            Task(o.getInt("id"), o.getString("title"), o.optString("description"), o.getString("status"), o.getString("priority"), o.getString("deadline"), o.getInt("userId"), o.optString("createdAt"))
        }
    }

    private fun screen(title: String, subtitle: String? = null): LinearLayout {
        val scroll = ScrollView(this)
        scroll.setBackgroundColor(Color.rgb(235, 242, 250))
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(18), dp(18), dp(18), dp(24))
        }
        scroll.addView(root)
        root.addView(TextView(this).apply {
            text = title
            textSize = 26f
            setTextColor(Color.rgb(15, 23, 42))
            setTypeface(null, 1)
        })
        if (subtitle != null) root.addView(TextView(this).apply {
            text = subtitle
            textSize = 14f
            setTextColor(Color.rgb(71, 85, 105))
            setPadding(0, dp(8), 0, dp(8))
        })
        setContentView(scroll)
        return root
    }

    private fun showLoginScreen() {
        val root = screen("Task Manager LB3", "Мобільний застосунок на Kotlin: задачі, ролі доступу, планування та нагадування.")
        val card = card()
        val email = edit("Email", "davyd.tavdhiridze@nure.ua")
        val password = edit("Пароль", "user123", true)
        card.addView(label("Вхід у систему"))
        card.addView(email)
        card.addView(password)
        card.addView(button("Увійти") {
            val found = users.firstOrNull { it.email.equals(email.text.toString().trim(), true) && it.password == password.text.toString() }
            if (found == null) toast("Неправильний email або пароль") else {
                currentUser = found
                showTasksScreen()
            }
        })
        card.addView(button("Зареєструвати нового User") {
            registerUser(email.text.toString().trim(), password.text.toString())
        })
        root.addView(card)
        val info = card()
        info.addView(label("Тестові акаунти"))
        info.addView(text("User: davyd.tavdhiridze@nure.ua / user123"))
        info.addView(text("Admin: admin@taskmanager.local / admin123"))
        root.addView(info)
    }

    private fun registerUser(email: String, password: String) {
        if (!email.contains("@") || password.length < 4) {
            toast("Введи коректний email і пароль від 4 символів")
            return
        }
        if (users.any { it.email.equals(email, true) }) {
            toast("Користувач із таким email уже існує")
            return
        }
        val newId = (users.maxOfOrNull { it.id } ?: 0) + 1
        users.add(User(newId, email.substringBefore("@"), email, password, "user"))
        saveData()
        toast("Користувача зареєстровано. Тепер можна увійти")
    }

    private fun addNavigation(root: LinearLayout, active: String) {
        val row = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER; setPadding(0, dp(8), 0, dp(8)) }
        row.addView(navButton("Задачі", active == "tasks") { showTasksScreen() })
        row.addView(navButton("Додати", active == "add") { showTaskForm(null) })
        row.addView(navButton("Нагадування", active == "reminders") { showRemindersScreen() })
        root.addView(row)
    }

    private fun showTasksScreen() {
        val user = currentUser ?: return showLoginScreen()
        val root = screen("Задачі", "${user.name} • роль: ${if (user.role == "admin") "Admin" else "User"}")
        addNavigation(root, "tasks")
        root.addView(button("Вийти з акаунта") { currentUser = null; showLoginScreen() })
        val visibleTasks = getVisibleTasks()
        if (visibleTasks.isEmpty()) root.addView(card().apply { addView(text("Список задач порожній.")) })
        visibleTasks.sortedWith(compareBy<Task> { it.deadline }.thenBy { it.status }).forEach { task -> root.addView(taskCard(task)) }
    }

    private fun taskCard(task: Task): View {
        val owner = users.firstOrNull { it.id == task.userId }
        val c = card()
        c.addView(label(task.title))
        c.addView(text("Статус: ${statusUa(task.status)} • Пріоритет: ${priorityUa(task.priority)}"))
        c.addView(text("Дедлайн: ${task.deadline} ${deadlineMark(task)}"))
        c.addView(text("Виконавець: ${owner?.name ?: "невідомо"} (${owner?.email ?: "-"})"))
        val row = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
        row.addView(smallButton("Деталі") { showTaskDetails(task) })
        row.addView(smallButton("Виконано") { task.status = "done"; saveData(); showTasksScreen() })
        row.addView(smallButton("Редагувати") { showTaskForm(task) })
        row.addView(smallButton("Видалити") { deleteTask(task) })
        c.addView(row)
        return c
    }

    private fun showTaskDetails(task: Task) {
        val owner = users.firstOrNull { it.id == task.userId }
        AlertDialog.Builder(this)
            .setTitle(task.title)
            .setMessage("Опис: ${task.description}\n\nСтатус: ${statusUa(task.status)}\nПріоритет: ${priorityUa(task.priority)}\nДедлайн: ${task.deadline}\nСтворено: ${task.createdAt}\nВиконавець: ${owner?.name} (${owner?.email})")
            .setPositiveButton("OK", null)
            .show()
    }

    private fun showTaskForm(task: Task?) {
        val root = screen(if (task == null) "Додавання задачі" else "Редагування задачі")
        addNavigation(root, "add")
        val c = card()
        val title = edit("Назва", task?.title ?: "")
        val description = edit("Опис", task?.description ?: "")
        val deadline = edit("Дедлайн yyyy-MM-dd", task?.deadline ?: dateFormat.format(Date()))
        val statuses = arrayOf("new", "in_progress", "done")
        val priorities = arrayOf("low", "medium", "high")
        val statusSpinner = spinner(statuses.map { statusUa(it) }, statuses.indexOf(task?.status ?: "new"))
        val prioritySpinner = spinner(priorities.map { priorityUa(it) }, priorities.indexOf(task?.priority ?: "medium"))
        val availableUsers = if (currentUser?.role == "admin") users else users.filter { it.id == currentUser?.id }
        val userSpinner = spinner(availableUsers.map { "${it.name} (${it.email})" }, availableUsers.indexOfFirst { it.id == (task?.userId ?: currentUser?.id) }.coerceAtLeast(0))
        c.addView(title)
        c.addView(description)
        c.addView(deadline)
        c.addView(text("Статус")); c.addView(statusSpinner)
        c.addView(text("Пріоритет")); c.addView(prioritySpinner)
        c.addView(text("Виконавець")); c.addView(userSpinner)
        c.addView(button("Зберегти") {
            val titleValue = title.text.toString().trim()
            val deadlineValue = deadline.text.toString().trim()
            if (titleValue.isEmpty() || parseDate(deadlineValue) == null) {
                toast("Заповни назву і дату у форматі yyyy-MM-dd")
                return@button
            }
            val selectedUser = availableUsers[userSpinner.selectedItemPosition]
            if (task == null) {
                val newId = (tasks.maxOfOrNull { it.id } ?: 0) + 1
                tasks.add(Task(newId, titleValue, description.text.toString().trim(), statuses[statusSpinner.selectedItemPosition], priorities[prioritySpinner.selectedItemPosition], deadlineValue, selectedUser.id, dateFormat.format(Date())))
            } else {
                task.title = titleValue
                task.description = description.text.toString().trim()
                task.deadline = deadlineValue
                task.status = statuses[statusSpinner.selectedItemPosition]
                task.priority = priorities[prioritySpinner.selectedItemPosition]
                task.userId = selectedUser.id
            }
            saveData()
            showTasksScreen()
        })
        root.addView(c)
    }

    private fun deleteTask(task: Task) {
        AlertDialog.Builder(this)
            .setTitle("Видалити задачу?")
            .setMessage(task.title)
            .setNegativeButton("Скасувати", null)
            .setPositiveButton("Видалити") { _, _ -> tasks.removeAll { it.id == task.id }; saveData(); showTasksScreen() }
            .show()
    }

    private fun showRemindersScreen() {
        val root = screen("Планування та нагадування", "Задачі з близьким дедлайном і прострочені задачі визначаються автоматично за датою deadline.")
        addNavigation(root, "reminders")
        val dueSoon = getVisibleTasks().filter { isDueSoon(it) && it.status != "done" }.sortedBy { it.deadline }
        val overdue = getVisibleTasks().filter { isOverdue(it) && it.status != "done" }.sortedBy { it.deadline }
        val dueCard = card(); dueCard.addView(label("Близький дедлайн"))
        if (dueSoon.isEmpty()) dueCard.addView(text("Немає задач з близьким дедлайном.")) else dueSoon.forEach { dueCard.addView(text("• ${it.title} — ${it.deadline} — ${userEmail(it.userId)}")) }
        root.addView(dueCard)
        val overdueCard = card(); overdueCard.addView(label("Прострочені задачі"))
        if (overdue.isEmpty()) overdueCard.addView(text("Прострочених задач немає.")) else overdue.forEach { overdueCard.addView(text("• ${it.title} — ${it.deadline} — ${userEmail(it.userId)}")) }
        root.addView(overdueCard)
    }

    private fun getVisibleTasks(): List<Task> {
        val user = currentUser ?: return emptyList()
        return if (user.role == "admin") tasks else tasks.filter { it.userId == user.id }
    }

    private fun isOverdue(task: Task): Boolean {
        val deadline = parseDate(task.deadline) ?: return false
        return deadline.before(startOfToday())
    }

    private fun isDueSoon(task: Task): Boolean {
        val deadline = parseDate(task.deadline) ?: return false
        val today = startOfToday()
        val next3 = Calendar.getInstance().apply { time = today; add(Calendar.DAY_OF_YEAR, 3) }.time
        return !deadline.before(today) && !deadline.after(next3)
    }

    private fun deadlineMark(task: Task): String = when {
        task.status == "done" -> "✅"
        isOverdue(task) -> "⚠ прострочено"
        isDueSoon(task) -> "🔔 скоро"
        else -> ""
    }

    private fun parseDate(raw: String): Date? = try { dateFormat.parse(raw) } catch (_: Exception) { null }
    private fun startOfToday(): Date = Calendar.getInstance().apply { set(Calendar.HOUR_OF_DAY, 0); set(Calendar.MINUTE, 0); set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0) }.time
    private fun userEmail(userId: Int) = users.firstOrNull { it.id == userId }?.email ?: "невідомо"
    private fun statusUa(status: String) = when (status) { "new" -> "Нова"; "in_progress" -> "В роботі"; "done" -> "Виконано"; else -> status }
    private fun priorityUa(priority: String) = when (priority) { "low" -> "Низький"; "medium" -> "Середній"; "high" -> "Високий"; else -> priority }

    private fun card(): LinearLayout = LinearLayout(this).apply {
        orientation = LinearLayout.VERTICAL
        setPadding(dp(16), dp(16), dp(16), dp(16))
        setBackgroundColor(Color.WHITE)
        val lp = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        lp.setMargins(0, dp(10), 0, dp(10))
        layoutParams = lp
    }

    private fun label(value: String) = TextView(this).apply { text = value; textSize = 18f; setTextColor(Color.rgb(15, 23, 42)); setTypeface(null, 1); setPadding(0, 0, 0, dp(8)) }
    private fun text(value: String) = TextView(this).apply { text = value; textSize = 15f; setTextColor(Color.rgb(30, 41, 59)); setPadding(0, dp(3), 0, dp(3)) }
    private fun edit(hintValue: String, value: String = "", password: Boolean = false) = EditText(this).apply {
        hint = hintValue
        setText(value)
        textSize = 15f
        inputType = if (password) InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD else InputType.TYPE_CLASS_TEXT
        setSingleLine(!hintValue.contains("Опис"))
    }
    private fun spinner(values: List<String>, selected: Int = 0) = Spinner(this).apply {
        adapter = ArrayAdapter(this@MainActivity, android.R.layout.simple_spinner_dropdown_item, values)
        setSelection(selected.coerceIn(0, values.lastIndex.coerceAtLeast(0)))
    }
    private fun button(title: String, action: () -> Unit) = Button(this).apply { text = title; setOnClickListener { action() } }
    private fun navButton(title: String, active: Boolean, action: () -> Unit) = Button(this).apply {
        text = title
        textSize = 12f
        isAllCaps = false
        setTextColor(if (active) Color.WHITE else Color.rgb(37, 99, 235))
        setBackgroundColor(if (active) Color.rgb(37, 99, 235) else Color.WHITE)
        val lp = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
        lp.setMargins(dp(2), 0, dp(2), 0)
        layoutParams = lp
        setOnClickListener { action() }
    }
    private fun smallButton(title: String, action: () -> Unit) = Button(this).apply { text = title; textSize = 11f; isAllCaps = false; setOnClickListener { action() }; layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f) }
    private fun toast(message: String) = Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    private fun dp(v: Int): Int = (v * resources.displayMetrics.density).toInt()
}
