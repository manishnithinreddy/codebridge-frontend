export interface Server {
  id: string;
  name: string;
  hostname?: string;
  port?: number;
  username?: string;
  status?: string;
  os?: string;
}
