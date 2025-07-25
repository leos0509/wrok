import { prisma } from "../lib/prisma";
import { User } from "../../generated/prisma";

export const createInitialTeamForUser = async (user: User) => {
  try {
    const team = await prisma.team.create({
      data: {
        name: `${user.firstName}'s Team`,
      },
    });

    const teamMember = await prisma.teamMember.create({
      data: {
        userId: user.id,
        teamId: team.id,
        isOwner: true,
      },
    });
    console.log("Initial team created:", team, teamMember);
  } catch (error) {
    console.error("Error creating initial team:", error);
    throw new Error("Failed to create initial team");
  }
};

export const createInitialColumnForProject = async (projectId: string) => {
  const columns = [
    {
      projectId: projectId,
      name: "To Do",
      description: "Tasks to be done",
      color: "#FBFCC3",
      position: 0,
    },
    {
      projectId: projectId,
      name: "In Progress",
      description: "Tasks currently being worked on",
      color: "#CEF2FF",
      position: 1,
    },
    {
      projectId: projectId,
      name: "Completed",
      description: "Tasks that are done",
      color: "#C1FFC1",
      position: 2,
    },
  ];
  try {
    const newColumns = await prisma.column.createMany({
      data: columns,
    });

    console.log("Initial columns created:", newColumns);
  } catch (error) {
    console.error("Error creating initial columns:", error);
  }
};

export const sanitizeUser = (user: User) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
}