<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface DepInfo {
  prefix: string
  hello_js: {
    available: boolean
    version: string
    greeting: string
  }
}

const loading = ref(true)
const error = ref('')
const info = ref<DepInfo | null>(null)

async function fetchInfo() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/plugin/nuxtblog-plugin-dep-test/info', {
      credentials: 'include',
    })
    const json = await res.json()
    if (json.code === 0) {
      info.value = json.data
    } else {
      error.value = json.message || 'Unknown error'
    }
  } catch (e: any) {
    error.value = e.message || 'Network error'
  } finally {
    loading.value = false
  }
}

onMounted(fetchInfo)
</script>

<template>
  <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
    <h2 style="margin-bottom: 16px; font-size: 18px; font-weight: 600;">
      Dependency Test Panel
    </h2>

    <div v-if="loading" style="color: var(--ui-text-muted, #888);">
      Loading...
    </div>

    <div v-else-if="error" style="color: var(--ui-color-error, red); padding: 12px; border: 1px solid; border-radius: 6px;">
      {{ error }}
      <button @click="fetchInfo" style="margin-left: 8px; cursor: pointer;">Retry</button>
    </div>

    <div v-else-if="info" style="display: flex; flex-direction: column; gap: 12px;">
      <!-- Plugin prefix -->
      <div style="padding: 12px; border: 1px solid var(--ui-border, #e5e7eb); border-radius: 8px;">
        <div style="font-size: 12px; color: var(--ui-text-muted, #888); margin-bottom: 4px;">Output Prefix</div>
        <div style="font-size: 14px; font-weight: 500;">{{ info.prefix }}</div>
      </div>

      <!-- Hello JS dependency info -->
      <div style="padding: 12px; border: 1px solid var(--ui-border, #e5e7eb); border-radius: 8px;">
        <div style="font-size: 12px; color: var(--ui-text-muted, #888); margin-bottom: 8px;">
          Dependency: nuxtblog-plugin-hello-js
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div>
            <span style="font-size: 11px; color: var(--ui-text-muted, #888);">Available</span>
            <div :style="{ color: info.hello_js.available ? 'green' : 'red', fontWeight: 600 }">
              {{ info.hello_js.available ? 'Yes' : 'No' }}
            </div>
          </div>
          <div>
            <span style="font-size: 11px; color: var(--ui-text-muted, #888);">Version</span>
            <div style="font-weight: 500;">{{ info.hello_js.version || '—' }}</div>
          </div>
        </div>

        <div style="margin-top: 8px;">
          <span style="font-size: 11px; color: var(--ui-text-muted, #888);">Greeting from hello-js</span>
          <div style="font-size: 14px; font-weight: 500; margin-top: 2px; padding: 8px; background: var(--ui-bg-elevated, #f9fafb); border-radius: 4px;">
            {{ info.hello_js.greeting || '(empty)' }}
          </div>
        </div>
      </div>

      <button @click="fetchInfo" style="align-self: flex-start; padding: 6px 16px; cursor: pointer; border: 1px solid var(--ui-border, #e5e7eb); border-radius: 6px; background: var(--ui-bg, #fff);">
        Refresh
      </button>
    </div>
  </div>
</template>
