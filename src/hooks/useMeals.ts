import { useState, useEffect } from 'react'
import type { Meal } from '../types'

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>(() => {
    const stored = localStorage.getItem('nutriai_meals')
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem('nutriai_meals', JSON.stringify(meals))
  }, [meals])

  const addMeal = (meal: Omit<Meal, 'id'>) => {
    const newMeal: Meal = { ...meal, id: Date.now().toString() }
    setMeals((prev) => [newMeal, ...prev])
  }

  const removeMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id))
  }

  const getTodayMeals = () => {
    const today = new Date().toISOString().split('T')[0]
    return meals.filter((m) => m.date === today)
  }

  const getDayMeals = (date: string) => {
    return meals.filter((m) => m.date === date)
  }

  return { meals, addMeal, removeMeal, getTodayMeals, getDayMeals }
}
