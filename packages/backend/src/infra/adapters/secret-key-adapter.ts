export class SecretKeyAdapter {
  static get(): string {
    const apiKey = process.env.DEEPL_API_KEY;

    if (!apiKey) {
      throw new Error("DEEPL_API_KEY is not defined in the environment");
    }

    return apiKey;
  }
}
