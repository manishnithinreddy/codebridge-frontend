export interface DockerContainer {
  id: string;
  name: string;
  image: string;
  imageId?: string;
  status: string;
  state?: string;
  ports?: { privatePort: number; publicPort?: number; type: string }[];
  createdAt?: string;
}
