// src/hooks/useAdminData.js
// Reads and writes the full wizard data object to Firestore admin/wizardData doc.
// Falls back to static defaults immediately if Firebase is not configured.

import { useState, useEffect } from 'react'
import {
  BUNKER_STYLES as DEFAULT_STYLES,
  COST_FACTORS as DEFAULT_FACTORS,
  WORK_PHASES as DEFAULT_PHASES,
} from '../data/bunkerData'

function isFirebaseConfigured() {
  const key = import.meta.env.VITE_FIREBASE_API_KEY
  return key && key !== 'YOUR_API_KEY' && key.length > 10
}

export function useAdminData() {
  const [styles, setStyles] = useState(null)
  const [costFactors, setCostFactors] = useState(null)
  const [workPhases, setWorkPhases] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [error, setError] = useState(null)
  const [firebaseReady, setFirebaseReady] = useState(false)

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      console.warn('Firebase not configured — admin running in local-only mode.')
      setStyles(DEFAULT_STYLES)
      setCostFactors(DEFAULT_FACTORS)
      setWorkPhases(DEFAULT_PHASES)
      setError('Firebase not configured. Changes will not be saved. Add your Firebase credentials to .env.local to enable saving.')
      setLoading(false)
      return
    }

    let cancelled = false

    const timeout = setTimeout(() => {
      if (!cancelled && loading) {
        setStyles(DEFAULT_STYLES)
        setCostFactors(DEFAULT_FACTORS)
        setWorkPhases(DEFAULT_PHASES)
        setError('Firestore connection timed out. Check your Firebase config.')
        setLoading(false)
      }
    }, 5000)

    async function load() {
      try {
        const { db } = await import('../firebase/config')
        const { doc, getDoc } = await import('firebase/firestore')
        setFirebaseReady(true)
        const snap = await getDoc(doc(db, 'admin', 'wizardData'))
        if (!cancelled) {
          if (snap.exists()) {
            const data = snap.data()
            setStyles(data.styles ?? DEFAULT_STYLES)
            setCostFactors(data.costFactors ?? DEFAULT_FACTORS)
            setWorkPhases(data.workPhases ?? DEFAULT_PHASES)
          } else {
            setStyles(DEFAULT_STYLES)
            setCostFactors(DEFAULT_FACTORS)
            setWorkPhases(DEFAULT_PHASES)
          }
        }
      } catch (err) {
        console.error('Admin load error:', err)
        if (!cancelled) {
          setError('Failed to load from Firestore. Check your Firebase config and Firestore rules.')
          setStyles(DEFAULT_STYLES)
          setCostFactors(DEFAULT_FACTORS)
          setWorkPhases(DEFAULT_PHASES)
        }
      } finally {
        clearTimeout(timeout)
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true; clearTimeout(timeout) }
  }, [])

  const save = async (patch = {}) => {
    if (!isFirebaseConfigured()) {
      setError('Cannot save — Firebase not configured. Add credentials to .env.local')
      return
    }
    setSaving(true)
    setError(null)
    const payload = {
      styles: patch.styles ?? styles,
      costFactors: patch.costFactors ?? costFactors,
      workPhases: patch.workPhases ?? workPhases,
      updatedAt: new Date().toISOString(),
    }
    try {
      const { db } = await import('../firebase/config')
      const { doc, setDoc } = await import('firebase/firestore')
      await setDoc(doc(db, 'admin', 'wizardData'), payload)
      if (patch.styles) setStyles(patch.styles)
      if (patch.costFactors) setCostFactors(patch.costFactors)
      if (patch.workPhases) setWorkPhases(patch.workPhases)
      setLastSaved(new Date())
    } catch (err) {
      console.error('Admin save error:', err)
      setError('Save failed. Check Firestore rules and your connection.')
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
