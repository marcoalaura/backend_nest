export class TemplateEmailService {
  static armarPlantillaActivacionCuenta(url, usuario, contrasena) {
    return `
      <!DOCTYPE html>
      <html lang='es'>
        <head>
          <meta charset='UTF-8'>
          <style>
            .container {
              width: 100%;
              max-width: 640px;
              margin-top: 10vh;
            }
          </style>
          <title>Activa tu cuenta</title>
        </head>
        <body>
          <div class='container'>
            Para acceder al sistema ingrese a la siguiente url: <a href='${url}'>${url}</a><br/>
            Los datos de acceso se detallan a continuación:
              <ul>
                <li><b>Usuario:</b></li> ${usuario}
                <li><b>Contraseña:</b></li> ${contrasena}
              </ul>
          </div>
        </body>
      </html>
    `
  }

  static armarPlantillaBloqueoCuenta(url) {
    return `
      <!DOCTYPE html>
      <html lang='es'>
        <head>
          <meta charset='UTF-8'>
          <style>
            .container {
              width: 100%;
              max-width: 640px;
              margin-top: 10vh;
            }
          </style>
          <title>Desbloquear cuenta</title>
        </head>
        <body>
          <div class='container'>
            Tu cuenta ha sido bloqueada temporalmente por muchos intentos fallidos de inicio de sesión.<br/>
            Para desbloquear tu cuenta haz clic en la siguiente url: <a href='${url}'>${url}</a><br/>
          </div>
        </body>
      </html>
    `
  }

  static armarPlantillaRecuperacionCuenta(url) {
    return `
      <!DOCTYPE html>
      <html lang='es'>
        <head>
          <meta charset='UTF-8'>
          <style>
            .container {
              width: 100%;
              max-width: 640px;
              margin-top: 10vh;
            }
          </style>
          <title>Recupera de cuenta</title>
        </head>
        <body>
          <div class='container'>
            
            Para recuperar tu cuenta haz clic en la siguiente url: <a href='${url}'>${url}</a><br/>
          </div>
        </body>
      </html>
    `
  }

  static armarPlantillaActivacionCuentaManual(url) {
    return `
      <!DOCTYPE html>
      <html lang='es'>
        <head>
          <meta charset='UTF-8'>
          <style>
            .container {
              width: 100%;
              max-width: 640px;
              margin-top: 10vh;
            }
          </style>
          <title>Activación de cuenta</title>
        </head>
        <body>
          <div class='container'>
            
            Para activar tu cuenta haz clic en la siguiente url: <a href='${url}'>${url}</a><br/>
          </div>
        </body>
      </html>
    `
  }
}
