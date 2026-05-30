package com.example.pz3max

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.TextView

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val root = rootScroll("ПЗ3 Kotlin Max")

        root.addView(TextView(this).apply {
            text = "Це не статичний екран, а набір інтерактивних модулів. Кожен модуль відповідає окремому рівню завдання."
            textSize = 16f
        })
        root.addSpace()

        root.addView(primaryButton("Рівень 1: привітання та Toast").apply {
            setOnClickListener { startActivity(Intent(this@MainActivity, GreetingActivity::class.java)) }
        })
        root.addView(primaryButton("Рівень 2: ToDo зі збереженням").apply {
            setOnClickListener { startActivity(Intent(this@MainActivity, TodoActivity::class.java)) }
        })
        root.addView(primaryButton("Рівень 3: список фільмів").apply {
            setOnClickListener { startActivity(Intent(this@MainActivity, MoviesActivity::class.java)) }
        })
        root.addView(primaryButton("Рівень 4: бібліотека").apply {
            setOnClickListener { startActivity(Intent(this@MainActivity, LibraryActivity::class.java)) }
        })
    }
}
