import { Module } from '@nestjs/common';
import { GlobalizationController } from './globalization.controller';
import { GlobalizationService } from './globalization.service';

@Module({ controllers: [GlobalizationController], providers: [GlobalizationService], exports: [GlobalizationService] })
export class GlobalizationModule {}
