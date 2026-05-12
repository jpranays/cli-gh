import Fuse from 'fuse.js';

class CommandRegistry {
  constructor() {
    this._commands = new Map();
    this._aliases = new Map();
    this._categories = new Map();
    this._fuse = null;
  }

  register(name, config) {
    const command = {
      name,
      handler: config.handler,
      description: config.description || '',
      category: config.category || 'misc',
      aliases: config.aliases || [],
      requiresAuth: config.requiresAuth !== false,
      schema: config.schema || null,
    };

    this._commands.set(name, command);

    for (const alias of command.aliases) {
      this._aliases.set(alias, name);
    }

    if (!this._categories.has(command.category)) {
      this._categories.set(command.category, []);
    }
    this._categories.get(command.category).push(name);

    this._fuse = null; // invalidate fuse index
    return this;
  }

  get(name) {
    const canonical = this._aliases.get(name) ?? name;
    return this._commands.get(canonical) ?? null;
  }

  getAll() {
    return Array.from(this._commands.values());
  }

  getCategories() {
    return Array.from(this._categories.keys());
  }

  getByCategory(category) {
    const names = this._categories.get(category) ?? [];
    return names.map((n) => this._commands.get(n)).filter(Boolean);
  }

  /** Fuzzy-match an input string against all registered command names. */
  getSuggestions(input, limit = 5) {
    if (!this._fuse) {
      this._fuse = new Fuse(this.getAll(), {
        keys: ['name', 'aliases', 'description'],
        threshold: 0.4,
        distance: 100,
      });
    }
    return this._fuse.search(input, { limit }).map((r) => r.item);
  }
}

export const registry = new CommandRegistry();
