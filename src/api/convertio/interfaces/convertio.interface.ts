export interface iConvertioInput {
    fileUrl?: string;
    fileBase64?: string;
    filename?: string;
}

export const ConvertioOCRBodyInput = {
    orc_enable: true,
    ocr_settings: {
        langs: ['eng', 'pt', 'bra', 'deu']
    },
    callback_url: process.env.CONVERTIO_CALLBACK_URL,
}

export interface iConvertioOutput {
    jobId: string;
    content: string;
}

export interface iConvertioRequestJobId {
    jobId: string;
}

export interface iConvertioResponseWorkerData {
    id: string;
    minutes: string;
    type: string;
    content: string;
}

export interface iConvertioResponseWorker {
    code: number;
    status: string;
    data: iConvertioResponseWorkerData;
    error?: string;
}