import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'up',
      module: 'module-autenticacao',
    };
  }
}
