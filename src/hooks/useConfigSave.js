// src/hooks/useConfigSave.js
import { useState } from 'react'
import { db } from '../firebase/config'
import { collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore'

export function useConfigSave() {
  const [saveId, setSaveId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const saveConfig = async (configData) => {
    setSaving(true)
    setSaveError(null)
    try {
      const docRef = await addDoc(collection(db, 'bunker_configs'), {
        ...configData,
        createdAt: serverTimestamp(),
      })
      setSaveId(docRef.id)
      return docRef.id
    } catch (err) {
      console.error('Save error:', err)
      setSaveError('Could not save configuration. Check Firebase setup.')
      return null
    } finally {
      setSaving(false)
    }
  }

  const loadConfig = async (id) => {
    try {
      const docRef = doc(db, 'bunker_configs', id)
      const snap = await getDoc(docRef)
      if (snap.exists()) return snap.data()
      return null
    } catch (err) {
      console.error('Load error:', err)
      return null
    }
  }

  return { saveConfig, loadConfig, saveId, saving, saveError }
}
