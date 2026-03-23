export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Registro não encontrado'
    });
  }

  return res.status(500).json({
    error: 'Erro interno do servidor'
  });
}