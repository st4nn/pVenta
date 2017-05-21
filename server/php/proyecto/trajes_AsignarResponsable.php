<?php
   include("../conectar.php"); 

   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Responsable = addslashes($_POST['idResponsable']);
   $Prefijo = addslashes($_POST['Prefijo']);

   date_default_timezone_set('America/Bogota');
   
   $fecha = date('Y-m-d h:i:s');
   $Respuesta = array('Error' => '', 'id' => 0);

   $sql = "UPDATE Trajes SET idBombero = '$Responsable' WHERE Prefijo = '$Prefijo';";
            
   $link->query(utf8_decode($sql));
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