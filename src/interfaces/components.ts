export interface ClientsCardProps {
  company: string;
  comments: string;
  rating: number;
  iconUrl?: string;
}

export interface ContentTabProps {
  clients: ClientsCardProps[];
}
