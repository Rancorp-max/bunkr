// src/hooks/useBunkerData.js
// Reads wizard data from Firestore. Falls back to static defaults immediately
// if Firebase is not configured or the request times out.

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

export function useBunkerData() {
  const [styles, setStyles] = useState(DEFAULT_STYLES)
  const [costFactors, setCostFactors] = useState(DEFAULT_FACTORS)
  const [workPhases, setWorkPhases] = useState(DEFAULT_PHASES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If Firebase isn't configured, skip straight to defaults
    if (!isFirebaseConfigured()) {
      setLoading(false)
      return
    }

    let cancelled = false

    // Hard 5-second timeout — never leave user on a spinner
    const timeout = setTimeout(() => {
      if (!cancelled) {
        console.warn('Firestore load timed out, using static defaults.')
        setLoading(false)
      }
    }, 5000)

    async function load() {
      try {
        const { db } = await import('../firebase/config')
        const { doc, getDoc } = await import('firebase/firestore')
        const snap = await getDoc(doc(db, 'admin', 'wizardData'))
        if (!cancelled) {
          if (snap.exists()) {
            const data = snap.data()
            if (data.styles) setStyles(data.styles)
            if (data.costFactors) setCostFactors(data.costFactors)
            if (data.workPhases) setWorkPhases(data.workPhases)
          }
        }
      } catch (err) {
        console.warn('Could not load Firestore wizard data, using defaults.', err)
      } finally {
        clearTimeout(timeout)
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [])

  return { styles, costFactors, workPhases, loading }
}
