import { Router } from 'express';
import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudents,
  updateStudent
} from '../controllers/students.controller.js';
import { authenticateProfessor } from '../middlewares/authenticate-professor.js';

const router = Router();

router.use(authenticateProfessor);
router.post('/', createStudent);
router.get('/', getStudents);
router.get('/:id', getStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;
