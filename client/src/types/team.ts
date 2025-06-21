export type Team = {
  id: string;
  name: string;

  createAt: string;
  updatedAt: string;
};

export type TeamMember = {
  id: string;
  userId: string;
  teamId: string;
  isOwner: boolean;

  createdAt: string;
  updatedAt: string;
};
