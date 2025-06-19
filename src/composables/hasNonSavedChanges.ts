import { ref, watch, isRef, toRaw, type Ref } from 'vue'

export function useHasNonSavedChanges<T>(data: T | Ref<T>) {
  const rawInitial = ref<any>(cloneDeep(data))
  const hasChanges = ref(false)

  watch(
    data,
    (newVal) => {
      hasChanges.value = !deepEqual(cloneDeep(newVal), rawInitial.value)
    },
    { deep: true, immediate: true },
  )

  function resetChanges() {
    rawInitial.value = cloneDeep(data)
    hasChanges.value = false
  }

  return {
    hasChanges,
    resetChanges,
  }
}

function cloneDeep<T>(obj: T): T {
  const raw = isRef(obj) ? toRaw(obj.value) : toRaw(obj)
  return JSON.parse(JSON.stringify(raw))
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true

  if (typeof a !== typeof b) return false
  if (a === null || b === null) return false
  if (typeof a !== 'object') return false

  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)

  if (aKeys.length !== bKeys.length) return false

  for (const key of aKeys) {
    if (!bKeys.includes(key)) return false
    if (!deepEqual(a[key], b[key])) return false
  }

  return true
}
