// Minimal ambient declarations to satisfy TypeScript in CI/build environments
// These are fallbacks when @types/* packages are not available during install.

declare module '@vercel/node';

declare module 'express' {
  const express: any;
  export = express;
}

declare module 'cors' {
  const cors: any;
  export default cors;
}

declare module 'morgan' {
  const morgan: any;
  export default morgan;
}

declare module 'multer' {
  const multer: any;
  export default multer;
}

// Provide minimal global multer namespace types used in some route signatures

declare module 'pdfkit' {
  const PDFDocument: any;
  export default PDFDocument;
}

declare module 'bcrypt' {
  const bcrypt: any;
  export default bcrypt;
}

declare module 'jsonwebtoken' {
  const jwt: any;
  export default jwt;
}

// Make these namespaces available globally (wrap in declare global since this file is a module)
declare global {
  namespace multer {
    type FileFilterCallback = (error: Error | null, acceptFile?: boolean) => void;
  }

  namespace jwt {
    interface SignOptions {
      [key: string]: any;
    }
  }

  // Provide a minimal Express namespace so code referencing Express types compiles.
  namespace Express {
    interface Request {
      [key: string]: any;
      body?: any;
      file?: any;
      files?: any;
    }

    interface Response {
      [key: string]: any;
    }

    interface NextFunction {
      (err?: any): void;
    }
  }
}

export {};
