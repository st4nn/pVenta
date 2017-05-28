<?php
   include("../conectar.php"); 
   include("datosUsuario.php"); 

   $link = Conectar();

   $datos = json_decode($_POST['datos']);
   $idUsuario = addslashes($_POST['idUsuario']);
   $Prefijo = addslashes($_POST['Prefijo']);
   $idBombero = addslashes($_POST['idBombero']);

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

   $sql = "INSERT INTO trajes_Inspecciones(idUsuario, idTraje, idTipoInspeccion, Descripcion, fechaBajoNorma, fechaFinalInspeccion, Detalles, idBombero) VALUES
         (
         '" . $idUsuario . "', 
         '" . $Prefijo . "', 
         '" . $datos->idTipoInspeccion . "', 
         '" . $datos->Descripcion . "', 
         '" . $datos->fechaBajoNorma . "', 
         '" . $datos->fechaFinalInspeccion . "', 
         '" . $datos->Detalles . "', 
         '" . $idBombero . "');";
            
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