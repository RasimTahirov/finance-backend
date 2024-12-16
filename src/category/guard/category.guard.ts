import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CategoryService } from '../category.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private readonly categoryService: CategoryService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const categoryId = req.params.id;

    const category = await this.categoryService.findOne(categoryId);

    if (category.user.id !== user.id) {
      throw new ForbiddenException('Что-то пошло не так :(');
    }

    return true;
  }
}
