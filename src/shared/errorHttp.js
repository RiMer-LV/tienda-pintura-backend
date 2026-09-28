export class ErrorHttp extends Error {
  constructor(statusCode, mensaje) {
    super(mensaje);
    this.statusCode = statusCode;
  }
}
