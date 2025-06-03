export interface DockerImage {
  id: string;
  repository: string;
  tag: string;
  size: string;
  createdAt?: string;
}
