export class Client {
  constructor(public url: URL) {}

  async callServer(path: string, data: object): Promise<any> {
    const response = await fetch(String(new URL(path, this.url)), {
      body: JSON.stringify(data),
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return await response.json();
  }

  async startSpanExtract(data: {
    name: string;
    reference: object;
    relationship: "child_of" | "follows_from";
  }): Promise<{ id: string }> {
    return this.callServer("start-span-extract", data);
  }

  async startSpan(data: {
    name: string;
    reference: { id: string };
    relationship: "child_of" | "follows_from";
  }): Promise<{ id: string }> {
    return this.callServer("start-span", data);
  }

  async injectSpan(data: { id: string }): Promise<object> {
    return this.callServer("inject-span", data);
  }

  async finishSpan(data: { id: string }): Promise<void> {
    await this.callServer("finish-span", data);
    return;
  }
}
