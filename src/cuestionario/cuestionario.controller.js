import * as cuestionarioService from "./cuestionario.service.js";

export async function obtenerInicio(req, res, next) {
  try {
    return res.json(await cuestionarioService.obtenerInicio());
  } catch (error) {
    return next(error);
  }
}

export async function obtenerPregunta(req, res, next) {
  try {
    return res.json(await cuestionarioService.obtenerPregunta(req.params.id));
  } catch (error) {
    return next(error);
  }
}

export async function completar(req, res, next) {
  try {
    const { idRecomendacion, respuestas, datosVisitante } = req.body;
    return res.json(
      await cuestionarioService.completar({
        usuario: req.usuario,
        idRecomendacion,
        respuestas,
        datosVisitante,
      })
    );
  } catch (error) {
    return next(error);
  }
}

export async function listarPreguntas(req, res, next) {
  try {
    return res.json(await cuestionarioService.listarPreguntas());
  } catch (error) {
    return next(error);
  }
}

export async function crearPregunta(req, res, next) {
  try {
    const { texto, orden } = req.body;
    return res.status(201).json(await cuestionarioService.crearPregunta({ texto, orden }));
  } catch (error) {
    return next(error);
  }
}

export async function actualizarPregunta(req, res, next) {
  try {
    const { texto, orden } = req.body;
    return res.json(await cuestionarioService.actualizarPregunta(req.params.id, { texto, orden }));
  } catch (error) {
    return next(error);
  }
}

export async function eliminarPregunta(req, res, next) {
  try {
    return res.json(await cuestionarioService.eliminarPregunta(req.params.id));
  } catch (error) {
    return next(error);
  }
}

export async function crearOpcion(req, res, next) {
  try {
    const { texto, tipoSigPaso, idSiguiente } = req.body;
    const resultado = await cuestionarioService.crearOpcion(req.params.id, { texto, tipoSigPaso, idSiguiente });
    return res.status(201).json(resultado);
  } catch (error) {
    return next(error);
  }
}

export async function actualizarOpcion(req, res, next) {
  try {
    const { texto, tipoSigPaso, idSiguiente } = req.body;
    return res.json(await cuestionarioService.actualizarOpcion(req.params.id, { texto, tipoSigPaso, idSiguiente }));
  } catch (error) {
    return next(error);
  }
}

export async function eliminarOpcion(req, res, next) {
  try {
    return res.json(await cuestionarioService.eliminarOpcion(req.params.id));
  } catch (error) {
    return next(error);
  }
}

export async function listarRecomendaciones(req, res, next) {
  try {
    return res.json(await cuestionarioService.listarRecomendaciones());
  } catch (error) {
    return next(error);
  }
}

export async function crearRecomendacion(req, res, next) {
  try {
    const { nombre, descripcion } = req.body;
    return res.status(201).json(await cuestionarioService.crearRecomendacion({ nombre, descripcion }));
  } catch (error) {
    return next(error);
  }
}

export async function actualizarRecomendacion(req, res, next) {
  try {
    const { nombre, descripcion } = req.body;
    return res.json(await cuestionarioService.actualizarRecomendacion(req.params.id, { nombre, descripcion }));
  } catch (error) {
    return next(error);
  }
}

export async function eliminarRecomendacion(req, res, next) {
  try {
    return res.json(await cuestionarioService.eliminarRecomendacion(req.params.id));
  } catch (error) {
    return next(error);
  }
}

export async function agregarProducto(req, res, next) {
  try {
    const resultado = await cuestionarioService.agregarProducto(req.params.id, req.body.idProducto);
    return res.status(201).json(resultado);
  } catch (error) {
    return next(error);
  }
}

export async function quitarProducto(req, res, next) {
  try {
    return res.json(await cuestionarioService.quitarProducto(req.params.id, req.params.idProducto));
  } catch (error) {
    return next(error);
  }
}
