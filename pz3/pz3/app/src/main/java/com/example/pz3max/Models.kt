package com.example.pz3max

data class TaskItem(
    val id: Int,
    var title: String,
    var done: Boolean = false
)

data class Movie(
    val id: Int,
    var title: String,
    var genre: String,
    var rating: Double
)

data class Book(
    val id: Int,
    var title: String,
    var author: String,
    var totalCopies: Int,
    val borrowedBy: MutableList<Int> = mutableListOf()
) {
    fun availableCopies(): Int = totalCopies - borrowedBy.size
}

data class Reader(
    val id: Int,
    var name: String
)
