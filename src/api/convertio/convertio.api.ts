import axios from 'axios';
import { iConvertioResponseWorker, iConvertioInput, iConvertioOutput, iConvertioRequestJobId, ConvertioOCRBodyInput } from './interfaces/convertio.interface';

export default class ConvertioAPIWrapper {
    private readonly baseURL = process.env.CONVERTIO_API_URL as string;
    private readonly body = { apikey: process.env.CONVERTIO_API_KEY };

    async completeJob({ jobId }: iConvertioRequestJobId): Promise<iConvertioOutput> {
        const response = await axios.get(`${this.baseURL}/convert/${jobId}/dl`);

        if (response.data.status === 'ok') {
            const content = Buffer.from(response.data.data.content, 'base64').toString();
            return { jobId: jobId, content: content };
        }

        throw new Error(`[${jobId}] ${response.data.error}`);
    }


    async convertPDF2TextWithORC({ fileBase64, filename }: iConvertioInput): Promise<iConvertioResponseWorker> {
        const response = await axios.post(`${this.baseURL}/convert/`, {
            ...this.body,
            filename: filename,
            input: 'base64',
            file: fileBase64,
            outputformat: 'txt',
            options: ConvertioOCRBodyInput,
        }, { maxContentLength: Infinity, maxBodyLength: Infinity });

        return response.data;
    }

    async convertPDF2Text({ fileUrl }: iConvertioInput): Promise<iConvertioResponseWorker> {
        const response = await axios.post(`${this.baseURL}/convert/`, {
            ...this.body,
            file: fileUrl,
            outputformat: 'txt',
        });

        return response.data;
    }
}