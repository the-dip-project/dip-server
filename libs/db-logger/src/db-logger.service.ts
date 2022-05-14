import { hostname } from 'os';
import { Repository } from 'typeorm';

import { LogEntity, LogTypes } from '@/common/entities/log.entity';
import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

type MiscInfo = {
  stack: string;
  context: string;
};

@Injectable({
  scope: Scope.TRANSIENT,
})
export class DbLoggerService implements LoggerService {
  private static readonly deviceName: string = hostname();

  public constructor(
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
  ) {}

  private generateStack(): string {
    const stack = new Error().stack;

    const stackLines = stack.split('\n');
    // Rename error type to AutoGeneratedStackTrace
    stackLines[0] = 'AutoGeneratedStackTrace:';
    // Remove all stack trace of DbLoggerService
    // Keep the stack trace of the caller
    stackLines.splice(1, 4);

    return stackLines.join('\n');
  }

  private getMisc(stack?: string, context?: string): MiscInfo {
    return {
      context: context ?? stack ?? 'DbLogger',
      stack:
        typeof context === 'string'
          ? stack ?? this.generateStack()
          : this.generateStack(),
    };
  }

  private async generalLog(
    message: string,
    detail: string,
    type: LogTypes,
    _stack?: string,
    _context?: string,
  ): Promise<void> {
    const { stack, context } = this.getMisc(_stack, _context);

    const log = this.logRepository.create({
      detail,
      message,
      scope: context,
      stack,
      type,
      source: DbLoggerService.deviceName,
    });

    this.logRepository.insert(log);
  }

  public log(
    detail: string,
    message: string,
    _stack?: string,
    _context?: string,
  ): void {
    this.generalLog(message, detail, LogTypes.LOG, _stack, _context);
  }

  public warn(
    detail: string,
    message: string,
    _stack?: string,
    _context?: string,
  ): void {
    this.generalLog(message, detail, LogTypes.WARNING, _stack, _context);
  }

  public error(
    detail: string,
    message: string,
    _stack?: string,
    _context?: string,
  ): void {
    this.generalLog(message, detail, LogTypes.ERROR, _stack, _context);
  }

  public debug?(
    detail: string,
    message: string,
    _stack?: string,
    _context?: string,
  ): void {
    this.generalLog(message, detail, LogTypes.DEBUG, _stack, _context);
  }

  public verbose?(
    detail: string,
    message: string,
    _stack?: string,
    _context?: string,
  ): void {
    this.generalLog(message, detail, LogTypes.VERBOSE, _stack, _context);
  }
}
