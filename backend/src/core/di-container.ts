export interface Container {
  get<T>(token: string): T;
  register<T>(token: string, factory: () => T): void;
}

class SimpleContainer implements Container {
  private readonly factories = new Map<string, () => unknown>();
  private readonly instances = new Map<string, unknown>();

  register<T>(token: string, factory: () => T): void {
    if (this.factories.has(token)) {
      throw new Error(`Service already registered: ${token}`);
    }
    this.factories.set(token, factory);
  }

  get<T>(token: string): T {
    if (this.instances.has(token)) {
      return this.instances.get(token) as T;
    }

    const factory = this.factories.get(token);
    if (!factory) {
      const availableTokens = Array.from(this.factories.keys()).join(', ');
      throw new Error(
        `Service not registered: ${token}. Available services: ${availableTokens}`
      );
    }

    try {
      const instance = factory();
      this.instances.set(token, instance);
      return instance as T;
    } catch (error) {
      throw new Error(`Failed to create instance of ${token}: ${error}`);
    }
  }
}

export const container = new SimpleContainer();

export const TOKENS = {
  TABLE_REPOSITORY: 'TableRepository',
  TABLE_SERVICE: 'TableService',
  TITLE_GENERATOR_SERVICE: 'TitleGeneratorService',
} as const;
