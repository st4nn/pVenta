<?php
   include("../conectar.php"); 
   include("../../../assets/mensajes/correo.php");  

   date_default_timezone_set('America/Bogota');

   $link = Conectar();

   $datos = json_decode($_POST['datos']);

   $id = "NULL";

   if ($datos->idLogin <> "")
   {
      $id = $datos->idLogin;
   }

   $pClave = $datos->Clave;

   $Respuesta = array();
   $Respuesta['Error'] = "";

   foreach ($datos as $key => $value) 
   {
      $datos->$key = addslashes($value);
   }

 
   $sql = "SELECT COUNT(*) AS 'Cantidad' FROM Login WHERE Usuario = '" . $datos->nUsuario . "';";
   $result = $link->query($sql);

   $fila =  $result->fetch_array(MYSQLI_ASSOC);

   if ($fila['Cantidad'] > 0 AND $id == "NULL")
   {
      $Respuesta['Error'] = "El Usuario ya existe, por favor selecciona otro.";
   } else
   {
      $sql = "SELECT COUNT(*) AS 'Cantidad' FROM datosUsuarios WHERE Correo = '" . $datos->Correo . "';";
      $result = $link->query($sql);

      $fila =  $result->fetch_array(MYSQLI_ASSOC);

      if ($fila['Cantidad'] > 0 AND $id == "NULL")
      {
         $Respuesta['Error'] .= "\n El Correo ya tiene un usuario asignado, por favor selecciona otro.";
      } else
      {
         if ($datos->Clave <> $datos->Clave2)
         {
            $Respuesta['Error'] .= "\n Las claves no coinciden.";
         } else
         {
            $nuevoId = $id;

            $fecha = date('Y-m-d H:i:s');
            $mensaje = "";

            if ($datos->Clave <> "laClaveEstaProtegida")
            {
               $sql = "INSERT INTO Login 
                           (idLogin, Usuario, Clave, Estado, idEmpresa, fechaCargue) 
                        VALUES 
                           (
                              $id, 
                              '" . $datos->nUsuario . "', 
                              '" . md5(md5(md5($datos->Clave))) . "', 
                              '" . $datos->Estado . "',
                              '" . $datos->idEmpresa . "', 
                              '$fecha') ON DUPLICATE KEY UPDATE 
                              Clave = VALUES(Clave),
                              Estado = VALUES(Estado),
                              idEmpresa = VALUES(idEmpresa),
                              fechaCargue = VALUES(fechaCargue);";

               $link->query(utf8_decode($sql));
               $nuevoId = $link->insert_id;

               $Asunto = "Creación de Usuario " . $datos->Nombre;
               if ( $link->error <> "")
               {
                  $Respuesta['Error'] .= "\n Hubo un error desconocido " . $link->error;
               } else
               {
                  if ($id == "NULL")
                  {
                     $mensaje = "Buen Día, " . $datos->Nombre . "
                     <br><br><strong>BIENVENIDO AL PORTAL DE REGISTRO</strong>
                     <br><br>No solo es usted cliente, ahora usted es parte del equipo Linea D Fuego.
                     <br><br>Los equipos de ultima tecnologia deben ser cuidadosamente mantenidos y monitoreados. El primer paso es el registro del producto en nuestro portal.
                     <br><br>Se le ha creado un usuario de acceso,
                     <br><br>
                     Los datos de autenticación son:
                     <br><br>
                     ";//<br>Url de Acceso: <a href='http://icbf.mentortic.com/'>http://icbf.mentortic.com</a>
                     $mensaje .= "<br>Usuario: " . $datos->nUsuario . "
                     <br>Clave: $pClave";
                  } else
                  {
                     $mensaje = "Buen Día, " . $datos->Nombre . "
                     <br><br><strong>BIENVENIDO AL PORTAL DE REGISTRO</strong>
                     <br><br>No solo es usted cliente, ahora usted es parte del equipo Linea D Fuego.
                     <br><br>Los equipos de ultima tecnologia deben ser cuidadosamente mantenidos y monitoreados. El primer paso es el registro del producto en nuestro portal.
                     <br><br>Se ha cambiado la clave de acceso para el sistema Linea D Fuego,
                     <br><br>
                     Los datos de autenticación son:
                     <br><br>
                     "; //<br>Url de Acceso: <a href='http://icbf.mentortic.com/'>http://icbf.mentortic.com</a>
                     $mensaje .= "<br>Usuario: " . $datos->nUsuario . "
                     <br>Clave: $pClave";

                     $Asunto = "Cambio de Clave " . $datos->Nombre;
                  }
               }
            } 

            if ($nuevoId <> "NULL")
            {
               $sql = "UPDATE Login SET Estado = '" . $datos->Estado . "' WHERE idLogin = $nuevoId";
               $link->query(utf8_decode($sql));
                           
               $sql = "INSERT INTO datosUsuarios (idLogin, Nombre, Cargo, Correo, idPerfil, fechaCargue) 
                        VALUES 
                        (
                           $nuevoId, 
                           '" . $datos->Nombre . "', 
                           '" . $datos->Cargo . "', 
                           '" . $datos->Correo . "', 
                           '" . $datos->idPerfil . "', 
                           '" . $fecha . "'
                        ) ON DUPLICATE KEY UPDATE 
                        Nombre = VALUES(Nombre), 
                        Cargo = VALUES(Cargo), 
                        idPerfil = VALUES(idPerfil), 
                        fechaCargue = VALUES(fechaCargue);";
                  
               $link->query(utf8_decode($sql));

               if ( $link->error <> "")
               {
                  $Respuesta['Error'] .= "\n Hubo un error desconocido " . $link->error;
               } else
               {
                  if ($mensaje <> "")
                  {
                     $obj = EnviarCorreo($datos->Correo, $Asunto, $mensaje) ;
                  }

                  $Respuesta['datos'] = $nuevoId;
               }
            } 
         }
      }
   }

   echo json_encode($Respuesta);

?>