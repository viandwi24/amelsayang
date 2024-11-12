import { z } from 'zod' 

export const SuratFormInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  companyName: z.string().optional(),
  companyAddress : z.string().optional(),
})