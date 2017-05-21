<?php
   include("../conectar.php"); 
   include("datosUsuario.php"); 

   $link = Conectar();

   $datos = json_decode($_POST['datos']);
   $idUsuario = addslashes($_POST['Usuario']);
   $Usuario = datosUsuario($idUsuario);

   foreach ($datos as $key => $value) 
   {
      if (!is_array($datos->$key))
      {
         $datos->$key = addslashes($value);
      }
   }


   date_default_timezone_set('America/Bogota');
   
   $fecha = date('Y-m-d h:i:s');

   $sql = "INSERT INTO Trajes(Prefijo, idUsuario, idProducto, idNorma, Serie, Anio, idEmpresa) VALUES 
         (
         '" . $datos->Prefijo . "', 
         '" . $idUsuario . "', 
         '" . $datos->idProducto . "', 
         '" . $datos->idNorma . "', 
         '" . $datos->Serie . "', 
         '" . $datos->Anio . "', 
         '" . $Usuario['idEmpresa'] . "')
         ON DUPLICATE KEY UPDATE
            idUsuario = VALUES(idUsuario),
            idProducto = VALUES(idProducto),
            idNorma = VALUES(idNorma),
            Serie = VALUES(Serie),
            Anio = VALUES(Anio),
            idEmpresa = VALUES(idEmpresa),
            fechaCargue = VALUES(fechaCargue),
            fechaCargue = '" . $fecha . "';";
            
   $link->query(utf8_decode($sql));

   $Respuesta = array('Error' => '', 'id' => 0);
   if ( $link->error == "")
   {
   		$id = $link->insert_id;
      $Respuesta['id'] = $id;
   } else
   {
      $Respuesta['Error'] = $link->error;
   }

   echo json_encode($Respuesta);
?>