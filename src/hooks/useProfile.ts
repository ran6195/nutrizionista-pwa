import { useState, useEffect } from 'react'
import type { UserProfile } from '../types'

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  age: 30,
  weight: 70,
  height: 170,
  goal: 'mantenere_peso',
  activityLevel: 'moderato',
  targetCalories: 2000,
  targetProtein: 75,
  targetCarbs: 250,
  targetFat: 67,
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const stored = localStorage.getItem('nutriai_profile')
    return stored ? JSON.parse(stored) : DEFAULT_PROFILE
  })

  useEffect(() => {
    localStorage.setItem('nutriai_profile', JSON.stringify(profile))
  }, [profile])

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
  }

  return { profile, updateProfile }
}
