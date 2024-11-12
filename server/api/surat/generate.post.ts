import { google } from 'googleapis'
import googleapis_docs from '@googleapis/docs'
import { SuratFormInputSchema } from '@/schemas/surat'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = SuratFormInputSchema.parse(body)

  // variable kusus
  const formData: any = {
    Pekerjaan_UP: data.companyName || "ATentang perkembangan proyek pembangunan Pelabuhan Patimban",
    Perusahaan_P1: "APT. Pelindo II",
    Reg_P1: data.name || "AIIX: 112432423235",
    Perusahaan_P2: "APT. Pelindo III",
    Alamat_P2: data.companyAddress || "AJl. Pelabuhan No. 1, Jakarta",
  };

  // * SETUP AUTH
  const creds = process.env.CREDENTIALS_JSON
  if (!creds) return {
    ok: false,
    message: "njir ada error mama di creds",
  }
  const auth = new googleapis_docs.auth.GoogleAuth({
    credentials: JSON.parse(creds),
    scopes: [
      "https://www.googleapis.com/auth/documents",
      "https://www.googleapis.com/auth/drive",
    ],
  });
  const authClient = await auth.getClient();
  if (!authClient)
    return {
      ok: false,
      message: "njir ada error mama di authClient",
    };
  

  // * SETUP CLIENT API
  // untuk terhubung memudahkan terhubung ke google apis
  // @ts-ignore
  const docs = google.docs({ version: "v1", auth: authClient });
  // @ts-ignore
  const drive = google.drive({ version: "v3", auth: authClient });

  // * CLONE DOCUMENT FROM TEMPLATE DOCUMENT
  const templateDocumentId = process.env.DOC_TEMPLATE_ID;
  const cloned_document = await drive.files.copy({
    fileId: templateDocumentId,
    requestBody: {
      name: "Undangan - Cloned Document from Template",
    },
  });
  if (!cloned_document || !cloned_document?.data?.id)
    return {
      ok: false,
      message: "njir ada error mama di cloned_document",
    };

  // * GIVE PERMISSION TO USER
  const drive_created = await drive.permissions.create({
    fileId: cloned_document.data.id,
    requestBody: {
      type: "user",
      role: "writer",
      emailAddress: process.env.TARGET_EMAIL,
    },
    fields: "id",
  });
  if (!drive_created || !drive_created?.data?.id)
    return {
      ok: false,
      message: "njir ada error mama di drive_created",
    };

  // * REPLACE TEXT IN DOCUMENT WITH FORM DATA VARIABLE KEY
  // pattern: <<key>>
  const updated_document = await docs.documents.batchUpdate({
    documentId: cloned_document.data.id,
    requestBody: {
      requests: Object.keys(formData).map((key) => ({
        replaceAllText: {
          containsText: {
            text: `<<${key}>>`,
            matchCase: true,
          },
          replaceText: formData[key],
        },
      })),
    },
  });
  if (!updated_document || !updated_document?.data)
    return {
      ok: false,
      message: "njir ada error mama di updated_document",
    };

  // return
  return {
    ok: true,
    message: "mantap bang",
    process_response: [cloned_document, drive_created, updated_document],
  };
});
