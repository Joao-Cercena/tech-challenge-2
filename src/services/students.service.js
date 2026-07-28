import prisma from '../database.js';

export async function createStudentService(data) {
  return prisma.student.create({ data });
}

export async function getStudentsService({ skip, limit }) {
  const [data, total] = await prisma.$transaction([
    prisma.student.findMany({ skip, take: limit, orderBy: { id: 'asc' } }),
    prisma.student.count()
  ]);

  return { data, total };
}

export async function getStudentService(id) {
  return prisma.student.findUnique({ where: { id } });
}

export async function updateStudentService(id, data) {
  return prisma.student.update({ where: { id }, data });
}

export async function deleteStudentService(id) {
  return prisma.student.delete({ where: { id } });
}
