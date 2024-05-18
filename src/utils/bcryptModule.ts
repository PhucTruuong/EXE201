import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export class bcryptModule {
  public getHash(pwd: string): Promise<string> {
    return bcrypt.hash(pwd, SALT_ROUNDS);
  };

  public hashSync(pwd: string): string {
    return bcrypt.hashSync(pwd, SALT_ROUNDS);
  };

  public compare(pwd: string, hash: string): Promise<boolean> {
    return bcrypt.compare(pwd, hash);
  };
};

