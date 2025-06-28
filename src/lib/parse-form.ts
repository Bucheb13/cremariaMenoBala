import formidable from 'formidable'
import type { File, Fields, Files } from 'formidable'

export function parseForm(req: Request): Promise<{ fields: Fields; files: Files }> {
  return new Promise((resolve, reject) => {
    const form = formidable()

    form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}
