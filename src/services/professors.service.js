import bcrypt from 'bcryptjs';
import prisma from '../database.js';

const publicProfessorFields = {
  id: true,
  name: true,
  username: true,
  createdAt: true,
  updatedAt: true
};

export async function createProfessorService(data) {
  return prisma.professor.create({
    data: { ...data, password: await bcrypt.hash(data.password, 12) },
    select: publicProfessorFields
  });
}

export async function getProfessorsService({ skip, limit }) {
  const [data, total] = await prisma.$transaction([
    prisma.professor.findMany({ skip, take: limit, orderBy: { id: 'asc' }, select: publicProfessorFields }),
    prisma.professor.count()
  ]);

  return { data, total };
}

export async function getProfessorService(id) {
  return prisma.professor.findUnique({ where: { id }, select: publicProfessorFields });
}

export async function updateProfessorService(id, data) {
  const updateData = { ...data };

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 12);
  }

  return prisma.professor.update({ where: { id }, data: updateData, select: publicProfessorFields });
}

export async function deleteProfessorService(id) {
  return prisma.professor.delete({ where: { id }, select: publicProfessorFields });
}
