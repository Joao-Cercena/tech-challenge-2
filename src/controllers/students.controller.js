import {
  createStudentService,
  deleteStudentService,
  getStudentService,
  getStudentsService,
  updateStudentService
} from '../services/students.service.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';
import { parseId, validateStudentCreate, validateStudentUpdate } from '../utils/validation.js';

export async function createStudent(req, res, next) {
  try {
    const student = await createStudentService(validateStudentCreate(req.body));
    return res.status(201).json(student);
  } catch (error) {
    return next(error);
  }
}

export async function getStudents(req, res, next) {
  try {
    const pagination = getPagination(req.query);
    const { data, total } = await getStudentsService(pagination);
    return res.json(paginatedResponse(data, pagination, total));
  } catch (error) {
    return next(error);
  }
}

export async function getStudent(req, res, next) {
  try {
    const student = await getStudentService(parseId(req.params.id));

    if (!student) {
      return res.status(404).json({ error: 'Estudante não encontrado' });
    }

    return res.json(student);
  } catch (error) {
    return next(error);
  }
}

export async function updateStudent(req, res, next) {
  try {
    const student = await updateStudentService(
      parseId(req.params.id),
      validateStudentUpdate(req.body)
    );
    return res.json(student);
  } catch (error) {
    return next(error);
  }
}

export async function deleteStudent(req, res, next) {
  try {
    const student = await deleteStudentService(parseId(req.params.id));
    return res.json({ message: 'Estudante deletado com sucesso', student });
  } catch (error) {
    return next(error);
  }
}
