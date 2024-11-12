<script lang="ts" setup>
import { SuratFormInputSchema } from '@/schemas/surat' 
const nama = "amel"

async function editdata () {
  alert('mama amel sexy')

  const data = {
    name: 'papa pian'
  }
}




// form
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'


type Schema = z.output<typeof SuratFormInputSchema>

// 
const state = reactive({
  name: '',
  companyName: '',
  companyAddress: '',
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const result = await $fetch('/api/surat/generate', {
    method: 'POST',
    body: event.data
  })
  console.log('hasil submit', result)
}
</script>

<template>
  <div class="max-w-screen-lg mx-auto">
    <UForm :schema="SuratFormInputSchema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Nama" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>

      <UFormGroup label="Perusahaan" name="companyName">
        <UInput v-model="state.companyName" />
      </UFormGroup>

      <UFormGroup label="Alamat" name="companyAddress">
        <UInput v-model="state.companyAddress" />
      </UFormGroup>

      <UButton type="submit">
        Submit
      </UButton>
    </UForm>
  </div>
</template>
