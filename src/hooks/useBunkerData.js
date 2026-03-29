// src/hooks/useBunkerData.js
// Reads wizard data from Firestore. Falls back to static defaults if nothing saved yet.

import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import {
  BUNKER_STYLES as DEFAULT_STYLES,
  COST_FACTORS as DEFAULT_FACTORS,
  WORK_PHASES as DEFAULT_PHASES,
} from '../data/bunkerData'

export function useBunkerData() {
  const [styles, setStyles] = useState(DEFAULT_STYLES)
  const [costFactors, setCostFactors] = useState(DEFAULT_FACTORS)
  const [workPhases, setWorkPhases] = useState(DEFAULT_PHASES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'admin', 'wizardData'))
        if (snap.exists()) {
          const data = snap.data()
          if (data.styles) setStyles(data.styles)
          if (data.costFactors) setCostFactors(data.costFactors)
          if (data.workPhases) setWorkPhases(data.workPhases)
        }
      } catch (err) {
        console.warn('Could not load Firestore wizard data, using defaults.', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { styles, costFactors, workPhases, loading }
}
