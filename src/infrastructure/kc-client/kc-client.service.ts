import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';

import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SISGEANestSSOKCContainerService, SISGEANestSSOOIDCClientContainerService } from '@sisgea/sso-nest-client';
import { has } from 'lodash';
import { IUsuarioCreateInput, IUsuarioUpdateInput, IUsuarioUpdatePasswordInput } from '../../domain';
import { ActorContext } from '../actor-context';

type IKCClientServiceCreateUserInput = Omit<IUsuarioCreateInput, 'nome'> & Partial<Pick<IUsuarioCreateInput, 'nome'>>;

type IKCClientServiceUpdateUserPasswordInput = Omit<IUsuarioUpdatePasswordInput, 'id'>;

@Injectable()
export class KCClientService {
  constructor(
    // ...
    private kcContainerService: SISGEANestSSOKCContainerService,
    private oidcClientContainerService: SISGEANestSSOOIDCClientContainerService,
  ) {}

  private async getOIDCClient() {
    try {
      const oidcClient = await this.oidcClientContainerService.getTrustIssuerClient();
      return oidcClient;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  static buildUserFullName(user: UserRepresentation) {
    return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  }

  private async getKcAdminClient() {
    try {
      const kcAdminClient = await this.kcContainerService.getAdminClient();
      return kcAdminClient;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findUserByEmail(actorContext: ActorContext, email: string): Promise<UserRepresentation | null> {
    const kcAdminClient = await this.getKcAdminClient();

    const response = await kcAdminClient.users.find({
      email,
      exact: true,
    });

    if (response.length === 0) {
      return null;
    }

    const user = response[0];

    return <UserRepresentation>user;
  }

  async findUserByUsername(actorContext: ActorContext, username: string): Promise<UserRepresentation | null> {
    const kcAdminClient = await this.getKcAdminClient();

    const response = await kcAdminClient.users.find({
      username,
      exact: true,
    });

    if (response.length === 0) {
      return null;
    }

    const user = response[0];

    return <UserRepresentation>user;
  }

  async findUserByKeycloakId(actorContext: ActorContext, keycloakId: string): Promise<UserRepresentation | null> {
    const kcAdminClient = await this.getKcAdminClient();
    const user = await kcAdminClient.users.findOne({ id: keycloakId });
    return <UserRepresentation>(user ?? null);
  }

  async findUserByKeycloakIdStrict(actorContext: ActorContext, keycloakId: string) {
    const user = await this.findUserByKeycloakId(actorContext, keycloakId);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async cleanupEmailUsage(actorContext: ActorContext, keycloakId: string | null, email: string) {
    const kcAdminClient = await this.getKcAdminClient();

    const users = await kcAdminClient.users.find({ email }, { catchNotFound: false });

    for (const user of users) {
      const id = user.id;

      if (id && id !== keycloakId) {
        await kcAdminClient.users.update({ id }, { email: '' });
      }
    }
  }

  async cleanupUsernameUsage(actorContext: ActorContext, keycloakId: string | null = null, username: string) {
    const kcAdminClient = await this.getKcAdminClient();

    const users = await kcAdminClient.users.find({ username }, { catchNotFound: false });

    if (users.length > 0) {
      throw new Error('Username already taken');
    }

    // for (const user of users) {
    //   const id = user.id;

    //   if (id && id !== keycloakId) {
    //     await kcAdminClient.users.update({ id }, { username: '' });
    //   }
    // }
  }

  async cleanupUsage(
    actorContext: ActorContext,
    keycloakId: string | null,
    dto: { email?: string | undefined | null; username?: string | undefined | null },
  ) {
    const email = dto.email;

    if (email) {
      await this.cleanupEmailUsage(actorContext, keycloakId, email);
    }

    const username = dto.username;

    if (username) {
      await this.cleanupUsernameUsage(actorContext, keycloakId, username);
    }
  }

  async createUser(actorContext: ActorContext, dto: IKCClientServiceCreateUserInput) {
    const kcAdminClient = await this.getKcAdminClient();

    await this.cleanupUsage(actorContext, null, { email: dto.email, username: dto.matriculaSiape });

    const user: UserRepresentation = {
      username: dto.matriculaSiape,
      email: dto.email,
      firstName: dto.nome,
      enabled: true,
    };

    const response = await kcAdminClient.users.create({ ...user });

    return response;
  }

  async updateUser(actorContext: ActorContext, keycloakId: string, dto: IUsuarioUpdateInput) {
    await this.cleanupUsage(actorContext, keycloakId, { email: dto.email, username: dto.matriculaSiape });

    const kcAdminClient = await this.getKcAdminClient();

    const user: UserRepresentation = {
      ...(has(dto, 'nome')
        ? {
            firstName: dto.nome,
            lastName: '',
          }
        : {}),

      ...(has(dto, 'email')
        ? {
            email: dto.email,
          }
        : {}),

      ...(has(dto, 'matriculaSiape')
        ? {
            username: dto.matriculaSiape,
          }
        : {}),
    };

    await kcAdminClient.users.update(
      {
        id: keycloakId,
      },
      {
        ...user,
      },
    );
  }

  async deleteUser(actorContext: ActorContext, keycloakId: string) {
    const kcAdminClient = await this.getKcAdminClient();

    const user = await this.findUserByKeycloakId(actorContext, keycloakId);

    if (user) {
      await kcAdminClient.users.del({ id: keycloakId });
    }
  }

  async isEmailAvailable(actorContext: ActorContext, email: string) {
    const currentUserWithEmail = await this.findUserByEmail(actorContext, email);
    return currentUserWithEmail === null;
  }

  async isEmailAvailableForUser(actorContext: ActorContext, email: string, keycloakId: string) {
    const currentUserWithEmail = await this.findUserByEmail(actorContext, email);
    const user = await this.findUserByKeycloakIdStrict(actorContext, keycloakId);
    return !currentUserWithEmail || currentUserWithEmail.id === user.id;
  }

  async isUsernameAvailable(actorContext: ActorContext, username: string) {
    const currentUserWithUsername = await this.findUserByUsername(actorContext, username);
    return currentUserWithUsername === null;
  }

  async isUsernameAvailableForUser(actorContext: ActorContext, username: string, keycloakId: string) {
    const currentUserWithUsername = await this.findUserByUsername(actorContext, username);

    const user = await this.findUserByKeycloakIdStrict(actorContext, keycloakId);

    return !currentUserWithUsername || currentUserWithUsername.id === user.id;
  }

  async checkUserPassword(actorContext: ActorContext, keycloakId: string, password: string) {
    const kcUser = await this.findUserByKeycloakId(actorContext, keycloakId);

    if (kcUser) {
      try {
        const username = kcUser.username ?? kcUser.email;

        const oidcClient = await this.getOIDCClient();

        const tokenset = await oidcClient.grant({
          password,
          username,
          grant_type: 'password',
        });

        if (tokenset) {
          return true;
        }
      } catch (error) {}

      return false;
    }
  }

  async updateUserPassword(
    actorContext: ActorContext,
    keycloakId: string,
    dto: IKCClientServiceUpdateUserPasswordInput,
    checkCurrentPassword = true,
  ) {
    const kcAdminClient = await this.getKcAdminClient();

    const user = await this.findUserByKeycloakId(actorContext, keycloakId);

    if (user) {
      if (checkCurrentPassword) {
        const isPasswordCorrect = await this.checkUserPassword(actorContext, keycloakId, dto.currentPassword);

        if (!isPasswordCorrect) {
          throw new ForbiddenException('Invalid current password.');
        }
      }

      if (dto.newPassword !== dto.confirmNewPassword) {
        throw new UnprocessableEntityException('Invalid confirmNewPassword');
      }

      await kcAdminClient.users.resetPassword({
        id: keycloakId,
        credential: {
          temporary: false,
          type: 'password',
          value: dto.newPassword,
        },
      });

      return true;
    }
  }
}
