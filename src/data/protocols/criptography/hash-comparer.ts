export interface HashComparer {
  comparer(password: string, hashed: string): Promise<boolean>
}