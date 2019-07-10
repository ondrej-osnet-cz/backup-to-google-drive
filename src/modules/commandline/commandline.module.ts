import { Module } from '@nestjs/common';
import { CommandLineService } from './commandline.service';

@Module({
  imports: [],
  providers: [CommandLineService],
  exports: [CommandLineService]
})
export class CommandLineModule {}
