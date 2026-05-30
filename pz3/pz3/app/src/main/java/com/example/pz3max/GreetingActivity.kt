package com.example.pz3max

import android.app.Activity
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast

class GreetingActivity : Activity() {
    private var clicks = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val root = rootScroll("Рівень 1")
        val counterText = TextView(this).apply {
            text = "Кнопку ще не натискали"
            textSize = 17f
        }

        root.addView(TextView(this).apply {
            text = "Завдання: реалізувати кнопку, при натисканні на яку виводиться повідомлення."
            textSize = 16f
        })
        root.addSpace()
        root.addView(primaryButton("Показати привітання").apply {
            setOnClickListener {
                clicks++
                Toast.makeText(this@GreetingActivity, "Вітаємо з першим додатком на Kotlin!", Toast.LENGTH_LONG).show()
                counterText.text = "Кнопку натиснуто: $clicks раз(и)"
            }
        })
        root.addView(counterText)
        root.addView(primaryButton("Назад").apply { setOnClickListener { finish() } })
    }
}
