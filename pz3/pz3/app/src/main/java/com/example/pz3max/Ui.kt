package com.example.pz3max

import android.app.Activity
import android.graphics.Color
import android.graphics.Typeface
import android.view.View
import android.widget.*

fun Activity.rootScroll(title: String): LinearLayout {
    val scroll = ScrollView(this)
    val root = LinearLayout(this).apply {
        orientation = LinearLayout.VERTICAL
        setPadding(32, 36, 32, 36)
    }
    scroll.addView(root)
    root.addView(TextView(this).apply {
        text = title
        textSize = 26f
        setTypeface(null, Typeface.BOLD)
        setTextColor(Color.rgb(15, 23, 42))
    })
    root.addView(TextView(this).apply {
        text = "ПЗ3. Мобільна розробка на Android з Kotlin"
        textSize = 14f
        setTextColor(Color.rgb(71, 85, 105))
        setPadding(0, 8, 0, 24)
    })
    setContentView(scroll)
    return root
}

fun Activity.input(hintText: String, inputKind: Int = android.text.InputType.TYPE_CLASS_TEXT): EditText = EditText(this).apply {
    hint = hintText
    inputType = inputKind
    setSingleLine(true)
}

fun Activity.primaryButton(label: String): Button = Button(this).apply {
    text = label
    isAllCaps = false
}

fun Activity.card(): LinearLayout = LinearLayout(this).apply {
    orientation = LinearLayout.VERTICAL
    setPadding(24, 20, 24, 20)
    background = android.graphics.drawable.GradientDrawable().apply {
        setColor(Color.WHITE)
        cornerRadius = 22f
        setStroke(2, Color.rgb(226, 232, 240))
    }
    val params = LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT)
    params.setMargins(0, 10, 0, 10)
    layoutParams = params
}

fun TextView.bold() { setTypeface(null, Typeface.BOLD) }

fun LinearLayout.addSpace(height: Int = 16) { addView(Space(context).apply { layoutParams = LinearLayout.LayoutParams(1, height) }) }
