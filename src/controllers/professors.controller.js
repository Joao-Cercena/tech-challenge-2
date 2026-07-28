import {
  createProfessorService,
  deleteProfessorService,
  getProfessorService,
  getProfessorsService,
  updateProfessorService
} from '../services/professors.service.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';
import { parseId, validateProfessorCreate, validateProfessorUpdate } from '../utils/validation.js';

export async function createProfessor(req, res, next) {
  try {
    const professor = await createProfessorService(validateProfessorCreate(req.body));
    return res.status(201).json(professor);
  } catch (error) {
    return next(error);
  }
}

export async function getProfessors(req, res, next) {
  try {
    const pagination = getPagination(req.query);
    const { data, total } = await getProfessorsService(pagination);
    return res.json(paginatedResponse(data, pagination, total));
  } catch (error) {
    return next(error);
  }
}

export async function getProfessor(req, res, next) {
  try {
    const professor = await getProfessorService(parseId(req.params.id));

    if (!professor) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    return res.json(professor);
  } catch (error) {
    return next(error);
  }
}

export async function updateProfessor(req, res, next) {
  try {
    const professor = await updateProfessorService(
      parseId(req.params.id),
      validateProfessorUpdate(req.body)
    );
    return res.json(professor);
  } catch (error) {
    return next(error);
  }
}

export async function deleteProfessor(req, res, next) {
  try {
    const professor = await deleteProfessorService(parseId(req.params.id));
    return res.json({ message: 'Professor deletado com sucesso', professor });
  } catch (error) {
    return next(error);
  }
}
