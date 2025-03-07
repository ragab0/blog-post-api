declare module 'bcrypt' {
  export function hashSync(
    data: string | Buffer,
    saltOrRounds: string | number,
  ): string;
  export function compareSync(
    data: string | Buffer,
    encrypted: string,
  ): boolean;
  export function hash(
    data: string | Buffer,
    saltOrRounds: string | number,
  ): Promise<string>;
  export function compare(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean>;
}
