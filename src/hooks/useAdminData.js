// src/hooks/useAdminData.js
// Reads and writes the full wizard data object to Firestore admin/wizardData doc.

import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import {
  BUNKER_STYLES as DEFAULT_STYLES,
  COST_FACTORS as DEFAULT_FACTORS,
  WORK_PHASES as DEFAULT_PHASES,
} from '../data/bunkerData'

export function useAdminData() {
  const [styles, setStyles] = useState(null)
  const [costFactors, setCostFactors] = useState(null)
  const [workPhases, setWorkPhases] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'admin', 'wizardData'))
        if (snap.exists()) {
          const data = snap.data()
          setStyles(data.styles ?? DEFAULT_STYLES)
          setCostFactors(data.costFactors ?? DEFAULT_FACTORS)
          setWorkPhases(data.workPhases ?? DEFAULT_PHASES)
        } else {
          // First time — seed with defaults
          setStyles(DEFAULT_STYLES)
          setCostFactors(DEFAULT_FACTORS)
          setWorkPhases(DEFAULT_PHASES)
        }
      } catch (err) {
        console.error('Admin load error:', err)
        setError('Failed to load data from Firestore. Check your Firebase config.')
        setStyles(DEFAULT_STYLES)
        setCostFactors(DEFAULT_FACTORS)
        setWorkPhases(DEFAULT_PHASES)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const save = async (patch = {}) => {
    setSaving(true)
    setError(null)
    const payload = {
      styles: patch.styles ?? styles,
      costFactors: patch.costFactors ?? costFactors,
      workPhases: patch.workPhases ?? workPhases,
      updatedAt: new Date().toISOString(),
    }
    try {
      await setDoc(doc(db, 'admin', 'wizardData'), payload)
      if (patch.styles) setStyles(patch.styles)
      if (patch.costFactors) setCostFactors(patch.costFactors)
      if (patch.workPhases) setWorkPhases(patch.workPhases)
      setLastSaved(new Date())
    } catch (err) {
      console.error('Admin save error:', err)
      setError('Save failed. Check Firestore rules and connection.')
    } finally {
      setSaving(false)
    }
  }

  return {
    styles, setStyles,
    costFactors, setCostFactors,
    workPhases, setWorkPhases,
    loading, saving, lastSaved, error,
    save,
  }
}
