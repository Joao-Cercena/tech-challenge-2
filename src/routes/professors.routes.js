import { Router } from 'express';
import {
  createProfessor,
  deleteProfessor,
  getProfessor,
  getProfessors,
  updateProfessor
} from '../controllers/professors.controller.js';
import { authenticateProfessor } from '../middlewares/authenticate-professor.js';

const router = Router();

router.use(authenticateProfessor);
router.post('/', createProfessor);
router.get('/', getProfessors);
router.get('/:id', getProfessor);
router.put('/:id', updateProfessor);
router.delete('/:id', deleteProfessor);

export default router;
