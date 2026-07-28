export function errorHandler(err, req, res, next) {
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Registro não encontrado'
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Registro duplicado'
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  console.error(err);

  return res.status(500).json({
    error: 'Erro interno do servidor'
  });
}
