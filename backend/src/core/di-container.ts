export interface Container {
  get<T>(token: string): T;
  register<T>(token: string, factory: () => T): void;
}

class SimpleContainer implements Container {
  private factories = new Map<string, () => any>();
  private instances = new Map<string, any>();

  register<T>(token: string, factory: () => T): void {
    this.factories.set(token, factory);
  }

  get<T>(token: string): T {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    const factory = this.factories.get(token);
    if (!factory) {
      throw new Error(`Service not registered: ${token}`);
    }

    const instance = factory();
    this.instances.set(token, instance);
    return instance;
  }
}

export const container = new SimpleContainer();

export const TOKENS = {
  TABLE_REPOSITORY: 'TableRepository',
  TABLE_SERVICE: 'TableService',
} as const;
