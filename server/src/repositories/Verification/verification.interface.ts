export interface IVerificationRepository {
  create(data: Partial<IVerification>): Promise<any>;
  replace(data: Partial<IVerification>): Promise<any>;
  findByTokenHash(tokenHash: string): Promise<any>;
  delete(id: string): Promise<void>;
}
