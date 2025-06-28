declare module 'formidable' {
    interface File {
      filepath: string
      originalFilename?: string
      mimetype?: string
      size?: number
    }
  
    interface Fields {
      [key: string]: string | string[]
    }
  
    interface Files {
      [key: string]: File | File[]
    }
  
    interface IncomingForm {
      parse(
        req: any,
        callback: (err: Error | null, fields: Fields, files: Files) => void
      ): void
    }
  
    function formidable(options?: any): IncomingForm
    export default formidable
  }
  