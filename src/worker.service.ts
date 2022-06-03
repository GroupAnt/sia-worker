import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import ConvertioAPI from './api/convertio/convertio.api';
import axios from 'axios';

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);
  private readonly convertionApi = new ConvertioAPI();
  private readonly coreBaseURL = process.env.SIA_API_URL;

  updateExternalId(id: string, externalId: string) {
    return axios.put(`${this.coreBaseURL}/notification/${id}`, { externalId });
  }

  @EventPattern('processJob')
  async process(payload: any) {
    this.logger.log(`[${payload.id}] - Processing ${payload.linkAt}`);

    const content = await this.download(payload.linkAt);
    const data = await this.convertionApi.convertPDF2TextWithORC({ fileBase64: content, filename: payload.id });

    if (data.code === HttpStatus.OK) {
      this.logger.log(`[${payload.id}] - Processed ${payload.linkAt} sucessfully (externalId=${data.data.id})`);

      await this.updateExternalId(payload.id, data.data.id);

      return payload;
    }

    this.logger.error(`[${payload.id}] - Error processing ${payload.linkAt} (error=${data.error} externalId=${data.data.id})`);
  }

  async download(url: string) {
    const { data } = await axios.get(url, { 
      responseType: 'arraybuffer',
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    });

    return Buffer.from(data, 'binary').toString('base64');
  }
}
