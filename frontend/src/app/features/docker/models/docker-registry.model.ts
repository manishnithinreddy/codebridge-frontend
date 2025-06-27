export interface DockerRegistry {
  id: string;
  name: string;
  url: string;
  username?: string;
  isConnected: boolean;
}
