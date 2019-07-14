import { Module, Logger } from '@nestjs/common';
import { CompressService, CompressorBase } from './compress.service';
import { SettingsModule } from '../settings/settings.module';
import { LoggerModule } from '../logger/logger.module';
import { Compressor7zipService } from './compressor-7zip.service';
import { CompressorTarBz2Service } from './compressor-tarbz2.service';
import { SettingsService, CompressionType } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';

@Module({
  imports: [SettingsModule, LoggerModule],
  providers: [
    CompressService,
    {
      provide: CompressorBase,
      useFactory: (settings: SettingsService, logger: LoggerService) => {
        switch (settings.getCompressType()) {
          case CompressionType.TARBZ2:
            return new CompressorTarBz2Service(logger);
          case CompressionType.ZIP7:
            return new Compressor7zipService(logger);
          default:
            throw new Error(`Unknow compression type: ${settings.getCompressType()}`);
        }
      },
      inject: [SettingsService, LoggerService]
    }
  ],
  exports: [CompressorBase]
})
export class CompressModule {}
